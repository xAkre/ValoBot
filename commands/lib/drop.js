const { SlashCommandBuilder, userMention } = require('@discordjs/builders'); 
const { generateRandomCard } = require('../../utilities/cards');
const { activeDrops } = require('../../utilities/cards');
const { userAgentCards, userWeaponCards } = require('../../database/models');
const { MessageActionRow, MessageButton } = require('discord.js');
const drops = require('../../utilities/cards/lib/activeDrops');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('drop')
        .setDescription('Drop a random card'),
    execute: async (interaction) => {
        const data = await generateRandomCard();

        const message = await interaction.reply({
            embeds: [data.embed],
            components: [data.actionRow],
            fetchReply: true
        })
        
        const droppedTime = new Date();

        const drop = await activeDrops.addDrop(
            data.card, 
            data.type === 'agent' ? userAgentCards : userWeaponCards,
            message.id
        );

        const filter = (i) => {
            return i.user.id === interaction.user.id && i.customId === 'claim'
        };

        const collector = message.createMessageComponentCollector({
            filter,
            time: 15000,
            max: 1
        });

        collector.on('collect', async (i) => {
            const claimedTime = new Date();

            const timeTaken = (claimedTime.getTime() - droppedTime.getTime()) / 1000;

            const collectedActionRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('claimed')
                        .setLabel('Claimed')
                        .setStyle('SUCCESS')
                        .setDisabled(true)
                );
        
            const card = await activeDrops.updateDrop(i.user.id, i.message.id);

            await i.update({
                components: [collectedActionRow]
            });

            return await i.followUp({
                content: `\`\`\`Card claimed by ${i.user.tag} (${i.user.id})\nTime Taken: ${timeTaken}s\nCard ID: ${card.id}\`\`\``
            });
        });

        collector.on('end', (i) => {
            drops.deleteDrop(i.first().message.id);
        });
    }
};