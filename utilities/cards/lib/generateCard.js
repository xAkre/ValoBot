const { rarityChances, rarityMultipliers } = require('../../data/rarities');
const { weaponCards, agentCards, weaponSkinVariants, weaponSkins } = require('../../../database/models');
const { Sequelize, Op } = require('sequelize');
const { capitalize } = require('../../formatting');
const { rarityColors } = require('../../data/rarities');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = async () => {
    const agentOrWeapon = Math.random();
    const isWeapon = agentOrWeapon <= 0.25 ? false : true;
    const rarityNumber = Math.floor(Math.random() * 10000);
    let rarity;
    
    for (const [key, value] of Object.entries(rarityChances)) {
        if (rarityNumber >= value[0] && rarityNumber <= value[1]) {
            rarity = key;
        };
    };

    const randomCard = isWeapon ? 
        await weaponCards.findOne({
            order: [
                Sequelize.fn('RAND')
            ]
        }) 
        : 
        await agentCards.findOne({
            order: [
                Sequelize.fn('RAND')
            ]
        });

    let data;

    if (isWeapon) {

        const randomSkin = await weaponSkins.findOne({
            where: {
                weaponId: randomCard.weaponId
            },  
            order: [
                Sequelize.fn('RAND')
            ]
        });

        const randomVariant = await randomSkin.getVariants({
            order: [
                Sequelize.fn('RAND')
            ],
            limit: 1
        });

        const weapon = await randomSkin.getWeapon();

        data = {
            type: 'weapon',
            weapon,
            skin: randomVariant[0],
            card: {
                weaponCardId: randomSkin.weaponId,
                userId: null,
                rarity: rarity,
                atk: randomCard.baseAtk * rarityMultipliers[rarity],
                pen: randomCard.basePen * rarityMultipliers[rarity],
                skinId: randomVariant[0].id
            }
        };

        const embed = {
            color: rarityColors[data.card.rarity],
            title: 'New Card Drop',
            author: {
                name: data.weapon.name,
                icon_url: data.skin.displayIcon
            },
            thumbnail: {
                url: data.skin.displayIcon
            },
            fields: [
                {
                    name: 'Weapon Name',
                    value: data.weapon.name
                },
                {
                    name: 'Card Rarity',
                    value: capitalize(data.card.rarity)
                },
                {
                    name: 'Skin Name',
                    value: capitalize(data.skin.name)
                },
                {
                    name: 'Card ATK',
                    value: data.card.atk.toString(),
                    inline: true
                },
                {
                    name: 'Card PEN',
                    value: data.card.pen.toString(),
                    inline: true
                }
            ],
            image: {
                url: data.skin.displayIcon
            },
            timestamp: new Date()
        }

        data.embed = embed;
    }
    else {

        const agent = await randomCard.getAgent();

        data = {
            type: 'agent',
            agent,
            card: {
                agentCardId: agent.id,
                userId: null,
                rarity,
                hp: randomCard.baseHp * rarityMultipliers[rarity],
                atk: randomCard.baseAtk * rarityMultipliers[rarity],
                def: randomCard.baseDef * rarityMultipliers[rarity],
            }
        };

        const embed = {
            color: rarityColors[data.card.rarity],
            title: 'New Card Drop',
            author: {
                name: data.agent.name,
                icon_url: data.agent.displayIcon
            },
            thumbnail: {
                url: data.agent.displayIcon
            },
            fields: [
                {
                    name: 'Agent Name',
                    value: data.agent.name
                },
                {
                    name: 'Card Rarity',
                    value: capitalize(data.card.rarity)
                },
                {
                    name: 'Card HP',
                    value: data.card.hp.toString(),
                    inline: true
                },
                {
                    name: 'Card ATK',
                    value: data.card.atk.toString(),
                    inline: true
                },
                {
                    name: 'Card DEF',
                    value: data.card.def.toString(),
                    inline: true
                }
            ],
            image: {
                url: data.agent.fullPortrait
            },
            timestamp: new Date()
        };

        data.embed = embed;
    };

    const actionRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('claim')
                .setLabel('Claim')
                .setStyle('PRIMARY')
        );

    data.actionRow = actionRow;

    return data
};