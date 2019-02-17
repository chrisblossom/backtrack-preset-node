'use strict';

const transformConfig = require('@backtrack/core/dist/options-file/transform-config')
    .transformConfig;
const modeTypes = require('./preset-node').modeTypes;
const syntaxTypes = require('./preset-node').syntaxTypes;

/**
 * mock nodemon to fix
 * MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
 */
jest.doMock('nodemon');

const allPossibleOptionCombinations = modeTypes.reduce(
    (acc, mode) => {
        const current = syntaxTypes.reduce((accInside, syntax) => {
            return [
                ...accInside,
                { mode },
                { syntax },
                { mode, syntax },
                // add all possible options
                { mode, syntax, windows: true },
                { mode, syntax, windows: false },
            ];
        }, []);

        return [...acc, ...current];
    },
    [
        // default options
        {},
    ]
);

describe('preset-node', () => {
    allPossibleOptionCombinations.forEach((runMode) => {
        const title = JSON.stringify(runMode);

        test(title, () => {
            const backtrackConfig = {
                presets: [['../', runMode]],
            };

            const result = transformConfig(backtrackConfig, __dirname);

            expect(result).toMatchSnapshot();
        });
    });

    test('mode not supported', () => {
        expect.assertions(1);

        try {
            const backtrackConfig = {
                presets: [['../', { mode: 'desktop' }]],
            };
            transformConfig(backtrackConfig, __dirname);
        } catch (error) {
            expect(error).toMatchSnapshot();
        }
    });

    test('syntax not supported', () => {
        expect.assertions(1);

        try {
            const backtrackConfig = {
                presets: [['../', { syntax: 'python' }]],
            };
            transformConfig(backtrackConfig, __dirname);
        } catch (error) {
            expect(error).toMatchSnapshot();
        }
    });
});
