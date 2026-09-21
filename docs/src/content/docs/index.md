---
title: Overview
description: File based Prefix + Modifier style CSS coding conventions + tools
sidebar:
  order: 1
  label: Overview
---

# FPM CSS Coding Conventions

FPM is a set of CSS coding conventions in the “File based Prefix + Modifier” style.
Rules connecting class names to the files that define them, together with several
constraints, prevent common CSS development problems such as unintended overrides
and support CSS that remains maintainable over time.

## Core concept

Match a class name prefix to its file name.
For example, `_header.css` contains `.header` and `.header-*`, and does not mix in
classes from other modules.
This constraint makes the file that defines each class obvious and prevents duplicate
definitions and implicit overrides.
Combined with the nesting rules, it also prevents unintended overrides caused by specificity.

## Overview

FPM rules are divided into Classes A, B, and C.

- Class A: FPM-specific, highest-priority rules enforced by custom Stylelint rules.
- Class B: Rules enforced by standard Stylelint rules.
- Class C: Advisory rules that are difficult to determine mechanically.

The higher-priority Class A and B rules can be checked mechanically with Stylelint.
Because Class C rules cannot be judged mechanically, AI generation and review uphold them.

## Reading the convention

1. Start with [Getting Started](./getting-started/) to learn how to adopt it.
2. Read [Roles](./roles/) to understand linter and AI/review responsibilities.
3. Use the [Rule Reference](./reference/rules/) for details on all 22 rules.
