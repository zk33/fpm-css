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

## Custom media defined in another file

Keep `no-unknown-custom-media` enabled and point Stylelint at the definitions with
its top-level `referenceFiles` option:

```js
// stylelint.config.cjs
const path = require("node:path");

module.exports = {
  extends: ["stylelint-config-fpm"],
  referenceFiles: [path.join(__dirname, "src/styles/_v.css")],
};
```

This option requires Stylelint **17.9.0 or later** and is experimental. See the
[Stylelint changelog](https://stylelint.io/changelog/#1790---2026-04-23) and
[referenceFiles documentation](https://stylelint.io/user-guide/configure/#referencefiles).
The package's general peer range is unchanged; projects using this option need
that newer version. `_v.css` is an example location, not a required custom-media
location. Use the actual definitions file for your project. The absolute path
based on `__dirname` is independent of the command's working directory.

`referenceFiles` helps check whether a referenced name exists; it does not enforce
its definition location or naming convention, or replace a project's contract
checks. Without the reference file, definitions in other partials are unavailable
to `no-unknown-custom-media`. It does not bundle or inject CSS: resolve custom media
in your build using the tools already used by your project.

## Links

- [Documentation](https://zk33.github.io/fpm-css/)
- [FPM CSS Coding Conventions](https://github.com/zk33/fpm-css)
- [stylelint-plugin-fpm](https://www.npmjs.com/package/stylelint-plugin-fpm)
