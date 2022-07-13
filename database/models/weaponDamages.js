module.exports = (sequelize, dataTypes) => {
    return sequelize.define('weaponDamages', {
        weaponId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        rangeStart: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        rangeEnd: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        headDamage: {
            type: dataTypes.INTEGER,
            allowNull: true
        },
        bodyDamage: {
            type: dataTypes.INTEGER,
            allowNull: true
        },
        legDamage: {
            type: dataTypes.INTEGER,
            allowNull: true
        }
    });
};