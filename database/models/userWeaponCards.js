module.exports = (sequelize, dataTypes) => {
    return sequelize.define('userWeaponCards', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        weaponCardId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: dataTypes.STRING,
            allowNull: true
        },
        rarity: {
            type: dataTypes.STRING,
            default: 'common'
        },
        atk: {
            type: dataTypes.INTEGER,
            default: 0
        },
        pen: {
            type: dataTypes.INTEGER,
            default: 0
        },
        skinId: {
            type: dataTypes.STRING,
            allowNull: false
        }
    });
};