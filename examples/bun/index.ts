import { Hono } from 'hono';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import debug from 'debug';

import sqs from './sqs.js';
import initConsumer from './consumer.js';

const app = new Hono();
const port = 3010;

app.get('/', (c) => {
  return c.html(readFileSync(resolve('pages/index.html'), 'utf8'));
});

Bun.serve({
  port,
  fetch: app.fetch,
  async error(error) {
    console.error('Server error:', error);
    return new Response('Server Error', { status: 500 });
  },
});

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

consumer.start();
