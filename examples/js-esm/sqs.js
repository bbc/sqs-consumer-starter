const sqs = {
  send: async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    return [];
  },
};

export default sqs;
