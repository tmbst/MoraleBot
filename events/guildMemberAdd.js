const database = require('../database/dbFunctions');
const Discord = require('discord.js');
const { DateTime } = require('luxon');
const { botChannelID } = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',

    execute(member, client, dbClient) {

        const userJoinedDate = DateTime.fromJSDate(member.user.createdAt)
        const userAccountAge = DateTime.now().diff(userJoinedDate,['years','months','days']).toObject();

        const welcomeEmbed = new Discord.MessageEmbed()
                .setColor('00FF00')
                .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.displayAvatarURL())
                .setTitle('Member Joined')
                .setDescription('Welcome to Team Morale Boost!')
                .addField('Account Age',`${userAccountAge.years} years, ${userAccountAge.months} months, ${Math.floor(userAccountAge.days)} days`)
                .setTimestamp();

        const channel = member.guild.channels.cache.get(botChannelID);

        channel.send(welcomeEmbed);

        // DB Add New User
        database.createGuildMember(member.guild, member.user, dbClient);
    },
}