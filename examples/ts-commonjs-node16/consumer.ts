import { Consumer, type ConsumerOptions } from 'sqs-consumer';

const initConsumer = (options: ConsumerOptions) => {
  console.log('Starting SQS Consumer now...');

  const consumer = new Consumer(options);

  return consumer;
};

export default initConsumer;
