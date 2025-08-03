const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
  host: 'database-1.c3omya2ui7ke.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'sanoj9900',
  database: 'crudProject',
  port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
