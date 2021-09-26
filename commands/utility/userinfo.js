const { MessageEmbed } = require("discord.js");
const { DateTime } = require("luxon");
const { SlashCommandBuilder } = require("@discordjs/builders");

/*
	Slash Command: Userinfo
	Uses Database?: No
	Description: This command pulls from the GuildMember and User classes and displays info in an embed.
*/

module.exports = {
	cooldown: 3,

	data: new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription("Get user information")
		.addUserOption((option) =>
			option.setName("user").setDescription("Specify a user.")
		),

	async execute(interaction) {
		let guildMember;
		let user = interaction.options.getUser("user");

		// Extract optional mentionable if it exists, otherwise get the user who called the interaction
		if (user != null) {
			guildMember = await interaction.guild.members.fetch(user);
		} else {
			user = interaction.user;
			guildMember = interaction.member;
		}

		// Extract various data from the User and GuildMember Classes and place into embed
		const userRegistered = DateTime.fromJSDate(user.createdAt).toLocaleString(DateTime.DATE_MED);
		const userName = user.username;
		const userDiscrim = user.discriminator;
		const userAvatar = user.displayAvatarURL();

		const guildMemberJoined = DateTime.fromJSDate(guildMember.joinedAt).toLocaleString(DateTime.DATE_MED);
		const guildMemberNickname = guildMember.nickname;
		const guildMemberColor = guildMember.displayColor;
		const guildMemberRolesSize = guildMember.roles.cache.size - 1;
		const guildMemberRolesText = guildMember.roles.cache
			.map((r) => r)
			.slice(0, -1)
			.join(" | ");

		let guildMemberPremium;

		if (guildMember.premiumSince) {
			guildMemberPremium = DateTime.fromJSDate(guildMember.premiumSince).toLocaleString(DateTime.DATE_MED);
		}

		const userInfoEmbed = new MessageEmbed()
			.setColor(guildMemberColor)
			.setThumbnail(userAvatar)
			.setAuthor(userName + "#" + userDiscrim, userAvatar)
			.addField(
				"Nickname",
				guildMemberNickname ? guildMemberNickname : "No Nickname set."
			)
			.addFields(
				{
					name: "Registered Date",
					value: userRegistered,
					inline: true,
				},
				{
					name: "Joined Server Date",
					value: guildMemberJoined,
					inline: true,
				},
				{
					name: "Booster Date",
					value: guildMemberPremium ? guildMemberPremium : "N/A",
					inline: true,
				}
			)
			.addField(
				`Roles [${guildMemberRolesSize}]`,
				guildMemberRolesText ? guildMemberRolesText : "No roles assigned."
			)
			.setTimestamp();

		// Send embed
		return await interaction.reply({ embeds: [userInfoEmbed] });
	},
};
