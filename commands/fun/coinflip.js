const Discord = require("discord.js");
const database = require('../../database/dbFunctions');

module.exports = {
	name: 'coinflip',
	aliases: ['coin', 'flip'],
	description: 'Heads or Tails...',
	args: false,
	usage: '!coinflip, !coinflip [bet]',
	guildOnly: true,
	cooldown: 8,

	async execute(message, args, dbClient) {

        const num = Math.floor(Math.random() * 2);
        const map = {0:'heads',1:'tails'};
        const regex = new RegExp(/^\d+$/);

        let heads = false;
        let tails = false;
        let bet = 0;

        // User passes a valid bet as an argument, allow them to gamble their moralies
        if (args.length > 0 && regex.test(args[0])){
            bet = args[0];
            const balance = await database.readBalance(message.guild.id, message.member.user.id, dbClient);
            if (bet > balance) {
                message.reply("Your current balance is to low for this bet!");
                return;
            }
        }

        const botMessage = await message.channel.send("Heads (H) or Tails (T)? React below...");
        botMessage.react('🇭').then(() => botMessage.react('🇹'));

        const filter = (reaction, user) => {
            return ['🇭','🇹'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        // Wait for the user to react with H or T
        botMessage.awaitReactions(filter, {max: 1, time: 8000, errors: ['time'] })
            .then(async collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '🇭') {
                    heads = true;
                    message.channel.send('You picked Heads...');
            
                }
                else {
                    tails = true;
                    message.channel.send('You picked Tails...');
                }
                // Determine winnings or losings
                if ((num == 0 && heads) || (num == 1 && tails)) {
                    message.reply(`You won!!! The flip was ${map[num]}!!`);
                    if (bet != 0) {
                        message.channel.send(`You won ${bet} Morale!`);
                        await database.updateBalance(message.guild.id, message.member.user.id, bet, dbClient);
                    }
                }
                else {
                    message.reply(`You lost. The flip was ${map[num]}.`);
                    if (bet != 0) {
                        message.channel.send(`You lost ${bet} Morale.`)
                        await database.updateBalance(message.guild.id, message.member.user.id, -bet, dbClient);
                    }
                }

            }).catch(collected => {
                message.reply('You failed to react with Heads or Tails.');
            });
	},
};