module.exports = (sequelize, dataTypes) => {
    return sequelize.define('userAgentCards', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        agentCardId: {
            type: dataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: dataTypes.STRING,
            allowNull: true
        },
        rarity: {
            type: dataTypes.STRING,
            default: 'common'
        },
        hp: {
            type: dataTypes.INTEGER,
            default: 0
        },
        atk: {
            type: dataTypes.INTEGER,
            default: 0
        },
        def: {
            type: dataTypes.INTEGER,
            default: 0
        }
    });
};