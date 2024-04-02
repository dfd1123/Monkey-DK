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
				project: true,
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
			rules: {
				'@typescript-eslint/ban-types': 'off',
				'no-await-in-loop': 'off',
				'no-negated-condition': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				' @typescript-eslint/no-unsafe-return': 'off',
				'no-unsafe-assignment': 'off',
				'@typescript-eslint/consistent-type-assertions': 'off',
				'react/react-in-jsx-scope': 'off',
				'arrow-body-style': ['error', 'as-needed'],
				'@typescript-eslint/object-curly-spacing': ['error', 'always', {objectsInObjects: false}],
			},
		},
	],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
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
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'no-unsafe-assignment': 'off',
		'arrow-body-style': ['error', 'as-needed'],
	},
};
