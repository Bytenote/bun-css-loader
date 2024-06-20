import { string } from '@tdewolff/minify';
import {
	loadFile,
	getImports,
	removeImportsFromCss,
	buildJsModule,
} from './utils.ts';

import type { BunPlugin } from 'bun';

/**
 * Bun plugin for loading CSS and SCSS files
 * that are being imported in JS source files.
 */
const cssLoader = (): BunPlugin => ({
	name: 'cssLoader',
	async setup({ onLoad }) {
		onLoad({ filter: /\.(s)*css$/ }, async (args) => {
			const { cssContent, type } = await loadFile(args.path);

			const imports = getImports(cssContent);
			const minifiedCss = string(type, cssContent);

			const cleanedCss = removeImportsFromCss(imports, minifiedCss);
			const contents = buildJsModule(imports, cleanedCss);

			return {
				contents,
				loader: 'js',
			};
		});
	},
});

export default cssLoader;
