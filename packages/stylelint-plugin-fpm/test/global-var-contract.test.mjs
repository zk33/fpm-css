import plugins, { globalVarContract } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/global-var-contract/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ":root { --v-color-text: #000; }",
      codeFilename: "/project/css/_v.css",
      description: "defines --v variables in _v.css :root"
    },
    {
      code: ":root, .theme-dark { --v-color-text: #000; }",
      codeFilename: "/project/css/_v.css",
      description: "allows selector lists that include :root in _v.css"
    },
    {
      code: ".header { color: var(--v-color-text); }",
      codeFilename: "/project/css/_header.css",
      description: "ignores var(--v-*) references"
    }
  ],

  reject: [
    {
      code: ":root { --v-color-text: #000; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expected("--v-color-text"),
      line: 1,
      column: 9
    },
    {
      code: ".header { --v-color-text: #000; }",
      codeFilename: "/project/css/_v.css",
      message: messages.expected("--v-color-text"),
      line: 1,
      column: 11
    },
    {
      code: ".theme-dark { --v-color-text: #000; }",
      codeFilename: "/project/css/_v.css",
      message: messages.expected("--v-color-text"),
      line: 1,
      column: 15
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(globalVarContract.ruleName).toBe(ruleName);
});
