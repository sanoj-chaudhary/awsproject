const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');
const authMiddleware = require('./../middlewares/auth.middleware');

router.post('/start', authMiddleware, ChatController.startChat);
router.get('/',  ChatController.getMyChats);
router.get('/:chatId', authMiddleware, ChatController.getChatMembers);

module.exports = router;
