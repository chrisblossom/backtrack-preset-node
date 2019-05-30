'use strict';

const path = require('path');
const slash = require('slash');
const { rootPath } = require('@backtrack/core/paths');
const packageId = require('../utils/package-id');

const relativeSourcePath = slash(path.relative(rootPath, 'lib'));

module.exports = (options) => {
    const preset = {
        presets: [
            ['@backtrack/style', { isApp: false, node: true }],
            ['@backtrack/jest', { isApp: false, windows: options.windows }],
        ],

        packageJson: {
            main: `${relativeSourcePath}/${packageId}.js`,
            files: [`${relativeSourcePath}/`],
            engines: {
                node: options.nodeVersion,
            },
            private: false,
        },

        'test.ci-pretest': ['backtrack lint'],
        release: ['np'],

        files: [
            { makeDirs: [relativeSourcePath], skip: ['dist', 'src'] },
            {
                src: 'files/CHANGELOG.md',
                dest: 'CHANGELOG.md',
                ignoreUpdates: true,
            },
            {
                src: 'files/README-module.md',
                dest: 'README.md',
                ignoreUpdates: true,
            },
            { src: 'files/editorconfig', dest: '.editorconfig' },
            { src: 'files/gitignore-module', dest: '.gitignore' },
            { src: 'files/gitattributes', dest: '.gitattributes' },
            { src: 'files/npmrc-module', dest: '.npmrc' },
            { src: 'files/yarnrc-module', dest: '.yarnrc' },
            {
                src: 'files/package-entry-module.js',
                dest: `${relativeSourcePath}/${packageId}.js`,
                ignoreUpdates: true,
            },
            { src: 'files/np-config.js', dest: '.np-config.js' },
        ],
    };

    return preset;
};
