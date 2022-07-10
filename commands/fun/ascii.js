const { MessageEmbed } = require("discord.js");
const { MoraleStrCommand } = require("../../utility/morale-commands.js");
const { GenerateAscii } = require('../../utility/ascii-generator.js');

/*
	Slash Command: Ascii
	Uses Database?: No
	Description: Creates ascii art based off text given.
*/

module.exports = {
	cooldown: 3,

	data: MoraleStrCommand("Ascii"),

	async execute(interaction) {
		// Verify user has arguments in quotes to capture the options
		const userInput = interaction.options.getString("input");
		
		if (userInput.length > 30) {
			message = "Ascii Messages cannot be over 30 characters. Try again."
		} else {
			message = "```"+ GenerateAscii(userInput) + "```";
		}

		return await interaction.reply(message);
	},
};
