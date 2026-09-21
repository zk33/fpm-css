import plugins, { customPropertyFilePrefix } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/custom-property-file-prefix/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".header { --header-color-text: #000; }",
      codeFilename: "/project/css/_header.css",
      description: "uses the file prefix from codeFilename"
    },
    {
      code: ":root { --v-color-text: #000; }",
      codeFilename: "/project/css/_header.css",
      description: "ignores global --v custom properties"
    },
    {
      code: ".card-list { --card-list-color-text: #000; }",
      codeFilename: "/project/css/_card-list.css",
      description: "uses the full hyphenated file stem as the file prefix"
    }
  ],

  reject: [
    {
      code: ".header { --color-of-header: #000; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expected("--color-of-header", "header"),
      line: 1,
      column: 11
    },
    {
      code: ".card-list { --card-color-text: #000; }",
      codeFilename: "/project/css/_card-list.css",
      message: messages.expected("--card-color-text", "card-list"),
      line: 1,
      column: 14
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(customPropertyFilePrefix.ruleName).toBe(ruleName);
});
