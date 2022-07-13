const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { weapons, weaponSkins } = require('../../database/models');
const { Op } = require('sequelize');

const createSkinEmbed = async (skin, variants, index) => {
    const variant = variants[index];
    const theme = await skin.getTheme();
    console.log(variant, skin);

    if (theme) {
        bundles = await theme.getBundles();
    }
    else {
        console.log('Expected skin to be part of a theme');
        return {
            color: 0xFF0000,
            title: 'Error retrieving skin data'
        };
    };

    console.log(bundles);

    let embed = {
        color: 0xFFFFFF,
        title: skin.name,
        url: variant.displayIcon,
        thumbnail: {
            url: bundles.length > 0 ? bundles[0].displayIcon : variant.displayIcon
        },
        description: `
            ---------------------------------
            Skin Name: ${skin.name}
            ---------------------------------
            Variant: ${variant.name}
            ---------------------------------
            Skin Set: ${theme.name}${bundles.length > 0 ? `\nFrom Bundle: ${bundles[0].name}` : ``}
            Variants: ${variants.length}
            \n\u200b\n\u200b
        `,
        image: {
            url: variant.displayIcon
        },
        timestamp: new Date(),
        footer: {
            text: 'All data taken from https://valorant-api.com'
        }
    };

    return embed;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skin')
        .setDescription('Get information about a skin')
        .addStringOption(new SlashCommandStringOption()
            .setName('weapon')
            .setDescription('The weapon you want to check')
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName('skin')
            .setDescription('The skin you want to check')
            .setRequired(true)
        ),
        execute: async (interaction) => {
            const weaponTarget = interaction.options._hoistedOptions[0].value;
            const skinTarget = interaction.options._hoistedOptions[1].value;

            const weapon = await weapons.findAll({
                where: {
                    name: {
                        [Op.or]: {
                            [Op.like]: weaponTarget,
                            [Op.startsWith]: weaponTarget,
                            [Op.endsWith]: weaponTarget
                        }
                    }
                }
            })
            .then(async (res) => {
                switch (res.length) {
                    case 0: {
                        await interaction.reply('Weapon not found');
                        break;
                    };
                    case 1: {
                        const weapon = res[0];
                        const skins = await weapon.getSkins({
                            where: {
                                name: {
                                    [Op.or]: {
                                        [Op.like]: skinTarget,
                                        [Op.startsWith]: skinTarget,
                                        [Op.endsWith]: skinTarget
                                    }
                                }
                            }
                        });

                        switch (skins.length) {
                            case 0: {
                                await interaction.reply('Skin not found');
                                break;
                            };
                            case 1: {
                                const selectedSkin = skins[0];
                                const skinVariants = await selectedSkin.getVariants({
                                    order: [
                                        ['name', 'ASC']
                                    ]
                                });

                                let variantIndex = 0;
                                
                                const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                const cycleRow = new MessageActionRow()
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

                                const message = await interaction.reply({
                                    embeds: [embed],
                                    components: [cycleRow],
                                    fetchReply: true
                                });

                                const filter = (i) => {
                                    return i.user.id === interaction.user.id;
                                };

                                const collector = message.createMessageComponentCollector({
                                    filter,
                                    time: 30000
                                });

                                collector.on('collect', async (i) => {
                                    if (i.customId === 'previous') {
                                        variantIndex = variantIndex === 0 ? skinVariants.length - 1 : variantIndex - 1;
                                    }
                                    else {
                                        variantIndex = variantIndex === skinVariants.length - 1 ? 0 : variantIndex + 1;
                                    };

                                    const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                    await i.update({
                                        embeds: [embed]
                                    });
                                });
                                break;
                            };
                            default: {
                                const count = skins.length >= 5 ? 5 : skins.length;
                                const components = [];

                                for (let i = 0; i < count; i++) {
                                    components.push(
                                        new MessageButton()
                                            .setCustomId(i.toString())
                                            .setLabel((i + 1).toString())
                                            .setStyle('PRIMARY')
                                    );
                                };
                                
                                const actionRow = new MessageActionRow()
                                    .addComponents(
                                        components
                                    );
                                
                                let descriptionText = `-------------------- Skin Results --------------------\n\n`;

                                for (let i = 0; i < count; i++) {
                                    descriptionText += `${i + 1}: ${skins[i].name}\n`;
                                    if (skins.length > 5) {
                                        descriptionText += `+${skins.length - 5} more`
                                    };
                                };

                                const messageEmbed = {
                                    color: 0xFFFFFF,
                                    description: descriptionText,
                                };
                            
                                const message = await interaction.reply({
                                    embeds: [messageEmbed],
                                    components: [actionRow],
                                    fetchReply: true
                                });

                                const filter = (i) => {
                                    return i.user.id === interaction.user.id;
                                };

                                const collector = message.createMessageComponentCollector({
                                    filter,
                                    time: 10000,
                                    max: 1
                                });

                                collector.on('collect', async (i) => {
                                    const index = parseInt(i.customId);
                                    const selectedSkin = skins[index];
                                    const skinVariants = await selectedSkin.getVariants({
                                        order: [
                                            ['name', 'ASC']
                                        ]
                                    });

                                    let variantIndex = 0;
                                    
                                    const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                    const cycleRow = new MessageActionRow()
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

                                    const message = await i.update({
                                        embeds: [embed],
                                        components: [cycleRow],
                                        fetchReply: true
                                    });

                                    const collector = message.createMessageComponentCollector({
                                        filter,
                                        time: 30000
                                    });

                                    collector.on('collect', async (i) => {
                                        if (i.customId === 'previous') {
                                            variantIndex = variantIndex === 0 ? skinVariants.length - 1 : variantIndex - 1;
                                        }
                                        else {
                                            variantIndex = variantIndex === skinVariants.length - 1 ? 0 : variantIndex + 1;
                                        };

                                        const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                        await i.update({
                                            embeds: [embed]
                                        });
                                    });
                                }); 
                            }
                        }
                        break;
                    };
                    default: {
                        const count = res.length >= 5 ? 5 : res.length;
                        const components = [];

                        for (let i = 0; i < count; i++) {
                            components.push(
                                new MessageButton()
                                    .setCustomId(i.toString())
                                    .setLabel((i + 1).toString())
                                    .setStyle('PRIMARY')
                            );
                        };
                        
                        const actionRow = new MessageActionRow()
                            .addComponents(
                                components
                            );
                        
                        let descriptionText = `-------------------- Weapon Results --------------------\n\n`;

                        for (let i = 0; i < count; i++) {
                            descriptionText += `${i + 1}: ${res[i].name}\n`;
                            if (res.length > 5) {
                                descriptionText += `+${res.length - 5} more`
                            };
                        };

                        const messageEmbed = {
                            color: 0xFFFFFF,
                            description: descriptionText,
                        };
                    
                        const message = await interaction.reply({
                            embeds: [messageEmbed],
                            components: [actionRow],
                            fetchReply: true
                        });

                        const filter = (i) => {
                            return i.user.id === interaction.user.id;
                        };

                        const collector = message.createMessageComponentCollector({
                            filter,
                            time: 10000,
                            max: 1
                        });

                        collector.on('collect', async (i) => {
                            const index = parseInt(i.customId);
                            const weapon = res[index];

                            const skins = await weapon.getSkins({
                                where: {
                                    name: {
                                        [Op.or]: {
                                            [Op.like]: skinTarget,
                                            [Op.startsWith]: skinTarget,
                                            [Op.endsWith]: skinTarget
                                        }
                                    }
                                }
                            });

                            switch (skins.length) {
                                case 0: {
                                    await interaction.reply('Skin not found');
                                    break;
                                };
                                case 1: {
                                    const selectedSkin = skins[0];
                                    const skinVariants = await selectedSkin.getVariants({
                                        order: [
                                            ['name', 'ASC']
                                        ]
                                    });

                                    let variantIndex = 0;
                                    
                                    const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                    const cycleRow = new MessageActionRow()
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

                                    const message = await i.update({
                                        embeds: [embed],
                                        components: [cycleRow],
                                        fetchReply: true
                                    });

                                    const collector = message.createMessageComponentCollector({
                                        filter,
                                        time: 30000
                                    });

                                    collector.on('collect', async (i) => {
                                        if (i.customId === 'previous') {
                                            variantIndex = variantIndex === 0 ? skinVariants.length - 1 : variantIndex - 1;
                                        }
                                        else {
                                            variantIndex = variantIndex === skinVariants.length - 1 ? 0 : variantIndex + 1;
                                        };

                                        const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                        await i.update({
                                            embeds: [embed]
                                        });
                                    });
                                    break;
                                };
                                default: {
                                    const count = skins.length >= 5 ? 5 : skins.length;
                                    const components = [];

                                    for (let i = 0; i < count; i++) {
                                        components.push(
                                            new MessageButton()
                                                .setCustomId(i.toString())
                                                .setLabel((i + 1).toString())
                                                .setStyle('PRIMARY')
                                        );
                                    };
                                    
                                    const actionRow = new MessageActionRow()
                                        .addComponents(
                                            components
                                        );
                                    
                                    let descriptionText = `-------------------- Skin Results --------------------\n\n`;

                                    for (let i = 0; i < count; i++) {
                                        descriptionText += `${i + 1}: ${skins[i].name}\n`;
                                        if (skins.length > 5) {
                                            descriptionText += `+${skins.length - 5} more`
                                        };
                                    };

                                    const messageEmbed = {
                                        color: 0xFFFFFF,
                                        description: descriptionText,
                                    };
                                
                                    const message = await i.update({
                                        embeds: [messageEmbed],
                                        components: [actionRow],
                                        fetchReply: true
                                    });

                                    const filter = (i) => {
                                        return i.user.id === interaction.user.id;
                                    };

                                    const collector = message.createMessageComponentCollector({
                                        filter,
                                        time: 10000,
                                        max: 1
                                    });

                                    collector.on('collect', async (i) => {
                                        const index = parseInt(i.customId);
                                        const selectedSkin = skins[index];
                                        const skinVariants = await selectedSkin.getVariants({
                                            order: [
                                                ['name', 'ASC']
                                            ]
                                        });

                                        let variantIndex = 0;
                                        
                                        const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                        const cycleRow = new MessageActionRow()
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

                                        const message = await i.update({
                                            embeds: [embed],
                                            components: [cycleRow],
                                            fetchReply: true
                                        });

                                        const collector = message.createMessageComponentCollector({
                                            filter,
                                            time: 30000
                                        });

                                        collector.on('collect', async (i) => {
                                            if (i.customId === 'previous') {
                                                variantIndex = variantIndex === 0 ? skinVariants.length - 1 : variantIndex - 1;
                                            }
                                            else {
                                                variantIndex = variantIndex === skinVariants.length - 1 ? 0 : variantIndex + 1;
                                            };

                                            const embed = await createSkinEmbed(selectedSkin, skinVariants, variantIndex);

                                            await i.update({
                                                embeds: [embed]
                                            });
                                        });
                                    }); 
                                }
                            }
                        });
                        break;
                    }
                };
            })
        }
};