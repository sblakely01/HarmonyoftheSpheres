const express = require('express');
const app = express();
const port = process.env.PORT || 3003;
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {console.log(`Server listening on ${port}`)})