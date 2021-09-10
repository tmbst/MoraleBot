const dbFunctions = require('../../database/dbFunctions');
const { dailyAmount, dailyReset, boostedRoleId } = require('../../config.json');
const { DateTime, Duration } = require('luxon');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Obtain your dailies.'),

	async execute(interaction) {
		
		const lastDailyClaimed = await dbFunctions.readLastDailyClaimed(interaction.guild.id, interaction.member.user.id);
		const currDateTime = DateTime.now().toMillis();
		const difference = Math.floor(dailyReset - (currDateTime - lastDailyClaimed));
		
		if (difference > 0){
			const timeRemaining = Duration.fromMillis(difference);

			interaction.reply(`Dailies already claimed. Time remaining: ${timeRemaining.toFormat("h")}h, ${timeRemaining.toFormat("m") % 60}m`);
		}
		else {
			// Check if the member boosted the server, if so give them a 1.5x multiplier to their dailies
			if (interaction.member.roles.cache.has(boostedRoleId)){
				await dbFunctions.updateBalance(interaction.guild.id, interaction.member.user.id, dailyAmount * 1.5);
				interaction.reply(`Successfully claimed ${dailyAmount * 1.5} Morale. You get a 1.5x multiplier for boosting the server!`);
			}
			else {
				await dbFunctions.updateBalance(interaction.guild.id, interaction.member.user.id, dailyAmount);
				interaction.reply(`Successfully claimed ${dailyAmount} Morale.`);
			}

			await dbFunctions.updateDailiesClaimed(interaction.guild.id, interaction.member.user.id, currDateTime);
			
		}
	},
};