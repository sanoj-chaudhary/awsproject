const db = require('../models/index');
const User = db.User;
const { Op } = require('sequelize');

class UserController {
    static async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // controllers/userController.js
static async getUsers(req, res) {
    try {
        const users = await User.findAll({
            where: { id: { [Op.ne]: req.user.id } }, // exclude current user
            // attributes: ['id', 'name', 'email']
        });
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


    static async searchUsers(req, res) {
        try {
            const { q } = req.query;
            const users = await User.findAll({
                where: {
                    username: { [Op.like]: `%${q}%` },
                    id: { [Op.ne]: req.user.id }
                },
                attributes: { exclude: ['password'] }
            });
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}



module.exports = UserController;
