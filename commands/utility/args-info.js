module.exports = {
	name: 'args-info',
    aliases: ['args'],
	description: 'Information about the arguments provided.',
    args: true,
    usage: '!args-info <arg1> <arg2> ... <argN>',
    guildOnly: true,
    cooldown: 3,

	execute(message, args) {

		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};