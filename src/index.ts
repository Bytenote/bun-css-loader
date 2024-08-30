import type { BunPlugin } from 'bun';
import { transform } from 'lightningcss';
import {
    buildJsModule,
    getImports,
    loadFile,
    removeImportsFromCss,
} from './utils.js';

/**
 * Bun plugin for loading CSS and SCSS files that are being imported in JS
 * source files.
 */
const cssLoader = (): BunPlugin => ({
    name: 'cssLoader',
    async setup({ onLoad }) {
        onLoad({ filter: /\.(s)*css$/ }, async (args) => {
            const cssContent = await loadFile(args.path);

            const imports = getImports(cssContent);
            const { code: minifiedCss } = transform({
                filename: args.path,
                code: new Uint8Array(Buffer.from(cssContent)),
                minify: true,
            });

            const cleanedCss = removeImportsFromCss(
                imports,
                minifiedCss.toString()
            );
            const contents = buildJsModule(imports, cleanedCss);

            return {
                contents,
                loader: 'js',
            };
        });
    },
});

export default cssLoader;
