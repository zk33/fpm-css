import plugins, { selectorFilePrefix } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/selector-file-prefix/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".header { color: red; } .header-logo { color: blue; }",
      codeFilename: "/project/css/_header.css",
      description: "accepts classes matching the file prefix"
    },
    {
      code: ".card-list { color: red; } .card-list-item { color: blue; }",
      codeFilename: "/project/css/_card-list.css",
      description: "uses the full hyphenated file stem as the file prefix"
    },
    {
      code: ".anything { color: red; }",
      codeFilename: "/project/css/_g.css",
      description: "ignores configured global files"
    },
    {
      code: ".anything { color: red; }",
      codeFilename: "/project/css/vendor/widget.css",
      description: "ignores configured vendor files"
    },
    {
      code: ".g-btn { color: red; } .x-hook { color: blue; } .mode-active { color: green; }",
      codeFilename: "/project/css/_header.css",
      description: "ignores configured class prefixes"
    },
    {
      code: ".card { .g-btn { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "ignores a global class nested as a local class child subject"
    }
  ],

  reject: [
    {
      code: ".my-awesome-header { color: red; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expected("my-awesome-header", "header"),
      line: 1,
      column: 1
    },
    {
      code: ".card-item { color: red; }",
      codeFilename: "/project/css/_card-list.css",
      message: messages.expected("card-item", "card-list"),
      line: 1,
      column: 1
    },
    {
      code: ".card { .header-nav { color: red; } }",
      codeFilename: "/project/css/_card.css",
      message: messages.expected("header-nav", "card"),
      line: 1,
      column: 9
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(selectorFilePrefix.ruleName).toBe(ruleName);
});
