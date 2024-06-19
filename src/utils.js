import { compile } from 'sass';

/**
 * Loads the contents of CSS and SCSS files
 * and returns it along with its file type.
 *
 * @param {string} filePath - File path
 * @returns {Promise<{ cssContent: string, type: string }>}
 */
export async function loadFile(filePath) {
	const fileRef = Bun.file(filePath);
	let cssContent = await fileRef.text();
	let type = fileRef.type;

	if (filePath.includes('.scss')) {
		cssContent = compile(fileRef.name)?.css;
		type = 'text/css;charset=utf-8';
	}

	return { cssContent, type };
}

/**
 * Extracts the imports from the CSS content
 * and returns them as an array.
 *
 * @param {string} content - CSS content
 * @returns {string[]}
 */
export function getImports(content) {
	const imports = [];
	const importRegex = /@import\s+(?:url\()?['"]?([^'"\)]+)['"]?\)?;/g;
	let match;

	while ((match = importRegex.exec(content)) !== null) {
		imports.push(match[1]);
	}

	return imports;
}

/**
 * Removes all imports from the CSS content.
 *
 * @param {string[]} imports	- Import paths
 * @param {string} content		- CSS content
 * @returns {string}
 */
export function removeImportsFromCss(imports, content) {
	for (let i = 0; i < imports.length; i++) {
		const importPath = imports[i];
		const importRegex = new RegExp(
			`@import\\s+(?:url\\()?['"]?${importPath}['"]?\\)?;`,
			'g'
		);

		content = content.replace(importRegex, '');
	}

	return content;
}

/**
 * Builds a JS module by creating and combining
 * several JS statements, like imports and exports.
 *
 * Also contains and calls a method that adds the
 * CSS content to the DOM, if the document object
 * is available.
 *
 * @param {string[]} imports	- Import paths
 * @param {string} content		- CSS content
 * @returns {string}
 */
export function buildJsModule(imports = [], content) {
	// const jsStringImports = _buildImports(imports);
	const jsStringImports = imports
		.map((importPath, i) => `import import_${i} from '${importPath}';`)
		.join('\n');
	const jsStringCssVar = `let css = ${JSON.stringify(content)};`;
	const jsStringMethod = `function addCssToDom(css) { const head = document.head ?? document.getElementsByTagName('head')[0]; if(head) { head.insertAdjacentHTML('beforeend', \`<style>\${css}</style>\`); } } if(document) { addCssToDom(css); }`;
	const jsStringExport = '\n\nexport default css';

	const jsStringModuleContent =
		jsStringImports + jsStringCssVar + jsStringMethod + jsStringExport;

	return jsStringModuleContent;
}
