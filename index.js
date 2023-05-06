const express = require('express');
const app = express();
const port = 3010;
const path = require('path');
const initConsumer = require('./consumer');

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

  const consumer = initConsumer();

  // Add your use case below, the rest of the setup has already been sorted out for you above.

  consumer.start();
});
