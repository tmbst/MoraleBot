module.exports = {
	name: 'ping',
	aliases: ['beep', 'isthison'],
	description: 'Ping!',
	args: false,
	usage: '!ping',
	guildOnly: true,
	cooldown: 3,

	execute(message, args) {
		message.channel.send('Pong.');
	},
};