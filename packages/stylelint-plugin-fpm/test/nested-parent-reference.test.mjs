import plugins, { nestedParentReference } from "../dist/index.js";
import { messages, ruleName } from "../dist/rules/nested-parent-reference/index.js";

testRule({
  plugins,
  ruleName,
  config: true,

  accept: [
    {
      code: ".nav-item { .nav & { color: red; } }",
      description: "allows a child rule to reference its parent as the subject"
    },
    {
      code: ".nav-item { .nav.mode-alt & { color: red; } }",
      description: "allows a compounded parent context before the nesting selector"
    },
    {
      code: ".nav-item { &.mode-active { color: red; } &:hover { color: blue; } &::before { content: \"\"; } }",
      description: "allows existing state and pseudo-class self references"
    },
    {
      code: ".nav-item { .nav &, .nav-alt & { color: red; } }",
      description: "allows selector lists when every subject is the nesting selector"
    },
    {
      code: ".nav-item { & + & { margin-inline-start: 1rem; } }",
      description: "allows sibling self references"
    },
    {
      code: ".card { .g-btn { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a global class nested as a local class child subject"
    },
    {
      code: ".card { .g-btn.mode-active, .g-input:hover { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows global child subjects with compounded states and selector lists"
    },
    {
      code: ".card { > .g-btn { color: red; } }",
      codeFilename: "/project/css/_card.css",
      description: "allows a combinator-prefixed global child subject"
    },
    {
      code: ".g-btn { .g-icon & { color: red; } }",
      codeFilename: "/project/css/_g.css",
      description: "allows global-within-global nesting when the child references its parent"
    },
    {
      code: ".nav { color: red; @media (--v-screen-xs) { color: green; } }",
      description: "does not inspect at-rules without nested child rules"
    },
    {
      code: ".markdown { ul { margin: 0; } }",
      description: "leaves non-class subjects to the type selector rule"
    },
    {
      code: "@keyframes nav-fade { from { opacity: 0; } to { opacity: 1; } }",
      description: "does not inspect keyframes rules"
    }
  ],

  reject: [
    {
      code: ".nav-list { .nav-list-item { color: red; } }",
      message: messages.rejected("nav-list-item"),
      line: 1,
      column: 13
    },
    {
      code: ".nav-list { &.mode-alt .nav-list-item { color: red; } }",
      message: messages.rejected("nav-list-item"),
      line: 1,
      column: 13
    },
    {
      code: ".nav-list { & .nav-list-link { color: red; } }",
      message: messages.rejected("nav-list-link"),
      line: 1,
      column: 13
    },
    {
      code: ".nav-list { > .nav-list-link { color: red; } }",
      message: messages.rejected("nav-list-link"),
      line: 1,
      column: 13
    },
    {
      code: ".nav-list { & + .nav-list-sibling { color: red; } }",
      message: messages.rejected("nav-list-sibling"),
      line: 1,
      column: 13
    },
    {
      code: ".nav-list { .nav-list-link &, .nav-list-link { color: red; } }",
      message: messages.rejected("nav-list-link"),
      line: 1,
      column: 13
    },
    {
      code: ".nav-list { @media (--v-screen-xs) { .nav-list-item { color: red; } } }",
      message: messages.rejected("nav-list-item"),
      line: 1,
      column: 38
    },
    {
      code: ".card { .g-btn .card-item { color: red; } }",
      codeFilename: "/project/css/_card.css",
      message: messages.rejected("card-item"),
      line: 1,
      column: 9
    },
    {
      code: ".card { .g-btn, .card-item { color: red; } }",
      codeFilename: "/project/css/_card.css",
      message: messages.rejected("card-item"),
      line: 1,
      column: 9
    },
    {
      code: ".g-btn { .g-icon { color: red; } }",
      codeFilename: "/project/css/_g.css",
      message: messages.rejected("g-icon"),
      line: 1,
      column: 10
    },
    {
      code: ".card { .card-list:has(&) { color: red; } }",
      message: messages.rejected("card-list"),
      line: 1,
      column: 9
    }
  ]
});

test("exports the registered plugin object", () => {
  expect(nestedParentReference.ruleName).toBe(ruleName);
});
