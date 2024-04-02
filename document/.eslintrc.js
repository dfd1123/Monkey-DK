const eslintConfig = require('../.eslintrc.js');

module.exports = {
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	extends: [
		'xo',
		'next/core-web-vitals',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				'.eslintrc.{js,cjs}',
			],
			parserOptions: {
				project: './document/tsconfig.json',
				tsconfigRootDir: __dirname,
				sourceType: 'script',
			},
		},
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'**/*.ts',
				'**/*.tsx',
			],
			rules: eslintConfig.overrides[1].rules,
		},
	],
	parserOptions: {
		project: './document/tsconfig.json',
		tsconfigRootDir: __dirname,
		babelOptions: {
			presets: [require.resolve('next/babel')],
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			tsx: true,
		},
	},
	plugins: [],
	rules: {
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'no-unsafe-assignment': 'off',
	},
};

