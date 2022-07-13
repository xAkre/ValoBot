module.exports = (sequelize, dataTypes) => {
    return sequelize.define('skinThemes', {
        id: {
            primaryKey: true,
            type: dataTypes.STRING
        },
        name: {
            primaryKey: true,
            type: dataTypes.STRING,
            allowNull: false
        },
        displayIcon: {
            type: dataTypes.STRING,
            allowNull: true
        }
    });
};