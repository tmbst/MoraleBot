const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	cooldown : 3,
	
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addMentionableOption(option => option.setName('mentionable').setDescription('Mention something')),

    async execute(interaction) {
        const mentionable = interaction.options.getMentionable('mentionable');

		const button = new MessageButton()
			.setCustomId('primary')
			.setLabel('Primary')
			.setStyle('PRIMARY')
		
		const row = new MessageActionRow().addComponents(button);

		await interaction.reply({ content: 'Pong!', components: [row] });

		const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 5000 });

		collector.on('collect', i => {
			if (i.user.id === interaction.user.id) {
				i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
			} else {
				i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
			}
		});

		collector.on('end', collected => {
			row.components[0].setDisabled(true)
			interaction.editReply({ content: 'Pong!', components: [row] });
			console.log(`Collected ${collected.size} interactions.`);
		});
    },
};