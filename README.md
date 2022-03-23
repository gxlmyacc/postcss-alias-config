# postcss-alias-config

> This Postcss plugin allows you to use webpack resolve aliases from alias configs in css.

## Example

`alias.config.js`
```js
var path = require('path');
...

module.exports = {
  ...
  alias: {
    '@libs': path.join(__dirname, '/myLibs/')
  }
  ...
};

```
or `webpack.config.js`
```js
var path = require('path');
...

module.exports = {
    ...
    resolve: {
        ...
        alias: {
            '@libs': path.join(__dirname, '/myLibs/')
        }
    }
    ...
};

```

Code:
```css
@import url(//www.baid.com/test.css);

@import url(@/test.css);

.test1 {
  background: url(@/images/a.png) no-repeat;
}

.tes2 {
  background: url("@/images/a.png") no-repeat;
}

```
Transpiles to:
```css
@import url(//www.baid.com/test.css);

@import url(../test.css);

.test1 {
  background: url(../images/a.png) no-repeat;
}

.tes2 {
  background: url("../images/a.png") no-repeat;
}

```

## Installation
```bash
 npm install --save-dev postcss-alias-config
```

Add the plugin to your `postcss.config.js`.  Optionally, add a path to a webpack config file, otherwise the plugin will look for `alias.config.js` or `app.config.js` or `tsconfig.json` or `jsconfig.json` or `webpack.config.js` in the root where the build was run.  Setting the config option will transform all alias destinations to be relative to the custom config.

postcss.config.js:
```js
// postcss < 8
module.exports = {
  plugins: {
    "postcss-alias-config": { "config": "./configs/webpack.config.test.js" }
  }
};
```

or postcss.config.js:
```js
// postcss >= 8
module.exports = {
  plugins: [
    require('postcss-alias-config/lib/postcss8')
  ]
};
```


