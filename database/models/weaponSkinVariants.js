module.exports = (sequelize, dataTypes) => {
    return sequelize.define('weaponSkinVariants', {
        id: {
            primaryKey: true,
            type: dataTypes.STRING,
            allowNull: false
        },
        weaponSkinId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        displayIcon: {
            type: dataTypes.STRING
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        video: {
            type: dataTypes.STRING
        }
    });
};