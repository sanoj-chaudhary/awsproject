const { raw } = require('body-parser');
const db = require('../models/index');
const { col } = require('sequelize');
const Message = db.Message;
const Attachment = db.Attachment;
const User = db.User;

class MessageController {
    static async sendMessage(req, res) {
        try {
            const { chat_id, type, content } = req.body;
            // console.log('sanoj', req.body, req.file);
            const message = await Message.create({
                chat_id,
                sender_id: req.user.id,
                type,
                content: type === 'text' ? content : req.file?.path
            });

            if (req.file) {
                await Attachment.create({
                    message_id: message.id,
                    file_name: req.file.originalname,
                    file_url: req.file.path,
                    file_type: req.file.mimetype,
                    file_size: req.file.size
                });
            }

            res.json({ message: 'Message sent', data: message });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
   static async getMessages(req, res) {
    try {
      const { chatId } = req.params;

      const messages = await Message.findAll({
        attributes: [
          "id",
          "chat_id",
          "sender_id",
          "content",
          "type",
          "file_url",
          "createdAt",
          [col("attachments.file_size"), "file_size"],
          [col("attachments.file_type"), "file_type"],
          [col("senderUser.username"), "sender_name"], // example if you want sender name
        ],
        where: { chat_id: chatId },
        include: [
          {
            model: User,
            as: "senderUser",
            attributes: [], // don’t fetch full user, only use alias
          },
          {
            model: Attachment,
            as: "attachments",
            attributes: [], // handled via col()
          },
        ],
        order: [["createdAt", "ASC"]],
        raw: true,
        nest: true, // helps keep alias structured
      });

      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = MessageController;