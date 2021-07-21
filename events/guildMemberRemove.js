const database = require('../database/dbFunctions');
const Discord = require('discord.js');
const { botChannelID } = require('../config.json');

module.exports = {
    name: 'guildMemberRemove',

    execute(member, client, dbClient) {

        const leavingEmbed = new Discord.MessageEmbed()
                .setColor('FF0000')
                .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.displayAvatarURL())
                .setTitle('Member Left')
                .setDescription('They are no longer a member of Team Morale Boost.')
                .setTimestamp();

        const channel = member.guild.channels.cache.get(botChannelID);

        channel.send(leavingEmbed);

        // DB delete user
        database.deleteGuildMember(member.guild.id, member.user.id, dbClient);
    },
}