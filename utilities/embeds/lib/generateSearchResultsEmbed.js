const { MessageActionRow, MessageButton } = require('discord.js');
const MAX_BUTTONS = 5;

module.exports = async (data, title, interaction, displayString = 'name') => {
    const dataLength = data.length;

    if (dataLength < 2) {
        console.log('Generated Search Results Embed With Less Than 2 Results');
    };

    let embed = {
        color: 0xFFFFFF,
        footer: {
            text: 'All data taken from https://valorant-api.com'
        },
        timestamp: new Date()
    };

    const targetLength = dataLength > MAX_BUTTONS ? MAX_BUTTONS : dataLength;
    const actionRow = new MessageActionRow();
    const components = [];

    let description = `-------------------- ${title} Results --------------------\n\n`;

    for (let i = 0; i < targetLength; i++) {
        components.push(new MessageButton()
            .setCustomId(`${i}`)
            .setLabel(`${i + 1}`)
            .setStyle('PRIMARY')
        );

        description += `${i + 1}: ${data[i][displayString]}\n`;
    };

    if (dataLength > MAX_BUTTONS) {
        description += `+${dataLength - MAX_BUTTONS} more\n`;
    };

    description += `\n-------------------- ${title} Results --------------------`;

    embed.description = description;

    actionRow.addComponents(components);

    let message;

    if (interaction.isButton()) {
        message = await interaction.update({
            embeds: [embed],
            components: [actionRow],
            fetchReply: true
        });
    }
    else {
        message = await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            fetchReply: true
        });
    };

    const filter = (i) => {
        return i.user.id === interaction.user.id;
    };

    const collector = message.createMessageComponentCollector({
        filter,
        time: 15000,
        max: 1
    });

    return { embed, collector }; 
};