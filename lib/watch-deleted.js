'use strict';

const path = require('path');
const chokidar = require('chokidar');
const log = require('@backtrack/core/dist/utils/log').default;
const del = require('del');
const slash = require('slash');
const { rootPath, sourcePath, buildPath } = require('@backtrack/core/paths');
const exitHook = require('./utils/exit-hook');

/**
 * babel-cli does not delete src files that have been removed.
 * watch sourcePath for deleted files and remove them from buildPath
 */
function watchDeleted({ flow = false } = {}) {
	const watcher = chokidar.watch('**/*.{js,jsx,ts,tsx,json,mjs}', {
		ignored: [
			'**/*.test.{js,jsx,ts,tsx,mjs}',
			'**/__sandbox__/**',
		],
		cwd: sourcePath,
	});

	watcher.on('unlink', async (file) => {
		const { name, ext, dir, base } = path.parse(file);

		const isTypescript = [
			'.ts',
			'.tsx',
		].includes(ext);

		const destFilename = isTypescript ? `${name}.js` : base;

		const destPath = path.resolve(buildPath, dir, destFilename);
		const rootRelativePath = path.relative(rootPath, destPath);

		const destPathSourceMap = `${destPath}.map`;

		const removeFiles = [
			destPath,
			destPathSourceMap,
		];

		if (flow === true) {
			const destPathSourceFlow = `${destPath}.flow`;
			removeFiles.push(destPathSourceFlow);
		}

		const removeFilesNormalized = removeFiles.map((current) => {
			return slash(current);
		});

		try {
			await del(removeFilesNormalized);
			log.info(`${rootRelativePath} deleted`);
		} catch (error) {
			log.error(error);

			log.error(`${rootRelativePath} could not be deleted`);
		}
	});

	exitHook(() => {
		watcher.close();
	});
}

module.exports = watchDeleted;
