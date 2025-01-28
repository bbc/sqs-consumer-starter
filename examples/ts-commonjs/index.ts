const express = require('express');
const path = require('path');
const debug = require('debug')('sqs-consumer');

const sqsClient = require('./sqs');
const startConsumer = require('./consumer');

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.listen(port, () => {
  // Edit these options if you need to
  const options = {
    queueUrl: 'some-url',
    sqs: sqsClient,
    handleMessage: async (msg) => {
      debug('Handled a message...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      debug(msg);
    },
  };
  const consumer = startConsumer(options);

  // Add your use case below, the rest of the setup has already been sorted out for you above.
  consumer.start();
});
