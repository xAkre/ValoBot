module.exports = (sequelize, dataTypes) => {
    return sequelize.define('weaponCards', {
        weaponId: {
            type: dataTypes.STRING,
            allowNull: false,
            primaryKey: true    
        },
        baseAtk: {
            type: dataTypes.INTEGER,
            default: 0
        },
        basePen: {
            type: dataTypes.INTEGER,
            default: 0
        }
    });
};