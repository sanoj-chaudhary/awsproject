const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: '',
  port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
