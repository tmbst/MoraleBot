const Discord = require('discord.js');
const fs = require('fs');
const { token, mongoURI } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// MongoDB
const { MongoClient } = require('mongodb');
const dbClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        // Connect to the MongoDB cluster
        await dbClient.connect();
        console.log("[MongoDB] Connected to MongoDB Servers.");

    } catch (error) {
        console.error(error);
    } 
}
run().catch(console.error);

// Commands Handler
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// Events Handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, dbClient));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client, dbClient));
    }
}

client.login(token);
