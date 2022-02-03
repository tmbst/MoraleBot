const ping = require('../../../commands/utility/ping');
const pingInteraction = require('./pingInteraction');

test('ping test', () => {
	const replySpy = jest.spyOn(pingInteraction, 'reply');
	const editReplySpy = jest.spyOn(pingInteraction, 'editReply');

	return ping.execute(pingInteraction).then(reply => {
		expect(replySpy).toHaveBeenCalledTimes(1);
		expect(editReplySpy).toHaveBeenCalledTimes(1);

		expect(reply.embeds[0].title.toLowerCase().includes("pong") || reply.content.toLowerCase().includes("pong")).toBe(true);
	});
})
