const dbFunctions = require('../../database/dbFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { freebieAmount } = require('../../config.json'); 

/*
	Slash Command: Freebie
	Uses Database?: Yes
	Description: If you are broke, you can get some Morale for free.
*/
module.exports = {
    cooldown : 3,
    
	data: new SlashCommandBuilder()
		.setName('freebie')
		.setDescription('Snag some spare change.'),

	async execute(interaction) {

        const guildId = interaction.guild.id
        const userId = interaction.member.user.id
		const balance = await dbFunctions.readBalance(guildId, userId);
        let message = ''

        if (balance < freebieAmount) {
            await dbFunctions.updateBalance(guildId, userId, freebieAmount);
            message += `Broke again? A Bank of Morale banker slides you ${freebieAmount} Morale!`
        } 
        else {
            message += `Your balance is ${balance}. You have enough Morale to survive.`;
        }

        return await interaction.reply(message);
	},
};