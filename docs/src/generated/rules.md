<!-- GENERATED FROM rules/convention.yaml — DO NOT EDIT -->

# CSS Convention Rules

Version: `1.2.0`
Rules: 22 (A12 / B5 / C5)

| ID | Class | Category | Level | Stylelint rule | Summary |
| --- | --- | --- | --- | --- | --- |
| `CSS-PROHIBIT-002` | A | `prohibited` | `error` | `fpm/no-restricted-type-selector` | Except for reset CSS and explicit exceptions, do not style with type selectors. Compound selectors containing type selectors, such as `.foo ul` and `ul.foo li`, are also forbidden. Where classes cannot be added, such as Markdown parser output, type selectors are allowed only under a parent class. |
| `CSS-FILE-001` | A | `file-structure` | `error` | `fpm/selector-file-prefix` | In _header.css, define only .header and .header-* classes whose prefix is header. Do not define classes whose prefix before the first hyphen differs from the file name. |
| `CSS-FILE-002` | A | `file-structure` | `error` | `fpm/keyframes-file-prefix` | Keep every name, including @keyframes animation names, aligned with the file name and therefore the class prefix. |
| `CSS-PREFIX-001` | A | `prefix` | `error` | `fpm/global-class-file` | Prefix reusable global classes with .g- and define them in _g.css. Outside _g.css, a .g- class may be the styled subject only as the child subject of one nesting level within a local class. When a local class is the subject, .g- may be referenced only as context or as a pseudo-class argument. Name merely common elements after the element instead. |
| `CSS-PREFIX-002` | A | `prefix` | `error` | `fpm/no-x-class-style` | Do not give .x- prefixed JS hook classes CSS declarations. |
| `CSS-PREFIX-004` | A | `prefix` | `error` | `fpm/mode-class-compound` | .mode- classes for states and variations need not match the file name, but they cannot stand alone. Always compound them with another class, as in .my-btn.mode-disabled or .my-btn { &.mode-disabled {} }. A standalone .mode- class in a descendant selector is also forbidden. |
| `CSS-NEST-002` | A | `nesting` | `error` | `fpm/no-cross-file-nesting` | Nested overrides are allowed only for a .g- global class used as the child subject inside a local class, or for an existing class defined in the same file. Do not override a class defined in another file through nesting. |
| `CSS-NEST-003` | A | `nesting` | `error` | `fpm/nested-parent-reference` | For nested overrides, do not write a child inside its parent selector. Instead, reference the parent from the child class definition with `.parent &` and keep related styles at the child definition. The subject of a nested rule, its final compound, must contain `&`. A .g- child subject within a local class outside _g.css is an exception. Self-references such as `&.mode-x` and pseudo-classes are allowed. |
| `CSS-VAR-002` | A | `variables` | `error` | `fpm/global-var-contract` | Define global variables in _v.css with a --v- prefix in the :root selector. Conversely, do not newly define a --v- variable outside :root in _v.css; modules may reference them. |
| `CSS-VAR-003` | A | `variables` | `error` | `fpm/custom-property-file-prefix` | Module variables defined in _header.css must use only the --header-* prefix, which matches the file name. --v- globals are excluded. |
| `CSS-VAR-004` | A | `variables` | `error` | `fpm/module-var-owner` | Define module variables inside the class named after the file, such as .header in _header.css, rather than in :root. Do not define --v- globals inside a module; --v- is reserved for :root in _v.css. |
| `CSS-RESP-002` | A | `responsive` | `error` | `fpm/no-root-media` | Nest `@media` inside the rule block for its target class. Do not place `@media` as a direct child of a CSS file root. `@custom-media` is allowed at the root. This rule does not check @media inside at-rule wrappers, breakpoint names, raw media features, or placement consolidation within a class. |
| `CSS-NAMING-001` | B | `naming` | `error` | `selector-class-pattern` | Write class names in kebab-case. snake_case, camelCase, and names beginning with uppercase letters are forbidden. camelCase is allowed only for prefixes with special requirements, such as Angular. |
| `CSS-PROHIBIT-001` | B | `prohibited` | `error` | `selector-max-id` | Do not style with #id selectors. Express styling with classes. |
| `CSS-PROHIBIT-003` | B | `prohibited` | `error` | `at-rule-disallowed-list` | Do not use @layer or @scope by default; a conforming codebase does not need them. They are exceptions only when an external library requires them. |
| `CSS-NEST-001` | B | `nesting` | `error` | `max-nesting-depth` | Do not nest selectors by default. When necessary, only one nesting level is allowed. Multiple levels such as .a .b .c and nesting multiple children are forbidden. |
| `CSS-VAR-001` | B | `variables` | `error` | `custom-property-pattern` | Custom Property names are lowercase kebab-case. snake_case and camelCase are forbidden. |
| `CSS-NAMING-002` | C | `naming` | `advisory` | `null` | Class names describe an element's role, meaning, or structure. Presentational and decorative names such as .column-6, .red, .text-large, .margin20, and .floated are forbidden. |
| `CSS-PREFIX-003` | C | `prefix` | `advisory` | `null` | Name JS IDs in x-prefixed camelCase, such as xSomeElement, and never use them in CSS. |
| `CSS-VAR-005` | C | `variables` | `advisory` | `null` | Variable names follow the order prefix > kind (color, font, height, and so on) > detail. For example: --v-color-text and --v-height-header. |
| `CSS-RESP-001` | C | `responsive` | `advisory` | `null` | Define breakpoints such as @custom-media --v-screen-xs (width <= 360px); and use them with nested @media (--v-screen-xs) { … } inside each class. Keep the responsive declarations for the same class together. |
| `CSS-JS-001` | C | `js-integration` | `advisory` | `null` | Change styles from JS by adding and removing .mode- classes. Direct style operations through .show(), .css({...}), or generic addClass('show') are forbidden. |
