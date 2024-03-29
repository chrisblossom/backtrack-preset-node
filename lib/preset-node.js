'use strict';

const modeTypes = [
	'module',
	'app',
];
const syntaxTypes = [
	'node',
	'babel',
	'typescript',
];

const presetNode = ({ options }) => {
	const { mode, syntax } = options;

	if (mode === undefined) {
		throw new Error(
			`@backtrack/preset-node: "mode" must be explicitly set to one of the following: ${modeTypes.join(
				', ',
			)}`,
		);
	}

	if (syntax === undefined) {
		throw new Error(
			`@backtrack/preset-node: "syntax" must be explicitly set to one of the following: ${syntaxTypes.join(
				', ',
			)}`,
		);
	}

	if (modeTypes.includes(mode) === false) {
		throw new Error(
			`@backtrack/preset-node: "mode: ${mode}" must be one of the following: ${modeTypes.join(
				', ',
			)}`,
		);
	}

	if (syntaxTypes.includes(syntax) === false) {
		throw new Error(
			`@backtrack/preset-node: "syntax: ${syntax}" must be one of the following: ${syntaxTypes.join(
				', ',
			)}`,
		);
	}

	/**
	 * By default, enable windows for libraries and disable for applications
	 */
	let windows = true;
	if (options.windows === false || options.windows === true) {
		windows = options.windows;
	} else if (mode === 'app') {
		windows = false;
	}

	/**
	 * https://github.com/nodejs/Release
	 *
	 * module default to supported LTS
	 * app default to latest LTS
	 */
	let nodeVersion = mode === 'module' ? '>=18.12.0' : '^20.9.0';
	if (options.nodeVersion) {
		nodeVersion = options.nodeVersion;
	}

	const presetOptions = { nodeVersion, windows };

	if (syntax === 'babel') {
		const babelPreset =
			mode === 'module'
				? require('./options/babel-module')(presetOptions)
				: require('./options/babel-app')(presetOptions);

		return babelPreset;
	}

	if (syntax === 'typescript') {
		const typescriptPreset =
			mode === 'module'
				? require('./options/typescript-module')(presetOptions)
				: require('./options/typescript-app')(presetOptions);

		return typescriptPreset;
	}

	const nodePreset =
		mode === 'module'
			? require('./options/node-module')(presetOptions)
			: require('./options/node-app')(presetOptions);

	return nodePreset;
};

presetNode.modeTypes = modeTypes;
presetNode.syntaxTypes = syntaxTypes;

module.exports = presetNode;
