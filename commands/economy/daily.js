const dbFunctions = require("../../database/dbFunctions");
const { dailyAmount, dailyMultiplier, boostedRoleId } = require("../../config.json");
const { DateTime, Duration } = require("luxon");
const { MoraleCommand } = require("../../utility/morale-commands.js ");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
	cooldown: 3,

	data: MoraleCommand("Daily"),

	async execute(interaction) {
		const guildData = interaction.guild;
		const userData = interaction.member.user;
		const guildId = guildData.id;
		const userId = userData.id;

		const currentDate = DateTime.now().setZone("America/Los_Angeles");

		// Compare the date the dailies were claimed to the current date.
		const lastDailyMillis = await dbFunctions.readLastDailyClaimed(
			guildData,
			userData
		);

		const claimedDate = DateTime.fromMillis(lastDailyMillis).setZone(
			"America/Los_Angeles"
		);

		if (claimedDate.startOf("day") < currentDate.startOf("day")) {
			let finalAmount = dailyAmount;
			let finalMultiplier = 1.0;
			let message = "";

			// Server Boosters get a multiplier when collecting their dailies.
			if (interaction.member.roles.cache.has(boostedRoleId)) {
				finalMultiplier = dailyMultiplier;
				finalAmount = dailyAmount * finalMultiplier;
				message += `💎 Thanks for Boosting! ${finalMultiplier}x applied!\n`;
			}

			// Mongo: Update the User's Balance and Claimed Time
			await dbFunctions.updateBalance(guildData, userData, finalAmount);
			await dbFunctions.updateDailiesClaimed(
				guildId,
				userId,
				currentDate.toMillis()
			);

			// Embed setup
			const userName = interaction.member.user.username;
			const userAvatar = interaction.member.user.displayAvatarURL();

			const attachment = new MessageAttachment(
				"./assets/images/chest.gif",
				"chest.gif"
			);

			const dailyEmbed = new MessageEmbed()
				.setColor("#FFFF00")
				.setTitle("Daily Morale Claimed!")
				.setAuthor(userName, userAvatar)
				.setThumbnail("attachment://chest.gif")
				.addFields(
					{ name: "💰 Amount", value: `${finalAmount}`, inline: true },
					{ name: "💌 Multiplier", value: `${finalMultiplier}`, inline: true})
				.setTimestamp()
				.setFooter(
					message ? message : "❗️ Tip: Server Boosting = More Morale!"
				);

			return await interaction.reply({
				embeds: [dailyEmbed],
				files: [attachment]
			});
		} 
		else {
			return await interaction.reply({
				content: `⌚️ Dailies already claimed. Please wait until **midnight (PST)** to claim your next set of dailies.`,
				ephemeral: true
			});
		}
	},
};
