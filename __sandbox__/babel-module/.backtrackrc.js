'use strict';

module.exports = {
    presets: [['../../', { mode: 'module', syntax: 'babel' }]],

    config: {
        eslint: {
            parser: 'babel-eslint',

            rules: {
                'no-console': 'off',
            },
        },
    },
};
