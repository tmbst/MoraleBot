const dbFunctions = require('../../database/dbFunctions');
const { dailyAmount, dailyReset, dailyMultiplier, boostedRoleId } = require('../../config.json');
const { DateTime, Duration } = require('luxon');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment} = require('discord.js');

/*
	Slash Command: Daily
	Uses Database?: Yes
	Description: Use this command to collect daily Morale and update the User's balance.
*/
module.exports = {
	cooldown : 3,
	
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Obtain your dailies.'),

	async execute(interaction) {

		const guildId = interaction.guild.id;
		const userId =  interaction.member.user.id;

		// Compare the time the User has claimed their dailies to the current time.
		const lastDailyClaimed = await dbFunctions.readLastDailyClaimed(guildId, userId);
		const currDateTime = DateTime.now().toMillis();

		// Currently set to check if 24 hours has passed since they last claimed their dailies.
		const difference = Math.floor(dailyReset - (currDateTime - lastDailyClaimed));
		
		if (difference > 0){
			const timeRemaining = Duration.fromMillis(difference);

			return await interaction.reply(`Dailies already claimed. Time remaining: ${timeRemaining.toFormat("h")}h, ${timeRemaining.toFormat("m") % 60}m`);
		}
		else {
			let finalAmount = dailyAmount;
			let finalMultiplier = 1.0;
			let message = '';

			// Server Boosters get a multiplier when collecting their dailies.
			if (interaction.member.roles.cache.has(boostedRoleId)){
				finalMultiplier = dailyMultiplier
				finalAmount = dailyAmount * finalMultiplier;
				message += `Thanks for Boosting! ${finalMultiplier}x applied!\n`;
			}

			// Mongo: Update the User's Balance and Claimed Time
			await dbFunctions.updateBalance(guildId, userId, finalAmount);
			await dbFunctions.updateDailiesClaimed(guildId, userId, currDateTime);

			// Embed setup
			const userName = interaction.member.user.username;
			const userAvatar = interaction.member.user.displayAvatarURL();

			const attachment = new MessageAttachment('./assets/images/chest.gif', 'chest.gif');

			const dailyEmbed = new MessageEmbed()
				.setColor('#FFFF00')
				.setTitle('Daily Morale Claimed!')
				.setAuthor(userName, userAvatar)
				.setThumbnail('attachment://chest.gif')
				.addFields(
					{ name: 'Amount', value: `${finalAmount}`, inline: true },
					{ name: 'Multiplier', value: `${finalMultiplier}`, inline: true },
				)
				.setTimestamp()
				.setFooter(message ? message : 'Tip: Server Boosting = More Morale!')
			
			return await interaction.reply({embeds: [dailyEmbed], files: [attachment]})
		}
	},
};