# CLAUDE.md

## CSS

Follow the `fpm-css` skill in `.claude/skills/fpm-css/` when writing, generating, or
reviewing CSS. The convention Single Source of Truth is `rules/convention.yaml`.
Classes A and B are enforced by Stylelint; Class C is upheld by AI and review. After
writing CSS, run `npx stylelint <path>` (or `pnpm lint:css` for the repository) and fix
violations by convention ID.
