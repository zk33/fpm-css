---
title: Class A Rules
description: FPM CSS Coding Conventions Class A rules (FPM-specific rules enforced by the custom Stylelint plugin).
sidebar:
  label: Class A Rules
---

<!-- GENERATED — DO NOT EDIT -->

Version: `1.2.0` / Rules: 12 (Class A; all rules: A12 / B5 / C5)

Enforced by the custom rules in `stylelint-plugin-fpm`.

[Back to the rule reference](../)

## File Structure

### CSS-FILE-001: Class name prefix must match the file name [critical]

- Class: `A`
- Level: `error`
- Category: `file-structure`
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

**What AI and reviewers check**

Start every new class with the prefix of its file name. In _header.css, define only .header or .header-*; do not begin with another module name such as .my-awesome-header. Classes prefixed with `.g-`, `.x-`, and `.mode-`, along with _g.css and _v.css, are exempt.

### CSS-FILE-002: @keyframes names must also match the file name

- Class: `A`
- Level: `error`
- Category: `file-structure`
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

**What AI and reviewers check**

Start @keyframes names with the file name prefix. In _header.css, use a name such as header-fade-in, not a file-independent name such as fadeIn.

## Prefix

### CSS-PREFIX-001: Global classes use .g- and live in _g.css

- Class: `A`
- Level: `error`
- Category: `prefix`
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

**What AI and reviewers check**

Add .g- only to reusable global classes and always define them in _g.css. Do not define a .g- class as the root styled subject outside _g.css. The only exception is one nesting level where it is the child subject inside a local class. When a local class is the subject, reference .g- only as context or as a pseudo-class argument. Name merely common elements after the element, such as .header-.

### CSS-PREFIX-002: JS hook classes (.x-) must not be styled in CSS

- Class: `A`
- Level: `error`
- Category: `prefix`
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

**What AI and reviewers check**

.x- classes are for JS hooks only. Do not add declarations such as color to a .x- class in CSS. Put styles on a separate semantic class.

### CSS-PREFIX-004: .mode- only as a compound with another class (no standalone or descendant-only use)

- Class: `A`
- Level: `error`
- Category: `prefix`
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

**What AI and reviewers check**

Always compound .mode- with its target class, such as .btn.mode-active. Do not write a standalone .mode- class or one that is standalone as a descendant, such as .parent .mode-x.

## Variables

### CSS-VAR-002: Global variables are defined as --v- in :root of _v.css

- Class: `A`
- Level: `error`
- Category: `variables`
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

**What AI and reviewers check**

--v- is only for globals. Define it only in :root of _v.css. Do not newly define --v- in another file or module; references such as var(--v-...) are allowed.

### CSS-VAR-003: Variable names must also match the file name

- Class: `A`
- Level: `error`
- Category: `variables`
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

**What AI and reviewers check**

Start module variable names with the file name prefix: --header-* in _header.css. Global --v- variables are exempt.

### CSS-VAR-004: Module variables are defined inside the class named after the file

- Class: `A`
- Level: `error`
- Category: `variables`
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

**What AI and reviewers check**

Define module variables inside the block for the class named after the file, such as .header, not in :root. Do not define variables prefixed with --v- inside a module; --v- is reserved for :root in _v.css by CSS-VAR-002.

## Nesting

### CSS-NEST-002: No nested overrides of classes defined in other files

- Class: `A`
- Level: `error`
- Category: `nesting`
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

**What AI and reviewers check**

Nesting may override only a class with the same file prefix or a .g- global class used as the child subject inside a local class. Put .g- state changes in the same child compound, such as .g-btn:hover or .g-btn.mode-active. When a local class is the subject, reference .g- only as context or a pseudo-class argument. Do not override classes from another file, such as .header-* from _card.css.

### CSS-NEST-003: When nesting, reference the parent from the child side to keep rules together

- Class: `A`
- Level: `error`
- Category: `nesting`
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

**What AI and reviewers check**

Keep an element's styles in that element's class definition. Rather than writing a child definition inside a parent, write `.parent &` on the child side. Even for the .g- child-nesting exception, put a state in the same compound such as .g-btn:hover or .g-btn.mode-active and do not nest another `&`. Stylelint checks whether the subject contains `&`, but you must also keep related styles for the same class together during generation and review.

## Responsive

### CSS-RESP-002: Nest @media inside classes; never at the file root

- Class: `A`
- Level: `error`
- Category: `responsive`
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

**What AI and reviewers check**

Nest @media inside the target class and never at the root. @custom-media definitions may live at the root. For breakpoint naming, forbidding raw values, and consolidating rules in a class, follow CSS-RESP-001.

## Prohibited

### CSS-PROHIBIT-002: No type selectors outside resets and explicit exceptions

- Class: `A`
- Level: `error`
- Category: `prohibited`
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

**What AI and reviewers check**

Add classes to elements and style through them. Do not style directly by tag names such as ul, li, or a. Use type selectors under a parent class only where a class cannot be added, such as reset CSS or Markdown output.
