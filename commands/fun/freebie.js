const dbFunctions = require('../../database/dbFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { freebieAmount } = require('../../config.json'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('freebie')
		.setDescription('Snag some spare change.'),

	async execute(interaction) {

		const balance = await dbFunctions.readBalance(interaction.guild.id, interaction.member.user.id);

        if (balance < freebieAmount) {
            await dbFunctions.updateBalance(interaction.guild.id, interaction.member.user.id, freebieAmount);
            interaction.reply(`I have given you ${freebieAmount} Morale. Use it wisely.`);
        } 
        else {
            interaction.reply(`You currently have enough Morale to survive...`);
        }
        
	},
};