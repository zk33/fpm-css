import stylelint from "stylelint";
import type { Root } from "postcss";

import { declarationHasAncestorRule, everySubjectHasOwner, getFileBasename, getFilePrefix, selectorListHasRoot } from "../../utils.js";

export const ruleName = "fpm/global-var-contract";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (property: string) => `CSS-VAR-002: Expected "${property}" to have its base definition in _v.css :root or an override on the file-named class (_g.css: .g-*).`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    const filePrefix = getFilePrefix(root);
    const isGlobalFile = getFileBasename(root) === "_g.css";
    const isVariableFile = getFileBasename(root) === "_v.css";

    root.walkDecls(/^--v-/, (declaration) => {
      const isRootDefinition = declarationHasAncestorRule(declaration, (cssRule) => selectorListHasRoot(cssRule.selector));

      if (isVariableFile && isRootDefinition) {
        return;
      }

      let ownerRule = declaration.parent;
      while (ownerRule?.type === "atrule" && ownerRule.name.toLowerCase() === "media") {
        ownerRule = ownerRule.parent;
      }
      if (!isVariableFile && filePrefix && ownerRule?.type === "rule" &&
          everySubjectHasOwner(ownerRule, (name) => isGlobalFile ? name.startsWith("g-") : name === filePrefix)) {
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
