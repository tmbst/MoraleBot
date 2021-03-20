const fs = require('fs');
const { connect } = require('http2');

module.exports = {
	name: 'bonk',
	aliases: ['bonk2'],
	description: 'Plays a bonk sound clip.',
	args: false,
	usage: '!bonk',
	guildOnly: true,
	cooldown: 1,

	async execute(message, args) {

        if (message.member.voice.channel) {

            const connection = await message.member.voice.channel.join();

            const dispatcher = connection.play(require("path").join(__dirname, `../../sounds/bonkSound2.mp3`), {volume: 0.75});

            dispatcher.on('start', () => {
                console.log(`[!bonk] An audio file is now playing!`);

            });

            dispatcher.on('finish', () => {
                console.log(`[!bonk] An audio file is no longer playing!`);

            });
            
            dispatcher.on('[!bonk] ERROR', console.error);
                

            
        }
        else {
            message.reply("You must be in a voice channel to use this command!");
        }
	},
};