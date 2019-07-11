/* eslint-disable no-console */

'use strict';

const path = require('path');
const stripAnsi = require('strip-ansi');

const runCommand = (command, args, options) =>
	require('./run-command')(command, args, options);

beforeEach(() => {
	jest.spyOn(console, 'info').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	jest.spyOn(console, 'debug').mockImplementation(() => undefined);
});

test('handles successful command', async () => {
	const command = path.resolve(__dirname, '__sandbox__/cli-cmd-file.js');

	await runCommand(command);

	expect(console.info.mock.calls).toHaveLength(1);
	expect(stripAnsi(console.info.mock.calls[0][1])).toEqual(
		`${path.normalize(
			'lib/utils/__sandbox__/cli-cmd-file.js',
		)} ran successfully`,
	);
});

test('handles command that throws an error', async () => {
	expect.hasAssertions();

	const command = path.resolve(
		__dirname,
		'__sandbox__/cli-cmd-file-error.js',
	);

	try {
		await runCommand(command);
	} catch (e) {
		expect(console.error.mock.calls).toHaveLength(1);

		const lines = stripAnsi(console.error.mock.calls[0][1]).split(
			/\r?\n|\r\\/,
		);

		expect(lines[0]).toEqual(
			path.normalize('lib/utils/__sandbox__/cli-cmd-file-error.js:3'),
		);

		expect(lines[1]).toEqual(
			`throw new Error('cli-cmd-file-error.js threw some random error');`,
		);

		expect(lines).toContain(
			'Error: cli-cmd-file-error.js threw some random error',
		);
	}
});
