'use strict';

const modeTypes = ['module', 'app'];
const syntaxTypes = ['node', 'babel', 'typescript', 'flow'];

const presetNode = ({ options }) => {
    const { mode, syntax } = options;

    if (mode === undefined) {
        throw new Error(
            `@backtrack/preset-node: "mode" must be explicitly set to one of the following: ${modeTypes.join(
                ', '
            )}`
        );
    }

    if (syntax === undefined) {
        throw new Error(
            `@backtrack/preset-node: "syntax" must be explicitly set to one of the following: ${syntaxTypes.join(
                ', '
            )}`
        );
    }

    if (modeTypes.includes(mode) === false) {
        throw new Error(
            `@backtrack/preset-node: "mode: ${mode}" must be one of the following: ${modeTypes.join(
                ', '
            )}`
        );
    }

    if (syntaxTypes.includes(syntax) === false) {
        throw new Error(
            `@backtrack/preset-node: "syntax: ${syntax}" must be one of the following: ${syntaxTypes.join(
                ', '
            )}`
        );
    }

    /**
     * By default enable windows for libraries and disable for applications
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
    const nodeVersion = mode === 'module' ? '>=6.9.0' : '^10.13.0';

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

    if (syntax === 'flow') {
        const flowPreset =
            mode === 'module'
                ? require('./options/flow-module')(presetOptions)
                : require('./options/flow-app')(presetOptions);

        return flowPreset;
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
