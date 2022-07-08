const poll = require('../../../commands/fun/poll');
const pollInteraction = require('./pollInteraction');
const pollInteractionDetails = require('./pollInteractionDetails');

test('poll test', () => {
  pollInteraction.constructor();
	return poll.execute(pollInteraction).then(response => {
    pollEmbed = pollInteractionDetails.getTestResult();
    expect(pollEmbed.embeds[0].title == "pollTitle" &&
        pollEmbed.embeds[0].description.includes('optionOne') &&
        pollEmbed.embeds[0].description.includes('optionTwo')).toBe(true);
  });
})
