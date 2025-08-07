const express = require('express');
const app = express();
const sequelize = require('./config/db');
const User = require('./models/user.model');

app.use(express.json());

sequelize.sync().then(() => console.log('User DB synced with MySQL'));

app.post('/register', async (req, res) => {
  try {
    console.log('[User Service] Data:', req.body);
    const user = await User.create(req.body);
    res.json({ message: 'User registered', });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  console.log('[User Service] Data:', req.body);
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ token: 'dummy-jwt-token', user });
});

app.listen(3001, () => console.log('User service running on port 3001'));
