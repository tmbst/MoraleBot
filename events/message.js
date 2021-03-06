const { prefix } = require('../config.json');
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

module.exports = {
    name: 'message',
    execute(message, client, dbClient) {

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return;
                
        // Check if command was used in DMs
        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command within DMs!');
        }
    
        // Check if command has permissions
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply('You do not have the power to do that!');
            }
        }
    
        // Check if command has args set to True, also returns a usage statement if user errors
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage is: \`${command.usage}\``;
            }
            return message.channel.send(reply);
        }
    
        // Handle command cooldowns
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
        // Execute the command
        try {
            command.execute(message, args, dbClient);
    
        } catch (error) {
            console.error(error);
            message.reply('Sorry, there was an error executing that command!');
    
        }
    },
}