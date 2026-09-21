---
title: Class B Rules
description: FPM CSS Coding Conventions Class B rules (Rules enforced by standard Stylelint rules).
sidebar:
  label: Class B Rules
---

<!-- GENERATED — DO NOT EDIT -->

Version: `1.2.0` / Rules: 5 (Class B; all rules: A12 / B5 / C5)

Enforced by existing standard Stylelint rules.

[Back to the rule reference](../)

## Naming

### CSS-NAMING-001: Class names are lowercase kebab-case

- Class: `B`
- Level: `error`
- Category: `naming`
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

**What AI and reviewers check**

Name new classes with lowercase words separated by hyphens. Do not use underscores or uppercase letters. Classes prefixed with `.g-`, `.x-`, and `.mode-` also follow this kebab-case format.

## Variables

### CSS-VAR-001: Custom Property names are kebab-case

- Class: `B`
- Level: `error`
- Category: `variables`
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

**What AI and reviewers check**

Write Custom Property names in kebab-case, such as --base-margin. The --v- prefix follows the same format.

## Nesting

### CSS-NEST-001: Nesting is discouraged; at most one level when allowed

- Class: `B`
- Level: `error`
- Category: `nesting`
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

**What AI and reviewers check**

Do not use nesting by default. If necessary, use only one level; do not nest multiple children or combinator chains.

## Prohibited

### CSS-PROHIBIT-001: No styling via ID selectors

- Class: `B`
- Level: `error`
- Category: `prohibited`
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

**What AI and reviewers check**

Always style through classes. Do not use ID selectors such as #foo for styling.

### CSS-PROHIBIT-003: @layer / @scope are not used by default

- Class: `B`
- Level: `error`
- Category: `prohibited`
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

**What AI and reviewers check**

Do not write @layer or @scope. Manage specificity through file splitting and naming.
