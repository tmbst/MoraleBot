const database = require('../../database/dbFunctions');

module.exports = {
	name: 'freebie',
	aliases: ['broke', 'poor', 'needmoneypls'],
	description: 'freebie!',
	args: false,
	usage: '!freebie',
	guildOnly: true,
	cooldown: 3,

	async execute(message, args, dbClient) {

		const balance = await database.readBalance(message.guild.id, message.member.user.id, dbClient);
        const freebieAmount = 10;

        if (balance == 0) {
            await database.updateBalance(message.guild.id, message.member.user.id, freebieAmount, dbClient);
            message.reply(`I have given you ${freebieAmount} Morale. Use it wisely.`);
        } 
        else {
            message.reply(`You currently have enough Morale to survive...`);
        }
	},
};