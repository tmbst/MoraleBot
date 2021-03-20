const Discord = require("discord.js");
const { DateTime } = require('luxon');

module.exports = {
	name: 'userinfo',
	aliases: ['user'],
	description: 'Brings up some details about a specific user or yourself.',
	args: false,
	usage: '!userinfo, !userinfo [@user]',
	guildOnly: true,
	cooldown: 3,

    async execute(message, args) {

        let user;

        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        }
        else {
            user = message.author;
        }

        const member = message.guild.member(user);

		const joinDate = DateTime.fromJSDate(member.joinedAt).toLocaleString(DateTime.DATE_MED);
        const registeredDate = DateTime.fromJSDate(user.createdAt).toLocaleString(DateTime.DATE_MED);
       
        const userInfoEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setThumbnail(user.displayAvatarURL())
            .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL())
            .addField('Nickname', member.nickname ? member.nickname : 'No Nickname')
            .addFields(
                {name: 'Registered Date', value: registeredDate, inline: true},
                {name: 'Joined Date', value: joinDate, inline: true},
            )
            .addField('Status', member.presence.status)
            .addField(`Roles [${member.roles.cache.size-1}]`, member.roles.cache.map(r => r).slice(0,-1).join(' | '))
            .setTimestamp();

        await message.channel.send(userInfoEmbed);

	},
};