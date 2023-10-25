'use strict';

module.exports = {
	presets: ['@backtrack/preset'],

	files: {
		allowChanges: [
			'.eslintignore',
			'.prettierignore',
		],
	},

	config: {
		wallaby: (config) => {
			config.files = [
				'!./__sandbox__/**',
				...config.files,
			];

			return config;
		},

		eslint: () => ({
			// use local eslint config
			extends: '@chrisblossom/eslint-config/node',

			overrides: [
				{
					files: ['lib/files/package-entry*.js'],
					parserOptions: {
						sourceType: 'module',
					},
					rules: {
						'n/no-unsupported-features/es-builtins': 'off',
						'n/no-unsupported-features/es-syntax': 'off',
						'n/no-unsupported-features/node-builtins': 'off',
					},
				},
				{
					files: ['*.test.js'],
					rules: {
						'jest/no-conditional-expect': 'off',
					},
				},
			],
		}),
	},
};
