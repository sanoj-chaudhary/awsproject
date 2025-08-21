const { Op } = require('sequelize');
const db = require('../models/index');
const Chat = db.Chat;
const ChatMember = db.ChatMember;
const User = db.User;
class ChatController {
    static async startChat(req, res) {
    try {
      const { userId } = req.body; // the user you clicked on
      const currentUserId = req.user.id;

      console.log("Current User ID:", currentUserId);
      console.log("Clicked User ID:", userId);

      // 1. Find if chat exists where both users are members
      let chat = await Chat.findOne({
        where: { type: "private" },
        include: [
          {
            model: ChatMember,
            as: "Chatmembers",
            where: { user_id: { [Op.in]: [currentUserId, userId] } },
          },
        ],
      });

      // Ensure both users are in the chat
      if (chat) {
        const members = await ChatMember.findAll({
          where: { chat_id: chat.id },
        });

        const memberIds = members.map((m) => m.user_id);
        if (memberIds.includes(currentUserId) && memberIds.includes(userId)) {
          return res.json({ chat }); // Chat already exists
        }
      }

      // 2. Otherwise, create new chat
      chat = await Chat.create({
        name: null,
        type: "private",
        created_by: currentUserId,
      });

      await ChatMember.bulkCreate([
        { chat_id: chat.id, user_id: currentUserId },
        { chat_id: chat.id, user_id: userId },
      ]);

      res.json({ chat });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }


    static async getMyChats(req, res) {
        try {
            const { chatId } = req.params;

            const chat = await Chat.findByPk(chatId, {
                include: [
                    {
                        model: User,
                        as: 'members',
                        attributes: ['id', 'username', 'profile_pic'],
                        through: { attributes: [] }
                    }
                ]
            });

            if (!chat) return res.status(404).json({ message: 'Chat not found' });

            res.json(chat);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getChatMembers(req, res) {
        try {
            const { chatId } = req.params;
            console.log(req.user)
            const members = await ChatMember.findAll({
                where: { chat_id: chatId,
                    user_id:{
                        [Op.ne]: req.user.id // Exclude current user
                    }
                 },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'profile_pic']
                    }
                ]
            });

            if (!members.length) return res.status(404).json({ message: 'No members found for this chat' });

            res.json(members[0]);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}


module.exports = ChatController;