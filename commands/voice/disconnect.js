const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect the bot from voice chat.'),

    async execute(interaction) {

        const userVoiceChannel = interaction.member.voice.channel;

        if (!userVoiceChannel) {
            await interaction.reply('You must be in a voice channel to use the disconnect command.');
            return;
        }

        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            await interaction.reply('The bot must be connected to a voice channel before using the disconnect command.')
            return;
        }

        connection.destroy();
        await interaction.reply('MoraleBot has been disconnected from the voice channel.')
    }
}