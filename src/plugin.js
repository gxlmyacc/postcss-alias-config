const { resolveAlias } = require('babel-plugin-alias-config');

const URL_PATTERNS = [
  /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g,
  /(AlphaImageLoader\(\s*src=['"]?)([^"')]+)(["'])/g
];

function getNodePathFile(node) {
  return node.source && node.source.input && node.source.input.file;
}

function isAbsoluteUrl(url) {
  return typeof url === 'string' && (/^(((https?:)?\/\/)|(data:))/.test(url) || url[0] === '/');
}

const plugin = function postcssPluginMethod(opts) {
  opts = opts || {};
  return function internalPostcssPlugin(root) {
    let options = {};
    if (typeof opts === 'function') {
      options = opts(root);
    } else {
      options = opts || {};
    }

    const { configPath, ...restOptions } = options;

    const replacePattern = (node, key) => {
      const filename = getNodePathFile(node);
      const pattern = URL_PATTERNS.find((pattern) => pattern.test(node[key]));
      if (!pattern) return;
      node[key] = node[key].replace(pattern, (matched, before, url, after) => {
        if (isAbsoluteUrl(url)) return matched;
        const newUrl = resolveAlias(filename, url, { configPath, ...restOptions });
        if (!newUrl) return matched;

        const result = node[key].replace(matched, `${before}${newUrl}${after}`);
        return result;
      });
    };

    root.walkAtRules('import', (rule) => replacePattern(rule, 'params'));
    root.walkDecls((node) => replacePattern(node, 'value'));
  };
};

plugin.id = 'postcss-alias-config';

module.exports = plugin;
