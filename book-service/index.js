const express = require('express');
const app = express();
const sequelize = require('./config/db');
const Book = require('./models/book.model');

app.use(express.json());

sequelize.sync().then(() => console.log('Book DB synced'));

app.get('/get-books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

app.post('/create-book', async (req, res) => {
  const book = await Book.create(req.body);
  res.json({ message: 'Book added', book });
});

app.listen(3002, () => console.log('Book service running on port 3002'));
