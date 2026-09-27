import path from "node:path";

import selectorParser from "postcss-selector-parser";
import type { AtRule, Declaration, Root, Rule } from "postcss";
import type { Container, Node as SelectorNode, Selector } from "postcss-selector-parser";

type PostcssAncestor = {
  name?: string;
  parent?: PostcssAncestor;
  type: string;
};

export function getFilePrefix(root: Root): string | undefined {
  const file = root.source?.input.file;

  if (!file) {
    return undefined;
  }

  const extension = path.extname(file);
  const basename = path.basename(file, extension);

  return basename.replace(/^_/, "");
}

export function getFileBasename(root: Root): string | undefined {
  const file = root.source?.input.file;

  if (!file) {
    return undefined;
  }

  return path.basename(file);
}

export function hasFilePrefix(name: string, filePrefix: string): boolean {
  return name === filePrefix || name.startsWith(`${filePrefix}-`);
}

export function hasAnyPrefix(name: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => name.startsWith(prefix));
}

export function matchesAnyFilePattern(root: Root, patterns: string[]): boolean {
  const file = root.source?.input.file;

  if (!file) {
    return false;
  }

  const normalizedFile = normalizePath(file);

  return patterns.some((pattern) => globToRegExp(normalizePath(pattern)).test(normalizedFile));
}

export function getClassNames(selector: string): string[] {
  const classNames: string[] = [];

  try {
    selectorParser((root) => {
      root.walkClasses((classNode) => {
        classNames.push(classNode.value);
      });
    }).processSync(selector);
  } catch {
    return [];
  }

  return classNames;
}

export function selectorHasClass(selector: string, className: string): boolean {
  return getClassNames(selector).includes(className);
}

export function getResolvedSubjectClassNames(rule: Rule): string[] {
  const subjectClassNames: string[] = [];

  try {
    selectorParser((root) => {
      root.each((selectorNode) => {
        subjectClassNames.push(...getResolvedSubjectClassNamesFromSelector(selectorNode, rule));
      });
    }).processSync(rule.selector);
  } catch {
    return [];
  }

  return subjectClassNames;
}

export function getSubjectClassNamesFromSelectorList(selector: string): string[] {
  const subjectClassNames: string[] = [];

  try {
    selectorParser((root) => {
      root.each((selectorNode) => {
        subjectClassNames.push(...getSubjectClassNames(selectorNode));
      });
    }).processSync(selector);
  } catch {
    return [];
  }

  return subjectClassNames;
}

export function getNestedSubjectClassNames(selector: string, ignoreGlobalChildSubject = false): string[] {
  const subjectClassNames: string[] = [];

  try {
    selectorParser((root) => {
      root.each((selectorNode) => {
        const subjectNodes = getSubjectNodes(selectorNode);

        if (subjectNodes.some((node) => node.type === "nesting")) {
          return;
        }

        const classNames = subjectNodes
          .filter((node): node is SelectorNode & { type: "class"; value: string } => node.type === "class")
          .map((node) => node.value);
        const hasGlobalChildSubject = classNames.some((className) => className.startsWith("g-"));

        subjectClassNames.push(
          ...(ignoreGlobalChildSubject && hasGlobalChildSubject
            ? classNames.filter((className) => !className.startsWith("g-") && !className.startsWith("mode-"))
            : classNames),
        );
      });
    }).processSync(selector);
  } catch {
    return [];
  }

  return subjectClassNames;
}

export function getSubjectXClassNames(selector: string): string[] {
  const subjectXClassNames: string[] = [];

  try {
    selectorParser((root) => {
      root.each((selectorNode) => {
        subjectXClassNames.push(...getSubjectClassNames(selectorNode).filter((className) => className.startsWith("x-")));
      });
    }).processSync(selector);
  } catch {
    return [];
  }

  return subjectXClassNames;
}

export function getModeClassViolations(selector: string): string[] {
  const violations: string[] = [];

  try {
    selectorParser((root) => {
      root.walkClasses((classNode) => {
        if (!classNode.value.startsWith("mode-")) {
          return;
        }

        if (!isModeClassCompounded(classNode)) {
          violations.push(classNode.value);
        }
      });
    }).processSync(selector);
  } catch {
    return [];
  }

  return violations;
}

export function selectorListHasRoot(selector: string): boolean {
  try {
    let hasRoot = false;

    selectorParser((root) => {
      root.each((selectorNode) => {
        if (selectorNode.nodes.some((node) => node.type === "pseudo" && node.value === ":root")) {
          hasRoot = true;
        }
      });
    }).processSync(selector);

    return hasRoot;
  } catch {
    return false;
  }
}

export function getTypeSelectorViolations(selector: string, allowedParentClasses: string[]): string[] {
  const violations: string[] = [];

  try {
    selectorParser((root) => {
      root.walkTags((tagNode) => {
        if (isTypeSelectorPosition(tagNode) && !hasAllowedClassBeforeNode(tagNode, allowedParentClasses)) {
          violations.push(tagNode.value);
        }
      });
    }).processSync(selector);
  } catch {
    return [];
  }

  return violations;
}

const selectorArgumentPseudos = new Set([
  ":is", ":where", ":not", ":has", ":matches", ":-webkit-any", ":-moz-any",
  ":host", ":host-context", "::slotted"
]);

function isTypeSelectorPosition(node: SelectorNode): boolean {
  let child = node;
  let parent = node.parent as SelectorNode | undefined;

  while (parent) {
    if (parent.type === "pseudo") {
      const name = parent.value.toLowerCase();
      if (name === ":nth-child" || name === ":nth-last-child") {
        const firstSelector = parent.nodes?.[0];
        const ofNode = firstSelector?.nodes.find((candidate) =>
          candidate.type === "tag" && candidate.value.toLowerCase() === "of");
        if (!ofNode || node.sourceIndex <= ofNode.sourceIndex) {
          return false;
        }
      } else if (!selectorArgumentPseudos.has(name)) {
        return false;
      }
    }
    child = parent;
    parent = child.parent as SelectorNode | undefined;
  }
  return true;
}

export function getParentRuleThroughMedia(rule: Rule): Rule | undefined {
  let parent = rule.parent;
  while (parent?.type === "atrule" && parent.name.toLowerCase() === "media") {
    parent = parent.parent;
  }
  return parent?.type === "rule" ? parent : undefined;
}

export function everySubjectHasOwner(rule: Rule, isOwner: (name: string) => boolean): boolean {
  try {
    const selectors = selectorParser().astSync(rule.selector);
    return selectors.nodes.length > 0 && selectors.nodes.every((selector) => {
      const subject = getSubjectNodes(selector);
      if (subject.some((node) => node.type === "class" && isOwner(node.value))) {
        return true;
      }
      if (!subject.some((node) => node.type === "nesting")) {
        return false;
      }
      const parent = getParentRuleThroughMedia(rule);
      return parent !== undefined && everySubjectHasOwner(parent, isOwner);
    });
  } catch {
    return false;
  }
}

export function declarationHasAncestorRule(declaration: Declaration, predicate: (rule: Rule) => boolean): boolean {
  let parent = declaration.parent as PostcssAncestor | undefined;

  while (parent) {
    if (parent.type === "rule" && predicate(parent as Rule)) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

export function isInsideKeyframes(rule: Rule): boolean {
  let parent = rule.parent as PostcssAncestor | undefined;

  while (parent) {
    if (parent.type === "atrule" && /^(-[a-z]+-)?keyframes$/.test((parent as AtRule).name)) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

export function hasRuleAncestor(rule: Rule): boolean {
  let parent = rule.parent as PostcssAncestor | undefined;

  while (parent) {
    if (parent.type === "rule") {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

export function getRuleAncestors(rule: Rule): Rule[] {
  const ancestors: Rule[] = [];
  let parent = rule.parent as PostcssAncestor | undefined;

  while (parent) {
    if (parent.type === "rule") {
      ancestors.push(parent as Rule);
    }

    parent = parent.parent;
  }

  return ancestors;
}

function getSubjectClassNames(selectorNode: Selector): string[] {
  return getSubjectNodes(selectorNode)
    .filter((node): node is SelectorNode & { type: "class"; value: string } => node.type === "class")
    .map((node) => node.value);
}

export function ruleHasOwnDeclarations(rule: Rule): boolean {
  return rule.nodes?.some((node) => {
    if (node.type === "decl") {
      return true;
    }

    if (node.type !== "atrule") {
      return false;
    }

    return node.nodes?.some((childNode) => childNode.type === "decl") ?? false;
  }) ?? false;
}

function isModeClassCompounded(classNode: SelectorNode & { type: "class"; value: string }): boolean {
  const compoundNodes = getOuterCompoundNodes(classNode);

  return compoundNodes.some((node) => {
    if (node.type === "nesting") {
      return true;
    }

    return node.type === "class" && node.value !== classNode.value && !node.value.startsWith("mode-");
  });
}

function getResolvedSubjectClassNamesFromSelector(selectorNode: Selector, rule: Rule): string[] {
  const subjectNodes = getSubjectNodes(selectorNode);

  if (!subjectNodes.some((node) => node.type === "nesting")) {
    return subjectNodes
      .filter((node): node is SelectorNode & { type: "class"; value: string } => node.type === "class")
      .map((node) => node.value);
  }

  const parent = getParentRuleThroughMedia(rule);

  return parent ? getResolvedSubjectClassNames(parent) : [];
}

function getSubjectNodes(selectorNode: Selector): SelectorNode[] {
  const compoundNodes: SelectorNode[] = [];

  for (let index = selectorNode.nodes.length - 1; index >= 0; index -= 1) {
    const node = selectorNode.nodes[index];

    if (node.type === "combinator") {
      break;
    }

    compoundNodes.unshift(node);
  }

  return compoundNodes;
}

function getOuterCompoundNodes(node: SelectorNode): SelectorNode[] {
  let anchorNode = node;
  let parent = node.parent as SelectorNode | undefined;

  if (parent?.type === "selector" && parent.parent?.type === "pseudo") {
    anchorNode = parent.parent as SelectorNode;
    parent = anchorNode.parent as SelectorNode | undefined;
  }

  while (parent && parent.type !== "selector") {
    anchorNode = parent;
    parent = parent.parent as SelectorNode | undefined;
  }

  return getCompoundNodes(anchorNode);
}

function getCompoundNodes(node: SelectorNode): SelectorNode[] {
  const parent = node.parent as Container | undefined;

  if (!parent?.nodes) {
    return [node];
  }

  const nodes = parent.nodes as SelectorNode[];
  const nodeIndex = nodes.indexOf(node);
  const compoundNodes: SelectorNode[] = [];

  for (let index = nodeIndex - 1; index >= 0; index -= 1) {
    const sibling = nodes[index];

    if (sibling.type === "combinator") {
      break;
    }

    compoundNodes.unshift(sibling);
  }

  compoundNodes.push(node);

  for (let index = nodeIndex + 1; index < nodes.length; index += 1) {
    const sibling = nodes[index];

    if (sibling.type === "combinator") {
      break;
    }

    compoundNodes.push(sibling);
  }

  return compoundNodes;
}

function hasAllowedClassBeforeNode(node: SelectorNode, allowedParentClasses: string[]): boolean {
  if (allowedParentClasses.length === 0) {
    return false;
  }

  const selectorNode = getSelectorParent(node);

  if (!selectorNode) {
    return false;
  }

  const nodes = selectorNode.nodes as SelectorNode[];
  const nodeIndex = nodes.indexOf(node);

  if (nodeIndex < 0) {
    return false;
  }

  return nodes.slice(0, nodeIndex).some((sibling) => {
    if (sibling.type !== "class") {
      return false;
    }

    return allowedParentClasses.includes(sibling.value);
  });
}

function getSelectorParent(node: SelectorNode): Selector | undefined {
  let parent = node.parent as SelectorNode | undefined;

  while (parent) {
    if (parent.type === "selector") {
      return parent as Selector;
    }

    parent = parent.parent as SelectorNode | undefined;
  }

  return undefined;
}

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function globToRegExp(pattern: string): RegExp {
  let source = "";

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    const nextChar = pattern[index + 1];

    if (char === "*" && nextChar === "*") {
      source += ".*";
      index += 1;
      continue;
    }

    if (char === "*") {
      source += "[^/]*";
      continue;
    }

    source += escapeRegExp(char);
  }

  return new RegExp(`(^|/)${source}$`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
