const { Consumer } = require('sqs-consumer');
const Debug = require('debug');

const debug = Debug('sqs-consumer-starter');

const initConsumer = (options) => {
  console.log('Starting SQS Consumer now...');

  const consumer = new Consumer(options);

  consumer.on('response_processed', () => {
    debug('response_processed');
  });

  consumer.once('empty', () => {
    debug('empty');
  });

  consumer.on('message_received', (msg) => {
    debug('message_received...');
    debug(msg);
  });

  consumer.on('message_processed', (msg) => {
    debug('message_processed...');
    debug(msg);
  });

  consumer.on('error', (err) => {
    debug(err.message);
  });

  consumer.on('timeout_error', (err) => {
    debug(err.message);
  });

  consumer.on('processing_error', (err) => {
    debug(err.message);
  });

  consumer.on('aborted', () => {
    debug('aborted');
  });

  consumer.on('started', () => {
    debug('started');
  });

  consumer.on('stopped', () => {
    debug('stopped');
  });

  consumer.on('option_updated', (option, value) => {
    debug('option_updated...');
    debug(option, value);
  });

  return consumer;
};

module.exports = initConsumer;
