const pingInteraction = {
  createdTimestamp: 10456,
  client: {'ws': {'ping': 5}},
  content: {},

  async reply() {},

  async fetchReply() {
    const replyObject = {'createdTimestamp': 1567};
    return replyObject;
  },

  async editReply(reply) {
    return reply;
  },
};

module.exports = pingInteraction;
