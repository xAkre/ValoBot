module.exports = (sequelize, dataTypes) => {
    return sequelize.define('skinBundles', {
        id: {
            primaryKey: true,
            type: dataTypes.STRING
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        description: {
            type: dataTypes.STRING
        },
        displayIcon: {
            type:  dataTypes.STRING
        },
        promoImage: {
            type: dataTypes.STRING
        }
    });
};