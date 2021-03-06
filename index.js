const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');


const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders){
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.once('ready', () => {
    console.log('Bot is online.');
});

client.on('message', message => {
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    
    // Check if command was used in DMs
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command within DMs!');
    }

    // Check if command has args set to True, also returns a usage statement if user errors
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage is: \`${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Sorry, there was an error executing that command!');
    }
});

client.login(token);
