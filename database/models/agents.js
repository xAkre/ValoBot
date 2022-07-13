module.exports = (sequelize, dataTypes) => {
    return sequelize.define('agents', {
        id: {
            primaryKey: true,
            type: dataTypes.STRING,
            allowNull: false
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        description: {
            type: dataTypes.TEXT,
            allowNull: true
        },
        displayIcon: {
            type: dataTypes.STRING,
            allowNull: false
        },
        fullPortrait: {
            type: dataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        background: {
            type: dataTypes.STRING,
            allowNull: true
        }
    });
};