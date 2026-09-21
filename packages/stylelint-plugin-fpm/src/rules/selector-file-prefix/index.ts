import stylelint from "stylelint";
import type { Root } from "postcss";

import { getFilePrefix, getResolvedSubjectClassNames, hasAnyPrefix, hasFilePrefix, matchesAnyFilePattern } from "../../utils.js";

export const ruleName = "fpm/selector-file-prefix";

const defaultIgnoreFiles = ["**/_g.css", "**/_v.css", "**/reset*.css", "**/vendor/**", "**/generated/**", "**/index.css"];
const defaultIgnoreClassPrefixes = ["g-", "x-", "mode-"];

type Options = {
  ignoreFiles?: string[];
  ignoreClassPrefixes?: string[];
};

export const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (className: string, filePrefix: string) =>
    `CSS-FILE-001: Expected .${className} to start with the file prefix "${filePrefix}".`
});

const rule: stylelint.Rule<boolean, Options> = (primary, secondaryOptions = {}) => {
  return (root: Root, result) => {
    if (primary !== true) {
      return;
    }

    const ignoreFiles = secondaryOptions.ignoreFiles ?? defaultIgnoreFiles;

    if (matchesAnyFilePattern(root, ignoreFiles)) {
      return;
    }

    const filePrefix = getFilePrefix(root);

    if (!filePrefix) {
      return;
    }

    const ignoreClassPrefixes = secondaryOptions.ignoreClassPrefixes ?? defaultIgnoreClassPrefixes;

    root.walkRules((cssRule) => {
      const rejectedClass = getResolvedSubjectClassNames(cssRule).find((className) => {
        if (hasAnyPrefix(className, ignoreClassPrefixes)) {
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
        message: messages.expected(rejectedClass, filePrefix)
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
