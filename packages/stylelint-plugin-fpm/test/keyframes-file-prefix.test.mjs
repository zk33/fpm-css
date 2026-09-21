import plugins, { keyframesFilePrefix } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/keyframes-file-prefix/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: "@keyframes header-fade-in { from { opacity: 0; } to { opacity: 1; } }",
      codeFilename: "/project/css/_header.css",
      description: "uses the file prefix from codeFilename"
    },
    {
      code: "@-webkit-keyframes header-fade-in { from { opacity: 0; } to { opacity: 1; } }",
      codeFilename: "/project/css/_header.css",
      description: "accepts vendor-prefixed keyframes"
    },
    {
      code: "@keyframes card-list-fade-in { from { opacity: 0; } to { opacity: 1; } }",
      codeFilename: "/project/css/_card-list.css",
      description: "uses the full hyphenated file stem as the file prefix"
    }
  ],

  reject: [
    {
      code: "@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }",
      codeFilename: "/project/css/_header.css",
      message: messages.expected("fade-in", "header"),
      line: 1,
      column: 1
    },
    {
      code: "@keyframes card-fade-in { from { opacity: 0; } to { opacity: 1; } }",
      codeFilename: "/project/css/_card-list.css",
      message: messages.expected("card-fade-in", "card-list"),
      line: 1,
      column: 1
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(keyframesFilePrefix.ruleName).toBe(ruleName);
});
