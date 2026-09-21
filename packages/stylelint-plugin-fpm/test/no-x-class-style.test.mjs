import plugins, { noXClassStyle } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/no-x-class-style/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".button { color: red; }",
      description: "styles a non x-prefixed class"
    },
    {
      code: ".x-hook {}",
      description: "does not report an empty x-prefixed selector"
    },
    {
      code: ".foo:not(.x-bar) { color: red; }",
      description: "does not treat x-prefixed classes inside :not() as the styled subject"
    },
    {
      code: ".foo:is(.x-bar) { color: red; }",
      description: "does not expand :is() contents for subject detection"
    },
    {
      code: ".foo:where(.x-bar) { color: red; }",
      description: "does not expand :where() contents for subject detection"
    },
    {
      code: ".x-modal .title { color: red; }",
      description: "allows x-prefixed classes as an ancestor scope"
    },
    {
      code: ".x-hook { .button { color: red; } }",
      description: "does not count declarations inside nested child rules as styling the x-prefixed subject"
    }
  ],

  reject: [
    {
      code: ".x-hook { color: red; }",
      message: messages.rejected("x-hook"),
      line: 1,
      column: 1
    },
    {
      code: ".button, .x-hook { color: red; }",
      message: messages.rejected("x-hook"),
      line: 1,
      column: 1
    },
    {
      code: ".x-hook, .button { color: red; }",
      message: messages.rejected("x-hook"),
      line: 1,
      column: 1
    },
    {
      code: ".x-hook { @media (width >= 40rem) { color: red; } }",
      message: messages.rejected("x-hook"),
      line: 1,
      column: 1
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(noXClassStyle.ruleName).toBe(ruleName);
});
