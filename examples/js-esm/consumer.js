import { Consumer } from 'sqs-consumer';

const initConsumer = (options) => {
  console.log('Starting SQS Consumer now...');

  const consumer = new Consumer(options);

  return consumer;
};

export default initConsumer;
