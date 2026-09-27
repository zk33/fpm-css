import stylelint from "stylelint";
import { fileURLToPath } from "node:url";

const configFile = fileURLToPath(new URL("../../stylelint-config-fpm/index.cjs", import.meta.url));
const codeFilename = "/project/css/_hoge.css";
const lint = (code) => stylelint.lint({ code, codeFilename, configFile });

test.each([
  `.hoge-item {
  .hoge.mode-active & {
    @media (width < 600px) {
      color: red;
    }
  }
}
`,
  `.hoge-item {
  @media (width < 600px) {
    .hoge.mode-active & {
      color: red;
    }
  }
}
`,
  `.hoge {
  @media (width < 600px) {
    .g-btn {
      color: red;
    }
  }
}
`
])("shared config accepts media and one selector level: %s", async (code) => {
  const result = await lint(code);
  expect(result.results[0].warnings).toEqual([]);
});

test("shared config preserves the ban on root media", async () => {
  const result = await lint(`@media (width < 600px) {
  .hoge {
    color: red;
  }
}
`);
  expect(result.results[0].warnings.map(({ rule }) => rule)).toContain("fpm/no-root-media");
  expect(result.results[0].warnings.map(({ rule }) => rule)).not.toContain("max-nesting-depth");
});

test("shared config detects depth and ownership through media", async () => {
  const result = await lint(`.hoge {
  @media (width < 600px) {
    .header-nav {
      .header-context & {
        color: red;
      }
    }
  }
}
`);
  const rules = result.results[0].warnings.map(({ rule }) => rule);
  expect(rules).toContain("fpm/max-selector-nesting-depth");
  expect(rules).toContain("fpm/no-cross-file-nesting");
  expect(rules).toContain("fpm/nested-parent-reference");
  expect(rules).not.toContain("max-nesting-depth");
});

// Each input runs against the complete shared config, without disabling other rules.
test.each([
  ["mode before media", `.c {
  &.mode-x {
    @media (width < 600px) {
      color: red;
    }
  }
}\n`],
  ["hover before media", `.c {
  &:hover {
    @media (width < 600px) {
      color: red;
    }
  }
}\n`],
  ["declarations and mode inside media", `.c {
  @media (width < 600px) {
    color: red;

    &.mode-x {
      color: blue;
    }
  }
}\n`],
  ["two media ancestors", `.c {
  @media (width < 600px) {
    @media (orientation: landscape) {
      &.mode-x {
        color: red;
      }
    }
  }
}\n`]
])("shared config accepts %s", async (_name, code) => {
  const result = await stylelint.lint({ code, codeFilename: "/project/css/_c.css", configFile });
  expect(result.results[0].warnings).toEqual([]);
});

test.each([
  ["depth only", `.a {
  @media (width < 600px) {
    .a-b & {
      .a-c & {
        color: red;
      }
    }
  }
}\n`, "a", ["fpm/max-selector-nesting-depth"], "CSS-NEST-001"],
  ["foreign child ownership", `.card {
  @media (width < 600px) {
    .header-nav {
      color: red;
    }
  }
}\n`, "card", ["fpm/selector-file-prefix", "fpm/no-cross-file-nesting", "fpm/nested-parent-reference"], "header-nav"],
  ["local child without parent reference", `.card {
  @media (width < 600px) {
    .card-nav {
      color: red;
    }
  }
}\n`, "card", ["fpm/nested-parent-reference"], "card-nav"]
])("shared config rejects %s independently", async (_name, code, file, expectedRules, token) => {
  const result = await stylelint.lint({ code, codeFilename: `/project/css/_${file}.css`, configFile });
  const warnings = result.results[0].warnings;
  expect(warnings.map(({ rule }) => rule).sort()).toEqual([...expectedRules].sort());
  for (const warning of warnings) expect(warning.text).toContain(token);
});

test.each([
  ["header", ".header.mode-dark:lang(ja)", []],
  ["g", ":root.g-reader-prefs.mode-dark:lang(ja)", []],
  ["header", ".header-nav:lang(ja)", ["fpm/global-var-contract"]]
])("shared config checks global override subject %s/%s with lang", async (file, selector, expectedRules) => {
  const result = await stylelint.lint({
    code: `${selector} {\n  --v-color-text: red;\n}\n`,
    codeFilename: `/project/css/_${file}.css`, configFile
  });
  const warnings = result.results[0].warnings;
  expect(warnings.map(({ rule }) => rule)).toEqual(expectedRules);
  for (const warning of warnings) expect(warning.text).toContain("--v-color-text");
});
