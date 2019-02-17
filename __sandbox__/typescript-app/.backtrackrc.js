'use strict';

module.exports = {
    presets: [['../../', { mode: 'app', syntax: 'typescript' }]],

    config: {
        eslint: {
            parser: 'babel-eslint',

            rules: {
                'no-console': 'off',
            },
        },
    },
};
