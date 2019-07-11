'use strict';

const path = require('path');
const slash = require('slash');
const log = require('@backtrack/core/dist/utils/log').default;
const {
	buildPath,
	rootPath,
	sourcePath: backtrackSourcePath,
} = require('@backtrack/core/paths');
const packageId = require('./utils/package-id');

function watchApp({
	watchPath = buildPath,
	sourcePath = backtrackSourcePath,
	verbose = false,
} = {}) {
	const script = path.resolve(watchPath, `${packageId}.js`);
	const relativeScript = slash(path.relative(rootPath, script));
	const relativeSourcePath = slash(path.relative(rootPath, sourcePath));

	return new Promise((resolve) => {
		// "Lazy" require nodemon otherwise will destroy node's event loop and child processes
		// https://github.com/wallabyjs/public/issues/2099#issuecomment-498898279
		const nodemon = require('nodemon');

		/**
		 * https://github.com/remy/nodemon/blob/master/doc/requireable.md
		 */
		nodemon({
			script,
			ext: 'js,jsx,ts,tsx,mjs,json',
			watch: [watchPath],
			ignore: [
				'*.test.{js,jsx,ts,tsx,mjs}',
				'*.d.ts',
				'*.flow',
				path.resolve(rootPath, '**/__sandbox__/**/*'),
			],
			// delay: 250,
			env: { ...process.env, FORCE_COLOR: 'true' },
		});

		nodemon.once('start', () => {
			// use setTimeout so it will end up to push log after "dev finished"
			setTimeout(() => {
				log.info(
					`starting ./${relativeScript} and watching ./${relativeSourcePath}/ for changes...`,
				);
			}, 1);

			resolve();
		});

		nodemon.on('restart', (changedFiles) => {
			if (verbose === true) {
				const relative = changedFiles
					.map((changedFile) => {
						return path.relative(rootPath, changedFile);
					})
					.join(' ');

				log.info('modified:', relative);
			}

			log.info('restarting app...');
		});

		/**
		 * Fix for terminal error
		 * https://github.com/JacksonGariety/gulp-nodemon/issues/77#issuecomment-277749901
		 */
		nodemon.on('quit', () => {
			// eslint-disable-next-line no-process-exit
			process.exit();
		});
	});
}

module.exports = watchApp;
