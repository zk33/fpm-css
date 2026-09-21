import stylelint from "stylelint";
import type { Root } from "postcss";

import { getTypeSelectorViolations, isInsideKeyframes, matchesAnyFilePattern, ruleHasOwnDeclarations } from "../../utils.js";

export const ruleName = "fpm/no-restricted-type-selector";

const defaultIgnoreFiles = ["**/reset*.css", "**/vendor/**", "**/generated/**"];

type Options = {
  ignoreFiles?: string[];
  allowedParentClasses?: string[];
};

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (selector: string) => `CSS-PROHIBIT-002: Unexpected type selector "${selector}" outside an allowed parent class.`
});

const rule: stylelint.Rule<boolean, Options> = (primary, secondaryOptions = {}) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    if (matchesAnyFilePattern(root, secondaryOptions.ignoreFiles ?? defaultIgnoreFiles)) {
      return;
    }

    const allowedParentClasses = secondaryOptions.allowedParentClasses ?? [];

    root.walkRules((cssRule) => {
      if (!ruleHasOwnDeclarations(cssRule) || isInsideKeyframes(cssRule)) {
        return;
      }

      const rejectedType = getTypeSelectorViolations(cssRule.selector, allowedParentClasses)[0];

      if (!rejectedType) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: cssRule,
        message: messages.rejected(rejectedType)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
