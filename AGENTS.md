# AGENTS.md

This repository manages the Single Source of Truth for FPM CSS Coding Conventions
(`rules/convention.yaml`) and its generated outputs: the Stylelint plugin, Claude Code
skill, and AI rule files. Follow the convention below when writing, generating, or
reviewing CSS.

- Claude Code receives the same convention through the `fpm-css` skill in `.claude/skills/fpm-css/`.
- Cursor receives the same convention for `**/*.css` through `.cursor/rules/fpm-css.mdc`.
- To change the convention, edit `rules/convention.yaml` and run `pnpm generate`. The
  generated block in this file, the skill, and all AI rule files are regenerated from
  the SoT; content outside markers may be hand-written.

## CSS Coding Conventions

<!-- BEGIN GENERATED fpm-css:css-rules FROM rules/convention.yaml — DO NOT EDIT -->
### Non-negotiable rules (enforced by Stylelint — satisfy them while generating and confirm with lint)

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

### Rules upheld by AI (Class C, not linted — follow them yourself when generating and reviewing)

- `CSS-NAMING-002` (C) — Class names describe role, meaning, or structure (no presentational names)
- `CSS-PREFIX-003` (C) — JS IDs are x-prefixed camelCase and never used in CSS
- `CSS-VAR-005` (C) — Variable names follow "prefix > kind > detail" order
- `CSS-RESP-001` (C) — Define @custom-media and use nested @media
- `CSS-JS-001` (C) — JS changes styles by toggling .mode- classes

Details and good/bad examples: `.claude/skills/fpm-css/references/css-convention.md`
Check CSS with `npx stylelint <path>` (or `pnpm lint:css` for the repository) and fix violations by rule ID.
<!-- END GENERATED fpm-css:css-rules -->
