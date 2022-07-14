module.exports = (sequelize, dataTypes) => {
    return sequelize.define('users', {
        id: {
            type: dataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        level: {
            type: dataTypes.INTEGER,
            default: 0
        },
        xp: {
            type: dataTypes.INTEGER,
            default: 0
        },
        balance: {
            type: dataTypes.INTEGER,
            default: 0
        }
    });
};  