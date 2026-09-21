---
title: Getting Started
description: How to adopt stylelint-config-fpm and the Claude Code / Codex skill.
sidebar:
  order: 2
  label: Getting Started
---

## Prerequisites

FPM requires CSS files to be split into small files, so you need a build environment
such as Lightning CSS or postcss-import that can bundle and combine multiple CSS files.
Follow the policy of each project when setting up that build environment.

A standard source layout looks like this:

```
assets/
├─ css/
│   ├─ style.css       // Entry file containing only @import statements (not linted)
|   ├─ vendor/         // External-library CSS (not linted)
│   └─ src/            // CSS content lives in this folder (linted)
│       ├─ _header.css // Defines .header / .header-* classes
│       ├─ _footer.css
│       ├─ _button.css
│       ├─ _g.css
│       └─ _v.css
└─ js/
```

## Adoption patterns

FPM separates CSS conventions into Classes A, B, and C.
The higher-priority Class A and B rules can be checked mechanically with Stylelint.
Because Class C rules cannot be judged mechanically, they are provided as an LLM skill.
Use it when generating or reviewing with AI.

| Pattern                       | Install                                                 | What it provides                                            | Mechanical checks                            |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| (1) Stylelint + project skill | npm `stylelint` + `stylelint-config-fpm`, project skill | Stylelint checks Classes A/B; AI can reference all 22 rules | Yes (A/B)                                    |
| (2) Project skill only        | Project skill                                           | AI can reference all 22 rules                               | No                                           |
| (3) Global skill              | Claude Code or Codex global skill                       | AI can reference all 22 rules in every project              | No (add Stylelint to each project if wanted) |

Stylelint is optional. Without it, the skill still gives AI all 22 rules (A12 / B5 / C5),
but it does not mechanically check Class A and B rules.

## Pattern (1): use the Stylelint configuration

For pattern (1), add Stylelint itself and `stylelint-config-fpm` to the consuming project.
You can also use it with the global skill from pattern (3).

```sh
pnpm add -D stylelint stylelint-config-fpm
```

Then add `stylelint-config-fpm` to the Stylelint configuration.

```js
module.exports = {
	extends: ["stylelint-config-fpm"],
};
```

This configuration includes custom `stylelint-plugin-fpm` rules and checks Class A and B.
After writing CSS, run Stylelint on the target file or the whole project.

```sh
npx stylelint "src/**/*.css"
```

## Use the skill

Get the [FPM GitHub repository](https://github.com/zk33/fpm-css) as a source copy. If its
local path is `<fpm-source>`, run:

```sh
git clone https://github.com/zk33/fpm-css.git <fpm-source>
```

Patterns (1) and (2) use a project skill; pattern (3) uses a global skill. Claude Code
and Codex use the same skill directory but install it in different locations.

| Tool        | Project skill             | Global skill                    |
| ----------- | ------------------------- | ------------------------------- |
| Claude Code | `.claude/skills/fpm-css/` | `~/.claude/skills/fpm-css/`     |
| Codex       | `.agents/skills/fpm-css/` | `$HOME/.agents/skills/fpm-css/` |

Copy the source `fpm-css` directory to the parent directory for the location you use.

```sh
# Claude Code: project skill
mkdir -p .claude/skills
cp -R <fpm-source>/.claude/skills/fpm-css .claude/skills/

# Claude Code: global skill
mkdir -p ~/.claude/skills
cp -R <fpm-source>/.claude/skills/fpm-css ~/.claude/skills/

# Codex: project skill
mkdir -p .agents/skills
cp -R <fpm-source>/.claude/skills/fpm-css .agents/skills/

# Codex: global skill
mkdir -p $HOME/.agents/skills
cp -R <fpm-source>/.claude/skills/fpm-css $HOME/.agents/skills/
```

The skill provides a convention digest and detailed reference when generating,
modifying, or reviewing CSS. See its bundled `references/css-convention.md` for
detailed good/bad examples.

## Without Stylelint

With patterns (2) and (3), the skill gives AI all 22 rules, but it does not mechanically
check Class A and B. The Stylelint checking procedure in the skill cannot run where
Stylelint is not installed. Add Stylelint later, or check Class A and B in review as well.
