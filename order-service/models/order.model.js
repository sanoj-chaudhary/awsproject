const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  userId: DataTypes.INTEGER,
  bookId: DataTypes.INTEGER,
});

module.exports = Order;
