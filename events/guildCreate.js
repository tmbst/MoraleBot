const dbFunctions = require("../database/dbFunctions");
const { generalChannelId } = require("../config.json");

/*
	Event: guildCreate
	Uses Database?: Yes
	Description: Emitted whenever the client joins a guild.
*/

module.exports = {
	name: "guildCreate",

	async execute(guild) {
		// First check if data already exists for this guild. If it does, then just skip and redirect to the /restart command.
		const guildId = await dbFunctions.readGuildId(guild.id);
		const channel = guild.channels.cache.get(generalChannelId);
		let message = "Thanks for inviting me to the server! I am the MoraleBot.";

		if (guildId) {
			message += `\nThere exists user data for this guild.\nI will not add anything to the database.\nTry running \`/restart\` to update the Database!`;
			channel.send(message);
			return;
		} 
        else {
			message += "\nNo data found in the database.\nI will begin adding all server members to the database!";
			channel.send(message);

			// Add each guild members data to the database
			guild.members.fetch().then((guildMembers) => {
				guildMembers.forEach((member) => {
					// Ignore bots
					if (!member.user.bot) {
						dbFunctions.createGuildMember(guild, member.user);
					}
				});
			});
		}
	},
};
