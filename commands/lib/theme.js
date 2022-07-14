const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { skinThemes } = require('../../database/models');
const { Op } = require('sequelize'); 
const { generateSearchResultsEmbed, generateAllResultsEmbed } = require('../../utilities/embeds');

const generateThemeEmbed = async (theme) => {
    const bundles = await theme.getBundles();
    const skins = await theme.getSkins();

    let embed = {
        color: 0xFFFFFF,
        title: theme.name,
        description: 
            `---------------------------------\n` +
            `Theme Name: ${theme.name}\n` +
            `---------------------------------\n` +
            `Is Bundle: ${bundles.length > 0 ? 'Yes' : 'No'}\n` +
            `---------------------------------`
        ,
        timestamp: new Date(),
        footer: {
            text: `All data taken from https://valorant-api.com`
        }
    };

    if (bundles.length > 0) {
        embed.image = {
            url: bundles[0].displayIcon
        }
        embed.thumbnail = {
            url: bundles[0].displayIcon
        };
    }
    else if (theme.displayIcon) {
        embed.image = {
            url: theme.displayIcon
        }
        embed.thumbnail = {
            url: theme.displayIcon
        };
    }

    if (skins.length > 0) {
        embed.description += 'Skin List:\n\n';

        for (let i = 0; i < skins.length; i++) {
            embed.description += `${skins[i].name}\n`
        };

        embed.description += '\n'
        embed.description += 'For more information about a skin, use the /skin command';
    };

    return embed;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('theme')
        .setDescription('Get information about a weapon skin theme')
        .addStringOption(new SlashCommandStringOption()
            .setName('theme')
            .setDescription('The theme you want to get information about')
            .setRequired(false)
        ),
    execute: async (interaction) => {
        const target =  interaction.options._hoistedOptions[0] ? interaction.options._hoistedOptions[0].value : false;
        
        if (!target) {
            const themes = await skinThemes.findAll();
            
            if (themes.length > 0) {
                await generateAllResultsEmbed(themes, 'Themes', interaction, 'name');
            }
            else {
                await interaction.reply('Error finding themes');
            };
        }

        else {
            const themes = await skinThemes.findAll({
                where: {
                    name: {
                        [Op.or]: {
                            [Op.like]: target,
                            [Op.startsWith]: target,
                            [Op.endsWith]: target
                        }
                    }
                }
            });

            switch (themes.length) {
                case 0: {
                    await interaction.reply('Theme not found');
                    break;
                };
                case 1: {
                    const selectedTheme = themes[0];
                    
                    const embed = await generateThemeEmbed(selectedTheme);

                    return await interaction.reply({
                        embeds: [embed]
                    });
                };
                default: {
                    const { collector } = await generateSearchResultsEmbed(themes, 'Theme', interaction, 'name');

                    collector.on('collect', async (i) => {
                        const index = parseInt(i.customId);
                        const selectedTheme = themes[index];
                        const embed = await generateThemeEmbed(selectedTheme);

                        return await i.update({
                            embeds: [embed],
                            components: []
                        });
                    });
                };
            };
        };
    }
};