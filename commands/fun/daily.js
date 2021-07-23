const database = require('../../database/dbFunctions');
const { dailyAmount, dailyReset, boostedRoleID } = require('../../config.json');
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
			// Check if the member boosted the server, if so give them a 1.5x multiplier to their dailies
			if (message.member.roles.cache.has(boostedRoleID)){
				await database.updateBalance(message.guild.id, message.member.user.id, dailyAmount * 1.5, dbClient);
				message.reply(`Successfully claimed ${dailyAmount * 1.5} Morale. You get a 1.5x multiplier for boosting the server!`);
			}
			else {
				await database.updateBalance(message.guild.id, message.member.user.id, dailyAmount, dbClient);
				message.reply(`Successfully claimed ${dailyAmount} Morale.`);
			}

			await database.updateDailiesClaimed(message.guild.id, message.member.user.id, currDateTime, dbClient);
			
		}
	},
};