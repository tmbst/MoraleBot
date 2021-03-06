const database = require('../../database/dbFunctions');
const { boostedRoleID } = require('../../config.json');
const Canvas = require('canvas');
const Discord = require("discord.js");
const path = require('path');

module.exports = {
	name: 'balance',
	aliases: ['balance','bank'],
	description: 'Check your balance.',
	args: false,
	usage: '!balance',
	guildOnly: true,
	cooldown: 3,

	async execute(message, args, dbClient) {
		
		// Function for formatting canvas text on an image
		const applyText = (canvas, text) => {
			const ctx = canvas.getContext('2d');
			let fontSize = 60;
			do {
				// Assign the font to the context and decrement it so it can be measured again
				ctx.font = `${fontSize -= 10}px "Futura"`;
			// Compare pixel width of the text ot the canvas minus the approx avatar size
			} while (ctx.measureText(text).width > canvas.width - 300);
			// Return the result to use in canvas
			return ctx.font;
		}

		// Function for creating a new canvas image
		const createCanvas = async (message, dbClient) => {
			
			// Create new Canvas with dimensions of tmbst_wallet.png
			Canvas.registerFont('./assets/fonts/Futura Now Headline Bd.otf', {family: 'Futura'})

			const canvas = Canvas.createCanvas(600,300);
			const ctx = canvas.getContext('2d');

			// Determine which background to use on the balance card

			let background;

			if (message.member.roles.cache.has(boostedRoleID)){
				background = await Canvas.loadImage(path.resolve(__dirname, '../../assets/images/tmbst_wallet_nitro.png'));
			}
			else {
				background = await Canvas.loadImage(path.resolve(__dirname, '../../assets/images/tmbst_wallet_default.png'));
			}

			// Canvas setup: Font size, Font, style, etc.
			ctx.drawImage(background, 0 , 0, canvas.width, canvas.height);
			ctx.font = applyText(canvas, `${message.member.displayName}`);
			ctx.fillStyle = '#ffffff'
		
			// Set the Display Name on the on the canvas
			ctx.fillText(`${message.member.displayName}`, 30, 285);

			// Fetch & Set the balance on the canvas
			const balance = await database.readBalance(message.guild.id, message.member.user.id, dbClient);
			ctx.font = applyText(canvas, `${balance}`);
			ctx.fillText(`${balance}`, 100, 170);

			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'tmbst_wallet.png');
			
			return attachment;
		}

		const attachment = await createCanvas(message, dbClient);

		message.channel.send(attachment);
	},
};