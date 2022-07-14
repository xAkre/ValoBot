const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const replaceBundleNames = require('./data/bundlesNames');
const replaceThemeNames = require('./data/themesNames');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
});

const agents = require('./models/agents')(sequelize, Sequelize.DataTypes);
const agentAbilities = require('./models/agentAbilities')(sequelize, Sequelize.DataTypes);
const roles = require('./models/roles')(sequelize, Sequelize.DataTypes);
const weapons = require('./models/weapons')(sequelize, Sequelize.DataTypes);
const weaponDamages = require('./models/weaponDamages')(sequelize, Sequelize.DataTypes);
const weaponSkins = require('./models/weaponSkins')(sequelize, Sequelize.DataTypes);
const weaponSkinVariants = require('./models/weaponSkinVariants')(sequelize, Sequelize.DataTypes);
const skinThemes = require('./models/skinThemes')(sequelize, Sequelize.DataTypes);
const skinBundles = require('./models/skinBundles')(sequelize, Sequelize.DataTypes);


// ALL DATA IS TAKEN FROM https://valorant-api.com


sequelize.sync({ force: true })

    // Get Agent Data And Add Roles, Abilities And Agents To Database 
    .then(async () => { 
        const options = {
            params: {
                isPlayableCharacter: true
            }
        };

        // Get The Data
        await axios.get(process.env.API_ROOT + 'agents', options)
            .then(async (res) => {
                if (res.status === 200) {
                    const agentData = res.data.data;

                    for (let i = 0; i < agentData.length; i++) {
                        
                        // Roles
                        const role = await roles.findOne({
                            where: {
                                id: agentData[i].role.uuid
                            }
                        });

                        if (!role) {
                            await roles.create({
                                id: agentData[i].role.uuid,
                                name: agentData[i].role.displayName,
                                description: agentData[i].role.description,
                                displayIcon: agentData[i].role.displayIcon,
                            });
                        };

                        // Agents
                        const data = {
                            id: agentData[i].uuid,
                            name: agentData[i].displayName,
                            description: agentData[i].description,
                            displayIcon: agentData[i].displayIcon,
                            fullPortrait: agentData[i].fullPortraitV2,
                            roleId: agentData[i].role.uuid,
                            background: agentData[i].background
                        };
                        
                        await agents.create(data);

                        // Abilites
                        const abilities = agentData[i].abilities;

                        const renameAbilities = {
                            'Ability1': 'Ability 1',
                            'Ability2': 'Ability 2',
                            'Grenade': 'Ability 3',
                            'Ultimate': 'Ultimate',
                            'Passive': 'Passive'
                        };

                        for (let j = 0; j < abilities.length; j++) {
                            const data = {
                                agentId: agentData[i].uuid,
                                slot: renameAbilities[abilities[j].slot],
                                name: abilities[j].displayName,
                                description: abilities[j].description,
                                displayIcon: abilities[j].displayIcon
                            };

                            await agentAbilities.create(data);
                        };
                    };
                };
            })
    })

    // Get Weapon Data And Add Them To Database As Well As Their Skins
    .then(async () => {

        // Get The Data
        await axios.get(process.env.API_ROOT + 'weapons')
            .then(async (res) => {
                if (res.status === 200) {
                    const weaponData = res.data.data;

                    // Weapons
                    for (let i = 0; i < weaponData.length; i++) {
                        const data = {
                            id: weaponData[i].uuid,
                            name: weaponData[i].displayName,
                            category: weaponData[i].shopData ? weaponData[i].shopData.category : 'Other',
                            fireRate: weaponData[i].weaponStats ? weaponData[i].weaponStats.fireRate : 0,
                            magazine: weaponData[i].weaponStats ? weaponData[i].weaponStats.magazineSize : 0,
                            runSpeed: weaponData[i].weaponStats ? weaponData[i].weaponStats.runSpeedMultiplier : 1,
                            equipTime: weaponData[i].weaponStats ? weaponData[i].weaponStats.equipTimeSeconds : 1,
                            reloadTime: weaponData[i].weaponStats ? weaponData[i].weaponStats.reloadTimeSeconds : 0,
                            firstBulletAccuracy: weaponData[i].weaponStats ? weaponData[i].weaponStats.firstBulletAccuracy : 0,
                            wallPenetration: weaponData[i].weaponStats ? weaponData[i].weaponStats.wallPenetration : 'EWallPenetrationDisplayType::None',
                            displayIcon: weaponData[i].displayIcon,
                            cost: weaponData[i].shopData ? weaponData[i].shopData.cost : 0
                        };

                        await weapons.create(data);

                        // Weapon Damages
                        const damages = weaponData[i].weaponStats ? weaponData[i].weaponStats.damageRanges : [
                            {
                                rangeStartMeters: 0,
                                rangeEndMeters: 0,
                                headDamage: 0,
                                bodyDamage: 0,
                                legDamage: 0
                            }
                        ];

                        for (let j = 0; j < damages.length; j++) {
                            const data = {
                                weaponId: weaponData[i].uuid,
                                rangeStart: damages[j].rangeStartMeters,
                                rangeEnd: damages[j].rangeEndMeters,
                                headDamage: damages[j].headDamage,
                                bodyDamage: damages[j].bodyDamage,
                                legDamage: damages[j].legDamage,
                            };

                            await weaponDamages.create(data);
                        };

                        // Skin Stuff
                        const skins = weaponData[i].skins;

                        for (let j = 0; j < skins.length; j++) {
                            const data = {
                                id: skins[j].uuid,
                                name: skins[j].displayName,
                                weaponId: weaponData[i].uuid,
                                themeId: skins[j].themeUuid
                            };

                            await weaponSkins.create(data);

                            // Variants
                            const variants = skins[j].chromas;

                            for (let k = 0; k < variants.length; k++) {
                                const data = {
                                    id: variants[k].uuid,
                                    weaponSkinId: skins[j].uuid,
                                    displayIcon: variants[k].displayIcon ? variants[k].displayIcon : skins[j].displayIcon,
                                    name: variants[k].displayName,
                                    video: variants[k].streamedVideo
                                };

                                await weaponSkinVariants.create(data);
                            };
                        };
                    };
                };
            })
    })  
    
    // Other Stuff, For Now Just Skin Themes And Bundles
    .then(async () => {

        // Get The Data For Themes
        await axios.get(process.env.API_ROOT + 'themes')
            .then(async (res) => {
                if (res.status === 200) {
                    const themesData = res.data.data
                    
                    // Themes
                    for (let i = 0; i < themesData.length; i++) {

                        // Manually change duplicate themes
                        if (replaceThemeNames[themesData[i].uuid]) {
                            themesData[i].displayName = replaceThemeNames[themesData[i].uuid];
                        }
                        
                        const data = {
                            id: themesData[i].uuid,
                            name: themesData[i].displayName,
                            displayIcon: themesData[i].displayIcon
                        };

                        await skinThemes.create(data);
                    };
                };
            });

        // Get The Data For Bundles
        await axios.get(process.env.API_ROOT + 'bundles')
            .then(async (res) => {
                if (res.status === 200) {
                    const bundlesData = res.data.data;

                    for (let i = 0; i < bundlesData.length; i++) {

                        // Manually change duplicate bundles
                        if (replaceBundleNames[bundlesData[i].uuid]) {
                            bundlesData[i].displayName = replaceBundleNames[bundlesData[i].uuid];
                        }

                        const data = {
                            id: bundlesData[i].uuid,
                            name: bundlesData[i].displayName,
                            description: bundlesData[i].description,
                            displayIcon: bundlesData[i].displayIcon,
                            promoImage: bundlesData[i].verticalPromoImage
                        };

                        await skinBundles.create(data);
                    }
                }
            })
    })
    .then(() => {
        sequelize.close();
        console.log('Database Synced Successfully');
    });

