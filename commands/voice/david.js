const fs = require('fs');
const { connect } = require('http2');

module.exports = {
	name: 'david',
	aliases: ['denver'],
	description: 'Plays a david sound clip.',
	args: false,
	usage: '!david',
	guildOnly: true,
	cooldown: 1,

	async execute(message, args) {

        if (message.member.voice.channel) {

            const connection = await message.member.voice.channel.join();
            // Play David's god dammit line specifically
            if (args[0] === 'goddammit') {
                
                const dispatcher = connection.play(require("path").join(__dirname, `../../sounds/godDammit.wav`), {volume: 0.75});

                dispatcher.on('start', () => {
                    console.log(`[!david] An audio file is now playing!`);

                });

                dispatcher.on('finish', () => {
                    console.log(`[!david] An audio file is no longer playing!`);

                });
                
                dispatcher.on('[!david] ERROR', console.error);
                

            }
            else {
                const files = fs.readdirSync('./sounds/');
                const randomFile = files[Math.floor(Math.random() * files.length)];
                const dispatcher = connection.play(require("path").join(__dirname, `../../sounds/${randomFile}`), {volume: 0.75});

                dispatcher.on('start', () => {
                    console.log(`[!david] An audio file is now playing!`);
                });
                
                dispatcher.on('finish', () => {
                    console.log(`[!david] An audio file is no longer playing!`);
    
                });
                
                dispatcher.on('[!david] ERROR', console.error);
            }

        }
        else {
            message.reply("You must be in a voice channel to use this command!");
        }
	},
};