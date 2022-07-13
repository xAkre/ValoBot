module.exports = (sequelize, dataTypes) => {
    return sequelize.define('roles', {
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
            type: dataTypes.STRING,
            allowNull: false
        },
        displayIcon: {
            type: dataTypes.STRING,
            allowNull: false
        }
    });
};