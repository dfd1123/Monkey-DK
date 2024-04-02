/* eslint-env node */

module.exports = {
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
  },
	ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts', 'vite-env.d.ts'],
};
