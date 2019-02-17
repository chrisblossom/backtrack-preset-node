'use strict';

const path = require('path');
const slash = require('slash');
const { rootPath } = require('@backtrack/core/paths');
const watchApp = require('../watch-app');
const packageId = require('../utils/package-id');

const sourcePath = path.resolve(rootPath, 'app');
const relativeSourcePath = slash(path.relative(rootPath, sourcePath));

module.exports = (options) => {
    const preset = {
        presets: [
            ['@backtrack/style', { isApp: true, node: true }],
            ['@backtrack/jest', { isApp: true, windows: options.windows }],
        ],

        packageJson: {
            main: `${relativeSourcePath}/${packageId}.js`,
            files: [`${relativeSourcePath}/`],
            engines: {
                node: options.nodeVersion,
            },
        },

        'test.ci-pretest': ['backtrack lint'],
        dev: [
            () =>
                watchApp({
                    sourcePath,
                    watchPath: sourcePath,
                    verbose: true,
                }),
        ],

        files: [
            { makeDirs: [relativeSourcePath], skip: ['dist', 'src'] },
            {
                src: 'files/CHANGELOG.md',
                dest: 'CHANGELOG.md',
                ignoreUpdates: true,
            },
            {
                src: 'files/README-app.md',
                dest: 'README.md',
                ignoreUpdates: true,
            },
            { src: 'files/editorconfig', dest: '.editorconfig' },
            { src: 'files/gitignore-app', dest: '.gitignore' },
            {
                src: 'files/package-entry-node-app.js',
                dest: `${relativeSourcePath}/${packageId}.js`,
                ignoreUpdates: true,
            },
        ],
    };

    return preset;
};