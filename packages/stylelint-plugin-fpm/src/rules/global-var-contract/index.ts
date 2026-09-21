import stylelint from "stylelint";
import type { Root } from "postcss";

import { declarationHasAncestorRule, getFileBasename, selectorListHasRoot } from "../../utils.js";

export const ruleName = "fpm/global-var-contract";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (property: string) => `CSS-VAR-002: Expected "${property}" to be defined only in _v.css :root.`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    const isVariableFile = getFileBasename(root) === "_v.css";

    root.walkDecls(/^--v-/, (declaration) => {
      const isRootDefinition = declarationHasAncestorRule(declaration, (cssRule) => selectorListHasRoot(cssRule.selector));

      if (isVariableFile && isRootDefinition) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: declaration,
        message: messages.expected(declaration.prop)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
