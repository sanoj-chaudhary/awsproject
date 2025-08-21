const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware, UserController.getProfile);
router.get('/search', authMiddleware, UserController.searchUsers);
router.get('/get-users', authMiddleware, UserController.getUsers);
router.get('/user/:id', authMiddleware, UserController.getUserById); // Assuming you want to get a user by ID
module.exports = router;
