const fs = require("fs");
const { MoraleCommand } = require("../../utility/morale-commands.js ");
const { getVoiceConnection } = require("@discordjs/voice");

/*
	Slash Command: Disconnect
	Uses Database?: No
	Description: Disconnects the bot from a connected voice channel.
*/

module.exports = {
	data: MoraleCommand("Disconnect"),

	async execute(interaction) {
		const userVoiceChannel = interaction.member.voice.channel;

		// Check if user is connected to a voice channel
		if (!userVoiceChannel) {
			return await interaction.reply("You must be in a voice channel to use the disconnect command.");
		}

		// Get the bot voice connection and destroy it
		const connection = getVoiceConnection(interaction.guild.id);

		if (!connection) {
			return await interaction.reply("The bot must be connected to a voice channel before using the disconnect command.");
		}

		connection.destroy();
		return await interaction.reply("MoraleBot has been disconnected from the voice channel.");
	},
};
