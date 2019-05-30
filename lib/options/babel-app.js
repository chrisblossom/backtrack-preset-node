'use strict';

const path = require('path');
const slash = require('slash');
const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');
const log = require('@backtrack/core/dist/utils/log').default;
const copyFiles = require('../copy-files');
const runBabel = require('../run-babel');
const watchApp = require('../watch-app');
const watchDeleted = require('../watch-deleted');
const packageId = require('../utils/package-id');

const relativeBuildPath = slash(path.relative(rootPath, buildPath));
const relativeSourcePath = slash(path.relative(rootPath, sourcePath));
const entryFile = path.resolve(buildPath, `${packageId}.js`);

module.exports = (options) => {
    const preset = {
        presets: [
            ['@backtrack/style', { isApp: true }],
            [
                '@backtrack/jest',
                {
                    isApp: true,
                    windows: options.windows,
                    prepublishOnly: false,
                },
            ],
        ],

        packageJson: {
            main: `${relativeBuildPath}/${packageId}.js`,
            files: [`${relativeBuildPath}/`],
            engines: {
                node: options.nodeVersion,
            },
            private: true,
        },

        prepublishOnly: [false],
        release: ['np'],
        'test.ci-pretest': ['backtrack build', 'backtrack lint'],
        clean: { del: ['**/*'] },

        dev: [
            'backtrack clean',
            [
                {
                    name: 'babel',
                    task: () => runBabel({ entryFile, watch: true }),
                },
                { name: 'copy files', task: () => copyFiles.watch() },
            ],
            () => watchDeleted(),
            () => watchApp(),
        ],
        'dev.watch-only': [
            'backtrack clean',
            [
                {
                    name: 'babel',
                    task: () => runBabel({ entryFile, watch: true }),
                },
                { name: 'copy files', task: () => copyFiles.watch() },
            ],
            () => watchDeleted(),
            () => {
                setTimeout(() => {
                    log.info(
                        `watching ./${relativeSourcePath}/ for changes...`,
                    );
                }, 1);
            },
        ],

        build: [
            'backtrack clean',
            [
                { name: 'babel', task: () => runBabel() },
                { name: 'copy files', task: () => copyFiles() },
            ],
        ],

        files: [
            {
                src: 'files/README-app.md',
                dest: 'README.md',
                ignoreUpdates: true,
            },
            { src: 'files/editorconfig', dest: '.editorconfig' },
            { src: 'files/gitignore-app', dest: '.gitignore' },
            { src: 'files/gitattributes', dest: '.gitattributes' },
            { src: 'files/babel-app.js', dest: '.babelrc.js' },
            {
                src: 'files/package-entry-app.js',
                dest: `${relativeSourcePath}/${packageId}.js`,
                ignoreUpdates: true,
            },
            { src: 'files/np-config.js', dest: '.np-config.js' },
        ],
    };

    return preset;
};
