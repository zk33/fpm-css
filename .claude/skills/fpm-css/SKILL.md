---
name: fpm-css
description: Use FPM CSS Coding Conventions when writing, generating, or reviewing CSS. Apply it when creating, editing, or refactoring .css files; deciding class naming, file splitting, .g-/.x-/.mode- prefixes, Custom Properties (--v-), nesting, or @custom-media/@media responsiveness; and checking CSS with stylelint. Classes A and B are enforced by Stylelint; AI and review uphold Class C rules on presentational naming, variable name order, breakpoint design, JS .mode- changes, and JS ID naming.
paths: "**/*.css"
allowed-tools: Bash(npx stylelint *) Bash(pnpm stylelint *) Bash(pnpm lint:css *)
---

# FPM CSS Coding Conventions

Follow this convention when writing, changing, or reviewing CSS. For all 22 rules,
their rationale, and good/bad examples, consult `references/css-convention.md`
(generated from the SoT `rules/convention.yaml`) as needed.

**Responsibilities**

- **Classes A/B = enforced by Stylelint.** AI must satisfy them while generating and confirm them with Stylelint at the end.
- **Class C = advisory rules the linter cannot catch.** The skill and review uphold them; follow them yourself while generating and reviewing.

<!-- BEGIN GENERATED fpm-css:css-rules FROM rules/convention.yaml — DO NOT EDIT -->
## Non-negotiable rules (enforced by Stylelint — satisfy them while generating and confirm with lint)

- `CSS-PROHIBIT-002` (A, `fpm/no-restricted-type-selector`) — No type selectors outside resets and explicit exceptions
- `CSS-FILE-001` (A, `fpm/selector-file-prefix`) — Class name prefix must match the file name [critical]
- `CSS-FILE-002` (A, `fpm/keyframes-file-prefix`) — @keyframes names must also match the file name
- `CSS-PREFIX-001` (A, `fpm/global-class-file`) — Global classes use .g- and live in _g.css
- `CSS-PREFIX-002` (A, `fpm/no-x-class-style`) — JS hook classes (.x-) must not be styled in CSS
- `CSS-PREFIX-004` (A, `fpm/mode-class-compound`) — .mode- only as a compound with another class (no standalone or descendant-only use)
- `CSS-NEST-002` (A, `fpm/no-cross-file-nesting`) — No nested overrides of classes defined in other files
- `CSS-NEST-003` (A, `fpm/nested-parent-reference`) — When nesting, reference the parent from the child side to keep rules together
- `CSS-VAR-002` (A, `fpm/global-var-contract`) — Global variables are defined as --v- in :root of _v.css
- `CSS-VAR-003` (A, `fpm/custom-property-file-prefix`) — Variable names must also match the file name
- `CSS-VAR-004` (A, `fpm/module-var-owner`) — Module variables are defined inside the class named after the file
- `CSS-RESP-002` (A, `fpm/no-root-media`) — Nest @media inside classes; never at the file root
- `CSS-NAMING-001` (B, `selector-class-pattern`) — Class names are lowercase kebab-case
- `CSS-PROHIBIT-001` (B, `selector-max-id`) — No styling via ID selectors
- `CSS-PROHIBIT-003` (B, `at-rule-disallowed-list`) — @layer / @scope are not used by default
- `CSS-NEST-001` (B, `max-nesting-depth`) — Nesting is discouraged; at most one level when allowed
- `CSS-VAR-001` (B, `custom-property-pattern`) — Custom Property names are kebab-case

## Rules upheld by AI (Class C, not linted — follow them yourself when generating and reviewing)

- `CSS-NAMING-002` (C) — Class names describe role, meaning, or structure (no presentational names)
  Name classes for what they are: their role, meaning, or structure. Do not use presentational words for color, size, spacing, or layout values, including red, large, column-6, margin20, and floated. The linter cannot catch this, so uphold it yourself during generation.
- `CSS-PREFIX-003` (C) — JS IDs are x-prefixed camelCase and never used in CSS
  Name JS IDs in x-prefixed camelCase, such as xSomeElement. Never reference IDs from CSS; CSS-PROHIBIT-001 enforces the CSS-side ID restriction. This naming rule applies to HTML and JS.
- `CSS-VAR-005` (C) — Variable names follow "prefix > kind > detail" order
  Build variable names in prefix > kind > detail order. Put kind words such as color, font, and height in the second segment: --v-color-text, not --v-text-color. This is not linted, so uphold it during generation.
- `CSS-RESP-001` (C) — Define @custom-media and use nested @media
  Define breakpoints as --v-screen-* with @custom-media and reference them. Do not write raw media features such as max-width: 360px; nest responsive rules inside their target class and keep them together. CSS-RESP-002 uses Stylelint to check placement of @media at the root.
- `CSS-JS-001` (C) — JS changes styles by toggling .mode- classes
  Change styles from JS by adding and removing .mode- classes. Do not directly manipulate styles with .show(), .hide(), .css(), or generic addClass('show'). This applies to JS and is not covered by the CSS linter.
<!-- END GENERATED fpm-css:css-rules -->

## Always check with Stylelint after writing CSS

Whenever you write or change CSS, run Stylelint on the target file and fix violations
by convention ID:

```bash
npx stylelint <path>
```

Use `pnpm lint:css` for the repository. Look up a violation ID such as
`fpm/selector-file-prefix` in `references/css-convention.md` for its meaning and
correct form. The linter does not report Class C violations, so check the rules upheld
by AI above during generation and review.

## Reference

- All 22 rules, good/bad examples, and rationale: [references/css-convention.md](references/css-convention.md)
