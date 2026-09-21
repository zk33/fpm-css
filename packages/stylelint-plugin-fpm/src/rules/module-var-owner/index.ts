import stylelint from "stylelint";
import type { Root } from "postcss";

import { declarationHasAncestorRule, getFilePrefix, selectorHasClass } from "../../utils.js";

export const ruleName = "fpm/module-var-owner";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (property: string, filePrefix: string) =>
    `CSS-VAR-004: Expected "${property}" to be defined inside .${filePrefix}.`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    const filePrefix = getFilePrefix(root);

    if (!filePrefix) {
      return;
    }

    root.walkDecls(/^--/, (declaration) => {
      if (declaration.prop.startsWith("--v-")) {
        return;
      }

      const isOwnedByModule = declarationHasAncestorRule(declaration, (cssRule) => selectorHasClass(cssRule.selector, filePrefix));

      if (isOwnedByModule) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: declaration,
        message: messages.expected(declaration.prop, filePrefix)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
