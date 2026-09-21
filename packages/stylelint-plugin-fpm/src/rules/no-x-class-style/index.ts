import stylelint from "stylelint";
import type { Root } from "postcss";

import { getSubjectXClassNames, ruleHasOwnDeclarations } from "../../utils.js";

export const ruleName = "fpm/no-x-class-style";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (className: string) =>
    `CSS-PREFIX-002: Expected .${className} to be used only as a JS hook, not as a styled selector.`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    root.walkRules((cssRule) => {
      const xClass = getSubjectXClassNames(cssRule.selector)[0];

      if (!xClass || !ruleHasOwnDeclarations(cssRule)) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: cssRule,
        message: messages.rejected(xClass)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
