const dbFunctions = require("../../database/dbFunctions");
const { boostedRoleId } = require("../../config.json");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const path = require("path");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	cooldown: 3,

	data: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("⎾💵 Economy⏌ Check your balance."),

	async execute(interaction) {
		/* 
			Function: applyText
			Description: Formats canvas text on an image
		 */
		const applyText = (canvas, text) => {
			const ctx = canvas.getContext("2d");
			let fontSize = 60;
			do {
				// Assign the font to the context and decrement it so it can be measured again
				ctx.font = `${(fontSize -= 10)}px "Futura"`;
				// Compare pixel width of the text ot the canvas minus the approx avatar size
			} while (ctx.measureText(text).width > canvas.width - 300);
			// Return the result to use in canvas
			return ctx.font;
		};

		/* 
			Function: createCanvas
			Description: Creates the Canvas image and sends it to the Discord Channel.
		*/
		const createCanvas = async (interaction) => {
			// Create new Canvas with dimension size of tmbst_wallet.png
			Canvas.registerFont("./assets/fonts/Futura Now Headline Bd.otf", {family: "Futura"});

			const canvas = Canvas.createCanvas(600, 300);
			const ctx = canvas.getContext("2d");

			// Determine which background to load onto the Canvas
			let source;

			if (interaction.member.roles.cache.has(boostedRoleId)) {
				source = path.resolve(
					__dirname,
					"../../assets/images/tmbst_wallet_nitro.png"
				);
			}
			else {
				source = path.resolve(
					__dirname,
					"../../assets/images/tmbst_wallet_default.png"
				);
			}

			const background = await Canvas.loadImage(source);

			// Canvas Styling: Font size, Font, style, etc.
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			ctx.font = applyText(canvas, `${interaction.member.displayName}`);
			ctx.fillStyle = "#ffffff";

			// Set the User's Display Name & Balance on the Canvas
			ctx.fillText(`${interaction.member.displayName}`, 30, 285);

			const balance = await dbFunctions.readBalance(interaction.guild.id, interaction.member.user.id);
			
			ctx.font = applyText(canvas, `${balance}`);
			ctx.fillText(`${balance}`, 100, 170);

			const attachment = new MessageAttachment(
				canvas.toBuffer(),
				"tmbst_wallet.png"
			);

			return attachment;
		};

		const attachment = await createCanvas(interaction);

		return await interaction.reply({ files: [attachment] });
	},
};
