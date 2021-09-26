const { SlashCommandBuilder } = require("@discordjs/builders");

/*
	Slash Command: Ping
	Uses Database?: No
	Description: Pong!
*/

module.exports = {
	cooldown: 3,

	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),

	async execute(interaction) {
		return await interaction.reply({ content: "Pong!" });
	},
};
