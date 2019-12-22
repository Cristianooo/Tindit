const mysql = require('mysql');
const connection = mysql.createConnection ({
  host: 'localhost',
  user: 'cristiano',
  password: 'ws1$79YuM6Nr&R',
  database: 'cristianoTestDb'
});


connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

module.exports=connection
