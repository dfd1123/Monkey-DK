import path from 'path';
import { readdir, writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import _debounce from 'lodash/debounce';
import _startCase from 'lodash/startCase';

// const svgFileDir = path.resolve(__dirname, '../');

export type SvgComponentGeneratorOption = {
	svgFileDir: string; 
	outputDir?: string;
	removeViewBox?: boolean;
	typescript?: boolean;
	useSvgr?: boolean;
};

let generating = false;

/**
 * SvgComponentGenerator 클래스는 SVG 파일들을 React 컴포넌트로 변환합니다.
 * 이 클래스는 SVG 파일들이 저장된 디렉토리를 읽고, 각 SVG 파일을 React 컴포넌트로 변환하여
 * 지정된 출력 디렉토리에 저장합니다. TypeScript를 지원하며, 필요에 따라 SVGR을 사용할 수 있습니다.
 */
class SvgComponentGenerator {
	/**
   * SVG 파일들이 위치한 디렉토리 경로
   */
	private readonly svgFileDir: string;
	/**
   * TypeScript를 사용할지 여부
   */
	private readonly typescript: boolean;
	/**
   * 변환된 컴포넌트들이 저장될 출력 디렉토리 경로
   */
	private readonly outputDir: string;
	/**
   * SVG에서 viewBox를 제거할지 여부
   */
	private readonly removeViewBox: boolean;
	/**
   * SVGR을 사용할지 여부
   */
	private readonly useSvgr: boolean;
  
	/**
   * SvgComponentGenerator 클래스의 생성자입니다.
   * @param {SvgComponentGeneratorOption} SVG 컴포넌트 생성 옵션 객체
   */
	constructor({ 
		svgFileDir,
		outputDir,
		removeViewBox = false,
		typescript = false, 
		useSvgr = false,
	}: SvgComponentGeneratorOption) {
		this.svgFileDir = svgFileDir;
		this.outputDir = outputDir ?? svgFileDir;
		this.removeViewBox = removeViewBox;
		this.useSvgr = useSvgr;
		this.typescript = typescript;
	}

	/**
   * SVG 파일 리스트를 파싱하여 타입 정의를 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   * @returns 타입 정의 문자열
   */
	parseSvgListForType(list: string[]) {
		const fileList = list.map((file) => `${file.replace('.svg', '')}`);
  
		const staticSvgIconName = fileList.map(item => `'${item}'`).join(' | ');
		const particalSvgObj = fileList.filter(item => item.includes('/')).reduce<Record<string, string>>((acc, cur) => {
			const arr = cur.split('/');
			const fileName = arr.pop();
  
			const directoryPascalName = _startCase(arr.join('-')).replace(/ /gi, '');
  
			return {
				...acc,
				[directoryPascalName]: acc[directoryPascalName] ? `${acc[directoryPascalName]} | '${fileName}'` : `'${fileName}'`,
			};
		}, {});
  
		const particalSvgIconName = Object.entries(particalSvgObj).map(([key, value]) => `export type ${key}IconType = ${value};\n`).join('');
  
		return { staticSvgIconName, particalSvgIconName };
	}

	/**
   * SVG 파일 리스트를 파싱하여 파일 객체를 생성하고 React 컴포넌트 문자열을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   * @returns React 컴포넌트 문자열과 관련 정보
   */
	async parseSvgListForFile(list: string[]) {
		const fileObject =  list.reduce<Record<string, string>>((acc, cur) => {
			const fileName = `Svg${_startCase(cur.replace(/\//gi, '-').replace('.svg', '')).replace(/ /gi, '')}`;
			acc = {
				...acc,
				[fileName]: cur,
			};
  
			return acc;
		}, {});
		const fileList = Object.entries(fileObject);
		const relativePath = path.relative(this.outputDir, this.svgFileDir);
		const importString = fileList.reduce((acc, [key, value]) => acc += `import ${key} from '${relativePath}/${value}';\n`, '').replace(/\n/gi, '');

		let componentFuncsString = '';

		for (const [key, value] of fileList) {
			const data = await readFile(`${this.svgFileDir}/${value}`, 'utf8');

			const regex = /(<svg[^>]*)/;
			const replacement = '$1 {...props}';
			let svgElement = data.replace(/([a-z])-([a-z])/g, function (_, p1, p2) {
				return `${p1}${p2.toUpperCase()}`;
			}).replace(regex, replacement);

			if (this.removeViewBox) {
				svgElement = svgElement.replace(/viewBox="[^"]*"/gi, '');
			}

			const type = 'React.SVGAttributes<SVGSVGElement>';

			componentFuncsString += `const ${key} = (props${this.typescript ? `: ${type}` : ''} = {}) => { return (${svgElement}); };\n`;
		}

		const exportString = fileList.reduce((acc, [key, _value], index) => {
			if (index === 0) acc = 'export {\n';
			acc += `${index !== 0 ? ',' : ''}  ${key}\n`;
			if (index === Object.entries(fileObject).length - 1) acc += ' };';
  
			return acc;
		}, '').replace(/\n/gi, '');
  
		return { importString, componentFuncsString, exportString };
	}

	/**
   * 주어진 파일 리스트에서 SVG 파일 이름만 필터링합니다.
   * @param {string[]} list 파일 이름 리스트
   * @returns SVG 파일 이름 리스트
   */
	filterSvgFileNameList(list: string[]) {
		return list
			.filter((name) => name.endsWith('.svg'));
	}


	/**
   * 지정된 디렉토리에서 SVG 파일 리스트를 읽습니다.
   * @param {string} dir SVG 파일이 위치한 디렉토리 경로
   * @param {string} [dirName=''] 현재 디렉토리 이름
   * @returns SVG 파일 경로 리스트
   */
	readSvgFileList = async (dir: string, dirName = ''): Promise<string[]> => {
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(
			dirents.map(async (dirent) => {
				const newDirName = `${dirName ? `${dirName}/` : ''}${dirent.name}`;
				const res = path.resolve(dir, dirent.name);
				return dirent.isDirectory() && dirent.name !== 'types'
					? this.readSvgFileList(res, newDirName)
					: newDirName;
			}),
		);
		const concatList = Array.prototype.concat(...files) as string[];
  
		return concatList;
	};

	/**
   * SVG 타입 파일을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   */
	async writeSvgTypeFile(list: string[]) {
		if (!this.typescript) return;

		const { staticSvgIconName, particalSvgIconName } = this.parseSvgListForType(list);

		const typeDir = `${this.outputDir}/types`;

		await mkdir(typeDir, { recursive: true });
  
		if (existsSync(typeDir)) {
			return writeFile(
				`${typeDir}/index.d.ts`,
				`/* eslint-disable */\nexport type StaticSvgIconName = ${staticSvgIconName};\n${particalSvgIconName}`,
				{ flag: 'w' },
			)
				.then(() => {
					console.log('✨[Static Svg Type File] is Generated!'); 
				})
				.catch(console.error);
		}

		
	}

	/**
   * 정적 SVG export 파일을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   */
	async writeStaticSvgExportFile(list: string[]) {
		const { componentFuncsString, importString, exportString } = await this.parseSvgListForFile(list);

		await mkdir(this.outputDir, { recursive: true });
  
		return writeFile(
			`${this.outputDir}/index.${this.typescript ? 'tsx' : 'jsx'}`,
			`/* eslint-disable */ \nimport React from "react";\n\n${this.useSvgr ? importString : componentFuncsString}\n${exportString}`,
			{ flag: 'w' },
		)
			.then(() => {
				console.log('✨[Static Svg Export File] is Generated!'); 
			})
			.catch(console.error);
	}

	generate = async () => {
		if (generating) return;

		try {
			generating = true;

			const fileNameList = await this.readSvgFileList(this.svgFileDir);
			const svgFileList = this.filterSvgFileNameList(fileNameList);
      
			await this.writeSvgTypeFile(svgFileList);
			await this.writeStaticSvgExportFile(svgFileList);
		} finally {
			setTimeout(() => {
				generating = false;
			}, 1500);
			
		}
   
	};
}


export default SvgComponentGenerator;