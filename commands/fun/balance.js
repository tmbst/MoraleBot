const database = require('../../database/dbFunctions');

module.exports = {
	name: 'balance',
	aliases: ['balance','bank'],
	description: 'Check your balance.',
	args: false,
	usage: '!balance',
	guildOnly: true,
	cooldown: 3,

	async execute(message, args, dbClient) {
		
        const balance = await database.readBalance(message.guild.id, message.member.user.id, dbClient);

        message.reply(`you have ${balance} moralies.`);

	},
};