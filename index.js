const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv').config();
const events = require('./events');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => { console.log('Bot is ready!') });

for (const [key, value] of Object.entries(events)) {
    client.on(key, value);
};

client.login(process.env.BOT_TOKEN);