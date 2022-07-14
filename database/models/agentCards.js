module.exports = (sequelize, dataTypes) => {
    return sequelize.define('agentCards', {
        agentId: {
            type: dataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        baseHp: {
            type: dataTypes.INTEGER,
            default: 0
        },
        baseAtk: {
            type: dataTypes.INTEGER,
            default: 0
        },
        baseDef: {
            type: dataTypes.INTEGER,
            default: 0
        }
    });
};