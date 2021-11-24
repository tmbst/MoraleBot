const dbFunctions = require("../../database/dbFunctions");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { devRoleId } = require("../../config.json");

module.exports = {
	cooldown: 3,

	data: new SlashCommandBuilder()
		.setName("restart")
		.setDescription("⎾🔨 Utility⏌ Brings the Database up to date if the bot goes offline."),

	async execute(interaction) {

		const isDev = interaction.member.roles.cache.has(devRoleId);

		if (!isDev) {
			return interaction.reply("This command is for the Development Team only.");
		}

		let message = "";
		const guildMembers = await interaction.guild.members.fetch();

		// Adding new guild members to the Database
		const nonBotGuildMembers = guildMembers.filter((member) => {
			return !member.user.bot
		});

		const nonRegisteredMembers = await dbFunctions.readMemberValidation(nonBotGuildMembers,"new");

		if (nonRegisteredMembers.size === 0) {
			message += "No new members to add to the Database.";
		} 
		else {
			nonRegisteredMembers.forEach((member) => {
				dbFunctions.createGuildMember(member.guild, member.user)
				message += `\nAdded ${member.user.username} to the Database.`;
			});
		}

		// Deleting guild members that left the server from the Database.
		const memberIdsToDelete = await dbFunctions.readMemberValidation(guildMembers,"retired");

		if (memberIdsToDelete.length === 0) {
			message += "\nNo new members to delete from the Database.";
		}
        else {
			// Must use for of to get the async/await to work properly
			for (const id of memberIdsToDelete) {
				const deletedMember = await dbFunctions.deleteGuildMember(interaction.guild.id, id);
				message += `\nRemoved ${deletedMember} from Database.`;
			}
		}
		return await interaction.reply(message);
	}
};
