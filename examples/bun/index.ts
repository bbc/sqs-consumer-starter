import express, { static as expressStatic } from 'express';
import { resolve } from 'node:path';
import debug from 'debug';

import sqs from './sqs.js';
import initConsumer from './consumer.js';

const app = express();
const port = 3010;

app.use(expressStatic('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

app.listen(port, () => {
  // Edit these options if you need to
  const options = {
    queueUrl: 'some-url',
    sqs,
    handleMessage: async (msg) => {
      debug('Handled a message...');
      debug(msg);
    },
  };
  const consumer = initConsumer(options);

  // Add your use case below, the rest of the setup has already been sorted out for you above.
  consumer.start();
});
