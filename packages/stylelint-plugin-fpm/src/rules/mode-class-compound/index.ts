import stylelint from "stylelint";
import type { Root } from "postcss";

import { getModeClassViolations } from "../../utils.js";

export const ruleName = "fpm/mode-class-compound";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (className: string) =>
    `CSS-PREFIX-004: Expected .${className} to be compounded with a target class or nesting selector.`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    root.walkRules((cssRule) => {
      const rejectedClass = getModeClassViolations(cssRule.selector)[0];

      if (!rejectedClass) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: cssRule,
        message: messages.rejected(rejectedClass)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
