// sockets/index.js
const db = require('../models/index');
const { sequelize } = db;
const Message = db.Message;
const Attachment = db.Attachment;
const User = db.User;
const Chat = db.Chat;
const ChatMember = db.ChatMember;
const path = require("path");
const fs = require("fs");
const { Op } = require('sequelize');

// Track sockets per user (multi-tab safe)
const userSockets = new Map(); // userId -> Set(socket.id)
const socketToUser = new Map(); // socket.id -> userId

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);





        // Join a chat room
        socket.on("joinChat", (chatId) => {
            socket.join(String(chatId));
            console.log(`User ${socket.id} joined chat ${chatId}`);
        });

        // Leave chat room (optional)
        socket.on("leaveChat", (chatId) => {
            socket.leave(String(chatId));
        });
        socket.on("userOnline", async (userId) => {
            console.log(`User ${userId} is online`);
            // Track which socket belongs to which user
            socketToUser.set(socket.id, userId);

            if (!userSockets.has(userId)) userSockets.set(userId, new Set());
            userSockets.get(userId).add(socket.id);

            socket.join(`user:${userId}`);

            await User.update({ online: true }, { where: { id: userId } });

            // ✅ Find all chat partners of this user
            const chatMembers = await ChatMember.findAll({
                where: { user_id: userId },
                attributes: ["chat_id"]
            });

            const chatIds = chatMembers.map(cm => cm.chat_id);

            const partners = await ChatMember.findAll({
                where: { chat_id: chatIds },
                attributes: ["user_id"]
            });

            const partnerIds = [...new Set(partners.map(p => p.user_id))].filter(id => id !== userId);

            // ✅ Notify only partners
            partnerIds.forEach(pid => {
                console.log(`Notifying partner ${pid} that ${userId} is online`);
                io.to(`user:${pid}`).emit("userStatus", { userId, online: true });
            });
        });

        // Send message (text or media)
        socket.on("sendMessage", async (data) => {
            try {
                let fileUrl = null;
                let result = null;

                // Validate essentials
                const { chat_id, sender_id } = data;
                if (!chat_id || !sender_id) return;
                // receiver_id is needed for unread counts
                // if (!receiver_id) {
                //   console.warn("sendMessage missing receiver_id");
                // }

                // Handle file upload
                if (data.file) {
                    const fileName = Date.now() + "-" + data.fileName;
                    const uploadPath = path.join(__dirname, "../../uploads", fileName);
                    fs.writeFileSync(uploadPath, data.file, { encoding: "base64" });
                    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
                    fileUrl = `${baseUrl}/uploads/${fileName}`;
                }
                const members = await ChatMember.findAll({
                    where: { chat_id: chat_id },
                    attributes: ['user_id']
                });

                // Get receiver (exclude sender)
                const receiver = members.find(m => m.user_id !== sender_id);

                if (!receiver) {
                    return res.status(400).json({ message: "Receiver not found" });
                }
                // Save message
                const message = await Message.create({
                    chat_id: chat_id,
                    sender_id: sender_id,
                    receiver_id: receiver.user_id ?? null,
                    content: data.content || "",
                    type: data.file ? "file" : "text",
                    file_url: fileUrl,
                    seen: false, // NEW
                });
                console.log((data));
                // Save attachment
                if (data.file) {
                    result = await Attachment.create({
                        message_id: message.id,
                        file_name: data.fileName,
                        file_url: fileUrl,
                        file_type: data.fileType,
                        file_size: data.fileSize
                    });
                }

                // Fetch sender info
                const sender = await User.findByPk(sender_id, {
                    attributes: ["id", "username"]
                });

                // Build full message object
                const fullMessage = {
                    ...message.toJSON(),
                    file_size: result ? result.file_size : null,
                    file_type: result ? result.file_type : null,
                    sender: sender ? sender.toJSON() : null
                };

                // Emit to all members in the chat room
                io.to(String(chat_id)).emit("receiveMessage", fullMessage);

                // === Sidebar summary updates for receiver & sender ===
                const summary = await computeChatSummary(chat_id, receiver.user_id);
                if (receiver.user_id) {
                    // Notify receiver’s personal room
                    io.to(`user:${receiver.user_id}`).emit("sidebarSummary", summary);
                }
                // Sender’s sidebar also updates with last message (unread for sender usually 0)
                const senderSummary = await computeChatSummary(chat_id, sender_id);
                io.to(`user:${sender_id}`).emit("sidebarSummary", senderSummary);

            } catch (err) {
                console.error("Error in sendMessage:", err);
            }
        });

        // Typing events
        socket.on("typing", (data) => {
            if (!data?.roomId) return;
            socket.to(String(data.roomId)).emit("display-typing", { username: data.username });
        });

        socket.on("stop-typing", (data) => {
            if (!data?.roomId) return;
            socket.to(String(data.roomId)).emit("remove-typing", { username: data.username });
        });

        // Mark all messages in a chat as read for a user
        socket.on("markAsRead", async ({ chatId, userId }) => {
            if (!chatId || !userId) return;

            await Message.update(
                { seen: true },
                { where: { chat_id: chatId, receiver_id: userId, seen: false } }
            );

            // Per-chat updated unread for this user
            const summary = await computeChatSummary(chatId, userId);
            io.to(`user:${userId}`).emit("sidebarSummary", summary);
        });

        // Get messages with filter (all|read|unread)
        socket.on("getMessages", async ({ chatId, filter }) => {
            let where = { chat_id: chatId };
            if (filter === "read") where.seen = true;
            if (filter === "unread") where.seen = false;

            const messages = await Message.findAll({ where, order: [["createdAt", "ASC"]] });
            socket.emit("messages", messages);
        });

        // Initial sidebar summaries for a user (all chats they are in)
        socket.on("getSidebarSummaries", async ({ userId }) => {
            if (!userId) return;
            const summaries = await computeAllSummariesForUser(userId);
            socket.emit("sidebarSummaries", summaries);
        });

        // Disconnect
        socket.on("disconnect", async () => {
            const userId = socketToUser.get(socket.id);
            if (!userId) return;

            userSockets.get(userId)?.delete(socket.id);
            if (userSockets.get(userId)?.size === 0) {
                await User.update({ online: false }, { where: { id: userId } });

                // Find partners again
                const chats = await ChatMember.findAll({
                    where: { user_id: userId },
                    attributes: ["chat_id"],
                });

                const chatIds = chats.map(c => c.chat_id);

                const partners = await ChatMember.findAll({
                    where: { chat_id: chatIds, user_id: { [Op.ne]: userId } },
                    attributes: ["user_id"],
                });

                // Notify partners about offline
                partners.forEach(p => {
                    io.to(`user:${p.user_id}`).emit("userStatus", { userId, online: false });
                });
            }
        });

    });
};

/**
 * Compute a single chat's sidebar summary for a given user.
 * Returns: { chatId, unreadCount, lastMessage }
 */
async function computeChatSummary(chatId, userId) {
    // last message
    const lastMessage = await Message.findOne({
        where: { chat_id: chatId },
        order: [["createdAt", "DESC"]],
    });

    // unread count for this user in this chat
    let unreadCount = 0;
    if (userId) {
        unreadCount = await Message.count({
            where: { chat_id: chatId, receiver_id: userId, seen: false }
        });
    }

    return {
        chatId,
        unreadCount,
        lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            type: lastMessage.type,
            file_url: lastMessage.file_url,
            sender_id: lastMessage.sender_id,
            createdAt: lastMessage.createdAt,
            seen: lastMessage.seen,
        } : null
    };
}

/**
 * Compute all chats a user participates in + per-chat unread + last message.
 * Adjust the subquery if you have a Chats table; here we derive from messages.
 */
async function computeAllSummariesForUser(userId) {
    // Find chat IDs where user is sender or receiver
    const chatIdsRows = await Message.findAll({
        attributes: ["chat_id"],
        where: sequelize.where(
            sequelize.fn("BOOL_OR",
                sequelize.literal(`"sender_id" = ${userId} OR "receiver_id" = ${userId}`)
            ),
            true
        ),
        group: ["chat_id"],
        raw: true
    }).catch(async () => {
        // Dialect fallback: collect from two queries
        const sent = await Message.findAll({
            attributes: ["chat_id"], where: { sender_id: userId }, group: ["chat_id"], raw: true
        });
        const recv = await Message.findAll({
            attributes: ["chat_id"], where: { receiver_id: userId }, group: ["chat_id"], raw: true
        });
        const set = new Set([...sent, ...recv].map(r => r.chat_id));
        return [...set].map(id => ({ chat_id: id }));
    });

    const chatIds = chatIdsRows.map(r => r.chat_id);
    const summaries = [];
    for (const cid of chatIds) {
        summaries.push(await computeChatSummary(cid, userId));
    }
    return summaries;
}
