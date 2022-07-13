const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
});

const models = {
    agents: require('./models/agents')(sequelize, Sequelize.DataTypes),
    agentAbilities: require('./models/agentAbilities')(sequelize, Sequelize.DataTypes),
    roles: require('./models/roles')(sequelize, Sequelize.DataTypes),
    weapons: require('./models/weapons')(sequelize, Sequelize.DataTypes),
    weaponDamages: require('./models/weaponDamages')(sequelize, Sequelize.DataTypes),
    weaponSkins: require('./models/weaponSkins')(sequelize, Sequelize.DataTypes),
    weaponSkinVariants: require('./models/weaponSkinVariants')(sequelize, Sequelize.DataTypes),
    skinThemes: require('./models/skinThemes')(sequelize, Sequelize.DataTypes),
    skinBundles: require('./models/skinBundles')(sequelize, Sequelize.DataTypes)
};


// Relationships


// Weapons

models.weapons.hasMany(models.weaponSkins, {
    foreignKey: 'weaponId',
    as: 'skins'
});

models.weapons.hasMany(models.weaponDamages, {
    foreignKey: 'weaponId',
    as: 'damages'
});

models.weaponSkins.hasMany(models.weaponSkinVariants, {
    foreignKey: 'weaponSkinId',
    as: 'variants'
});

models.weaponSkins.belongsTo(models.skinThemes, {
    foreignKey: 'themeId',
    as: 'theme'
});

models.skinThemes.hasMany(models.weaponSkins, {
    foreignKey: 'themeId',
    as: 'skins'
});

models.skinThemes.hasMany(models.skinBundles, {
    foreignKey: 'name',
    sourceKey: 'name',
    as: 'bundles'
})

// Agents

models.agents.hasMany(models.agentAbilities, {
    foreignKey: 'agentId',
    as: 'abilities'
});

models.roles.hasMany(models.agents, {
    foreignKey: 'roleId',
    as: 'agents'
});

models.agents.belongsTo(models.roles, {
    foreignKey: 'roleId',
    as: 'role'
});


// Exports


module.exports = models;

module.exports = {
    agents: models.agents,
    agentAbilities: models.agentAbilities,
    roles: models.roles,
    weapons: models.weapons,
    weaponDamages: models.weaponDamages,
    weaponSkins: models.weaponSkins,
    weaponSkinVariants: models.weaponSkinVariants,
    skinThemes: models.skinThemes,
    skinBundles: models.skinBundles
};
