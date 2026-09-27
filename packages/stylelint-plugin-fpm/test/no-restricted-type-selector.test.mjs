import { getTypeSelectorViolations } from "../dist/utils.js";
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


testRule({
  plugins, ruleName, config: true,
  accept: [
    '.a:lang(ja)', '.a:lang(ja, en)', '.a:lang("ja")', '.a:LANG(ja)',
    '.a:is(:lang(ja), .b)', '.a:dir(rtl)', '.a:nth-child(odd)',
    '.a:nth-child(2n + 1 of .b)', '.a:nth-last-child(-n + 2 of .b, .c)',
    '.a:nth-of-type(2n)', '.a:nth-last-of-type(odd)', '.a:state(checked)',
    '.a::part(label)', '.a::highlight(foo)', '.a:has(> .b:lang(en))'
  ].map((selector) => ({ code: `${selector} { color: red; }` })),
  reject: [
    ['html:lang(ja)', 'html'], ['.a:is(div)', 'div'], ['.a:where(span)', 'span'],
    ['.a:not(p)', 'p'], ['.a:has(> span)', 'span'], ['.a:nth-child(2n of div)', 'div'],
    ['.a:nth-last-child(2n + 1 of .b, span)', 'span'],
    ['.a:nth-child(-n + 2 of :is(div, .b))', 'div'],
    ['.a:is(:nth-child(odd), span)', 'span'], ['.a ul', 'ul'],
    ...[':matches', ':-webkit-any', ':-moz-any', ':host', ':host-context', '::slotted']
      .map((pseudo) => [`.a${pseudo}(div)`, 'div'])
  ].map(([selector, tag]) => ({ code: `${selector} { color: red; }`, message: messages.rejected(tag) }))
});

testRule({
  plugins, ruleName, config: true,
  accept: [{ code: ".a:NTH-CHILD(2n+1 OF .b) { color: red; }" }],
  reject: [{
    code: ".a:not(:lang(ja) p) { color: red; }",
    message: messages.rejected("p")
  }, {
    code: ".a:nth-last-child(2n of div, span) { color: red; }",
    message: messages.rejected("div")
  }]
});


test("nth-last-child of-list analysis detects both types before the rule reports the first", () => {
  expect(getTypeSelectorViolations(".a:nth-last-child(2n of div, span)", [])).toEqual(["div", "span"]);
});
