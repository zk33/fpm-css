# stylelint-plugin-fpm

Custom [Stylelint](https://stylelint.io/) rules for the
[FPM CSS Coding Conventions](https://zk33.github.io/fpm-css/).

The plugin enforces FPM-specific Class A rules, including class/file-name matching,
global and JavaScript-only class handling, nesting constraints, Custom Property
ownership, and responsive-rule placement.

Most projects should use
[`stylelint-config-fpm`](https://www.npmjs.com/package/stylelint-config-fpm), which
configures this plugin together with the standard Stylelint rules used by FPM.

## Installation

```sh
pnpm add -D stylelint stylelint-plugin-fpm
```

## Usage

Enable the plugin and the rules your project needs in the Stylelint configuration.

```js
// stylelint.config.cjs
module.exports = {
  plugins: ["stylelint-plugin-fpm"],
  rules: {
    "fpm/selector-file-prefix": true,
    "fpm/no-restricted-type-selector": true,
  },
};
```

For the complete FPM ruleset, use `stylelint-config-fpm` instead.

## Links

- [Documentation](https://zk33.github.io/fpm-css/)
- [FPM CSS Coding Conventions](https://github.com/zk33/fpm-css)
- [stylelint-config-fpm](https://www.npmjs.com/package/stylelint-config-fpm)
