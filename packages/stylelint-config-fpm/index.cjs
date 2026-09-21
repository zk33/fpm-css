"use strict";

module.exports = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-plugin-fpm"],
  rules: {
    "selector-class-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected class selector to be lowercase kebab-case"
      }
    ],
    "selector-max-id": 0,
    "at-rule-disallowed-list": ["layer", "scope", "extend"],
    "max-nesting-depth": 1,
    "custom-property-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected custom property to be lowercase kebab-case"
      }
    ],
    "at-rule-no-unknown": [true, { ignoreAtRules: ["custom-media"] }],
    "no-unknown-custom-media": true,
    "fpm/no-restricted-type-selector": true,
    "fpm/selector-file-prefix": true,
    "fpm/keyframes-file-prefix": true,
    "fpm/global-class-file": true,
    "fpm/no-x-class-style": true,
    "fpm/mode-class-compound": true,
    "fpm/no-cross-file-nesting": true,
    "fpm/nested-parent-reference": true,
    "fpm/no-root-media": true,
    "fpm/global-var-contract": true,
    "fpm/custom-property-file-prefix": true,
    "fpm/module-var-owner": true
  }
};
