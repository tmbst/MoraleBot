const { MessageActionRow, MessageButton } = require("discord.js");
const dbFunctions = require("../../database/dbFunctions");
const { SlashCommandBuilder } = require("@discordjs/builders");

/*
	Slash Command: Coinflip
	Uses Database?: Yes
	Description: Flip a coin! Optional bet arguments.
*/

module.exports = {
	cooldown: 8,

	data: new SlashCommandBuilder()
		.setName("coinflip")
		.setDescription("Flip a coin! Optionally, bet some Morale.")
		.addIntegerOption((option) =>
			option.setName("int").setDescription("Bet Amount")
		),

	async execute(interaction) {
		let bet = interaction.options.getInteger("int");
		const idx = Math.floor(Math.random() * 2);
		const choices = ["Heads", "Tails"];
		const result = choices[idx];
		const regex = new RegExp(/^\d+$/);

		// Bet Validation
		if (bet) {
			if (!regex.test(bet)) {
				return await interaction.reply(
					"Invalid bet. Please try again!"
				);
			}

			const balance = await dbFunctions.readBalance(
				interaction.guild.id,
				interaction.member.user.id
			);

			if (bet > balance) {
				return await interaction.reply(
					"Your current balance is to low for this bet!"
				);
			}
		}

		// Button setup
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("Heads")
					.setLabel("Heads")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("Tails")
					.setLabel("Tails")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("CANCEL")
					.setLabel("❌ Cancel")
					.setStyle("DANGER"),
		);

		await interaction.reply({
			content: `
				> __**Heads or Tails?**__
				> Select from the buttons below.
				> You are betting: ${bet ? bet : 0} Morale.`,
			components: [row],
		});

		const message = await interaction.fetchReply();

		// Collector: Only collect from the user that called the cmd, max 1 button click, listen for 8 seconds
		const colFilter = (buttonInteraction) => {
			buttonInteraction.deferUpdate();
			return interaction.user.id === buttonInteraction.user.id;
		}

		const collector = message.createMessageComponentCollector({
			componentType : "BUTTON",
			max : 1,
			filter : colFilter,
			time: 1000 * 8,
		});

		// Collector End Event: Handles game logic and closure
		collector.on("end", async (collected) => {

			if (collected.size === 0) {
				return await interaction.editReply({
					content: `
						> __**Game Cancelled**__
						> Any bets have been refunded.
						> Please click on the Heads or Tails buttons. The time limit is 8 seconds.`,
					components: [],
				});
			}

			const choice = collected.first().customId;

			if (choice === "CANCEL") {
				return await interaction.editReply({
					content: `
						> __**Game Cancelled**__
						> Any bets have been refunded.`,
					components: []
				})
			}

			// Pop the cancel button
			row.components.pop()

			// Set colors and disable all buttons
			row.components.forEach((component) => {
				if (component.customId === choice && choice === result) {
					component.setStyle("SUCCESS");
				}

				if (component.customId === choice && choice !== result) {
					component.setStyle("DANGER");
				}
				component.setDisabled(true);
			});

			const guildId = interaction.guild.id;
			const userId = interaction.member.user.id;
			const win = choice === result ? true : false;

			let message = `
				> __**Heads or Tails?**__
				> **Choice**: ${choice}.
				> **Result**: ${result}.
				> 
				${win ? `> You won!!! 🎉` : `> You lost... 😥`}`;

			if (bet) {
				message += `\n> ${bet} Morale has been ${win ? `added to` : `deducted from`} your balance.`;
				bet = win ? bet : -bet;
				await dbFunctions.updateBalance(guildId, userId, bet);
			}

			return await interaction.editReply({
				content: message,
				components: [row]
			});
			
		});
	},
};
