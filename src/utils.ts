import { compile } from 'sass';

/**
 * Loads the contents of CSS and SCSS files and returns it along with its file
 * type.
 *
 * @param filePath File path
 *
 * @returns CSS content and file type
 */
export async function loadFile(filePath: string): Promise<string> {
    const fileRef = Bun.file(filePath);
    let cssContent: string = await fileRef.text();

    if (filePath.includes('.scss')) {
        cssContent = compile(fileRef.name ?? '')?.css ?? '';
    }

    return cssContent;
}

/**
 * Extracts the imports from the CSS content and returns them as an array.
 *
 * @param content CSS content
 *
 * @returns Array of import paths
 */
export function getImports(content: string): string[] {
    const imports: string[] = [];
    const importRegex = /@import\s+(?:url\()?['"]?([^'"\)]+)['"]?\)?;/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1] as string);
    }

    return imports;
}

/**
 * Removes all imports from the CSS content.
 *
 * @param imports Array of import paths
 * @param content CSS content
 *
 * @returns CSS content without imports
 */
export function removeImportsFromCss(
    imports: string[],
    content: string
): string {
    for (const importPath of imports) {
        const importRegex = new RegExp(
            `@import\\s+(?:url\\()?['"]?${importPath}['"]?\\)?;`,
            'g'
        );

        content = content.replace(importRegex, '');
    }

    return content;
}

/**
 * Builds a JS module by creating and combining several JS statements, like
 * imports and exports.
 *
 * Contains and calls a method that adds the CSS content to the DOM, if the
 * document object is available.
 *
 * @param imports Import paths
 * @param content CSS content
 * @param styleId Optional style tag ID
 *
 * @returns JS module content
 */
export function buildJsModule(
    imports: string[],
    content: string,
    styleId: string = 'css-loader-styles'
): string {
    const jsStringImports = imports
        .map((importPath, i) => `import import_${i} from '${importPath}';`)
        .join('\n');
    const jsStringCssVar = `let css = ${JSON.stringify(content)};`;
    const jsStringMethodAction = `if(head) { if(!styleElem) { head.insertAdjacentHTML('beforeend', \`<style id="${styleId}">\${content}</style>\`); } else { styleElem.textContent += \`\${content}\`; } } `;
    const jsStringMethod = `function injectCss(content) { const head = document.head ?? document.getElementsByTagName('head')[0]; const styleElem = document.getElementById('${styleId}'); ${jsStringMethodAction} } if(document) { injectCss(css); }`;
    const jsStringExport = '\n\nexport default css';

    const jsStringModuleContent =
        jsStringImports + jsStringCssVar + jsStringMethod + jsStringExport;

    return jsStringModuleContent;
}
