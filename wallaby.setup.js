'use strict';

const fs = require('fs');

function wallaby() {
	/**
	 * hack until https://github.com/wallabyjs/public/issues/1949
	 */
	fs.chmodSync('./lib/utils/__sandbox__/cli-cmd-file.js', '755');
	fs.chmodSync('./lib/utils/__sandbox__/cli-cmd-file-error.js', '755');
}

module.exports = wallaby;
