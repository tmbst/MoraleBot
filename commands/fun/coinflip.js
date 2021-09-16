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
		.setDescription("Flip a coin!")
		.addIntegerOption((option) =>
			option.setName("int").setDescription("Enter a bet.")
		),

	async execute(interaction) {
		const bet = interaction.options.getInteger("int");
		const idx = Math.floor(Math.random() * 2);
		const choices = ["Heads", "Tails"];
		const result = choices[idx];
		const regex = new RegExp(/^\d+$/);

		// User passes a valid bet as an argument, allow them to gamble their moralies
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
		const buttonHeads = new MessageButton()
			.setCustomId("Heads")
			.setLabel("Heads")
			.setStyle("SECONDARY");

		const buttonTails = new MessageButton()
			.setCustomId("Tails")
			.setLabel("Tails")
			.setStyle("SECONDARY");

		const row = new MessageActionRow().addComponents([
			buttonHeads,
			buttonTails,
		]);

		await interaction.reply({
			content: "Heads or Tails?",
			components: [row],
		});

		// Spawns a collector to collect respones from the buttons, user has 8 seconds to click the buttons.
		const collector = interaction.channel.createMessageComponentCollector({
			componentType: "BUTTON",
			time: 8000,
		});

		let choice;

		collector.on("collect", async (buttonInteraction) => {
			if (buttonInteraction.user.id === interaction.user.id) {
				choice = buttonInteraction.customId;

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

				// Game Logic: Determine if the user's choice matches the result
				// Also handle any bets that were placed at the time of playing the game. Deduct/Add to user's balance.
				let message = "";
				const guildId = interaction.guild.id;
				const userId = interaction.member.user.id;

				message += `You picked: ${choice}`;

				if (choice === result) {
					message += `\nYou won!!! The flip was ${result}.`;
					if (bet) {
						message += `\n${bet} Morale has been added to your account!`;
						await dbFunctions.updateBalance(guildId, userId, bet);
					}
				} else {
					message += `\nYou lost. The flip was ${result}.`;
					if (bet) {
						message += `\n${bet} Morale has been deducted from your account.`;
						await dbFunctions.updateBalance(guildId, userId, -bet);
					}
				}

				await buttonInteraction.reply({
					content: message,
					components: [row],
				});

				collector.stop();
			}
			// Another user attempted to click on the buttons.
			else {
				await buttonInteraction.reply({
					content: `These buttons aren't for you!`,
					ephemeral: true,
				});
			}
		});

		// Collector End Event -> Close out the main interaction.
		collector.on("end", async (collected) => {
			if (!choice) {
				return await interaction.editReply({
					content: "Plase click on the Heads or Tails buttons.",
					components: [],
				});
			}

			return await interaction.editReply({
				content: "This coinflip session has completed.",
				components: [],
			});
		});
	},
};
