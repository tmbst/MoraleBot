module.exports = {
	name: 'kick',
	description: 'Kick a user from the server.',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',

	execute(message, args) {
		message.channel.send('Kick.');
	},
};