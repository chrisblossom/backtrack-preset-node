'use strict';

module.exports = {
    presets: [['../../', { mode: 'module', syntax: 'node' }]],

    config: {
        eslint: {
            rules: {
                'no-console': 'off',
            },
        },
    },
};
