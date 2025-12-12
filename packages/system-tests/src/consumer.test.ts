import { Consumer } from 'sqs-consumer';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';

const queueUrl = 'https://example.com/123456789012/demo-queue';
const sqsMock = mockClient(SQSClient);

beforeEach(() => {
  sqsMock.reset();
});

describe('sqs-consumer integration surface', () => {
  it('processes a message and deletes it from the queue', async () => {
    const sqs = new SQSClient({ region: 'us-east-1' });
    const body = JSON.stringify({ hello: 'world' });

    sqsMock.on(ReceiveMessageCommand).resolvesOnce({
      Messages: [
        {
          MessageId: '1',
          ReceiptHandle: 'abc',
          Body: body
        }
      ]
    });

    sqsMock.on(ReceiveMessageCommand).resolves({ Messages: [] });
    sqsMock.on(DeleteMessageCommand).resolves({});

    const processedBodies: string[] = [];

    const consumer = Consumer.create({
      queueUrl,
      sqs,
      handleMessage: async (message) => {
        processedBodies.push(message.Body ?? '');
      }
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        consumer.stop();
        reject(new Error('Timed out waiting for message'));
      }, 5000);

      consumer.once('message_processed', () => {
        clearTimeout(timeout);
        consumer.stop();
        resolve();
      });

      consumer.once('processing_error', (err) => {
        clearTimeout(timeout);
        consumer.stop();
        reject(err);
      });

      consumer.once('error', (err) => {
        clearTimeout(timeout);
        consumer.stop();
        reject(err);
      });

      consumer.start();
    });

    expect(processedBodies).toEqual([body]);
    expect(sqsMock.commandCalls(DeleteMessageCommand).length).toBe(1);
  });
});
