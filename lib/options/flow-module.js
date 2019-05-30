'use strict';

const path = require('path');
const slash = require('slash');
const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');
const log = require('@backtrack/core/dist/utils/log').default;
const runBabel = require('../run-babel');
const flowCopySource = require('../flow-copy-source');
const copyFiles = require('../copy-files');
const watchDeleted = require('../watch-deleted');
const packageId = require('../utils/package-id');

const relativeBuildPath = slash(path.relative(rootPath, buildPath));
const relativeSourcePath = slash(path.relative(rootPath, sourcePath));
const babelEntryFile = path.resolve(buildPath, `${packageId}.js`);
const flowEntryFile = path.resolve(buildPath, `${packageId}.js.flow`);

module.exports = (options) => {
    const preset = {
        presets: [
            ['@backtrack/style', { isApp: false }],
            ['@backtrack/jest', { isApp: false, windows: options.windows }],
        ],

        packageJson: {
            main: `${relativeBuildPath}/${packageId}.js`,
            files: [`${relativeBuildPath}/`, 'flow-typed/'],
            engines: {
                node: options.nodeVersion,
            },
            private: false,
        },

        prepublishOnly: ['backtrack build', 'backtrack flow'],
        release: ['np'],
        'git-pre-push': ['backtrack build', 'backtrack flow'],
        flow: ['flow'],
        'test.ci-pretest': [
            'backtrack build',
            'backtrack lint',
            {
                name: 'flow ci',
                task: path.resolve(__dirname, '../ci-run-flow.js'),
            },
        ],

        clean: { del: ['**/*'] },

        dev: [
            'backtrack clean',
            [
                {
                    name: 'babel',
                    task: () =>
                        runBabel({ entryFile: babelEntryFile, watch: true }),
                },
                {
                    name: 'flow-copy-source',
                    task: () =>
                        flowCopySource({
                            entryFile: flowEntryFile,
                            watch: true,
                        }),
                },
                { name: 'copy files', task: () => copyFiles.watch() },
            ],
            () => watchDeleted({ flow: true }),
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
                {
                    name: 'babel',
                    task: () => runBabel(),
                },
                {
                    name: 'flow-copy-source',
                    task: () => flowCopySource(),
                },
                { name: 'copy files', task: () => copyFiles() },
            ],
        ],

        files: [
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
                src: 'files/package-entry-flow-module.js',
                dest: `${relativeSourcePath}/${packageId}.js`,
                ignoreUpdates: true,
            },
            { src: 'files/flowconfig', dest: '.flowconfig' },
            { src: 'files/jest.flow', dest: 'flow-typed/jest.js' },
            { src: 'files/babel-module.js', dest: '.babelrc.js' },
            { src: 'files/np-config.js', dest: '.np-config.js' },
        ],

        config: {
            babel: {
                presets: [require.resolve('@babel/preset-flow')],
            },
        },
    };

    return preset;
};
