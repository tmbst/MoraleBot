const database = require('../../database/dbFunctions');

module.exports = {
	name: 'restart',
	aliases: ['reset'],
	description: 'Perform restart services for the bot. Should only be called by *BOT* admins.',
	args: false,
	usage: '!restart',
	guildOnly: true,
	cooldown: 0,

	async execute(message, args, dbClient) {
        const membersList = [];
        // Get Guild Members from Discord
        await message.guild.members.fetch().then( guildMembers => {
            
            guildMembers.forEach( member =>

                membersList.push(member.user.id)
                
            );
        });

        // Get Guild Members to add from MongoDB
        const addIdList = await database.checkNewbieGuildMembers(membersList, dbClient);

        if (addIdList.length == 0) {
            message.reply(`No new members to add to the Database.`);
        }
        else {
            addIdList.forEach(async id => {
                const guildMember = await message.guild.members.fetch(id);

                database.createGuildMember(message.guild, guildMember.user, dbClient);

                message.reply(`Added ${guildMember.user.username} to the Database.`);
            });
        }

        // Get Guild Members to delete from MongoDB
        const delIdList = await database.checkRetiredGuildMembers(membersList, dbClient);

        if (delIdList.length == 0) {
            message.reply(`No new members to delete from the Database.`);
        }
        else {
            delIdList.forEach(async id => {

                const deletedUser = await database.deleteGuildMember(message.guild.id, id, dbClient);

                message.reply(`Removed ${deletedUser} from Database.`);
            });
        } 
	},
};