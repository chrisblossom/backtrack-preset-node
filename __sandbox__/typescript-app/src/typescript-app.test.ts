const path = require('path');

const cwd = process.cwd();

const typescriptApp = () => require('./typescript-app')();

beforeEach(() => {
    process.chdir(path.resolve(__dirname, 'nested'));
});

afterEach(() => {
    process.chdir(cwd);
});

test('works', () => {
    const result = typescriptApp();
    expect(result).toEqual(1);
});

export {};
