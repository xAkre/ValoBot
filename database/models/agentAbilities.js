module.exports = (sequelize, dataTypes) => {
    return sequelize.define('agentAbilities', {
        agentId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        slot: {
            type: dataTypes.STRING,
            allowNull: false
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        description: {
            type: dataTypes.TEXT,
            allowNull: false
        },
        displayIcon: {
            type: dataTypes.STRING,
            allowNull: true
        }
    });
};