const babel = require("@rollup/plugin-babel").default;
const typescript = require("@rollup/plugin-typescript");
const json = require("@rollup/plugin-json");
const nodeBuiltins = require('rollup-plugin-node-builtins');
const nodeGlobals = require('rollup-plugin-node-globals');
const ignore = require('rollup-plugin-ignore');
const resolve = require("@rollup/plugin-node-resolve").nodeResolve; // nodeResolve 함수를 직접 가져옴
const commonjs = require("@rollup/plugin-commonjs");
const organizer = require("./plugins/rollup-plugin-organizer.js");
const createIndexFilePlugin = require("./plugins/rollup-plugin-create-index.js");
const addDirective = require("./plugins/rollup-plugin-add-directive.js");


const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const buildTargets = ['modules', 'components', 'utils'];

const defaultConfig = {
    external: ['react', 'react-dom', '@emotion/react', '@emotion/styled', (id) => /fsevents/.test(id)],
    plugins: [
        json(),
        ignore(['fsevents']),
        resolve({
            preferBuiltins: true,
            extensions
        }),
        commonjs(),
        typescript(),
        babel({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            extensions,
            plugins: ['@emotion']
        })
    ],
}

const rollupConfig = () => {
    return buildTargets.map((target) => {
        const plugins = [
            ...defaultConfig.plugins, 
            organizer({target: target}), 
            createIndexFilePlugin({
                target: target,
                fileName: {
                    cjs: `${target}.cjs.js`,
                    esm: `${target}.esm.js`
                }
            }) 
        ]

        if(target === 'components'){
            plugins.push(addDirective({directive: `'use client'`}))
        }

        
        return {
            ...defaultConfig,
            plugins: plugins,
            input: `./src/${target}/index.ts`,
            output: [
                {
                    file: `dist/${target}/${target}.cjs.js`,
                    format: 'cjs',
                    sourcemap: true,
                },
                {
                    file: `dist/${target}/${target}.esm.js`,
                    format: 'esm',
                    sourcemap: true,
                }
            ]
        }
    })
}

module.exports = [
    {
        ...defaultConfig,
        plugins: [
            ...defaultConfig.plugins, 
            organizer({target: ''}), 
            createIndexFilePlugin({
                target: '',
                fileName: {
                    cjs: `index.cjs.js`,
                    esm: `index.esm.js`
                }
            }) 
        ],
        input: `./src/index.ts`,
        output: [
            {
                file: `dist/index.cjs.js`,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: `dist/index.esm.js`,
                format: 'esm',
                sourcemap: true,
            }
        ]
    },
    ...rollupConfig()
];