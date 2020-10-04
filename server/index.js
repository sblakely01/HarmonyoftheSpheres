const express = require('express');
const app = express();
const port = process.env.PORT || 3007;
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../libs')));
app.use(express.static(path.join(__dirname, '../assets')));

app.get('/', function (req, res) {
  res.sendStatus(200);
})

app.listen(port, () => {console.log(`Server listening on ${port}`)})