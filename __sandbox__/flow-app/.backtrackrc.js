'use strict';

module.exports = {
    presets: [['../../', { mode: 'app', syntax: 'flow' }]],

    files: { allowChanges: '.flowconfig' },

    config: {
        eslint: {
            parser: 'babel-eslint',

            rules: {
                'no-console': 'off',
            },
        },
    },
};
