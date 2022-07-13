const dotenv = require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const { Collection } = require('discord.js');

const commands = new Collection();
const commandsPath = path.join(__dirname, 'lib');
const commandFiles = fs.readdirSync(commandsPath);

for (const commandFile of commandFiles) {
    const filePath = path.join(commandsPath, commandFile);
    const command = require(filePath);
    commands.set(command.data.name, command);
};

module.exports = commands;