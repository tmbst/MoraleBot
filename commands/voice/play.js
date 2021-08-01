const fs = require('fs');
const { connect } = require('http2');

module.exports = {
    name: 'play',
    aliases: ['vc'],
    description: 'Connect bot to voice chat and play request',
    args: true,
    usage: '!play [input], where input can be any of the following: david, goddammit, pepperoncini, bonk, joey',
    guildOnly: true,
    cooldown: 1,

    async execute(message, args) {

        if (!message.member.voice.channel) {
            message.reply('You must be in a voice channel to use the play command!');
            return;
        }

        const playRequest = args[0].toLowerCase();
        const connection = await message.member.voice.channel.join();
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
                filePath = `../../assets/sounds/general/bonkSound.mp3`;
                message.reply('Bonk! Please use the input specified in the usage or check spelling!')

                break;
        }


        dispatcher = connection.play(require("path").join(__dirname, `${filePath}`), {volume: 0.75});

        dispatcher.on('start', () => {
            console.log(`LOGS: ${filePath} has started playing.`);

        });

        dispatcher.on('finish', () => {
            console.log(`LOGS: ${filePath} has finished playing.`);

        });
        
        dispatcher.on(`ERROR: ${filePath} has errored.`, console.error);

    }
}