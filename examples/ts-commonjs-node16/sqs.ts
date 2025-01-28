class MockSQSClient {
  async send(command) {
    if (command.constructor.name === 'ReceiveMessageCommand') {
      if (Math.random() < 0.3) {
        return {
          $metadata: { httpStatusCode: 200 },
          Messages: [{
            MessageId: Math.random().toString(36).substring(7),
            ReceiptHandle: 'mock-receipt-handle',
            Body: JSON.stringify({
              id: Math.random().toString(36).substring(7),
              timestamp: new Date().toISOString(),
              message: `Mock message ${new Date().toLocaleTimeString()}`
            }),
            Attributes: {},
            MD5OfBody: 'mock-md5',
            MD5OfMessageAttributes: 'mock-md5'
          }]
        };
      }
      return { $metadata: { httpStatusCode: 200 }, Messages: [] };
    }
    
    if (command.constructor.name === 'DeleteMessageCommand') {
      return { $metadata: { httpStatusCode: 200 } };
    }
    
    return { $metadata: { httpStatusCode: 200 } };
  }
}

export default new MockSQSClient();
