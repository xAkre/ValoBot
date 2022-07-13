const { REST } = require('@discordjs/rest');
const dotenv = require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const { Routes } = require('discord-api-types/v10');

const commands = [];
const commandsPath = path.join(__dirname, 'lib');
const commandFiles = fs.readdirSync(commandsPath);

for (const commandFile of commandFiles) {
    const filePath = path.join(commandsPath, commandFile);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken([process.env.BOT_TOKEN]);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .then(() => {
        console.log('Successfully registered commands');
    })
    .catch((err) => {
        console.log(err);
    });