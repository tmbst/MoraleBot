const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const database = require('./database/dbClient');
const fs = require('fs');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

// Commands Handler
client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

// Events Handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, database.getMongoClient()));
    } else {
        client.on(event.name, (...args) => event.execute(...args, database.getMongoClient()));
    }
}

client.login(token);
database.run().catch(console.error);
