import stylelint from "stylelint";

test.each(["fpm/spike-rule", "plugin/fpm/spike-rule"])(
  "Stylelint accepts the custom rule name %s",
  async (ruleName) => {
    const plugin = stylelint.createPlugin(ruleName, () => (root, result) => {
      stylelint.utils.report({
        ruleName,
        result,
        node: root,
        message: `${ruleName}: file=${root.source.input.file}`
      });
    });

    const lintResult = await stylelint.lint({
      code: ".header { color: red; }",
      codeFilename: "/project/css/_header.css",
      config: {
        plugins: [plugin],
        rules: { [ruleName]: true }
      }
    });

    expect(lintResult.results[0].warnings).toHaveLength(1);
    expect(lintResult.results[0].warnings[0].text).toContain("file=/project/css/_header.css");
  }
);
