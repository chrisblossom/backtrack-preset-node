'use strict';

const { promises: fs } = require('node:fs');

async function fileExists(file) {
	try {
		await fs.access(file);

		return true;
	} catch (error) {
		// ENOENT = no such file or directory
		if (error.code === 'ENOENT') {
			return false;
		}

		throw error;
	}
}

module.exports = fileExists;
