const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bookdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
