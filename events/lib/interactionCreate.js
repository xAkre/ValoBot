const commands = require('../../commands');
const { users } = require('../../database/models');

module.exports = async (interaction) => {

    const user = await users.findOne({
        where: {
            id: interaction.user.id
        }
    });

    if (!user) {
        await users.create({
            id: interaction.user.id
        })
    };

    if (!interaction.isCommand()) { return };

    const command = commands.get(interaction.commandName);

    if (!command) { return };

    command.execute(interaction);
};