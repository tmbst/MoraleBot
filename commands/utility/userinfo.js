const { MessageEmbed } = require("discord.js");
const { DateTime } = require("luxon");
const { MoraleUserCommand } = require("../../utility/morale-commands.js");

module.exports = {
	cooldown: 2,

	data: MoraleUserCommand("UserInfo"),

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

		// Extract various data from the User and GuildMember Classes
		const userRegistered = DateTime.fromJSDate(user.createdAt).toLocaleString(DateTime.DATE_MED);
		const userName = user.username;
		const userDiscrim = user.discriminator;
		const userAvatar = user.displayAvatarURL();

		const guildMemberJoined = DateTime.fromJSDate(guildMember.joinedAt).toLocaleString(DateTime.DATE_MED);
		const guildMemberNickname = guildMember.nickname;
		const guildMemberColor = guildMember.displayColor;

		let guildMemberPremium;

		if (guildMember.premiumSince) {
			guildMemberPremium = DateTime.fromJSDate(guildMember.premiumSince).toLocaleString(DateTime.DATE_MED);
		}

		// Grab all the guild member's roles
		const guildMemberRolesSize = guildMember.roles.cache.size - 1;
		const guildMemberRoles = guildMember.roles.cache.sort((r1, r2) => r2.rawPosition - r1.rawPosition);
		const guildMemberRolesText = guildMemberRoles
			.map((r) => r)
			.slice(0, -1)
			.join(", ");

		// Grab all the guild member's award roles
		const guildMemberAwards = guildMember.roles.cache
			.map((role) => role)
			.filter((role) => role.name.toLowerCase()
			.includes('award'));
		const guildMemberAwardsText = guildMemberAwards.join(", ");
		const guildMemberAwardsSize = guildMemberAwards.length;

		const userInfoEmbed = new MessageEmbed()
			.setColor(guildMemberColor)
			.setThumbnail(userAvatar)
			.setAuthor(userName + "#" + userDiscrim, userAvatar)
			.addField("🏷 Nickname", guildMemberNickname ? guildMemberNickname : "No nickname set")
			.addFields(
				{
					name: "✅ Registered",
					value: userRegistered,
					inline: true,
				},
				{
					name: "📆 Joined Server",
					value: guildMemberJoined,
					inline: true,
				},
				{
					name: "💎 Booster",
					value: guildMemberPremium ? guildMemberPremium : "Not a booster",
					inline: true,
				})
			.addField(`🎭 All Roles (${guildMemberRolesSize})`, guildMemberRolesText ? guildMemberRolesText : "No roles assigned")
			.addField(`🏆 Award Roles (${guildMemberAwardsSize})`, guildMemberAwardsText ? guildMemberAwardsText : "No awards")

		return await interaction.reply({ embeds: [userInfoEmbed] });
	},
};
