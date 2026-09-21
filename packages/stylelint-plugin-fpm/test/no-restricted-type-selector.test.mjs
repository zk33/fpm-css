import plugins, { noRestrictedTypeSelector } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/no-restricted-type-selector/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".list { color: red; }",
      description: "allows class selectors"
    },
    {
      code: "html { box-sizing: border-box; }",
      codeFilename: "/project/css/reset.css",
      description: "ignores configured reset files"
    }
  ],

  reject: [
    {
      code: "ul { margin: 0; }",
      message: messages.rejected("ul"),
      line: 1,
      column: 1
    },
    {
      code: ".some-class ul { margin: 0; }",
      message: messages.rejected("ul"),
      line: 1,
      column: 1
    },
    {
      code: "ul.some-class li { margin: 0; }",
      message: messages.rejected("ul"),
      line: 1,
      column: 1
    }
  ]
});

testRule({
  plugins,
  ruleName,
  config: [true, { allowedParentClasses: ["markdown"] }],

  accept: [
    {
      code: ".markdown ul { margin: 0; }",
      description: "allows type selectors under an allowed parent class"
    }
  ],

  reject: [
    {
      code: ".article ul { margin: 0; }",
      message: messages.rejected("ul"),
      line: 1,
      column: 1
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(noRestrictedTypeSelector.ruleName).toBe(ruleName);
});
