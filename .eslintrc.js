module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'xo',
		'plugin:react/recommended',
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
				sourceType: 'script',
			},
		},
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
			rules: {
				'@typescript-eslint/ban-types': 'off',
				'no-await-in-loop': 'off',
				'no-negated-condition': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/object-curly-spacing': ['error', 'always', {objectsInObjects: false}],
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			tsx: true,
		},
	},
	plugins: [
		'react',
	],
	rules: {

	},
};
