const express = require('express');
const axios = require('axios');
const app = express();
const sequelize = require('./config/db');
const Order = require('./models/order.model');

app.use(express.json());

sequelize.sync().then(() => console.log('Order DB synced'));

app.post('/orders', async (req, res) => {
  const { userId, bookId } = req.body;

  const bookRes = await axios.get('http://localhost:3002/books');
  const book = bookRes.data.find(b => b.id === bookId);
  if (!book) return res.status(400).json({ message: 'Book not found' });

  const order = await Order.create({ userId, bookId });
  res.json({ message: 'Order placed', order });
});

app.get('/get-orders', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

app.listen(3003, () => console.log('Order service running on port 3003'));
