const babel = require('@rollup/plugin-babel').default;
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
// Const nodeBuiltins = require('rollup-plugin-node-builtins');
// const nodeGlobals = require('rollup-plugin-node-globals');
const terser = require('@rollup/plugin-terser');
const ignore = require('rollup-plugin-ignore');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve; // NodeResolve 함수를 직접 가져옴
const commonjs = require('@rollup/plugin-commonjs');
const organizer = require('./plugins/rollup-plugin-organizer.js');
const createIndexFilePlugin = require('./plugins/rollup-plugin-create-index.js');
const addDirective = require('./plugins/rollup-plugin-add-directive.js');

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const buildTargets = ['modules', 'components', 'utils'];

const defaultConfig = {
	external: ['react', 'react-dom', '@emotion/react', '@emotion/styled', id => /fsevents/.test(id)],
	plugins: [
		json(),
		ignore(['fsevents']),
		resolve({
			preferBuiltins: true,
			extensions,
		}),
		commonjs(),
		typescript(),
		babel({
			babelHelpers: 'runtime',
			exclude: 'node_modules/**',
			extensions,
			plugins: ['@emotion'],
		}),
	],
};

if (process.env.NODE_ENV === 'production') {
	defaultConfig.plugins.push(terser());
}

const rollupConfig = () => buildTargets.map(target => {
	const plugins = [
		...defaultConfig.plugins,
		organizer({target}),
		createIndexFilePlugin({
			target,
			fileName: {
				cjs: `${target}.cjs.js`,
				esm: `${target}.esm.mjs`,
			},
		}),
	];

	if (target === 'components') {
		plugins.push(addDirective({directive: '\'use client\''}));
	}

	return {
		...defaultConfig,
		plugins,
		input: `./src/${target}/index.ts`,
		output: [
			{
				file: `dist/${target}/${target}.cjs.js`,
				format: 'cjs',
				sourcemap: true,
			},
			{
				file: `dist/${target}/${target}.esm.mjs`,
				format: 'esm',
				sourcemap: true,
			},
		],
	};
});

module.exports = [
	{
		...defaultConfig,
		plugins: [
			...defaultConfig.plugins,
			createIndexFilePlugin({
				target: '',
				fileName: {
					cjs: 'index.cjs.js',
					esm: 'index.esm.mjs',
				},
			}),
		],
		input: './src/index.ts',
		output: [
			{
				file: 'dist/index.cjs.js',
				format: 'cjs',
				sourcemap: true,
			},
			{
				file: 'dist/index.esm.mjs',
				format: 'esm',
				sourcemap: true,
			},
		],
	},
	...rollupConfig(),
];
