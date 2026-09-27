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

const overrideCases = [
  ["header", ".header"],
  ["header", ".header.mode-dark"],
  ["header", ".header:lang(ja)"],
  ["header", ".context .header"],
  ["header", ".header, .header.mode-dark"],
  ["g", ".g-theme"],
  ["g", ":root.g-reader-prefs"],
  ["g", ":root.g-reader-prefs:lang(ja)"],
  ["g", ":root.g-reader-prefs.mode-reader-tone-sans"]
];

testRule({
  plugins, ruleName, config: true,
  accept: [
    ...overrideCases.map(([file, selector]) => ({
      code: `${selector} { --v-color-text: red; }`,
      codeFilename: `/project/css/_${file}.css`
    })),
    ...[
      ".header { &.mode-dark { --v-x: 1; } }",
      ".header { @media (width < 600px) { --v-x: 1; } }",
      ".header { @media (width < 600px) { &.mode-dark { --v-x: 1; } } }",
      ".header { .header-context & { @media (width < 600px) { --v-x: 1; } } }"
    ].map((code) => ({ code, codeFilename: "/project/css/_header.css" }))
  ],
  reject: [
    ["header", ":root"], ["header", ".header-nav"], ["header", ".g-btn"],
    ["header", ".header .foo"], ["header", ".header, .foo"],
    ["header", ":not(.header)"], ["header", ":is(.header)"],
    ["g", ":root"], ["g", ".g-theme .other"], ["g", ".g-theme, .other"],
    ["v", ".theme-dark"]
  ].map(([file, selector]) => ({
    code: `${selector} { --v-x: 1; }`, codeFilename: `/project/css/_${file}.css`,
    message: messages.expected("--v-x")
  })).concat([
    ".header { .header-nav { --v-x: 1; } }",
    ".header, .foo { @media (width < 600px) { &.mode-dark { --v-x: 1; } } }",
    ".header { & .header-nav { --v-x: 1; } }"
  ].map((code) => ({ code, codeFilename: "/project/css/_header.css", message: messages.expected("--v-x") })))
});
