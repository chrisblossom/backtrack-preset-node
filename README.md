# @backtrack/preset-node

[![npm](https://img.shields.io/npm/v/@backtrack/preset-node.svg?label=npm%20version)](https://www.npmjs.com/package/@backtrack/preset-node)

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

## Installation

`npm install --save-dev @backtrack/preset-node`

## Usage

```js
// backtrack.config.js

'use strict';

module.exports = {
	// see settings below
	presets: [
		[
			'@backtrack/node',
			{
				mode: 'module',
				syntax: 'node',
			},
		],
	],
};
```

## Settings

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
				 * Required
				 *
				 * Available modes:
				 *     module - npm module
				 *     app - node application
				 *
				 */
				mode: 'app',

				/**
				 * Javascript syntax
				 *
				 * Required
				 *
				 * Available syntax:
				 *     node: Target package.json's engines.node (no compilation)
				 *
				 *     babel: Use babel to provide latest javascript features
				 *         - app requirements:
				 *             - npm install --save source-map-support core-js@3
				 *
				 *     typescript: Use Typescript
				 *         - requirements
				 *             - npm install --save-dev typescript
				 *         - app requirements:
				 *             - npm install --save source-map-support core-js@3
				 */
				syntax: 'typescript',

				/**
				 * Specify node version
				 *
				 * module default: '>=14.15.0'
				 * app default: '^16.13.0'
				 */
				nodeVersion: '^18.0.0',

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
