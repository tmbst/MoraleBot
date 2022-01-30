const { generalChannelId } = require("../config.json");

/*
	Event: guildCreate
	Uses Database?: No
	Description: Emitted whenever the client joins a guild.
*/

module.exports = {
	name: "guildCreate",

	async execute(guild) {
		const channel = guild.channels.cache.get(generalChannelId);
		let message = "Thanks for inviting me to the server! I am the MoraleBot.";
		channel.send(message);
	},
};
