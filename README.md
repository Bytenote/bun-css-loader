<p>
<h1 align="center">Bun CSS Loader</h1>
<div align="center">
<p align="center"><i>Bun plugin for loading style files</i></p>
	
	bun i -D bun-css-loader
</div>
</p>

# About

This plugin loads the contents of all CSS and SCSS files that are imported in JS files and appends them as `<style>` tags to the DOM's `<head>` element.

The style tag is accessible either via the default ID `css-loader-styles` or via a custom ID you can set with the `styleId` option.
All `@import` statements inside of the CSS files are processed and resolved.

Now supports PostCSS, adding _TailwindCSS_ support!

# How-To

Basic:

```js
import cssLoader from 'bun-css-loader';

await Bun.build({
    // ...
    plugins: [
        // ...
        cssLoader(),
    ],
});
```

Style Tag ID:

```js
import cssLoader from 'bun-css-loader';

await Bun.build({
    // ...
    plugins: [
        // ...
        cssLoader({ styleId: 'custom-id' }),
    ],
});
```

TailwindCSS:

```js
// autoprefixer & tailwindcss need to be added as (dev) dependencies to your project
import autoprefixer from 'autoprefixer';
import cssLoader from 'bun-css-loader';
import tailwindcss from 'tailwindcss';

await Bun.build({
    // ...
    plugins: [
        // ...
        cssLoader({
            postCssPlugins: [tailwindcss(), autoprefixer()],
        }),
    ],
});
```

# License

Distributed under the MIT License. See [MIT License](https://opensource.org/license/MIT) for more information.
