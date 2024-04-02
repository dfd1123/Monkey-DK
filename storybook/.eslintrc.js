const eslintConfig = require('../.eslintrc.js');

module.exports = {
	...eslintConfig,
	overrides: [
		{
			...eslintConfig.overrides[0],
			parserOptions: {
				...eslintConfig.overrides[0].parserOptions,
				project: './storybook/tsconfig.json',
				tsconfigRootDir: __dirname,
			},
		},
		{
			...eslintConfig.overrides[1],
		},
	],
	parserOptions: {
		...eslintConfig.parserOptions,
		project: './storybook/tsconfig.json',
		tsconfigRootDir: __dirname,
	},
};
