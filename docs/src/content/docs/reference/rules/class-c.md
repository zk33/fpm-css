---
title: Class C Rules
description: FPM CSS Coding Conventions Class C rules (Advisory rules upheld by AI and review).
sidebar:
  label: Class C Rules
---

<!-- GENERATED — DO NOT EDIT -->

Version: `1.2.0` / Rules: 5 (Class C; all rules: A12 / B5 / C5)

Not enforced by the linter; upheld during AI generation and review.

[Back to the rule reference](../)

## Naming

### CSS-NAMING-002: Class names describe role, meaning, or structure (no presentational names)

- Class: `C`
- Level: `advisory`
- Category: `naming`
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

**What AI and reviewers check**

Name classes for what they are: their role, meaning, or structure. Do not use presentational words for color, size, spacing, or layout values, including red, large, column-6, margin20, and floated. The linter cannot catch this, so uphold it yourself during generation.

## Prefix

### CSS-PREFIX-003: JS IDs are x-prefixed camelCase and never used in CSS

- Class: `C`
- Level: `advisory`
- Category: `prefix`
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

**What AI and reviewers check**

Name JS IDs in x-prefixed camelCase, such as xSomeElement. Never reference IDs from CSS; CSS-PROHIBIT-001 enforces the CSS-side ID restriction. This naming rule applies to HTML and JS.

## Variables

### CSS-VAR-005: Variable names follow "prefix > kind > detail" order

- Class: `C`
- Level: `advisory`
- Category: `variables`
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

**What AI and reviewers check**

Build variable names in prefix > kind > detail order. Put kind words such as color, font, and height in the second segment: --v-color-text, not --v-text-color. This is not linted, so uphold it during generation.

## Responsive

### CSS-RESP-001: Define @custom-media and use nested @media

- Class: `C`
- Level: `advisory`
- Category: `responsive`
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

**What AI and reviewers check**

Define breakpoints as --v-screen-* with @custom-media and reference them. Do not write raw media features such as max-width: 360px; nest responsive rules inside their target class and keep them together. CSS-RESP-002 uses Stylelint to check placement of @media at the root.

## JS Integration

### CSS-JS-001: JS changes styles by toggling .mode- classes

- Class: `C`
- Level: `advisory`
- Category: `js-integration`
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

**What AI and reviewers check**

Change styles from JS by adding and removing .mode- classes. Do not directly manipulate styles with .show(), .hide(), .css(), or generic addClass('show'). This applies to JS and is not covered by the CSS linter.
