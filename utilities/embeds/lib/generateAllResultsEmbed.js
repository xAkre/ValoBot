const { MessageActionRow, MessageButton } = require('discord.js');
const RESULTS_PER_SLIDE = 20;


const generateDescription = (data, title, displayString) => {
    const dataLength = data.length;

    let description = `-------------------- All Results For ${title} --------------------\n\n`;
    
    for (let i = 0; i < dataLength; i++) {
        description += `${data[i][displayString]}\n`;
    };

    return description;
};


module.exports = async (data, title, interaction, displayString = 'name') => {
    const dataLength = data.length;

    let currentIndex = 0;

    if (dataLength < 2) {
        console.log('Generated All Results Embed With Less Than 2 Results');
    };

    let embed = {
        color: 0xFFFFFF,
        footer: {
            text: `All data taken from https://valorant-api.com | ${currentIndex} / ${dataLength} |`
        },
        timestamp: new Date()
    };

    const actionRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('previous')
                .setLabel('<')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setLabel('>')
                .setStyle('PRIMARY')
        );
    
    const description = generateDescription(
        data.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 
        title, 
        displayString
    ) + `\n-------------------- All Results For ${title} --------------------`;
    
    embed.description = description;

    let message;

    if (interaction.isButton()) {
        message = await interaction.update({
            embeds: [embed],
            components: dataLength > RESULTS_PER_SLIDE ? [actionRow] : [],
            fetchReply: true
        });
    }
    else {
        message = await interaction.reply({
            embeds: [embed],
            components: dataLength > RESULTS_PER_SLIDE ? [actionRow] : [],
            fetchReply: true
        });
    };

    const filter = (i) => {
        return i.user.id === interaction.user.id;
    };

    const collector = message.createMessageComponentCollector({
        filter,
        time: 30000
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'previous') {
            currentIndex = currentIndex === 0 ? RESULTS_PER_SLIDE * Math.floor(dataLength / RESULTS_PER_SLIDE) : currentIndex - RESULTS_PER_SLIDE;
            if (currentIndex < 0) {
                currentIndex = 0;
            }
        }
        else {
            if (currentIndex + RESULTS_PER_SLIDE > dataLength) {
                currentIndex = 0
            }
            else {
                currentIndex += RESULTS_PER_SLIDE;
            };
        };

        console.log(currentIndex)

        const description = generateDescription(
            data.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 
            title, 
            displayString
        );

        embed.description = description;
        embed.footer.text = `All data taken from https://valorant-api.com | ${currentIndex} / ${dataLength} |`; 

        await i.update({
            embeds: [embed],
            fetchReply: true
        });
    });
};