'use strict';

const path = require('node:path');
const fileExists = require('./file-exists');

describe('lib/utils/file-exists', () => {
	test('file exists', async () => {
		const file = path.resolve(__dirname, 'file-exists.js');
		const exists = await fileExists(file);

		expect(exists).toEqual(true);
	});

	test('file does not exists', async () => {
		const file = path.resolve('file-does-not-exist.js');
		const exists = await fileExists(file);

		expect(exists).toEqual(false);
	});
});
