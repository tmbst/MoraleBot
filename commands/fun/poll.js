const Discord = require("discord.js");

module.exports = {
	name: 'poll',
	aliases: ['survey'],
	description: 'Produces a poll via discord embeds that allows voting by reacting',
	args: true,
	usage: '!poll ["title"] ["pollItem1"] ["pollItem2"] ... ["pollItem9"]',
	guildOnly: true,
	cooldown: 3,

	async execute(message, args) {
		
        // Verify user has arguments in quotes to capture the options
        const match = message.content.match(/".+?"/g);

        if (match == null) {
            message.reply('Quotes are required for each item! Example "My Poll" "PollItem1" "PollItem2"');
            return;
        }
        
        // Construct the poll list and extract details
        const poll = match.map(str => str.replace(/"/g, ''));

        const pollTitle = poll[0];
        const pollOptions = poll.slice(1);
        const choices = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];

        if (pollOptions.length > 9) {
            message.reply('At this time you can only have 9 options.');
            return;
        }
        
        // Create the poll embed description (all of the poll options)
        let str = '';
        let i = 0;
        for (const pollItem of pollOptions) {
            str = str + `${choices[i]} ${pollItem}\n\n`;
            i++;
        }

        // Build the poll embed and send to channel. Build reactions for each choice.
        const pollEmbed = new Discord.MessageEmbed()
            .setColor('#7851a9')
            .setTitle(`${pollTitle}`)
            .setDescription(str)
            .setFooter(`${message.member.user.username}'s poll.`, message.member.user.avatarURL())
            .setTimestamp();
            
        const pollEmbedRef = await message.channel.send(pollEmbed);

        for (let i = 0; i < pollOptions.length; i++) {
            pollEmbedRef.react(choices[i]);
        }
	},
};