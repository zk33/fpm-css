import stylelint from "stylelint";
import plugins, { maxSelectorNestingDepth } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/max-selector-nesting-depth/index.js";


testRule({
  plugins, ruleName, config: 1,
  accept: [
    ".hoge-item { .hoge.mode-active & { @media (width < 600px) { color: red; } } }",
    ".hoge-item { @media (width < 600px) { .hoge.mode-active & { color: red; } } }",
    ".c { &.mode-x { @media (width < 600px) { color: red; } } }",
    ".c { &:hover { @media (width < 600px) { color: red; } } }",
    ".c { @media (width < 600px) { color: red; &.mode-x { color: blue; } } }",
    ".c { @media (width < 600px) { @media (orientation: landscape) { &.mode-x { color: red; } } } }",
    ".c { @supports (display: grid) { color: red; } }",
    "@supports (display: grid) { .c { &.mode-x { color: red; } } }",
    "@keyframes c-enter { from { opacity: 0; } to { opacity: 1; } }"
  ].map((code) => ({ code })),
  reject: [
    ".a { .b & { .c & { color: red; } } }",
    ".a { @media (width < 600px) { .b & { .c & { color: red; } } } }",
    ".a { .b & { @media (width < 600px) { .c & { color: red; } } } }",
    ".a { @supports (display: grid) { .b & { color: red; } } }",
    ".a { .b & { @container (width < 600px) { color: red; } } }"
  ].map((code) => ({ code, message: messages.expected(1) }))
});

testRule({
  plugins, ruleName, config: 0,
  accept: [{ code: ".a { @media (width < 600px) { color: red; } }" }],
  reject: [{ code: ".a { &:hover { color: red; } }", message: messages.expected(0) }]
});

test("exports the registered plugin object", () => {
  expect(maxSelectorNestingDepth.ruleName).toBe(ruleName);
});


test.each([
  ["root container", "@container (width < 600px) { .a { &:hover { color: red; } } }", 0],
  ["blockless at-rule", ".a { .b & { @apply utility; } }", 0],
  ["nested supports", ".a { @supports (display: grid) { .b & { color: red; } } }", 1],
  ["nested container", ".a { .b & { @container (width < 600px) { color: red; } } }", 1]
])("non-media depth matches standard rule: %s", async (_name, code, expectedCount) => {
  for (const checkedRule of ["max-nesting-depth", ruleName]) {
    const result = await stylelint.lint({ code, config: { plugins, rules: { [checkedRule]: 1 } } });
    const warnings = result.results[0].warnings;
    expect(warnings).toHaveLength(expectedCount);
    for (const warning of warnings) {
      expect(warning.rule).toBe(checkedRule);
      expect(warning.text).toContain(checkedRule === ruleName ? "CSS-NEST-001" : "maximum 1");
    }
  }
});
