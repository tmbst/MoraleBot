const dbFunctions = require('../../database/dbFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ministryRoleId } = require('../../config.json'); 


module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('[ADMIN] Brings the Database up to date.'),

	async execute(interaction) {
        
        // Verify user executing this command is an admin.
        if (!interaction.member.roles.cache.has(ministryRoleId)) {
            interaction.reply(`You must be a part of the Ministry of Morale to use this command!`);
            return;
        }

        const membersList = [];

        // Get Guild Members from Discord Server.
        await interaction.guild.members.fetch().then( guildMembers => {
            
            guildMembers.forEach( member =>

                membersList.push(member.user.id)
                
            );
        });

        // Compare Guild Members to add from MongoDB.
        const addIdList = await dbFunctions.readMemberValidation(membersList, 'new');

        if (addIdList.length == 0) {
            await interaction.reply(`No new members to add to the Database.`);
        }
        else {
            addIdList.forEach(async id => {
                const guildMember = await interaction.guild.members.fetch(id);

                dbFunctions.createGuildMember(interaction.guild, guildMember.user);

                await interaction.reply(`Added ${guildMember.user.username} to the Database.`);
            });
        }

        // Compare Guild Members to delete from MongoDB.
        const delIdList = await dbFunctions.readMemberValidation(membersList, 'retired');

        if (delIdList.length == 0) {
            await interaction.followUp(`No new members to delete from the Database.`);
        }
        else {
            delIdList.forEach(async id => {

                const deletedUser = await dbFunctions.deleteGuildMember(interaction.guild.id, id);

                await interaction.followUp(`Removed ${deletedUser} from Database.`);
            });
        } 
	},
};