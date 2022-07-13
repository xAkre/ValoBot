const rarityChances = {
    'common': [0, 5089],
    'uncommon': [5090, 8089],
    'rare': [8090, 9389],
    'epic': [9390, 9889],
    'legendary': [9890, 9989],
    'special': [9990, 9999],
    'unknown': [10000, 10000]
};

const rarityMultipliers = {
    'common': 1,
    'uncommon': 1.2,
    'rare': 1.5,
    'epic': 1.75,
    'legendary': 1.9,
    'special': 2,
    'unknown': 2.2
};

module.exports = {
    rarityChances,
    rarityMultipliers
};