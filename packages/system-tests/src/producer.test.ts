import { Producer } from 'sqs-producer';
import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, it } from 'vitest';

const queueUrl = 'https://example.com/123456789012/demo-queue';
const sqsMock = mockClient(SQSClient);

beforeEach(() => {
  sqsMock.reset();
});

describe('sqs-producer integration surface', () => {
  it('sends a message payload with attributes', async () => {
    const sqs = new SQSClient({ region: 'us-east-1' });
    sqsMock.on(SendMessageBatchCommand).resolves({});

    const producer = Producer.create({
      queueUrl,
      sqs
    });

    await producer.send({
      id: 'demo-message',
      body: JSON.stringify({ hello: 'world' }),
      messageAttributes: {
        source: {
          DataType: 'String',
          StringValue: 'system-tests'
        }
      }
    });

    const calls = sqsMock.commandCalls(SendMessageBatchCommand);
    expect(calls).toHaveLength(1);
    const [{ args }] = calls;
    expect(args[0]?.input?.QueueUrl).toBe(queueUrl);
    expect(args[0]?.input?.Entries).toHaveLength(1);
    const [entry] = args[0]?.input?.Entries ?? [];
    expect(entry?.MessageBody).toContain('"hello":"world"');
    expect(entry?.MessageAttributes?.source).toEqual({
      DataType: 'String',
      StringValue: 'system-tests'
    });
  });
});
