const { MessageActionRow, MessageButton } = require("discord.js");
const dbFunctions = require("../../database/dbFunctions.js");
const { MoraleIntCommand } = require("../../utility/morale-commands.js ");
const rng = require("../../systems/rng.js");

module.exports = {
	cooldown: 4,
	roll: 2,

	data: MoraleIntCommand("Coinflip"),

	async execute(interaction) {
		const bet = interaction.options.getInteger("int");
		const guildData = interaction.guild;
		const userData = interaction.member.user;

		// Validate a correct bet was placed
		try {
			await rng.validate_bet(bet, guildData, userData);
		} catch (err) {
			return interaction.reply({
				content: `❌ Error: ${err}`,
				ephemeral: true,
			});
		}

		// Button configurations
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("0")
				.setLabel("Heads")
				.setStyle("SECONDARY"),
			new MessageButton()
				.setCustomId("1")
				.setLabel("Tails")
				.setStyle("SECONDARY"),
			new MessageButton()
				.setCustomId("-1")
				.setLabel("❌ Cancel")
				.setStyle("DANGER")
		);

		// Display prompt to the user
		await interaction.reply({
			content: `
				> __**Heads or Tails?**__
				> Select from the buttons below.
				${bet ? `> You are betting: ${bet} Morale.` : ""}`,
			components: [row],
		});

		const message = await interaction.fetchReply();

		// Collector: Only collect from the user that called the cmd, max 1 button click, listen for 8 seconds
		const colFilter = (buttonInteraction) => {
			buttonInteraction.deferUpdate();
			return interaction.user.id === buttonInteraction.user.id;
		};

		const collector = message.createMessageComponentCollector({
			componentType: "BUTTON",
			max: 1,
			filter: colFilter,
			time: 1000 * 4,
		});

		// Collector End Event: Handles game logic and closure
		collector.on("end", async (collected) => {
			// User took longer than 4 seconds to respond
			if (collected.size === 0) {
				return await interaction.editReply({
					content: `
						> __**Game Cancelled**__
						> Any bets have been refunded.
						> Please click on the Heads or Tails buttons. The time limit is 4 seconds.`,
					components: [],
				});
			}

			const choice = collected.first().customId;

			if (choice === "-1") {
				return await interaction.editReply({
					content: `
						> __**Game Cancelled**__
						> Any bets have been refunded.`,
					components: [],
				});
			}

			// Pop the cancel button
			row.components.pop();

			const isWin = rng.validate_win(parseInt(choice), this.roll);
			const results = await rng.format_results(isWin, bet, guildData, userData);

			// Set colors and disable all buttons
			row.components.forEach((component) => {
				if (component.customId === choice) {
					if (isWin) {
						component.setStyle("SUCCESS");
					} else {
						component.setStyle("DANGER");
					}
				}
				component.setDisabled(true);
			});

			return await interaction.editReply({
				content: results,
				components: [row],
			});
		});
	},
};
