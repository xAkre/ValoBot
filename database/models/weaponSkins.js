module.exports = (sequelize, dataTypes) => {
    return sequelize.define('weaponSkins', {
        id: {
            primaryKey: true,
            type: dataTypes.STRING
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        weaponId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        themeId: {
            type: dataTypes.STRING,
            allowNull: true
        }
    });
};