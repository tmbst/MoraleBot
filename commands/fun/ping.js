module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: false,
	usage: '!ping',
	guildOnly: true,

	execute(message, args) {
		message.channel.send('Pong.');
	},
};