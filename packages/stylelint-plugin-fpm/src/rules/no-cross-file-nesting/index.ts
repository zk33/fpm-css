import stylelint from "stylelint";
import type { Root } from "postcss";

import { getFilePrefix, getResolvedSubjectClassNames, hasFilePrefix } from "../../utils.js";

export const ruleName = "fpm/no-cross-file-nesting";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (className: string, filePrefix: string) =>
    `CSS-NEST-002: Expected nested .${className} override to target .g-* or the current file prefix "${filePrefix}".`
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

    root.walkRules((cssRule) => {
      if (cssRule.parent?.type !== "rule") {
        return;
      }

      const rejectedClass = getResolvedSubjectClassNames(cssRule).find((className) => {
        if (className.startsWith("mode-") || className.startsWith("g-")) {
          return false;
        }

        return !hasFilePrefix(className, filePrefix);
      });

      if (!rejectedClass) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: cssRule,
        message: messages.rejected(rejectedClass, filePrefix)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
