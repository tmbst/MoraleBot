const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");
const fs = require("fs");
const { logger } = require("./utility/logger.js");
const glob = require("glob");

const commands = [];

glob("commands/**/*.js", (error, files) => {
	if (error) {
		logger.error(error);
	}
	for (index in files) {
		const command = require("./" + files[index]);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: "9" }).setToken(token);

	(async () => {
		try {
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commands,
			});

			logger.info("Successfully registered application commands.");
		} catch (error) {
			logger.error(error);
		}
	})();
});
