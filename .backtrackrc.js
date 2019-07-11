'use strict';

module.exports = {
	presets: ['@backtrack/preset'],

	files: {
		allowChanges: ['.eslintignore', '.prettierignore'],
	},

	config: {
		wallaby: (config) => {
			config.files = ['!./__sandbox__/**', ...config.files];

			return config;
		},

		eslint: {
			overrides: [
				{
					files: ['lib/files/package-entry*.js'],
					parserOptions: {
						sourceType: 'module',
					},
					rules: {
						'node/no-unsupported-features/es-builtins': 'off',
						'node/no-unsupported-features/es-syntax': 'off',
						'node/no-unsupported-features/node-builtins': 'off',
					},
				},
			],
		},
	},
};
