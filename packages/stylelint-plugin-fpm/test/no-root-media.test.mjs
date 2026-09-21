import plugins, { noRootMedia } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/no-root-media/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".a { @media (--v-screen-xs) { color: green; } }",
      description: "allows media nested in a class rule"
    },
    {
      code: ":root { @media print { --v-color-text: #000; } }",
      description: "allows media nested in a non-class rule"
    },
    {
      code: "@custom-media --v-screen-xs (width <= 360px);",
      description: "allows custom media definitions at the CSS root"
    },
    {
      code: "@supports (display: grid) { @media (width <= 42rem) { .a { display: grid; } } }",
      description: "limits the check to direct children of the CSS root"
    },
    {
      code: "@keyframes a-fade { from { opacity: 0; } to { opacity: 1; } }",
      description: "does not inspect other at-rules"
    }
  ],

  reject: [
    {
      code: "@media (--v-screen-xs) { .a { color: green; } }",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "@media (max-width: 360px) { .a { color: green; } }",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "@media print { .a { display: none; } }",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: "@media (--v-screen-xs) { @media (--v-screen-sm) { .a { color: green; } } }",
      message: messages.rejected,
      line: 1,
      column: 1,
      description: "reports only the outer media query when nested media is not a root child"
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(noRootMedia.ruleName).toBe(ruleName);
});
