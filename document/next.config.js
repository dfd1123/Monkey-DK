const path = require('node:path');
const {WebpackSvgComponentPlugin} = require('monkey-d/modules');

/** @type {import('next').NextConfig} */
module.exports = {
	compiler: {
    styledComponents: true,
  },
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
		prependData: `
     
    `,
	},
	webpack(config) {
		const plugins = config?.plugins || [];

		plugins.push(new WebpackSvgComponentPlugin({
			svgFileDir: './public/svgs',
			outputDir: './src/components/common/svg',
			removeViewBox: true,
			typescript: true,
		}));

		return config;
	},
};
