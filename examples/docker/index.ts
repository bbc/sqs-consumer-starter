import express, { static as expressStatic } from 'express';
import { resolve } from 'node:path';
import debug from 'debug';
import { SQSClient } from '@aws-sdk/client-sqs';
import type { ConsumerOptions } from 'sqs-consumer';

import initConsumer from './consumer.js';

const app = express();
const port = 3010;

app.use(expressStatic('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

app.listen(port, () => {
  // Edit these options if you need to
  const options: ConsumerOptions = {
    queueUrl: 'http://127.0.0.1:4566/000000000000/sqs-consumer-test',
    sqs: new SQSClient({
      endpoint: 'http://127.0.0.1:4566/000000000000/sqs-consumer-test',
    }),
    handleMessage: async (msg) => {
      debug('Handled a message...');
      debug(msg);
    },
    waitTimeSeconds: 1,
  };
  const consumer = initConsumer(options);

  // Add your use case below, the rest of the setup has already been sorted out for you above.
  consumer.start();
});
