import plugins, { moduleVarOwner } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/module-var-owner/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".header { --header-color-text: #000; }",
      codeFilename: "/project/css/_header.css",
      description: "defines module variables in the same-named class"
    },
    {
      code: ".header { .header-title { --header-color-text: #000; } }",
      codeFilename: "/project/css/_header.css",
      description: "allows nested declarations owned by an ancestor same-named class"
    },
    {
      code: ".header { color: var(--v-color-text); }",
      codeFilename: "/project/css/_header.css",
      description: "ignores --v references"
    },
    {
      code: ".header { --v-header-height: 30px; }",
      codeFilename: "/project/css/_header.css",
      description: "leaves --v definitions to global-var-contract"
    }
  ],

  reject: [
    {
      code: ":root { --header-color-text: #000; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expected("--header-color-text", "header"),
      line: 1,
      column: 9
    },
    {
      code: ".header-title { --header-color-text: #000; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expected("--header-color-text", "header"),
      line: 1,
      column: 17
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(moduleVarOwner.ruleName).toBe(ruleName);
});
