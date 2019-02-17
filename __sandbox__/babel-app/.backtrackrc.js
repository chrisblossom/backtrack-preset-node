'use strict';

module.exports = {
    presets: [['../../', { mode: 'app', syntax: 'babel' }]],

    config: {
        eslint: {
            parser: 'babel-eslint',

            rules: {
                'no-console': 'off',
            },
        },
    },
};
