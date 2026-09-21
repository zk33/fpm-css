import plugins, { modeClassCompound } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/mode-class-compound/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".button.mode-disabled { color: gray; }",
      description: "allows a mode class compounded with a target class"
    },
    {
      code: ".button { &.mode-disabled { color: gray; } }",
      description: "allows a mode class compounded with nesting"
    },
    {
      code: ".parent .button.mode-disabled { color: gray; }",
      description: "allows a compounded mode class after an ancestor"
    },
    {
      code: ".button.mode-primary.mode-disabled { color: gray; }",
      description: "allows multiple mode classes when a target class is present"
    },
    {
      code: ".button:not(.mode-active) { color: gray; }",
      description: "allows mode classes inside :not() when the outer compound has a target class"
    },
    {
      code: ".button:is(.mode-a, .mode-b) { color: gray; }",
      description: "allows mode classes inside :is() when the outer compound has a target class"
    }
  ],

  reject: [
    {
      code: ".mode-disabled { color: gray; }",
      message: messages.rejected("mode-disabled"),
      line: 1,
      column: 1
    },
    {
      code: ".parent .mode-disabled { color: gray; }",
      message: messages.rejected("mode-disabled"),
      line: 1,
      column: 1
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(modeClassCompound.ruleName).toBe(ruleName);
});
