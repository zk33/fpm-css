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

## Nesting and global overrides

`fpm/max-selector-nesting-depth: 1` permits one selector nesting level and excludes
`@media` from the depth in either order. Other at-rules keep standard nesting-depth
counting. Use it instead of `max-nesting-depth`; `fpm/no-root-media` still rejects
file-root media. Ownership checks also follow nested `&` through media.

`fpm/global-var-contract` permits existing `--v-*` overrides on the file-named
module class or `.g-*` subjects in `_g.css`, including mode compounds. Every
selector-list branch must qualify. Base definitions belong in `_v.css :root`;
the rule does not check whether the central definition exists. No opt-in is needed.

## Links

- [Documentation](https://zk33.github.io/fpm-css/)
- [FPM CSS Coding Conventions](https://github.com/zk33/fpm-css)
- [stylelint-config-fpm](https://www.npmjs.com/package/stylelint-config-fpm)
