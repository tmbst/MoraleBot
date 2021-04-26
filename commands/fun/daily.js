const database = require('../../database/dbFunctions');
const { dailyAmount, dailyReset } = require('../../config.json');
const { DateTime, Duration } = require('luxon');

module.exports = {
	name: 'daily',
	aliases: ['dailies'],
	description: 'Obtain your daily Morale.',
	args: false,
	usage: '!daily',
	guildOnly: true,
	cooldown: 3,

	async execute(message, args, dbClient) {
		
		const lastDailyClaimed = await database.readLastDailyClaimed(message.guild.id, message.member.user.id, dbClient);
		const currDateTime = DateTime.now().toMillis();
		const difference = Math.floor(dailyReset - (currDateTime - lastDailyClaimed))
		
		if (difference > 0){
			const timeRemaining = Duration.fromMillis(difference);

			message.reply(`Dailies already claimed. Time remaining: ${timeRemaining.toFormat("h")}h, ${timeRemaining.toFormat("m") % 60}m`);
		}
		else {
			await database.updateBalance(message.guild.id, message.member.user.id, dailyAmount, dbClient);
			await database.updateDailiesClaimed(message.guild.id, message.member.user.id, currDateTime, dbClient);

			message.reply(`Successfully claimed ${dailyAmount} Morale.`);
		}
	},
};