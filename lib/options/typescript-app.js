'use strict';

const path = require('path');
const slash = require('slash');
const { buildPath, rootPath, sourcePath } = require('@backtrack/core/paths');
const log = require('@backtrack/core/dist/utils/log').default;
const runBabel = require('../run-babel');
const copyFiles = require('../copy-files');
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
			types: `${relativeBuildPath}/${packageId}.d.ts`,
			files: [`${relativeBuildPath}/`],
			engines: {
				node: options.nodeVersion,
			},
			private: true,
		},

		prepublishOnly: [false],
		release: ['np'],
		'git-pre-push': ['backtrack build', 'backtrack typescript'],
		typescript: ['tsc'],
		'test.ci-pretest': [
			'backtrack build',
			'backtrack lint',
			'backtrack typescript',
		],

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
				{
					name: 'babel',
					task: () => runBabel(),
				},
				{
					name: 'generate typescript declarations',
					task: 'tsc --project tsconfig.types.json',
				},
				{ name: 'copy files', task: () => copyFiles() },
			],
		],

		files: [
			{
				src: 'files/README-app.md',
				dest: 'README.md',
				ignoreUpdates: true,
			},
			{ src: 'files/gitignore-app', dest: '.gitignore' },
			{ src: 'files/gitattributes', dest: '.gitattributes' },
			{
				src: 'files/package-entry-app.js',
				dest: `${relativeSourcePath}/${packageId}.ts`,
				ignoreUpdates: true,
			},
			{ src: 'files/babel-app.js', dest: '.babelrc.js' },
			{ src: 'files/tsconfig.json', dest: 'tsconfig.json' },
			{
				src: 'files/tsconfig.types.json',
				dest: 'tsconfig.types.json',
			},
			{
				src: 'files/global.d.ts',
				dest: 'global.d.ts',
				ignoreUpdates: true,
			},
			{ src: 'files/np-config.js', dest: '.np-config.js' },
		],

		config: {
			babel: {
				presets: [require.resolve('@babel/preset-typescript')],
			},
		},
	};

	return preset;
};
