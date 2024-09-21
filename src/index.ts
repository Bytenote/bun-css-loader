import type { BunPlugin } from 'bun';
import { transform } from 'lightningcss';
import postcss, { type AcceptedPlugin } from 'postcss';
import {
    buildJsModule,
    getImports,
    loadFile,
    removeImportsFromCss,
} from './utils.js';

type CssLoaderOptions = {
    postCssPlugins?: AcceptedPlugin[];
};

/**
 * Bun plugin for loading CSS and SCSS files that are being imported in JS
 * source files.
 *
 * @param postCssPlugins Optional PostCSS plugins
 *
 * @returns Bun plugin
 */
const cssLoader = ({ postCssPlugins }: CssLoaderOptions = {}): BunPlugin => ({
    name: 'cssLoader',
    async setup({ onLoad }) {
        onLoad({ filter: /\.(s)*css$/ }, async (args) => {
            const rawCss = await loadFile(args.path);

            const imports = getImports(rawCss);

            let processedCss = rawCss;
            if (postCssPlugins && postCssPlugins.length > 0) {
                // avoid using postcss if possible (10x slowdown)
                // tailwind will support lightningcss with v4, which will be a lot faster
                ({ css: processedCss } = await postcss(postCssPlugins).process(
                    rawCss,
                    {
                        from: args.path,
                    }
                ));
            }

            const { code: minifiedCss } = transform({
                filename: args.path,
                code: new Uint8Array(Buffer.from(processedCss)),
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
