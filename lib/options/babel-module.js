'use strict';

const path = require('path');
const slash = require('slash');
const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');
const log = require('@backtrack/core/dist/utils/log').default;
const copyFiles = require('../copy-files');
const runBabel = require('../run-babel');
const watchDeleted = require('../watch-deleted');
const packageId = require('../utils/package-id');

const relativeBuildPath = slash(path.relative(rootPath, buildPath));
const relativeSourcePath = slash(path.relative(rootPath, sourcePath));
const babelEntryFile = path.resolve(buildPath, `${packageId}.js`);

module.exports = (options) => {
    const preset = {
        presets: [
            ['@backtrack/style', { isApp: false }],
            ['@backtrack/jest', { isApp: false, windows: options.windows }],
        ],

        packageJson: {
            main: `${relativeBuildPath}/${packageId}.js`,
            files: [`${relativeBuildPath}/`],
            engines: {
                node: options.nodeVersion,
            },
            private: false,
        },

        prepublishOnly: ['backtrack build'],
        release: ['np'],
        'test.ci-pretest': ['backtrack build', 'backtrack lint'],
        clean: { del: ['**/*'] },

        dev: [
            'backtrack clean',
            [
                {
                    name: 'babel',
                    task: () =>
                        runBabel({ entryFile: babelEntryFile, watch: true }),
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
            { src: 'files/npmrc-module', dest: '.npmrc' },
            { src: 'files/yarnrc-module', dest: '.yarnrc' },
            { src: 'files/babel-module.js', dest: '.babelrc.js' },
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
