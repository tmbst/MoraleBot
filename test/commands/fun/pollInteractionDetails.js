const mockEmbed = require('./mockEmbed');

const pollInteractionDetails = {
  username: "username",

  avatarURL() {
  },

  getString() {
    return('"pollTitle" "optionOne" "optionTwo"');
  },

  async send(embed) {
    this.embed = embed;
    return(mockEmbed);
  },

  getTestResult() {
    return this.embed;
  },
};

module.exports = pollInteractionDetails;
