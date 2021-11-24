const { Collection } = require("discord.js");
const cooldowns = new Collection();

/*
	Event: interactionCreate
	Uses Database?: No
	Description: Emitted when an interaction is created.
*/

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(
			interaction.commandName
		);

		if (!command) return;

		// Handle command cooldowns
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = command.cooldown ? (command.cooldown || 3) * 1000 : 0;

		if (timestamps.has(interaction.member.user.id)) {
			const expirationTime = timestamps.get(interaction.member.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return await interaction.reply({
                    content: `⌚️ Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`,
                    ephemeral: true,
                });
			}
		}

		timestamps.set(interaction.member.user.id, now);

		setTimeout(
			() => timestamps.delete(interaction.member.user.id),
			cooldownAmount
		);

		// Execute the command
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);

			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	},
};
