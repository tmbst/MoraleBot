const dbFunctions = require('../database/dbFunctions');
const Discord = require('discord.js');
const { generalChannelId } = require('../config.json');

/*
	Event: guildMemberRemove
	Uses Database?: Yes
	Description: Emitted whenever a member leaves a guild, or is kicked.
*/

module.exports = {
    name: 'guildMemberRemove',

    execute(member) {

        // Ignore bots.
        if (member.user.bot) {
            return;
        }

        const leavingEmbed = new Discord.MessageEmbed()
                .setColor('FF0000')
                .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.displayAvatarURL())
                .setTitle('A member has left the server.')
                .setDescription(`${member.user.username} is no longer a member of Team Morale Boost.`)
                .setTimestamp();

        const channel = member.guild.channels.cache.get(generalChannelId);

        channel.send({embeds: [leavingEmbed]});

        // DB delete user
        dbFunctions.deleteGuildMember(member.guild.id, member.user.id);
    },
}