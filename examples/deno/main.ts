import { Consumer } from '@bbc/sqs-consumer';

const sqs = {
  send: async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    return [];
  },
};

const initConsumer = (options) => {
  console.log('Starting SQS Consumer now...');

  const consumer = new Consumer(options);

  return consumer;
};

const options = {
  queueUrl: 'some-url',
  sqs,
  handleMessage: async (msg) => {
    console.log('Handled a message...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(msg);
  },
};

const consumer = initConsumer(options);

consumer.start();
