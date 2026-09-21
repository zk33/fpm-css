import stylelint from "stylelint";
import type { Root } from "postcss";

import { getFilePrefix, hasFilePrefix } from "../../utils.js";

export const ruleName = "fpm/custom-property-file-prefix";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (property: string, filePrefix: string) =>
    `CSS-VAR-003: Expected custom property "${property}" to start with "--${filePrefix}".`
});

function getCustomPropertyName(property: string): string {
  return property.slice(2);
}

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

      const propertyName = getCustomPropertyName(declaration.prop);

      if (hasFilePrefix(propertyName, filePrefix)) {
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
