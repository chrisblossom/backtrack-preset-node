'use strict';

module.exports = {
    presets: [['../../', { mode: 'app', syntax: 'node' }]],

    config: {
        eslint: {
            rules: {
                'no-console': 'off',
            },
        },
    },
};
