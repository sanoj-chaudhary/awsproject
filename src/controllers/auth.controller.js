const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = db.User;
class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const exists = await User.findOne({ where: { email } });
            if (exists) return res.status(400).json({ message: 'Email already registered' });

            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({ username, email, password: hash });

            res.json({ message: 'User registered', user });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: 'Invalid password' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({ message: 'Login success', token });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}


module.exports = AuthController;
