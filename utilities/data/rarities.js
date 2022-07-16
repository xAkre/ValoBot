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

const rarityColors = {
    'common': 0xe8e8e8,
    'uncommon': 0xd4ffd4,
    'rare': 0xa8ceff,
    'epic': 0xc696f2,
    'legendary': 0xf7ec88,
    'special': 0xf28ac5,
    'unknown': 0x1f1f1f
};

const rarityEmotes = {
    'common': '\:white_circle:',
    'uncommon': '\:green_circle:',
    'rare': '\:blue_circle:',
    'epic': '\:purple_circle:',
    'legendary': '\:yellow_circle:',
    'special': '\:red_circle:',
    'unknown': '\:black_circle:'
};


module.exports = {
    rarityChances,
    rarityMultipliers,
    rarityColors,
    rarityEmotes
};