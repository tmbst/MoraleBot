const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	Slash Command: Poll
	Uses Database?: No
	Description: Creates a poll embed with reactions as the votes.
*/
module.exports = {
    cooldown : 3,
    
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Create a new poll.')
        .addStringOption(option => option.setName('input').setDescription('Enter a string').setRequired(true)),

	async execute(interaction) {
		
        // Verify user has arguments in quotes to capture the options
        const match = interaction.options.getString('input').match(/".+?"/g);

        if (match == null) {
            return await interaction.reply('Quotes are required for each item! Example "My Poll" "PollItem1" "PollItem2"');
        }
        
        // Construct the poll list and extract details
        const poll = match.map(str => str.replace(/"/g, ''));

        const pollTitle = poll[0];
        const pollOptions = poll.slice(1);
        const choices = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];

        if (pollOptions.length > 9) {
            return await interaction.reply('At this time you can only have 9 options.');
        }
        
        // Create the poll embed description (all of the poll options)
        let str = '';
        let i = 0;
        for (const pollItem of pollOptions) {
            str = str + `${choices[i]} ${pollItem}\n\n`;
            i++;
        }

        // Build the poll embed and send to channel. Build reactions for each choice.
        const pollEmbed = new MessageEmbed()
            .setColor('#7851a9')
            .setTitle(`${pollTitle}`)
            .setDescription(str)
            .setFooter(`${interaction.member.user.username}'s poll.`, interaction.member.user.avatarURL())
            .setTimestamp();

        const pollEmbedRef = await interaction.channel.send({embeds: [pollEmbed]});

        // Add reacts to the Poll Embed
        for (let i = 0; i < pollOptions.length; i++) {
            pollEmbedRef.react(choices[i]);
        }

        return await interaction.reply('Poll created.');
	},
};