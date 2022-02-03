const pollInteractionDetails = require('./pollInteractionDetails');

const pollInteraction = {
  createdTimestamp: 10456,
  client: {'ws': {'ping': 5}},

  constructor() {
    this.options = pollInteractionDetails;
    this.member = {"user": pollInteractionDetails};
    this.channel = pollInteractionDetails;
  },

  async reply() {
  },
};

module.exports = pollInteraction;
