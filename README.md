# @backtrack/preset-node

[![npm](https://img.shields.io/npm/v/@backtrack/preset-node.svg?label=npm%20version)](https://www.npmjs.com/package/@backtrack/preset-node)
[![Linux Build Status](https://img.shields.io/circleci/project/github/chrisblossom/backtrack-preset-node/master.svg?label=linux%20build)](https://circleci.com/gh/chrisblossom/backtrack-preset-node/tree/master)
[![Windows Build Status](https://img.shields.io/appveyor/ci/chrisblossom/backtrack-preset-node/master.svg?label=windows%20build)](https://ci.appveyor.com/project/chrisblossom/backtrack-preset-node/branch/master)
[![Code Coverage](https://img.shields.io/codecov/c/github/chrisblossom/backtrack-preset-node/master.svg)](https://codecov.io/gh/chrisblossom/backtrack-preset-node/branch/master)

## About

[`backtrack`](https://github.com/chrisblossom/backtrack) preset that sets up a node project.

## Features

-   [`jest`](https://facebook.github.io/jest/) with [Wallaby.js](https://wallabyjs.com/), [CircleCI](https://circleci.com/) and [AppVeyor](https://www.appveyor.com/)
-   [`eslint`](https://eslint.org/), and [`prettier`](https://prettier.io)
-   `package.json` scripts
-   `git-pre-push`, `git-pre-commit` and `prepublish` hooks
-   Automatic app restarts in `development` via [nodemon](https://github.com/remy/nodemon)
-   Optional: [`babel`](https://babeljs.io) with [`babel-preset-env`](https://babeljs.io/docs/plugins/preset-env/)
-   Optional: [`typescript`](http://www.typescriptlang.org)
-   Optional: [`flow`](https://flow.org)

## Installation

`npm install --save-dev @backtrack/preset-node`

## Usage

```js
// backtrack.config.js

'use strict';

module.exports = {
    // see defaults below
    presets: ['@backtrack/node'],
};
```

## Options

```js
'use strict';

module.exports = {
    presets: [
        [
            '@backtrack/node',
            {
                /**
                 * Project mode type
                 *
                 * Available modes:
                 *     module - npm module
                 *     app - node application
                 *
                 * default: 'module'
                 */
                mode: 'app',

                /**
                 * Javascript syntax
                 *
                 * Available syntax:
                 *     node: Target package.json's engines.node (no compilation)
                 *     babel: Use babel to provide latest javascript features
                 *         - app requirements:
                 *             - npm install --save source-map-support @babel/polyfill core-js@2
                 *     typescript: Use Typescript
                 *         - requirements
                 *             - npm install --save-dev typescript
                 *         - app requirements:
                 *             - npm install --save source-map-support @babel/polyfill core-js@2
                 *     flow: Use flow-type
                 *         - requirements
                 *             - npm install --save-dev flow-bin
                 *         - app requirements:
                 *             - npm install --save source-map-support @babel/polyfill
                 *
                 * default: 'node'
                 */
                syntax: 'typescript',

                /**
                 * Specify node version
                 *
                 * module default: '>=6.9.0'
                 * app default: '^10.13.0'
                 */
                nodeVersion: '^12.0.0',

                /**
                 * Enable/disable Windows-only features
                 *
                 * module default: true
                 * app default: false
                 */
                windows: false,
            },
        ],
    ],
};
```
