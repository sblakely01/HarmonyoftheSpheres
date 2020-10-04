const express = require('express');
const app = express();
const port = process.env.PORT || 3007;
const path = require('path');
// const mysql = require('mysql');
// const config = require('./config.js');

// const connection = mysql.createConnection(config);
// const db = require('./database.js');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../libs')));
app.use(express.static(path.join(__dirname, '../assets')));

app.get('/', function (req, res) {
  res.sendStatus(200);
})

// app.post('/', function(req, res) {
//   data = {
//     name: req.name,
//     score: req.score
//   }
//       const sql = `INSERT into scores (player, score) VALUES (${data.name}, ${data.score}`
//       connection.query(sql, function(error, result, fields) {
//         if (error) {
//           res.sendStatus(500).end();
//         } else {
//           res.json(result).end();
//         }
//       })
// })

app.listen(port, () => {console.log(`Server listening on ${port}`)})