const dbFunctions = require("../../database/dbFunctions");
const { MoraleCommand } = require("../../utility/morale-commands.js ");
const { freebieAmount } = require("../../config.json");

module.exports = {
	cooldown: 3,

	data: MoraleCommand('Freebie'),

	async execute(interaction) {
		const guildData = interaction.guild;
		const userData = interaction.member.user;
		const guildId = guildData.id;
		const userId = userData.id;
		const balance = await dbFunctions.readBalance(guildData, userData);
		let message = "";

		if (balance < freebieAmount) {
			await dbFunctions.updateBalance(guildData, userData, freebieAmount);
			message += `✅ Broke again? A Bank of Morale banker slides you **${freebieAmount}** Morale!`;
		} else {
			message += `❌ Your balance is **${balance}**. You have enough Morale to survive.`;
		}

		return await interaction.reply(message);
	},
};
