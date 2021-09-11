const fs = require('fs');
const { join } = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play audio files.')
        .addStringOption(option => option.setName('input').setDescription('Choices: david, joey, goddammit, pepperoncini, or bonk').setRequired(true)),

    async execute(interaction) {

        const channel = interaction.member.voice.channel

        if (!channel) {
            await interaction.reply('You must be in a voice channel to use the play command.');
            return;
        }

        const playRequest = interaction.options.getString('input').toLowerCase();

        let filePath;

        switch (playRequest) {
            case 'david':
                const files = fs.readdirSync('./assets/sounds/david/');
                const randomDavidSound = files[Math.floor(Math.random() * files.length)];

                filePath = `../../assets/sounds/david/${randomDavidSound}`;

                break;

            case 'joey':
                filePath = `../../assets/sounds/david/joey.wav`;

                break;

            case 'goddammit':
                filePath = `../../assets/sounds/david/godDammit.wav`;

                break;

            case 'pepperoncini':
                filePath = `../../assets/sounds/general/pepperoncini.mp3`;

                break;

            case 'bonk':
                filePath = `../../assets/sounds/general/bonkSound.mp3`;

                break;

            default:
                await interaction.reply('Please use the input specified or check spelling!')
                return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        let resource = createAudioResource(join(__dirname, `${filePath}`), { inlineVolume: true });
        resource.volume.setVolume(0.5);

        const player = createAudioPlayer();

        player.play(resource);

        connection.subscribe(player);
        
        await interaction.reply(`Now playing ${playRequest} audio.`);
    }
}