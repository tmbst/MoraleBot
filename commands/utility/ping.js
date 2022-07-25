const { MoraleCommand } = require("../../utility/morale-commands.js");
const { MessageEmbed } = require('discord.js');

module.exports = {

	cooldown: 0,

	data: MoraleCommand("Ping"),

	async execute(interaction) {

		await interaction.reply({ 
			content: 'Calculating Ping...' 
		});

		const reply = await interaction.fetchReply();
		const botLatency = reply.createdTimestamp - interaction.createdTimestamp;
		const apiLatency = Math.round(interaction.client.ws.ping);
		
		const pingEmbed = new MessageEmbed()
			.setColor('#4fffa4')
			.setTitle('🏓 Pong!')
			.addFields(
				{name: 'Bot Latency', value: `**${botLatency}ms**`},
				{name: 'API Latency', value: `**${apiLatency}ms**`},
			)

		return await interaction.editReply({
			content : 'Ping Calculated.', 
			embeds: [pingEmbed] 
		});
	},
};
