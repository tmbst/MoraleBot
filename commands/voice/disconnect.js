const fs = require('fs');
const { connect } = require('http2');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect the bot from voice chat.'),

    async execute(message, args) {

        const userVoiceChannel = message.member.voice.channel;

        if (!userVoiceChannel) {
            message.reply('You must be in a voice channel to use the disconnect command.');
            return;
        }

        const botVoiceConnection = message.guild.voice;

        if (!botVoiceConnection) {
            message.reply('The bot must be connected to a voice channel before using the disconnect command.')
            return;
        }

        const botVoiceChannel = botVoiceConnection.channel;

        if (userVoiceChannel === botVoiceChannel) {
            botVoiceChannel.leave();
            message.reply('MoraleBot has been disconnected from the voice channel.')
        }
        else {
            message.reply('MoraleBot is not in the same voice channel as you.')
        }
    }
}