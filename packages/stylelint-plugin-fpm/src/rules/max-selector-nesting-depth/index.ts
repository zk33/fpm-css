import stylelint from "stylelint";
import type { AtRule, Root, Rule } from "postcss";

export const ruleName = "fpm/max-selector-nesting-depth";
export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (depth: number) => `CSS-NEST-001: Expected nesting depth of at most ${depth}, excluding @media.`
});

const rule: stylelint.Rule<number> = (primary) => (root: Root, result) => {
  if (!stylelint.utils.validateOptions(result, ruleName, {
    actual: primary,
    possible: (value) => typeof value === "number" && Number.isInteger(value) && value >= 0
  })) {
    return;
  }

  function check(statement: Rule | AtRule): void {
    if (!statement.nodes) {
      return;
    }
    let depth = 0;
    let current: Rule | AtRule = statement;
    while (current.parent && current.parent.type !== "root") {
      const parent = current.parent;
      if (parent.type === "atrule" && parent.parent?.type === "root") {
        break;
      }
      if (current.type !== "atrule" || current.name.toLowerCase() !== "media") {
        depth += 1;
      }
      if (parent.type !== "rule" && parent.type !== "atrule") {
        break;
      }
      current = parent;
    }
    if (depth > primary) {
      stylelint.utils.report({ ruleName, result, node: statement, message: messages.expected(primary) });
    }
  }

  root.walkRules(check);
  root.walkAtRules(check);
};

rule.ruleName = ruleName;
rule.messages = messages;
export default stylelint.createPlugin(ruleName, rule);
