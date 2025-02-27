import { Hono } from 'hono';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import debug from 'debug';

import sqs from './sqs';
import initConsumer from './consumer';

const app = new Hono();
const port = 3010;


app.get('/', (c) => {
  return c.html(readFileSync(resolve('pages/index.html'), 'utf8'));
});

createServer(app.fetch).listen(port, () => {
  // Edit these options if you need to
  const options = {
    queueUrl: 'some-url',
    sqs,
    handleMessage: async (msg) => {
      debug('Handled a message...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      debug(msg);
    },
  };
  const consumer = initConsumer(options);

  // Add your use case below, the rest of the setup has already been sorted out for you above.
  consumer.start();
});
