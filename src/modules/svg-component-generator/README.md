# SvgComponentGenerator 

`SvgComponentGenerator` is a generator that automatically converts svg files with svg extension into React Component.<br />
While the existing svgr played the role of converting an svg file into a React Component during the loading process when importing an svg file, `SvgComponentGenerator` detects when an svg file is added, moved, modified, or deleted and generates index.tsx or index.jsx in the form of a React Component.
<br /><br />

## Naming Rule
SVG Component is created according to the svg file name, and the naming rules when creating SVG Component are as follows.

```
ico-react.svg => SvgIcoReact
```
<br /><br />

## Auto Generate Type
`SvgComponentGenerator` detects whenever an svg file is added, moved, deleted, or modified, and automatically creates not only components but also useful types.

1. Type creation for file name
```ts
export type StaticSvgIconName = 'ico-close' | 'ico-search' | 'next' | 'react' | 'vercel';
```

2. Type creation for SVG Component name
```ts
export type SvgComponentName = 'SvgIcoClose' | 'SvgIcoSearch' | 'SvgNext' | 'SvgReact' | 'SvgVercel';
```
<br /><br />

## How to use

### webpack (nextjs, cra)

`next.config.js`

```js
const { WebpackSvgComponentPlugin } = require('monkey-d/modules');

/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.plugins.push(new WebpackSvgComponentPlugin({
      svgFileDir: './public/svgs'
    }))

    return config;
  }
};
```

### vite 

`vite.config.js`

```js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteSvgComponentPlugin } from 'monkey-d/modules'

export default defineConfig({
  plugins: [
    react(), 
    viteSvgComponentPlugin({
      svgFileDir: 'src/assets/svgs', 
      typescript: true
    })],
})

```
<br/><br/>

## `SvgComponentGenerator` Options

| option         | type                   | default value | description                                                                                                                                                                                                 |
|----------------|------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| svgFileDir | `string` | - (required)       | Directory path where the project's SVG files are stored    |
| outputDir     | `string` | `svgFileDir`       | This is the output directory path where the converted components will be saved, and the default value is `svgFileDir`.                
| typescript          | `boolean` | `false`        | Whether to use typescript. If `true`, `index.tsx` file and `types/index.d.ts` are created. If `false`, `index.jsx` is created.                                                                                           |
| title          | `string` | `false`        | Whether to expose SVG Title tag            
| description          | `string` | `false`        | Whether to expose SVG Desc tags                 
| useSvgr          | `boolean` | `false`        | When used with svgr, it sets its value to `true`. 
| svgo          | `SvgoConfig` | `undefined`        | If you want to use svgo together, you can substitute the configuration values ​​for svgo ([svgo config docs](https://svgo.dev/docs/introduction/)). If you set the `useSvgr` option to `true`, svgr's svgo settings will be followed and the value will be ignored  
<br />

```ts 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteSvgComponentPlugin } from 'monkey-d/modules'

export default defineConfig({
  plugins: [
    react(), 
    viteSvgComponentPlugin({
      svgFileDir: 'src/assets/svgs', 
      // If you want to apply removeDimensions plugin using svgo
      svgo: {
        plugins: [
            "removeDimensions"
        ]
      }
    })],
})
 ```