<p>
<h1 align="center">Bun CSS Loader</h1>
<div align="center">
<p align="center"><i>Bun plugin for loading style files </i></p>
	
	bun i bun-css-loader
</div>
</p>

# About

This plugin integrates all CSS and SCSS files imported into JS source files directly into the DOM's `<head>` element within `<style>` stags.  
Additionally, it processes and resolves `@import`statements within the CSS files themselves.

<b>Please note:</b> <i>Only works on non-Windows based operating systems.</i>

# How-To

```js
import cssLoader from 'bun-css-loader';

await Bun.build({
    ...
    plugins: [
        cssLoader(),
    ],
    ...
});
```

# License

Distributed under the MIT License. See [MIT License](https://opensource.org/license/MIT) for more information.
