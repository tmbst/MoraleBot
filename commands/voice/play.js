const fs = require("fs");
const { join } = require("path");
const { MoraleStrCommand } = require("../../utility/morale-commands.js ");
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

/*
	Slash Command: Play
	Uses Database?: No
	Description: Plays audio files based on the options based in to the slash command.
*/

module.exports = {
	data: MoraleStrCommand("Play"),

	async execute(interaction) {
		// Grab the voice channel and request from the User
		const channel = interaction.member.voice.channel;

		if (!channel) {
			return await interaction.reply(
				"You must be in a voice channel to use the play command."
			);
		}

		const playRequest = interaction.options
			.getString("input")
			.toLowerCase();

		// Determine the file path for the given request
		let filePath;

		switch (playRequest) {
			case "david":
				const files = fs.readdirSync("./assets/sounds/david/");
				const randomDavidSound = files[Math.floor(Math.random() * files.length)];

				filePath = `../../assets/sounds/david/${randomDavidSound}`;

				break;
			
			case "animal":
				const animalFiles = fs.readdirSync("./assets/sounds/animal/");
				const randomAnimalSound = animalFiles[Math.floor(Math.random() * animalFiles.length)];

				filePath = `../../assets/sounds/animal/${randomAnimalSound}`;

				break;

			case "joey":
				filePath = `../../assets/sounds/david/joey.wav`;

				break;

			case "goddammit":
				filePath = `../../assets/sounds/david/godDammit.wav`;

				break;

			case "pepperoncini":
				filePath = `../../assets/sounds/general/pepperoncini.mp3`;

				break;

			case "bonk":
				filePath = `../../assets/sounds/general/bonkSound.mp3`;

				break;

			case "bingbong":
				filePath = `../../assets/sounds/general/bingBong.mp3`;

				break;

			default:
				return await interaction.reply("Please use the input specified or check spelling!");
		}

		// Get the bot voice connection and destroy it
		let connection = getVoiceConnection(interaction.guild.id);

		if (!connection) {
			// DiscordJS Voice Connections and Audio Player Setup
			connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			await interaction.channel.send("Connected to a voice channel.");
		}

		const player = createAudioPlayer();

		let resource = createAudioResource(join(__dirname, `${filePath}`), {
			inlineVolume: true,
		});
		resource.volume.setVolume(0.5);

		connection.subscribe(player);

		player.play(resource);

		return await interaction.reply(`Now playing ${playRequest} audio.`);
	},
};
