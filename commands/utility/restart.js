const dbFunctions = require('../../database/dbFunctions');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ministryRoleId } = require('../../config.json'); 

/*
	Slash Command: Restart
	Uses Database?: Yes
	Description: This command will check if any users need to be added to the DB or removed from the DB.
*/
module.exports = {
    cooldown : 3,
    
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('[ADMIN] Brings the Database up to date.'),

	async execute(interaction) {

        // Verify user executing this command is an admin.
        if (!interaction.member.roles.cache.has(ministryRoleId)) {
            return interaction.reply('You must be a part of the Ministry of Morale to use this command!');
        }

        const membersList = [];
        let message = '';

        // Get Guild Members from Discord Server.
        await interaction.guild.members.fetch().then( guildMembers => {
            
            guildMembers.forEach( (member) => {

                // Do not add bots to the list.
                if (!member.user.bot) {
                    membersList.push(member.user.id)
                }

            });
        });

        // Compare Guild Members to add from MongoDB.
        const addIdList = await dbFunctions.readMemberValidation(membersList, 'new');

        if (addIdList.length == 0) {
            message += 'No new members to add to the Database.';
        }
        else {

            for (const id of addIdList) {
                const guildMember = await interaction.guild.members.fetch(id);
                
                // No bots allowed
                if (!guildMember.user.bot) {
                    dbFunctions.createGuildMember(interaction.guild, guildMember.user);

                    message += `\nAdded ${guildMember.user.username} to the Database.`;
                }
            }

            // addIdList.forEach(async id => {
            //     const guildMember = await interaction.guild.members.fetch(id);
                
            //     // No bots allowed
            //     if (!guildMember.user.bot) {
            //         dbFunctions.createGuildMember(interaction.guild, guildMember.user);

            //         message += `\nAdded ${guildMember.user.username} to the Database.`;
            //     }
            // });
        }

        // Compare Guild Members to delete from MongoDB.
        const delIdList = await dbFunctions.readMemberValidation(membersList, 'retired');

        if (delIdList.length == 0) {
            message += '\nNo new members to delete from the Database.';
        }
        else {

            for (const id of delIdList) {

                const deletedUser = await dbFunctions.deleteGuildMember(interaction.guild.id, id);
                message += `\nRemoved ${deletedUser} from Database.`;

            }

            // delIdList.forEach(async id => {

            //     const deletedUser = await dbFunctions.deleteGuildMember(interaction.guild.id, id);
            //     message += `\nRemoved ${deletedUser} from Database.`;

            // });
        }

        return await interaction.reply(message); 
	},
};