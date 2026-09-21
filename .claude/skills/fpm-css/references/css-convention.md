<!-- GENERATED FROM rules/convention.yaml — DO NOT EDIT -->

# FPM CSS Coding Conventions Reference

Source: `rules/convention.yaml`
Version: `1.2.0`
Rules: 22 (A12 / B5 / C5)

This reference is generated for progressive disclosure from the Claude Code skill. Use it when CSS generation, review, or lint fixes need rule-level details.

## Class A: FPM-specific rules enforced by the custom Stylelint plugin

### CSS-PROHIBIT-002: No type selectors outside resets and explicit exceptions

- id: `CSS-PROHIBIT-002`
- category: `prohibited`
- class: `A`
- level: `error`
- stylelintRule: `fpm/no-restricted-type-selector`

**Summary**

Except for reset CSS and explicit exceptions, do not style with type selectors. Compound selectors containing type selectors, such as `.foo ul` and `ul.foo li`, are also forbidden. Where classes cannot be added, such as Markdown parser output, type selectors are allowed only under a parent class.

**Rationale**

Type selectors have a broad effect range and invite accidental overrides.

**Good**

```text
.some-class-list { }
.some-class-list-item { }
```

**Bad**

```text
.some-class ul { }
ul.some-class li { }
```

**AI Guidance**

Add classes to elements and style through them. Do not style directly by tag names such as ul, li, or a. Use type selectors under a parent class only where a class cannot be added, such as reset CSS or Markdown output.

### CSS-FILE-001: Class name prefix must match the file name [critical]

- id: `CSS-FILE-001`
- category: `file-structure`
- class: `A`
- level: `error`
- stylelintRule: `fpm/selector-file-prefix`

**Summary**

In _header.css, define only .header and .header-* classes whose prefix is header. Do not define classes whose prefix before the first hyphen differs from the file name.

**Rationale**

Make the defining file obvious from a class name and prevent accidental overrides caused by duplicate definitions. This is the core of the convention.

**Good**

```text
/* _header.css */
.header {}
.header-logo {}
.header-nav {}
```

**Bad**

```text
/* _header.css */
.my-awesome-header {}
.alternative-header {}
```

**AI Guidance**

Start every new class with the prefix of its file name. In _header.css, define only .header or .header-*; do not begin with another module name such as .my-awesome-header. Classes prefixed with `.g-`, `.x-`, and `.mode-`, along with _g.css and _v.css, are exempt.

### CSS-FILE-002: @keyframes names must also match the file name

- id: `CSS-FILE-002`
- category: `file-structure`
- class: `A`
- level: `error`
- stylelintRule: `fpm/keyframes-file-prefix`

**Summary**

Keep every name, including @keyframes animation names, aligned with the file name and therefore the class prefix.

**Rationale**

Apply the rule that names reveal their file location consistently to animation names.

**Good**

```text
/* _header.css */
@keyframes header-fade-in { … }
```

**Bad**

```text
/* _header.css */
@keyframes fadeIn { … }
```

**AI Guidance**

Start @keyframes names with the file name prefix. In _header.css, use a name such as header-fade-in, not a file-independent name such as fadeIn.

### CSS-PREFIX-001: Global classes use .g- and live in _g.css

- id: `CSS-PREFIX-001`
- category: `prefix`
- class: `A`
- level: `error`
- stylelintRule: `fpm/global-class-file`

**Summary**

Prefix reusable global classes with .g- and define them in _g.css. Outside _g.css, a .g- class may be the styled subject only as the child subject of one nesting level within a local class. When a local class is the subject, .g- may be referenced only as context or as a pseudo-class argument. Name merely common elements after the element instead.

**Rationale**

Make shared items that need careful editing visible through their prefix and file.

**Good**

```text
/* _g.css */
.g-btn { … }
.g-input-text { … }
/* _card.css */
.card { .g-btn { … } }
.card:has(.g-btn) { … }
```

**Bad**

```text
/* _header.css */
.g-btn { … }   /* Defining .g- outside _g.css */
```

**AI Guidance**

Add .g- only to reusable global classes and always define them in _g.css. Do not define a .g- class as the root styled subject outside _g.css. The only exception is one nesting level where it is the child subject inside a local class. When a local class is the subject, reference .g- only as context or as a pseudo-class argument. Name merely common elements after the element, such as .header-.

### CSS-PREFIX-002: JS hook classes (.x-) must not be styled in CSS

- id: `CSS-PREFIX-002`
- category: `prefix`
- class: `A`
- level: `error`
- stylelintRule: `fpm/no-x-class-style`

**Summary**

Do not give .x- prefixed JS hook classes CSS declarations.

**Rationale**

Separate JS targets from CSS styling targets to prevent unintended style changes.

**Good**

```text
/* Put styles on a non-.x- class */
.list-item { color: red; }
```

**Bad**

```text
.x-list-element { color: red; }
```

**AI Guidance**

.x- classes are for JS hooks only. Do not add declarations such as color to a .x- class in CSS. Put styles on a separate semantic class.

### CSS-PREFIX-004: .mode- only as a compound with another class (no standalone or descendant-only use)

- id: `CSS-PREFIX-004`
- category: `prefix`
- class: `A`
- level: `error`
- stylelintRule: `fpm/mode-class-compound`

**Summary**

.mode- classes for states and variations need not match the file name, but they cannot stand alone. Always compound them with another class, as in .my-btn.mode-disabled or .my-btn { &.mode-disabled {} }. A standalone .mode- class in a descendant selector is also forbidden.

**Rationale**

Bind each state class to its target class so the element's state is explicit.

**Good**

```text
.my-btn.mode-disabled { … }
.my-btn { &.mode-disabled { … } }
```

**Bad**

```text
.mode-disabled { … }
.my-btn .mode-disabled { … }
```

**AI Guidance**

Always compound .mode- with its target class, such as .btn.mode-active. Do not write a standalone .mode- class or one that is standalone as a descendant, such as .parent .mode-x.

### CSS-NEST-002: No nested overrides of classes defined in other files

- id: `CSS-NEST-002`
- category: `nesting`
- class: `A`
- level: `error`
- stylelintRule: `fpm/no-cross-file-nesting`

**Summary**

Nested overrides are allowed only for a .g- global class used as the child subject inside a local class, or for an existing class defined in the same file. Do not override a class defined in another file through nesting.

**Rationale**

Forbid implicit cross-file overrides and preserve the CSS-FILE-001 principle that a defining file is obvious.

**Good**

```text
/* _card.css (same file) */
.card { .card-alt & { … } }
.card { .g-btn.mode-active { … } }
```

**Bad**

```text
/* _card.css */
.g-btn { .special & { … } }  /* Do not make .g- the root subject */
.header-nav { … }   /* Overrides a class defined in another file (_header.css) */
```

**AI Guidance**

Nesting may override only a class with the same file prefix or a .g- global class used as the child subject inside a local class. Put .g- state changes in the same child compound, such as .g-btn:hover or .g-btn.mode-active. When a local class is the subject, reference .g- only as context or a pseudo-class argument. Do not override classes from another file, such as .header-* from _card.css.

### CSS-NEST-003: When nesting, reference the parent from the child side to keep rules together

- id: `CSS-NEST-003`
- category: `nesting`
- class: `A`
- level: `error`
- stylelintRule: `fpm/nested-parent-reference`

**Summary**

For nested overrides, do not write a child inside its parent selector. Instead, reference the parent from the child class definition with `.parent &` and keep related styles at the child definition. The subject of a nested rule, its final compound, must contain `&`. A .g- child subject within a local class outside _g.css is an exception. Self-references such as `&.mode-x` and pseudo-classes are allowed.

**Rationale**

Keep definitions for child elements in one place and improve discoverability.

**Good**

```text
.nav-list-item {
  …
  .nav-list & { … }
  .nav-list.mode-alt & { … }
}
.card { .g-btn.mode-active { … } }
```

**Bad**

```text
.nav-list {
  .nav-list-item { … }
  &.mode-alt .nav-list-item { … }
}
```

**AI Guidance**

Keep an element's styles in that element's class definition. Rather than writing a child definition inside a parent, write `.parent &` on the child side. Even for the .g- child-nesting exception, put a state in the same compound such as .g-btn:hover or .g-btn.mode-active and do not nest another `&`. Stylelint checks whether the subject contains `&`, but you must also keep related styles for the same class together during generation and review.

### CSS-VAR-002: Global variables are defined as --v- in :root of _v.css

- id: `CSS-VAR-002`
- category: `variables`
- class: `A`
- level: `error`
- stylelintRule: `fpm/global-var-contract`

**Summary**

Define global variables in _v.css with a --v- prefix in the :root selector. Conversely, do not newly define a --v- variable outside :root in _v.css; modules may reference them.

**Rationale**

Fix global variable definitions to one location and make override sources explicit.

**Good**

```text
/* _v.css */
:root {
  --v-color-text: #333;
  --v-radius: 5px;
}
```

**Bad**

```text
/* _header.css */
:root { --v-color-text: #333; }   /* Defining --v- outside _v.css */
```

**AI Guidance**

--v- is only for globals. Define it only in :root of _v.css. Do not newly define --v- in another file or module; references such as var(--v-...) are allowed.

### CSS-VAR-003: Variable names must also match the file name

- id: `CSS-VAR-003`
- category: `variables`
- class: `A`
- level: `error`
- stylelintRule: `fpm/custom-property-file-prefix`

**Summary**

Module variables defined in _header.css must use only the --header-* prefix, which matches the file name. --v- globals are excluded.

**Rationale**

Make the defining file traceable from a variable name as well.

**Good**

```text
/* _header.css */
--header-color: #999;
```

**Bad**

```text
/* _header.css */
--color-of-header: #999;
```

**AI Guidance**

Start module variable names with the file name prefix: --header-* in _header.css. Global --v- variables are exempt.

### CSS-VAR-004: Module variables are defined inside the class named after the file

- id: `CSS-VAR-004`
- category: `variables`
- class: `A`
- level: `error`
- stylelintRule: `fpm/module-var-owner`

**Summary**

Define module variables inside the class named after the file, such as .header in _header.css, rather than in :root. Do not define --v- globals inside a module; --v- is reserved for :root in _v.css.

**Rationale**

Close variable scope to its module and limit its effect range.

**Good**

```text
/* _header.css */
.header { --header-color-text: #333; }
```

**Bad**

```text
/* _header.css */
:root { --header-color-text: #333; }
.header { --v-header-height: 30px; }   /* --v- in a module is a violation */
```

**AI Guidance**

Define module variables inside the block for the class named after the file, such as .header, not in :root. Do not define variables prefixed with --v- inside a module; --v- is reserved for :root in _v.css by CSS-VAR-002.

### CSS-RESP-002: Nest @media inside classes; never at the file root

- id: `CSS-RESP-002`
- category: `responsive`
- class: `A`
- level: `error`
- stylelintRule: `fpm/no-root-media`

**Summary**

Nest `@media` inside the rule block for its target class. Do not place `@media` as a direct child of a CSS file root. `@custom-media` is allowed at the root. This rule does not check @media inside at-rule wrappers, breakpoint names, raw media features, or placement consolidation within a class.

**Rationale**

Keep responsive definitions at their target class and eliminate overrides scattered outside classes.

**Good**

```text
@custom-media --v-screen-xs (width <= 360px);
.some-class {
  @media (--v-screen-xs) { color: green; }
}
```

**Bad**

```text
@media (--v-screen-xs) {
  .some-class { color: green; }   /* @media at the root */
}
```

**AI Guidance**

Nest @media inside the target class and never at the root. @custom-media definitions may live at the root. For breakpoint naming, forbidding raw values, and consolidating rules in a class, follow CSS-RESP-001.

## Class B: Rules enforced by standard Stylelint rules

### CSS-NAMING-001: Class names are lowercase kebab-case

- id: `CSS-NAMING-001`
- category: `naming`
- class: `B`
- level: `error`
- stylelintRule: `selector-class-pattern`

**Summary**

Write class names in kebab-case. snake_case, camelCase, and names beginning with uppercase letters are forbidden. camelCase is allowed only for prefixes with special requirements, such as Angular.

**Rationale**

Fix one notation to eliminate the cost of deciding how to name things.

**Good**

```text
.good-class-definition { }
```

**Bad**

```text
.snakecase_class {}
.camelCaseClass {}
.Has-Capital-CLASS {}
```

**AI Guidance**

Name new classes with lowercase words separated by hyphens. Do not use underscores or uppercase letters. Classes prefixed with `.g-`, `.x-`, and `.mode-` also follow this kebab-case format.

### CSS-PROHIBIT-001: No styling via ID selectors

- id: `CSS-PROHIBIT-001`
- category: `prohibited`
- class: `B`
- level: `error`
- stylelintRule: `selector-max-id`

**Summary**

Do not style with #id selectors. Express styling with classes.

**Rationale**

Avoid escalating specificity and accidental overrides.

**Good**

```text
.main { }
.main-list { }
```

**Bad**

```text
#main { }
#main ul { }
```

**AI Guidance**

Always style through classes. Do not use ID selectors such as #foo for styling.

### CSS-PROHIBIT-003: @layer / @scope are not used by default

- id: `CSS-PROHIBIT-003`
- category: `prohibited`
- class: `B`
- level: `error`
- stylelintRule: `at-rule-disallowed-list`

**Summary**

Do not use @layer or @scope by default; a conforming codebase does not need them. They are exceptions only when an external library requires them.

**Rationale**

The convention's specificity and splitting policies make them unnecessary.

**Good**

```text
/* Do not use @layer / @scope */
```

**Bad**

```text
@layer base { … }
@scope (.card) { … }
```

**AI Guidance**

Do not write @layer or @scope. Manage specificity through file splitting and naming.

### CSS-NEST-001: Nesting is discouraged; at most one level when allowed

- id: `CSS-NEST-001`
- category: `nesting`
- class: `B`
- level: `error`
- stylelintRule: `max-nesting-depth`

**Summary**

Do not nest selectors by default. When necessary, only one nesting level is allowed. Multiple levels such as .a .b .c and nesting multiple children are forbidden.

**Rationale**

Preserve specificity and readability and make definitions easy to trace.

**Good**

```text
.my-child {
  .my-parent-alternate & { … }
}
```

**Bad**

```text
.my-parent .my-child .my-element { … }
.my-parent { .my-child {} .my-child2 {} }
```

**AI Guidance**

Do not use nesting by default. If necessary, use only one level; do not nest multiple children or combinator chains.

### CSS-VAR-001: Custom Property names are kebab-case

- id: `CSS-VAR-001`
- category: `variables`
- class: `B`
- level: `error`
- stylelintRule: `custom-property-pattern`

**Summary**

Custom Property names are lowercase kebab-case. snake_case and camelCase are forbidden.

**Rationale**

Match class naming notation and eliminate variation.

**Good**

```text
--base-margin: 12px;
--base-padding: 12px;
```

**Bad**

```text
--base_margin: 12px;
--basePadding: 12px;
```

**AI Guidance**

Write Custom Property names in kebab-case, such as --base-margin. The --v- prefix follows the same format.

## Class C: Advisory rules upheld by AI and review

### CSS-NAMING-002: Class names describe role, meaning, or structure (no presentational names)

- id: `CSS-NAMING-002`
- category: `naming`
- class: `C`
- level: `advisory`
- stylelintRule: `null`

**Summary**

Class names describe an element's role, meaning, or structure. Presentational and decorative names such as .column-6, .red, .text-large, .margin20, and .floated are forbidden.

**Rationale**

Prevent a mismatch between styles and names, so design changes do not require changing HTML.

**Good**

```text
<section class="main-section">
  <h1 class="main-section-title">…</h1>
</section>
```

**Bad**

```text
<div class="column-6 margin20 floated">
  <h1 class="red text-large">…</h1>
</div>
```

**AI Guidance**

Name classes for what they are: their role, meaning, or structure. Do not use presentational words for color, size, spacing, or layout values, including red, large, column-6, margin20, and floated. The linter cannot catch this, so uphold it yourself during generation.

### CSS-PREFIX-003: JS IDs are x-prefixed camelCase and never used in CSS

- id: `CSS-PREFIX-003`
- category: `prefix`
- class: `C`
- level: `advisory`
- stylelintRule: `null`

**Summary**

Name JS IDs in x-prefixed camelCase, such as xSomeElement, and never use them in CSS.

**Rationale**

Separate JS reference points from CSS and make their purpose explicit in the name.

**Good**

```text
<!-- HTML/JS -->
<div id="xSomeElement"></div>
```

**Bad**

```text
#xSomeElement { color: red; }  /* Used from CSS */
```

**AI Guidance**

Name JS IDs in x-prefixed camelCase, such as xSomeElement. Never reference IDs from CSS; CSS-PROHIBIT-001 enforces the CSS-side ID restriction. This naming rule applies to HTML and JS.

### CSS-VAR-005: Variable names follow "prefix > kind > detail" order

- id: `CSS-VAR-005`
- category: `variables`
- class: `C`
- level: `advisory`
- stylelintRule: `null`

**Summary**

Variable names follow the order prefix > kind (color, font, height, and so on) > detail. For example: --v-color-text and --v-height-header.

**Rationale**

Standardize variable name ordering to improve completion and scanability.

**Good**

```text
--v-font-text: sans-serif;
--v-color-text: #333;
--v-height-header: 60px;
```

**Bad**

```text
--v-text-color: #333;   /* Kind and detail are reversed */
```

**AI Guidance**

Build variable names in prefix > kind > detail order. Put kind words such as color, font, and height in the second segment: --v-color-text, not --v-text-color. This is not linted, so uphold it during generation.

### CSS-RESP-001: Define @custom-media and use nested @media

- id: `CSS-RESP-001`
- category: `responsive`
- class: `C`
- level: `advisory`
- stylelintRule: `null`

**Summary**

Define breakpoints such as @custom-media --v-screen-xs (width <= 360px); and use them with nested @media (--v-screen-xs) { … } inside each class. Keep the responsive declarations for the same class together.

**Rationale**

Centralize breakpoints as variables and keep responsive definitions at their target class.

**Good**

```text
.some-class {
  color: red;
  @media (--v-screen-xs) { color: green; }
}
```

**Bad**

```text
@media (max-width: 360px) {
  .some-class { color: green; }   /* Raw value and definition outside the class */
}
```

**AI Guidance**

Define breakpoints as --v-screen-* with @custom-media and reference them. Do not write raw media features such as max-width: 360px; nest responsive rules inside their target class and keep them together. CSS-RESP-002 uses Stylelint to check placement of @media at the root.

### CSS-JS-001: JS changes styles by toggling .mode- classes

- id: `CSS-JS-001`
- category: `js-integration`
- class: `C`
- level: `advisory`
- stylelintRule: `null`

**Summary**

Change styles from JS by adding and removing .mode- classes. Direct style operations through .show(), .css({...}), or generic addClass('show') are forbidden.

**Rationale**

Keep style control in CSS .mode- definitions rather than scattering it through JS.

**Good**

```text
$('.x-list-item').addClass('mode-show');
```

**Bad**

```text
$('.x-list-item').show();
$('.x-list-item').css({ display: 'block' });
$('.x-list-item').addClass('show');
```

**AI Guidance**

Change styles from JS by adding and removing .mode- classes. Do not directly manipulate styles with .show(), .hide(), .css(), or generic addClass('show'). This applies to JS and is not covered by the CSS linter.
