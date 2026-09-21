import stylelint from "stylelint";
import type { Root } from "postcss";

import { getFileBasename, getNestedSubjectClassNames, hasRuleAncestor, isInsideKeyframes } from "../../utils.js";

export const ruleName = "fpm/nested-parent-reference";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (className: string) =>
    `CSS-NEST-003: Expected nested .${className} to reference its parent with "&" as its subject.`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    root.walkRules((cssRule) => {
      if (!hasRuleAncestor(cssRule) || isInsideKeyframes(cssRule)) {
        return;
      }

      const nestedClass = getNestedSubjectClassNames(cssRule.selector, getFileBasename(root) !== "_g.css")[0];

      if (!nestedClass) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: cssRule,
        message: messages.rejected(nestedClass)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
