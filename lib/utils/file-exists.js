'use strict';

const fs = require('fs');

function fileExists(file) {
	return new Promise((resolve) => {
		fs.access(file, (error) => {
			if (error) {
				resolve(false);

				return;
			}

			resolve(true);
		});
	});
}

module.exports = fileExists;
