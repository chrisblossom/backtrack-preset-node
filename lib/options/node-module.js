'use strict';

const path = require('path');
const slash = require('slash');
const { rootPath } = require('@backtrack/core/paths');
const packageId = require('../utils/package-id');

const relativeSourcePath = slash(path.relative(rootPath, 'lib'));

module.exports = (options) => {
	const preset = {
		presets: [
			[
				'@backtrack/style',
				{ isApp: false, node: true },
			],
			[
				'@backtrack/jest',
				{
					isApp: false,
					windows: options.windows,
					prepublishOnly: false,
				},
			],
		],

		packageJson: {
			main: `${relativeSourcePath}/${packageId}.js`,
			files: [`${relativeSourcePath}/`],
			module: 'commonjs',
			engines: {
				node: options.nodeVersion,
			},
			private: false,
		},

		'test.ci-pretest': ['backtrack lint'],
		release: ['np'],

		files: [
			{
				makeDirs: [relativeSourcePath],
				skip: [
					'dist',
					'src',
				],
			},
			{
				src: 'files/README-module.md',
				dest: 'README.md',
				ignoreUpdates: true,
			},
			{ src: 'files/gitignore-module', dest: '.gitignore' },
			{ src: 'files/gitattributes', dest: '.gitattributes' },
			{ src: 'files/npmrc-module', dest: '.npmrc' },
			{ src: 'files/yarnrc-module', dest: '.yarnrc' },
			{
				src: 'files/package-entry-module.js',
				dest: `${relativeSourcePath}/${packageId}.js`,
				ignoreUpdates: true,
			},
			{ src: 'files/np-config.cjs', dest: '.np-config.cjs' },
		],
	};

	return preset;
};
