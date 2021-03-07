const database = require('../database/dbFunctions');
const Discord = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',

    execute(member, client, dbClient) {

        // Swap this channelID for the TMBST channelID
        const channelID = '571250035086589973';
        const userJoinedDate = member.user.createdAt

        const welcomeEmbed = new Discord.MessageEmbed()
                .setColor('00FF00')
                .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.displayAvatarURL())
                .setTitle('Member Joined')
                .setDescription(`Account Created: ${userJoinedDate}`)
                .setTimestamp();

        const channel = member.guild.channels.cache.get(channelID);

        channel.send(welcomeEmbed);

        // DB Add New User
        database.createGuildMember(member.guild, member.user, dbClient);
    },
}