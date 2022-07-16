const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');
const models = require('../../database/models');
const { userWeaponCards, userAgentCards } = require('../../database/models');
const { generateCardsEmbed } = require('../../utilities/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cards')
        .setDescription('Get a users cards')
        .addUserOption(new SlashCommandUserOption()
            .setName('user')
            .setDescription('The user whose cards you want to check')
            .setRequired(false)
        ),
    execute: async (interaction) => {

        const target = interaction.options._hoistedOptions[0] ? interaction.options._hoistedOptions[0].user.id : interaction.user.id;

        const agentCards = await userAgentCards.findAll({
            where: {
                userId: target
            },
            include: [
                {
                    model: models.agentCards,
                    as: 'agentCard',
                    include: ['agent']
                }
            ]
        });

        const weaponCards = await userWeaponCards.findAll({
            where: {
                userId: target
            },
            include: [
                'skin',
                {
                    model: models.weaponCards,
                    as: 'weaponCard',
                    include: ['weapon']
                },
            ]
        });

        return await generateCardsEmbed(agentCards, weaponCards, interaction);
    }
};