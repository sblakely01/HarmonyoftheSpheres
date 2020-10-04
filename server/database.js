const mysql = require('mysql');
const config = require('./config.js');

const connection = mysql.createConnection(config);

const postPlayerScore = (function(data, callback) {
  const sql = `INSERT into scores (name, score, date) VALUES (${data.name}, ${data.score}, GETDATE()`
  connection.query(sql, function(err, result, fields) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, error);
    }
  });
}

module default postPlayerScore;
}