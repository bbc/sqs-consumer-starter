const { Hono } = require('hono');
const path = require('path');
const debug = require('debug')('sqs-consumer');

const sqs = require('./sqs');
const initConsumer = require('./consumer');

const app = new Hono();
const port = 3010;


app.get('/', (c) => {
  return c.html(require('fs').readFileSync(path.resolve('pages/index.html'), 'utf8'));
});

require('node:http').createServer(app.fetch).listen(port, () => {
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
