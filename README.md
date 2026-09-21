# FPM CSS Coding Conventions

FPM provides coding conventions for maintainable CSS and tools that enforce and support them.
See the [published documentation](https://zk33.github.io/fpm-css/) for adoption guidance and all rules.

Japanese documentation: [https://zk33.github.io/fpm-css/ja/](https://zk33.github.io/fpm-css/ja/)

## For repository contributors

### SoT and generated outputs

The relationship is `rules/convention.yaml` → `pnpm generate` → these generated outputs:

- `rules/generated/rules.json`
- `.claude/skills/fpm-css/{SKILL.md,references/css-convention.md}`
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/fpm-css.mdc`
- `docs/src/content/docs/reference/**`
- `docs/src/content/docs/ja/reference/**`
- `docs/src/generated/rules.md`

`rules/convention.ja.yaml` is the Japanese translation overlay used to generate the
Japanese rule reference. It contains translated natural-language fields only; structural
fields live in `rules/convention.yaml`.

Only the marked blocks in `.claude/skills/fpm-css/SKILL.md`, `AGENTS.md`, and
`.github/copilot-instructions.md` are regenerated, preserving hand-written content
outside the markers. Every other listed generated output is overwritten in full.

### Updating the convention

Edit `rules/convention.yaml` and, when needed, `rules/convention.ja.yaml`; then run
`pnpm generate` and inspect the diff before committing. CI uses
`pnpm generate && git diff --exit-code` to detect generated-output drift and translation
coverage errors.

### Verification entry points

| Purpose | Command |
| --- | --- |
| Tests | `pnpm test` |
| CSS lint | `pnpm lint:css` |
| Build | `pnpm build` |
| Docs development server (http://localhost:4321) | `pnpm --filter docs dev` |
| Docs production build | `pnpm --filter docs build` |

The published site at https://zk33.github.io/fpm-css/ deploys automatically through
`pages.yml` when main receives a push.

When changing `packages/*`, add a `pnpm changeset`; `release.yml` creates release PRs.

### Three enforcement classes

- **Class A** — FPM-specific rules enforced by custom `stylelint-plugin-fpm` rules.
- **Class B** — Rules enforced by existing standard Stylelint rules.
- **Class C** — Advisory rules not enforced by the linter; upheld during AI generation and review.

### Repository layout

```text
fpm-css/
├── rules/                       # Convention SoT, Japanese overlay, and generated metadata
├── packages/
│   ├── stylelint-config-fpm/    # Shared Stylelint configuration
│   └── stylelint-plugin-fpm/    # Custom rules enforcing Class A
├── docs/                        # Published documentation site
├── scripts/generate-rules.mjs   # Generation script
└── AGENTS.md                    # Convention for general AI agents
```

## License

[MIT License](./LICENSE) — Copyright (c) 2026 fpm contributors
