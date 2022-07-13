const commands = require('../../commands');

module.exports = (interaction) => {
    if (!interaction.isCommand()) { return };

    const command = commands.get(interaction.commandName);

    if (!command) { return };

    command.execute(interaction);
};