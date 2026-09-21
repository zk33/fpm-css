import stylelint from "stylelint";
import type { Root } from "postcss";

export const ruleName = "fpm/no-root-media";

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: "CSS-RESP-002: Unexpected @media at the CSS file root. Nest it inside the target class rule."
});

const rule: stylelint.Rule<boolean> = (primary) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    root.walkAtRules((atRule) => {
      if (atRule.name.toLowerCase() !== "media" || atRule.parent?.type !== "root") {
        return;
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: atRule,
        message: messages.rejected
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
