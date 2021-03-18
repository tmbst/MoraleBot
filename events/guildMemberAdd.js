const database = require('../database/dbFunctions');
const Discord = require('discord.js');
const { DateTime } = require('luxon');

module.exports = {
    name: 'guildMemberAdd',

    execute(member, client, dbClient) {

        // Swap this channelID for the TMBST channelID
        const channelID = '571250035086589973';
        const userJoinedDate = DateTime.fromJSDate(member.user.createdAt)
        const userAccountAge = DateTime.now().diff(userJoinedDate,['years','months','days']).toObject();
        console.log(userJoinedDate);
        console.log(userAccountAge);
        const welcomeEmbed = new Discord.MessageEmbed()
                .setColor('00FF00')
                .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.displayAvatarURL())
                .setTitle('Member Joined')
                .addField('Account Age',`${userAccountAge.years} years, ${userAccountAge.months} months, ${Math.floor(userAccountAge.days)} days`)
                .setTimestamp();

        const channel = member.guild.channels.cache.get(channelID);

        channel.send(welcomeEmbed);

        // DB Add New User
        database.createGuildMember(member.guild, member.user, dbClient);
    },
}