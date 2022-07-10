const Commands = require("../utility/commands.json");
const { logger } = require('../utility/logger.js');
const { GenerateAscii } = require('../utility/ascii-generator.js');

/*
	Event: ready
	Uses Database?: No
	Description: Emitted when the client becomes ready to start working.
*/

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		logger.info(`MoraleBot is ready! Logged in as ${client.user.tag}.`);
		client.user.setActivity("TMBST", { type: "COMPETING" });
		console.log(GenerateAscii("Morale Bot"));
		
		console.log("Commands Available:")
		for (cmd in Commands) {
			console.log(
				`\t/${Commands[cmd]['name']} - ${Commands[cmd]['desc']}`
			);
		}
	},
};
