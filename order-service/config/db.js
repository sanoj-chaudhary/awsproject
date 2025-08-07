const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('orderdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
