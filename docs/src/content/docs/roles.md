---
title: Roles
description: Responsibilities for Classes A, B, and C, and the scope checked by the linter, AI, and review.
sidebar:
  order: 4
  label: Roles
---

The convention separates rules that can be checked mechanically from those that need
human or AI design judgment.

## Class A

Class A contains FPM-specific, highest-priority items enforced by custom rules in
`stylelint-plugin-fpm`.
They include matching file names and class prefixes; handling `.g-`, `.x-`, and
`.mode-`; Custom Property definition locations; the direction of parent references in
nesting; and placement of root-level `@media`.

AI generates CSS that satisfies Class A from the start and confirms it with Stylelint at the end.

## Class B

Class B contains items enforced by existing standard Stylelint rules.
Examples include kebab-case class names, no ID selectors, nesting depth, and Custom
Property name format.

Stylelint also checks Class B.
Review confirms there are no unnatural names intended to avoid errors or implementations
that diverge from the intent of file splitting.

## Class C

Class C contains advisory rules that are difficult to determine by static checks alone.
They include the no-presentational-names rule in `CSS-NAMING-002`, JS ID naming in
`CSS-PREFIX-003`, variable word order in `CSS-VAR-005`, breakpoint design in
`CSS-RESP-001`, and how JS changes styles in `CSS-JS-001`. The nesting rule that puts
`&` in the subject is mechanically checked as Class A by `CSS-NEST-003`, and the ban on
root-level `@media` is mechanically checked as Class A by `CSS-RESP-002`.

AI generation and review uphold Class C.
Even if Stylelint passes, CSS that is hard to read or fragile under change from the Class C
perspective should be corrected.
