import plugins, { noCrossFileNesting } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/no-cross-file-nesting/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".card { .card-alt & { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows nested overrides for the current file prefix"
    },
    {
      code: ".card { .g-btn { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a global class nested as a local class child subject"
    },
    {
      code: ".card { .g-btn.mode-active { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a compounded global class child subject"
    },
    {
      code: ".card { &.mode-active { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "leaves mode-only nested selectors to mode-class-compound"
    },
    {
      code: ".card-list { .card-list-alt & { color: red; } }",
      codeFilename: "/project/css/_card-list.css",
      description: "uses the full hyphenated file stem as the file prefix"
    }
  ],

  reject: [
    {
      code: ".card { .header-nav { color: red; } }",
      codeFilename: "/project/css/_card.css",
      message: messages.rejected("header-nav", "card"),
      line: 1,
      column: 9
    },
    {
      code: ".card-list { .card-alt { color: red; } }",
      codeFilename: "/project/css/_card-list.css",
      message: messages.rejected("card-alt", "card-list"),
      line: 1,
      column: 14
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(noCrossFileNesting.ruleName).toBe(ruleName);
});
