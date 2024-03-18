import chokidar from 'chokidar';
import SvgComponentGenerator, { SvgComponentGeneratorOption } from '.';

type WebpackPluginOptions = SvgComponentGeneratorOption & {
	//
};

type Compiler = {
	hooks: {
		done: {
			tap: (name: string, callback: (stats: unknown) => void) => void;
		};
	};
};

class WebpackSvgComponentPlugin {
	private readonly svgCompGenertor: SvgComponentGenerator;
	private readonly svgFileDir: string;

	constructor({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript }: WebpackPluginOptions) {
		this.svgFileDir = svgFileDir;
		this.svgCompGenertor = new SvgComponentGenerator({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript });
	}

	apply(compiler: Compiler) {
		compiler.hooks.done.tap('SvgComponentGeneratorPlugin', (_stats) => {
			if (process.env.NODE_ENV === 'development') {
				const watcher = chokidar.watch(this.svgFileDir, { persistent: true, ignored: /\/svg\/types\// });

				watcher.on('add',  this.svgCompGenertor.generate);
				watcher.on('unlink', this.svgCompGenertor.generate);

				process.on('SIGINT', function () {
					void watcher.close();
					process.exit(0);
				});
			} else {
				void this.svgCompGenertor.generate();
			}
		});
	}
}

export default WebpackSvgComponentPlugin;