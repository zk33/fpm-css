# stylelint-config-fpm

Shareable [Stylelint](https://stylelint.io/) configuration for the
[FPM CSS Coding Conventions](https://zk33.github.io/fpm-css/).

It enables the standard Stylelint rules used by FPM and the custom rules from
[`stylelint-plugin-fpm`](https://www.npmjs.com/package/stylelint-plugin-fpm).

## Installation

```sh
pnpm add -D stylelint stylelint-config-fpm
```

## Usage

Add the configuration to your Stylelint configuration file.

```js
// stylelint.config.cjs
module.exports = {
  extends: ["stylelint-config-fpm"],
};
```

Then run Stylelint against the CSS files that follow the convention.

```sh
npx stylelint "src/**/*.css"
```

The configuration enforces FPM Class A and B rules. Class C rules require design
judgment and should be checked through review or the FPM AI skill.

## Links

- [Documentation](https://zk33.github.io/fpm-css/)
- [FPM CSS Coding Conventions](https://github.com/zk33/fpm-css)
- [stylelint-plugin-fpm](https://www.npmjs.com/package/stylelint-plugin-fpm)
