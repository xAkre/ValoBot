const { Collection } = require('discord.js');

const drops = new Collection();

Reflect.defineProperty(drops, 'addDrop', {
    value: async (data, model, messageId) => {
        const drop = await model.create(data);
        drops.set(messageId, drop);
        return drop;
    }
});

Reflect.defineProperty(drops, 'updateDrop', {
    value: async (userId, messageId) => {
        const card = drops.get(messageId);
        card.userId = userId;
        await card.save();
        drops.sweep((value, key) => {
            return key === messageId;
        });
        return card;
    }
});

Reflect.defineProperty(drops, 'deleteDrop', {
    value: (messageId) => {
        if (drops.get(messageId)) {
            drops.sweep((value, key) => {
                return key === messageId;
            });
        };
    }
});

module.exports = drops;