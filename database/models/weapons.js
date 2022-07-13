module.exports = (sequelize, dataTypes) => {
    return sequelize.define('weapons', {
        id: {
            primaryKey: true,
            type: dataTypes.STRING
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        category: {
            type: dataTypes.STRING,
            allowNull: false
        },
        fireRate: {
            type: dataTypes.FLOAT,
            allowNull: true
        },
        magazine: {
            type: dataTypes.INTEGER,
            allowNull: true
        },
        runSpeed: {
            type: dataTypes.FLOAT,
            allowNull: true
        },
        equipTime: {
            type: dataTypes.FLOAT,
            allowNull: true
        },
        reloadTime: {
            type: dataTypes.FLOAT,
            allowNull: true
        },
        firstBulletAccuracy: {
            type: dataTypes.FLOAT,
            allowNull: true
        },
        wallPenetration: {
            type: dataTypes.STRING,
            allowNull: true
        },
        displayIcon: {
            type: dataTypes.STRING,
            allowNull: true
        },
        cost: {
            type: dataTypes.INTEGER,
            allowNull: true
        }
    });
};