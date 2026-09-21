import stylelint from "stylelint";
import type { AtRule, Root } from "postcss";

import { getFilePrefix, hasFilePrefix } from "../../utils.js";

export const ruleName = "fpm/keyframes-file-prefix";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (name: string, filePrefix: string) =>
    `CSS-FILE-002: Expected @keyframes name "${name}" to start with "${filePrefix}".`
});

function getKeyframesName(atRule: AtRule): string {
  return atRule.params.trim().split(/\s+/)[0]?.replace(/^["']|["']$/g, "") ?? "";
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

    root.walkAtRules(/^(-[a-z]+-)?keyframes$/, (atRule) => {
      const name = getKeyframesName(atRule);

      if (!name || hasFilePrefix(name, filePrefix)) {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: atRule,
        message: messages.expected(name, filePrefix)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
