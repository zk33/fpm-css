import stylelint from "stylelint";
import type { Root, Rule } from "postcss";

import {
  getFileBasename,
  getResolvedSubjectClassNames,
  getRuleAncestors,
  getSubjectClassNamesFromSelectorList,
  isInsideKeyframes,
  ruleHasOwnDeclarations,
} from "../../utils.js";

export const ruleName = "fpm/global-class-file";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expectedInGlobalFile: (className: string) => `CSS-PREFIX-001: Expected .${className} to be defined only in _g.css.`,
  expectedOnlyGlobalClass: (className: string) => `CSS-PREFIX-001: Expected _g.css to define only .g-* classes, not .${className}.`
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    const isGlobalFile = getFileBasename(root) === "_g.css";

    root.walkRules((cssRule) => {
      if (isInsideKeyframes(cssRule)) {
        return;
      }

      if (!isGlobalFile) {
        const globalClass = getSubjectClassNamesFromSelectorList(cssRule.selector).find((className) => className.startsWith("g-"));

        if (!globalClass || isAllowedNestedGlobalChild(cssRule)) {
          return;
        }

        stylelint.utils.report({
          ruleName,
          result,
          node: cssRule,
          message: messages.expectedInGlobalFile(globalClass)
        });
        return;
      }

      if (!ruleHasOwnDeclarations(cssRule)) {
        return;
      }

      const subjectClassNames = getSubjectClassNamesFromSelectorList(cssRule.selector);

      const localClass = subjectClassNames.find((className) => !className.startsWith("g-") && !className.startsWith("mode-"));

      if (!localClass) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: cssRule,
        message: messages.expectedOnlyGlobalClass(localClass)
      });
    });
  };
};

function isAllowedNestedGlobalChild(cssRule: Rule): boolean {
  const ruleAncestors = getRuleAncestors(cssRule);

  if (ruleAncestors.length !== 1) {
    return false;
  }

  return getResolvedSubjectClassNames(ruleAncestors[0]).some(
    (className) => !className.startsWith("g-") && !className.startsWith("mode-"),
  );
}

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
