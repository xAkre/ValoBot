const { avatar, capitalize } = require('../../../utilities/formatting');
const { rarityEmotes } = require('../../../utilities/data/rarities');
const { MessageActionRow, MessageButton } = require('discord.js');
const RESULTS_PER_SLIDE = 20;

const generateDescription = (data, type) => {
    let description = `--------------- ${capitalize(type)} Cards ---------------\n\n`;

    if (data.length < 1) {
        description += `No cards\n\n--------------- ${capitalize(type)} Cards ---------------`;
        return description;
    }

    for (let i = 0; i < data.length; i++) {
        if (type == 'agent') {
            description += `${rarityEmotes[data[i].rarity]} ${data[i].id} ${data[i].agentCard.agent.name}\n`
        }
        else {
            description += `${rarityEmotes[data[i].rarity]} ${data[i].id} ${data[i].skin.name}\n`
        };
    }

    description += `\n--------------- ${capitalize(type)} Cards ---------------`;

    return description;
};  

module.exports = async (agentCards, weaponCards, interaction) => {
    const agentCardCount = agentCards.length;
    const weaponCardCount = weaponCards.length;
    let selectedType = 'agent';
    let currentIndex = 0;

    let agentEmbed = {
        color: 0xFF0000,
        title: `${interaction.user.tag}'s Cards`,
        author: {
            name: interaction.user.tag,
            icon_url: avatar(interaction.user.id, interaction.user.avatar)
        },
        thumbnail: {
            url: avatar(interaction.user.id, interaction.user.avatar)
        },
        description: generateDescription(agentCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'agent'),
        timestamp: new Date(),
        footer: {
            text: `| ${currentIndex} / ${agentCardCount} |`
        }
    };

    let weaponEmbed = {
        color: 0xFFFF00,
        title: `${interaction.user.tag}'s Cards`,
        author: {
            name: interaction.user.tag,
            icon_url: avatar(interaction.user.id, interaction.user.avatar)
        },
        thumbnail: {
            url: avatar(interaction.user.id, interaction.user.avatar)
        },
        description: generateDescription(weaponCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'weapon'),
        timestamp: new Date(),
        footer: {
            text: `| ${currentIndex} / ${weaponCardCount} |`
        }
    };

    const agentActionRow = agentCardCount > 20 ?
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setLabel('<')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('>')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('agents')
                    .setLabel('Agents')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('weapons')
                    .setLabel('Weapons')
                    .setStyle('SECONDARY')
            )
        :
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setLabel('<')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('>')
                    .setStyle('PRIMARY')
            )
    
    const weaponActionRow = agentCardCount > 20 ?
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setLabel('<')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('>')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('agents')
                    .setLabel('Agents')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('weapons')
                    .setLabel('Weapons')
                    .setStyle('SECONDARY')
            )
        :
        new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setLabel('<')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('>')
                    .setStyle('PRIMARY')
            )

    const message = await interaction.reply({
        embeds: [agentEmbed],
        components: [agentActionRow],
        fetchReply: true
    });

    const filter = (i) => {
        return i.user.id === interaction.user.id;
    };

    const collector = message.createMessageComponentCollector({
        filter,
        time: 60000
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'next') {
            if (currentIndex + RESULTS_PER_SLIDE > (selectedType === 'agent' ? agentCardCount : weaponCardCount)) {
                currentIndex = 0
            }
            else {
                currentIndex += RESULTS_PER_SLIDE;
            };

            if (selectedType === 'agent') {
                agentEmbed.description = generateDescription(agentCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'agent');
                agentEmbed.footer = {
                    text: `| ${currentIndex} / ${agentCardCount} |`
                };
                await i.update({
                    embeds: [agentEmbed]
                });
            }
            else {
                weaponEmbed.description = generateDescription(weaponCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'weapon');
                weaponEmbed.footer = {
                    text: `| ${currentIndex} / ${weaponCardCount} |`
                };
                await i.update({
                    embeds: [weaponEmbed]
                });
            }
        }
        
        else if (i.customId === 'previous') {
            currentIndex = currentIndex === 0 ? 
            RESULTS_PER_SLIDE * Math.floor((selectedType === 'agent' ? agentCardCount : weaponCardCount) / RESULTS_PER_SLIDE) 
            : 
            currentIndex - RESULTS_PER_SLIDE;

            if (currentIndex < 0) {
                currentIndex = 0;
            }

            if (selectedType === 'agent') {
                agentEmbed.description = generateDescription(agentCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'agent');
                agentEmbed.footer = {
                    text: `| ${currentIndex} / ${agentCardCount} |`
                };
                await i.update({
                    embeds: [agentEmbed]
                });
            }
            else {
                weaponEmbed.description = generateDescription(weaponCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'weapon');
                weaponEmbed.footer = {
                    text: `| ${currentIndex} / ${weaponCardCount} |`
                };
                await i.update({
                    embeds: [weaponEmbed]
                });
            }
        }

        else if (i.customId === 'agents') {
            selectedType = 'agent';
            currentIndex = 0;
            agentEmbed.description = generateDescription(agentCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'agent');
            agentEmbed.footer = {
                text: `| ${currentIndex} / ${agentCardCount} |`
            };
            await i.update({
                components: [agentActionRow],
                embeds: [agentEmbed]
            });
        }
        
        else if (i.customId === 'weapons') {
            selectedType = 'weapon';
            currentIndex = 0;
            weaponEmbed.description = generateDescription(weaponCards.slice(currentIndex, currentIndex + RESULTS_PER_SLIDE), 'weapon');
            weaponEmbed.footer = {
                text: `| ${currentIndex} / ${weaponCardCount} |`
            };
            await i.update({
                components: [weaponActionRow],
                embeds: [weaponEmbed]
            });
        }
    });
}; 