const dbFunctions = require('../database/dbFunctions');
const Discord = require('discord.js');
const { DateTime } = require('luxon');
const { generalChannelId, lurkerRoleId } = require('../config.json');

/*
	Event: guildMemberAdd
	Uses Database?: Yes
	Description: Emitted whenever a user joins a guild.
*/

module.exports = {
    name: 'guildMemberAdd',

    execute(member) {

        const userJoinedDate = DateTime.fromJSDate(member.user.createdAt)
        const userAccountAge = DateTime.now().diff(userJoinedDate,['years','months','days']).toObject();

        const welcomeEmbed = new Discord.MessageEmbed()
                .setColor('00FF00')
                .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.displayAvatarURL())
                .setTitle('Member Joined')
                .setDescription('Welcome to Team Morale Boost!')
                .addField('Account Age',`${userAccountAge.years} years, ${userAccountAge.months} months, ${Math.floor(userAccountAge.days)} days`)
                .setTimestamp();

        const channel = member.guild.channels.cache.get(generalChannelId);

        channel.send({embeds: [welcomeEmbed]});

        // DB Add New User (no bots allowed)
        if (!member.user.bot) {

            // Add the default role to the user
            let lurkerRole = member.guild.roles.cache.get(lurkerRoleId);

            if (!member.roles.cache.has(lurkerRole.id)) {
                member.roles.add(lurkerRole).catch(console.error);
            }

            dbFunctions.createGuildMember(member.guild, member.user);
        }
    },
}