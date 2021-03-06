const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content === `${config.prefix}ping`) {
        message.channel.send('Pong.');
    
    } else if (message.content === `${config.prefix}beep`) {
        message.channel.send('Boop.');
    }
});

client.login(config.token);
