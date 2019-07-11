'use strict';

const path = require('path');
const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');
const runCommand = require('./utils/run-command');

/**
 * Find the babel-cli bin using require instead of PATH
 */
const babelCliPath = path.parse(require.resolve('@babel/cli')).dir;
const babelBinPath = path.resolve(babelCliPath, 'bin/babel.js');

const ignorePatterns = [
	'**/*.test.js',
	'**/*.test.ts',
	'**/*.d.ts',
	'**/__sandbox__/*',
]
	.map((pattern) => {
		const ignorePattern = path.join(rootPath, pattern);

		return ignorePattern;
	})
	.join(',');

function runBabel(options = {}) {
	const args = [
		sourcePath,
		'--out-dir',
		buildPath,
		'--source-maps',
		'--ignore',
		ignorePatterns,
		'--verbose',
		'--extensions',
		'.js,.jsx,.ts,.tsx',
	];

	if (options.watch) {
		args.push('--watch');
	}

	return runCommand(babelBinPath, args, options);
}

module.exports = runBabel;
