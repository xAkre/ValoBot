const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { weapons, agents } = require('../../database/models');
const { Op } = require('sequelize');
const { MessageActionRow, MessageButton, Interac } = require('discord.js');

const generateWeaponEmbed = async (weapon) => {
    let embed = {
        color: 0xFFFFFF,
        title: weapon.name,
        url: weapon.displayIcon,
        description: `
            --------------- Stats ---------------

            Weapon Name: ${weapon.name}
            Category: ${weapon.category}
            Fire Rate: ${weapon.fireRate}
            Magazine Size: ${weapon.magazine}
            Run Speed: ${weapon.runSpeed}
            Equip Time: ${weapon.equipTime}
            Reload Time: ${weapon.reloadTime}
            First Bullet Accuracy: ${weapon.firstBulletAccuracy}
            Cost: ${weapon.cost}
        `,
        image: {
            url: weapon.displayIcon
        },
        timestamp: new Date()
    };

    const skins = await weapon.getSkins();
    
    if (skins.length > 0) {
        embed.description += `\n--------------- Skins ---------------\n`;

        for (let i = 0; i < skins.length; i++) {
            const currentSkin = skins[i];
            const skinTheme = await currentSkin.getTheme();
            embed.description += `\n${currentSkin.name} :: ${skinTheme.name} set`
        };

        embed.description += `\n\nTo see more info about a skin, use the /skin command`;

        embed.description += `\n\u200b\n\u200b`;
    }

    return embed;
};

const generateAgentEmbed = async (agent) => {
    let embed = {
        color: 0xFFFFFF,
        title: agent.name,
        url: agent.fullPortrait,
        thumbnail: {
            url: agent.displayIcon
        },
        description: `
            Info 
            ---------------------------------
            Agent Name: ${agent.name}
            ---------------------------------
            Agent Description: ${agent.description}
            ---------------------------------
        `,
        image: {
            url: agent.fullPortrait
        },
        timestamp: new Date()
    }

    const agentRole = await agent.getRole();

    if (agentRole) {
        embed.description += `Agent Role: ${agentRole.name}
            ---------------------------------
            Role Description: ${agentRole.description}
            ---------------------------------
            Click Buttons Below To See Abilities
        `;
        
    }

    return embed
};

const generateAbilityEmbed = (ability, agent) => {
    let embed = {
        color: 0xFFFFFF,
        title: ability.name,
        url: ability.displayIcon ? ability.displayIcon : null,
        thumbnail: {
            url: ability.displayIcon ? ability.displayIcon : null
        },
        description: `
            Info
            ---------------------------------
            Agent Name: ${agent.name}
            ---------------------------------
            Ability Slot: ${ability.slot}
            ---------------------------------
            Ability Name: ${ability.name}
            ---------------------------------
            Ability Description: ${ability.description}
        `,
        image: {
            url: agent.fullPortrait
        },
        timestamp: new Date()
    };

    return embed;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
            .setDescription('Get info about a weapon or agent')
            .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName('agent')
                    .setDescription('Get info about an agent')
                    .addStringOption(new SlashCommandStringOption()
                        .setName('agent')
                        .setDescription('The agent you want to get information about')
                        .setRequired(true)    
                    )
            )
            .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName('weapon')
                    .setDescription('Get info about an weapon')
                    .addStringOption(new SlashCommandStringOption()
                        .setName('weapon')
                        .setDescription('The weapon you want to get information about')
                        .setRequired(true)    
                    )
            ),
    execute: async (interaction) => {

        // If Checking Weapon Info
        if (interaction.options._subcommand === 'weapon') {
            const target = interaction.options._hoistedOptions[0].value;
            const weapon = await weapons.findAll({
                where: {
                    name: {
                        [Op.or]: {
                            [Op.like]: target,
                            [Op.startsWith]: target,
                            [Op.endsWith]: target
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
                        const embed = await generateWeaponEmbed(res[0]);
                        const message = await interaction.reply({
                            embeds: [embed],
                            fetchReply: true
                        });     
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
                        
                        let descriptionText = `-------------------- Results --------------------\n\n`;

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
                            time: 15000,
                            max: 1
                        });

                        collector.on('collect', async (i) => {
                            console.log(i);
                            const index = parseInt(i.customId);
                            const weapon = res[index];
                            const embed = await generateWeaponEmbed(weapon);
                            const message = await i.update({
                                embeds: [embed],
                                components: [],
                                fetchReply: true
                            });
                        });

                        break;
                    };
                };
            });
        } 

        // If Checking Agent Info
        else {
            const target = interaction.options._hoistedOptions[0].value;
            const agent = await agents.findAll({
                where: {
                    name: {
                        [Op.or]: {
                            [Op.like]: target,
                            [Op.startsWith]: target,
                            [Op.endsWith]: target
                        }
                    }
                }
            })
            .then(async (res) => {
                switch (res.length) {
                    case 0: {
                        await interaction.reply('Agent not found');
                        break;
                    };
                    case 1: {
                        const agent = res[0];
                        const embed = await generateAgentEmbed(res[0]);
                        const abilities = await agent.getAbilities();
                        let abilityRow = new MessageActionRow();

                        if (abilities.length > 0) {
                            const components = [];

                            for (let i = 0; i < abilities.length; i++) {
                                const currentAbility = abilities[i];
                                components.push(
                                    new MessageButton()
                                        .setCustomId(`${i.toString()}`)
                                        .setLabel(`${currentAbility.slot}`)
                                        .setStyle('PRIMARY')
                                );
                            }

                            abilityRow.addComponents(components);
                        }

                        const message = await interaction.reply({
                            embeds: [embed],
                            components: abilities.length > 0 ? [abilityRow] : [],
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
                            const index = parseInt(i.customId);
                            const ability = abilities[index];
                            
                            const newEmbed = generateAbilityEmbed(ability, agent);

                            await i.update({
                                components: [abilityRow],
                                embeds: [newEmbed]
                            });
                        });
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
                        
                        let descriptionText = `-------------------- Results --------------------\n\n`;

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
                            time: 15000,
                            max: 1
                        });

                        collector.on('collect', async (i) => {
                            const index = parseInt(i.customId);
                            const agent = res[index];
                            const embed = await generateAgentEmbed(agent);

                            const abilities = await agent.getAbilities();
                            let abilityRow = new MessageActionRow();

                            if (abilities.length > 0) {
                                const components = [];

                                for (let i = 0; i < abilities.length; i++) {
                                    const currentAbility = abilities[i];
                                    components.push(
                                        new MessageButton()
                                            .setCustomId(`${i.toString()}`)
                                            .setLabel(`${currentAbility.slot}`)
                                            .setStyle('PRIMARY')
                                    );
                                }

                                abilityRow.addComponents(components);
                            }

                            const message = await i.update({
                                embeds: [embed],
                                components: abilities.length > 0 ? [abilityRow] : [],
                                fetchReply: true
                            });

                            const collector = message.createMessageComponentCollector({
                                filter,
                                time: 30000
                            });

                            collector.on('collect', async (i) => {
                                const index = parseInt(i.customId);
                                const ability = abilities[index];
                                
                                const newEmbed = generateAbilityEmbed(ability, agent);

                                await i.update({
                                    components: [abilityRow],
                                    embeds: [newEmbed]
                                });
                            });
                        });

                        break;
                    };
                };
            })
        }
    }
};