const { ContextMenuCommandBuilder } = require("@discordjs/builders");

module.exports = {
	cooldown: 2,

	data: new ContextMenuCommandBuilder().setName("useravatar").setType(2),

	async execute(interaction) {
		const avatar = interaction.targetUser.displayAvatarURL();
		return await interaction.reply(avatar);
	},
};
