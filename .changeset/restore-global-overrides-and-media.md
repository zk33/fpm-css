---
"stylelint-plugin-fpm": minor
"stylelint-config-fpm": minor
---

Allow global variable overrides on file-named module classes and `_g.css` global classes. Fix type-selector false positives in non-selector pseudo arguments while retaining checks in selector arguments and nth-child `of` lists.

Replace standard nesting-depth enforcement with `fpm/max-selector-nesting-depth`, excluding media without permitting extra selector levels. Check nested ownership through media and keep root media forbidden. Document Stylelint referenceFiles for cross-file custom media.
