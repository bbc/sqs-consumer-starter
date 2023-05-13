const { Consumer } = require('sqs-consumer');
const initConsumer = (options) => {
  console.log('Starting SQS Consumer now...');

  const consumer = new Consumer(options);

  return consumer;
};

module.exports = initConsumer;
