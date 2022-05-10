'use strict';

const transformConfig =
	require('@backtrack/core/dist/options-file/transform-config').transformConfig;
const modeTypes = require('./preset-node').modeTypes;
const syntaxTypes = require('./preset-node').syntaxTypes;

const allPossibleOptionCombinations = modeTypes.reduce((acc, mode) => {
	const current = syntaxTypes.reduce((accInside, syntax) => {
		return [
			...accInside,
			{ mode, syntax },
			// add all possible options
			{ mode, syntax, windows: true },
			{ mode, syntax, windows: false },
		];
	}, []);

	return [...acc, ...current];
}, []);

describe('preset-node', () => {
	allPossibleOptionCombinations.forEach((runMode) => {
		const title = JSON.stringify(runMode);

		// eslint-disable-next-line jest/valid-title
		test(title, () => {
			const backtrackConfig = {
				presets: [['../', runMode]],
			};

			const result = transformConfig(backtrackConfig, __dirname);

			expect(result).toMatchSnapshot();
		});
	});

	test('options undefined', () => {
		expect.assertions(1);

		try {
			const backtrackConfig = {
				presets: ['../'],
			};
			transformConfig(backtrackConfig, __dirname);
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
			[Error: @backtrack/preset-node: "mode" must be explicitly set to one of the following: module, app
			found in path: <PROJECT_ROOT>/lib]
		`);
		}
	});

	test('mode undefined', () => {
		expect.assertions(1);

		try {
			const backtrackConfig = {
				presets: [['../', { syntax: 'node' }]],
			};
			transformConfig(backtrackConfig, __dirname);
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
			[Error: @backtrack/preset-node: "mode" must be explicitly set to one of the following: module, app
			found in path: <PROJECT_ROOT>/lib]
		`);
		}
	});

	test('syntax undefined', () => {
		expect.assertions(1);

		try {
			const backtrackConfig = {
				presets: [['../', { mode: 'module' }]],
			};
			transformConfig(backtrackConfig, __dirname);
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
			[Error: @backtrack/preset-node: "syntax" must be explicitly set to one of the following: node, babel, typescript
			found in path: <PROJECT_ROOT>/lib]
		`);
		}
	});

	test('mode not supported', () => {
		expect.assertions(1);

		try {
			const backtrackConfig = {
				presets: [['../', { mode: 'desktop', syntax: 'node' }]],
			};
			transformConfig(backtrackConfig, __dirname);
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
			[Error: @backtrack/preset-node: "mode: desktop" must be one of the following: module, app
			found in path: <PROJECT_ROOT>/lib]
		`);
		}
	});

	test('syntax not supported', () => {
		expect.assertions(1);

		try {
			const backtrackConfig = {
				presets: [['../', { mode: 'app', syntax: 'python' }]],
			};
			transformConfig(backtrackConfig, __dirname);
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
			[Error: @backtrack/preset-node: "syntax: python" must be one of the following: node, babel, typescript
			found in path: <PROJECT_ROOT>/lib]
		`);
		}
	});
});
