const path = require('path');

const cwd = process.cwd();

const typescriptModule = () => require('./typescript-module')();

beforeEach(() => {
    process.chdir(path.resolve(__dirname, 'nested'));
});

afterEach(() => {
    process.chdir(cwd);
});

test('works', () => {
    const result = typescriptModule();
    expect(result).toEqual(1);
});

export {};
