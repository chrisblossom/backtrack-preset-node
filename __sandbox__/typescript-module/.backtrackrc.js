'use strict';

module.exports = {
    presets: [['../../', { mode: 'module', syntax: 'typescript' }]],

    config: {
        eslint: {
            parser: 'babel-eslint',

            rules: {
                'no-console': 'off',
            },
        },
    },
};
