import plugins, { globalClassFile } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/global-class-file/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".g-btn { color: red; } .g-btn.mode-active { color: blue; }",
      codeFilename: "/project/css/_g.css",
      description: "defines global classes in _g.css"
    },
    {
      code: ":root { --v-color-text: #000; } @custom-media --v-screen-sm (width >= 40rem); @keyframes fade { from { opacity: 0; } to { opacity: 1; } }",
      codeFilename: "/project/css/_g.css",
      description: "ignores root, custom media, and keyframes content in _g.css"
    },
    {
      code: ".header { color: red; }",
      codeFilename: "/project/css/_header.css",
      description: "allows non-global classes outside _g.css"
    },
    {
      code: ".card { .g-btn { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a global class as a local class child subject"
    },
    {
      code: ".card { > .g-btn.mode-active, & .g-input:hover { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows compounded and combinator child subjects for global classes"
    },
    {
      code: ".g-modal .card-item { color: red; } .card:has(.g-btn) { color: blue; } .card:not(.g-hidden) { color: green; }",
      codeFilename: "/project/css/_card.css",
      description: "allows global classes used only as local subject context or pseudo arguments"
    },
    {
      code: ".card-item { .g-modal & { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a global class used only as a local child subject context"
    },
    {
      code: ".card { .g-btn & { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a global class used only as a nested local subject context"
    }
  ],

  reject: [
    {
      code: ".g-btn { color: red; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 1
    },
    {
      code: ".g-btn {}",
      codeFilename: "/project/css/_header.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 1
    },
    {
      code: ".g-btn { .special & { color: red; } }",
      codeFilename: "/project/css/_header.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 1
    },
    {
      code: ".g-btn { &.mode-active { color: red; } }",
      codeFilename: "/project/css/_header.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 1
    },
    {
      code: ".card .g-btn.mode-active { color: red; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 1
    },
    {
      code: ".card .g-btn { color: red; }",
      codeFilename: "/project/css/_header.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 1
    },
    {
      code: ".card { .card-body { .g-btn { color: red; } } }",
      codeFilename: "/project/css/_card.css",
      message: messages.expectedInGlobalFile("g-btn"),
      line: 1,
      column: 22
    },
    {
      code: ".header { color: red; }",
      codeFilename: "/project/css/_g.css",
      message: messages.expectedOnlyGlobalClass("header"),
      line: 1,
      column: 1
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(globalClassFile.ruleName).toBe(ruleName);
});
