const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
// console.log(authMiddleware)
// router.post('/send', authMiddleware, upload.single('file'), MessageController.sendMessage);
router.get('/:chatId', authMiddleware, MessageController.getMessages);

module.exports = router;
