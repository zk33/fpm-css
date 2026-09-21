import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import yaml from "js-yaml";

const SOURCE_FILE = "rules/convention.yaml";
const TRANSLATION_SOURCE_FILE = "rules/convention.ja.yaml";
const GENERATED_COMMENT = `<!-- GENERATED FROM ${SOURCE_FILE} — DO NOT EDIT -->`;
const sourcePath = resolve(SOURCE_FILE);
const translationSourcePath = resolve(TRANSLATION_SOURCE_FILE);

// Claude Code project skill lives here so it is active for this repository
// (docs: Project skill at `.claude/skills/<name>/SKILL.md`).
const SKILL_DIR = ".claude/skills/fpm-css";

// Fully generated files: the whole file is overwritten from the SoT.
const overwriteTargets = [
  {
    path: `${SKILL_DIR}/references/css-convention.md`,
    render: renderSkillReference,
  },
  {
    path: "rules/generated/rules.json",
    render: renderRulesJson,
  },
  {
    path: "docs/src/generated/rules.md",
    render: renderDocsPartial,
  },
  {
    path: "docs/src/content/docs/reference/rules.md",
    render: renderStarlightRulesIndexPage,
  },
  {
    path: "docs/src/content/docs/reference/rules/class-a.md",
    render: (convention, lang) => renderStarlightClassRulesPage(convention, "A", lang),
  },
  {
    path: "docs/src/content/docs/reference/rules/class-b.md",
    render: (convention, lang) => renderStarlightClassRulesPage(convention, "B", lang),
  },
  {
    path: "docs/src/content/docs/reference/rules/class-c.md",
    render: (convention, lang) => renderStarlightClassRulesPage(convention, "C", lang),
  },
  {
    path: "docs/src/content/docs/ja/reference/rules.md",
    locale: "ja",
    render: renderStarlightRulesIndexPage,
  },
  {
    path: "docs/src/content/docs/ja/reference/rules/class-a.md",
    locale: "ja",
    render: (convention, lang) => renderStarlightClassRulesPage(convention, "A", lang),
  },
  {
    path: "docs/src/content/docs/ja/reference/rules/class-b.md",
    locale: "ja",
    render: (convention, lang) => renderStarlightClassRulesPage(convention, "B", lang),
  },
  {
    path: "docs/src/content/docs/ja/reference/rules/class-c.md",
    locale: "ja",
    render: (convention, lang) => renderStarlightClassRulesPage(convention, "C", lang),
  },
  {
    path: ".cursor/rules/fpm-css.mdc",
    render: renderCursorRule,
  },
];

// Marker-splice files: only the SoT-derived block between the BEGIN/END markers
// is regenerated; everything outside the markers is hand-written and preserved.
// The file must already exist with the markers.
const spliceTargets = [
  {
    path: `${SKILL_DIR}/SKILL.md`,
    marker: "css-rules",
    render: renderSkillDigest,
  },
  {
    path: "AGENTS.md",
    marker: "css-rules",
    render: renderCrossToolDigest,
  },
  {
    path: ".github/copilot-instructions.md",
    marker: "css-rules",
    render: renderCrossToolDigest,
  },
];

async function main() {
  const convention = await loadConvention();
  validateConvention(convention);
  const translation = await loadTranslation();
  validateTranslation(convention, translation);
  const localizedConventions = {
    en: convention,
    ja: localize(convention, translation),
  };

  await Promise.all([
    ...overwriteTargets.map((target) => writeOverwrite(localizedConventions, target)),
    ...spliceTargets.map((target) => writeSplice(convention, target)),
  ]);

  const counts = countByClass(convention.rules);
  const total = overwriteTargets.length + spliceTargets.length;
  console.log(
      `Generated ${convention.rules.length} rules from ${SOURCE_FILE} and ${TRANSLATION_SOURCE_FILE} ` +
      `(A${counts.A}/B${counts.B}/C${counts.C}) into ${total} targets ` +
      `(${overwriteTargets.length} full, ${spliceTargets.length} spliced).`,
  );
}

async function writeOverwrite(localizedConventions, target) {
  const outputPath = resolve(target.path);
  await mkdir(dirname(outputPath), { recursive: true });
  const locale = target.locale ?? "en";
  await writeFile(outputPath, target.render(localizedConventions[locale], locale), "utf8");
}

async function writeSplice(convention, target) {
  const outputPath = resolve(target.path);
  let existing;
  try {
    existing = await readFile(outputPath, "utf8");
  } catch (error) {
    throw new Error(
      `${target.path} must exist with fpm-css markers before \`pnpm generate\` ` +
        `(create the hand-written scaffold first). Underlying error: ${error.message}`,
    );
  }

  const spliced = spliceMarker(existing, target.marker, target.render(convention), target.path);
  await writeFile(outputPath, spliced, "utf8");
}

function beginMarker(marker) {
  return `<!-- BEGIN GENERATED fpm-css:${marker} FROM ${SOURCE_FILE} — DO NOT EDIT -->`;
}

function endMarker(marker) {
  return `<!-- END GENERATED fpm-css:${marker} -->`;
}

function spliceMarker(existing, marker, interior, path) {
  const begin = beginMarker(marker);
  const end = endMarker(marker);
  const beginIdx = existing.indexOf(begin);
  const endIdx = existing.indexOf(end);

  if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx) {
    throw new Error(
      `${path} is missing the fpm-css:${marker} generation markers ` +
        `(expected "${begin}" … "${end}").`,
    );
  }

  const before = existing.slice(0, beginIdx + begin.length);
  const after = existing.slice(endIdx);
  return `${before}\n${interior}\n${after}`;
}

async function loadConvention() {
  const source = await readFile(sourcePath, "utf8");
  if (!source.trim()) {
    throw new Error(`${SOURCE_FILE} is empty.`);
  }

  const parsed = yaml.load(source);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${SOURCE_FILE} must contain a YAML object.`);
  }

  return parsed;
}

async function loadTranslation() {
  const source = await readFile(translationSourcePath, "utf8");
  if (!source.trim()) {
    throw new Error(`${TRANSLATION_SOURCE_FILE} is empty.`);
  }

  const parsed = yaml.load(source);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${TRANSLATION_SOURCE_FILE} must contain a YAML object.`);
  }

  return parsed;
}

function validateConvention(convention) {
  if (typeof convention.version !== "string" || !convention.version) {
    throw new Error("convention.version must be a non-empty string.");
  }

  const expectedClassIds = ["A", "B", "C"];
  if (!Array.isArray(convention.classes) || convention.classes.length !== expectedClassIds.length) {
    throw new Error("convention.classes must define Class A, B, and C in priority order.");
  }

  for (const [index, classDefinition] of convention.classes.entries()) {
    const expectedId = expectedClassIds[index];
    if (!classDefinition || typeof classDefinition !== "object" || Array.isArray(classDefinition)) {
      throw new Error(`convention.classes[${index}] must be an object.`);
    }

    if (classDefinition.id !== expectedId) {
      throw new Error(`convention.classes must be ordered A, B, C; found ${classDefinition.id}.`);
    }

    for (const field of ["title", "enforcement", "stylelintEnforced"]) {
      if (!Object.hasOwn(classDefinition, field)) {
        throw new Error(`Class ${classDefinition.id} is missing ${field}.`);
      }
    }

    if (typeof classDefinition.title !== "string" || !classDefinition.title) {
      throw new Error(`Class ${classDefinition.id} title must be a non-empty string.`);
    }

    if (typeof classDefinition.enforcement !== "string" || !classDefinition.enforcement) {
      throw new Error(`Class ${classDefinition.id} enforcement must be a non-empty string.`);
    }

    if (typeof classDefinition.stylelintEnforced !== "boolean") {
      throw new Error(`Class ${classDefinition.id} stylelintEnforced must be a boolean.`);
    }

    if (classDefinition.id === "C" ? classDefinition.stylelintEnforced : !classDefinition.stylelintEnforced) {
      throw new Error(`Class ${classDefinition.id} has an invalid stylelintEnforced value.`);
    }
  }

  if (!Array.isArray(convention.rules) || convention.rules.length === 0) {
    throw new Error("convention.rules must be a non-empty array.");
  }

  const seen = new Set();
  const requiredFields = [
    "id",
    "category",
    "class",
    "level",
    "title",
    "summary",
    "rationale",
    "good",
    "bad",
    "aiGuidance",
    "stylelintRule",
    "docsPath",
  ];

  for (const [index, rule] of convention.rules.entries()) {
    if (!rule || typeof rule !== "object" || Array.isArray(rule)) {
      throw new Error(`convention.rules[${index}] must be an object.`);
    }

    for (const field of requiredFields) {
      if (!Object.hasOwn(rule, field)) {
        throw new Error(`${rule.id ?? `rules[${index}]`} is missing ${field}.`);
      }
    }

    if (seen.has(rule.id)) {
      throw new Error(`Duplicate rule id: ${rule.id}`);
    }
    seen.add(rule.id);

    const classDefinition = getClassDefinition(convention, rule.class);
    if (!classDefinition) {
      throw new Error(`${rule.id} has invalid class: ${rule.class}`);
    }

    if (!classDefinition.stylelintEnforced && rule.stylelintRule !== null) {
      throw new Error(`${rule.id} is not Stylelint-enforced and must not have a stylelintRule.`);
    }

    if (classDefinition.stylelintEnforced && typeof rule.stylelintRule !== "string") {
      throw new Error(`${rule.id} is Stylelint-enforced and must have a stylelintRule.`);
    }
  }
}

function validateTranslation(convention, translation) {
  assertExactKeys(translation, ["lang", "ui", "classes", "rules"], TRANSLATION_SOURCE_FILE);
  if (translation.lang !== "ja") {
    throw new Error(`${TRANSLATION_SOURCE_FILE}.lang must be \"ja\".`);
  }

  const uiFields = [
    "referenceTitle",
    "referenceDescription",
    "generatedNotice",
    "rulesByClass",
    "classRules",
    "classListItem",
    "classDescription",
    "rules",
    "backToReference",
    "class",
    "level",
    "category",
    "summary",
    "rationale",
    "good",
    "bad",
    "aiGuidance",
  ];
  const categoryKeys = [
    "naming",
    "file-structure",
    "prefix",
    "variables",
    "nesting",
    "responsive",
    "prohibited",
    "js-integration",
  ];
  if (!translation.ui || typeof translation.ui !== "object" || Array.isArray(translation.ui)) {
    throw new Error(`${TRANSLATION_SOURCE_FILE}.ui must be an object.`);
  }
  assertExactKeys(translation.ui, [...uiFields, "categories"], `${TRANSLATION_SOURCE_FILE}.ui`);
  assertNonEmptyTranslationFields(translation.ui, uiFields, `${TRANSLATION_SOURCE_FILE}.ui`);
  if (
    !translation.ui.categories ||
    typeof translation.ui.categories !== "object" ||
    Array.isArray(translation.ui.categories)
  ) {
    throw new Error(`${TRANSLATION_SOURCE_FILE}.ui.categories must be an object.`);
  }
  assertExactKeys(translation.ui.categories, categoryKeys, `${TRANSLATION_SOURCE_FILE}.ui.categories`);
  assertNonEmptyTranslationFields(
    translation.ui.categories,
    categoryKeys,
    `${TRANSLATION_SOURCE_FILE}.ui.categories`,
  );

  if (!translation.classes || typeof translation.classes !== "object" || Array.isArray(translation.classes)) {
    throw new Error(`${TRANSLATION_SOURCE_FILE}.classes must be an object.`);
  }

  const classIds = convention.classes.map((classDefinition) => classDefinition.id);
  assertExactKeySet(translation.classes, classIds, `${TRANSLATION_SOURCE_FILE}.classes`);
  for (const classId of classIds) {
    const localizedClass = translation.classes[classId];
    if (!localizedClass || typeof localizedClass !== "object" || Array.isArray(localizedClass)) {
      throw new Error(`${TRANSLATION_SOURCE_FILE}.classes.${classId} must be an object.`);
    }
    assertExactKeys(localizedClass, ["title", "enforcement"], `${TRANSLATION_SOURCE_FILE}.classes.${classId}`);
    assertNonEmptyTranslationFields(
      localizedClass,
      ["title", "enforcement"],
      `${TRANSLATION_SOURCE_FILE}.classes.${classId}`,
    );
  }

  if (!translation.rules || typeof translation.rules !== "object" || Array.isArray(translation.rules)) {
    throw new Error(`${TRANSLATION_SOURCE_FILE}.rules must be an object.`);
  }

  const ruleIds = convention.rules.map((rule) => rule.id);
  assertExactKeySet(translation.rules, ruleIds, `${TRANSLATION_SOURCE_FILE}.rules`);
  const requiredFields = ["title", "summary", "rationale", "aiGuidance"];
  const allowedFields = [...requiredFields, "good", "bad"];
  for (const ruleId of ruleIds) {
    const localizedRule = translation.rules[ruleId];
    if (!localizedRule || typeof localizedRule !== "object" || Array.isArray(localizedRule)) {
      throw new Error(`${TRANSLATION_SOURCE_FILE}.rules.${ruleId} must be an object.`);
    }
    assertKnownKeys(localizedRule, allowedFields, `${TRANSLATION_SOURCE_FILE}.rules.${ruleId}`);
    assertNonEmptyTranslationFields(
      localizedRule,
      requiredFields,
      `${TRANSLATION_SOURCE_FILE}.rules.${ruleId}`,
    );
    for (const optionalField of ["good", "bad"]) {
      if (
        Object.hasOwn(localizedRule, optionalField) &&
        (typeof localizedRule[optionalField] !== "string" || !localizedRule[optionalField].trim())
      ) {
        throw new Error(`${TRANSLATION_SOURCE_FILE}.rules.${ruleId}.${optionalField} must be a non-empty string.`);
      }
    }
  }
}

function assertExactKeys(value, expectedKeys, path) {
  assertKnownKeys(value, expectedKeys, path);
  assertExactKeySet(value, expectedKeys, path);
}

function assertKnownKeys(value, allowedKeys, path) {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.includes(key)) {
      throw new Error(`${path} contains unknown field: ${key}.`);
    }
  }
}

function assertExactKeySet(value, expectedKeys, path) {
  for (const key of expectedKeys) {
    if (!Object.hasOwn(value, key)) {
      throw new Error(`${path} is missing required key: ${key}.`);
    }
  }
  for (const key of Object.keys(value)) {
    if (!expectedKeys.includes(key)) {
      throw new Error(`${path} contains unexpected key: ${key}.`);
    }
  }
}

function assertNonEmptyTranslationFields(value, fields, path) {
  for (const field of fields) {
    if (typeof value[field] !== "string" || !value[field].trim()) {
      throw new Error(`${path}.${field} must be a non-empty string.`);
    }
  }
}

function localize(convention, translation) {
  return {
    ...convention,
    ui: translation.ui,
    classes: convention.classes.map((classDefinition) => ({
      ...classDefinition,
      ...translation.classes[classDefinition.id],
    })),
    rules: convention.rules.map((rule) => ({
      ...rule,
      ...translation.rules[rule.id],
    })),
  };
}

function renderSkillReference(convention) {
  const counts = countByClass(convention.rules);
  const lines = [
    GENERATED_COMMENT,
    "",
    "# FPM CSS Coding Conventions Reference",
    "",
    `Source: \`${SOURCE_FILE}\``,
    `Version: \`${convention.version}\``,
    `Rules: ${convention.rules.length} (A${counts.A} / B${counts.B} / C${counts.C})`,
    "",
    "This reference is generated for progressive disclosure from the Claude Code skill. Use it when CSS generation, review, or lint fixes need rule-level details.",
    "",
    ...convention.classes.flatMap((classDefinition) =>
      renderClassSection(
        classDefinition.id,
        `Class ${classDefinition.id}: ${classDefinition.title}`,
        convention.rules,
      ),
    ),
  ];

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderClassSection(className, heading, rules) {
  const classRules = rules.filter((rule) => rule.class === className);
  const lines = [`## ${heading}`, ""];

  for (const rule of classRules) {
    lines.push(...renderRuleReference(rule), "");
  }

  return lines;
}

function renderRuleReference(rule) {
  return [
    `### ${rule.id}: ${cleanInline(rule.title)}`,
    "",
    `- id: \`${rule.id}\``,
    `- category: \`${rule.category}\``,
    `- class: \`${rule.class}\``,
    `- level: \`${rule.level}\``,
    `- stylelintRule: ${formatNullableCode(rule.stylelintRule)}`,
    "",
    "**Summary**",
    "",
    cleanBlock(rule.summary),
    "",
    "**Rationale**",
    "",
    cleanBlock(rule.rationale),
    "",
    "**Good**",
    "",
    codeBlock(rule.good),
    "",
    "**Bad**",
    "",
    codeBlock(rule.bad),
    "",
    "**AI Guidance**",
    "",
    cleanBlock(rule.aiGuidance),
  ];
}

function renderRulesJson(convention) {
  return `${JSON.stringify(
    {
      _generated: SOURCE_FILE,
      version: convention.version,
      classes: convention.classes.map((classDefinition) => ({
        id: classDefinition.id,
        title: classDefinition.title,
        enforcement: classDefinition.enforcement,
        stylelintEnforced: classDefinition.stylelintEnforced,
      })),
      rules: convention.rules.map((rule) => ({
        id: rule.id,
        category: rule.category,
        class: rule.class,
        level: rule.level,
        title: rule.title,
        summary: rule.summary,
        rationale: rule.rationale,
        good: rule.good,
        bad: rule.bad,
        aiGuidance: rule.aiGuidance,
        stylelintRule: rule.stylelintRule,
        docsPath: rule.docsPath,
      })),
    },
    null,
    2,
  )}\n`;
}

function renderDocsPartial(convention) {
  const counts = countByClass(convention.rules);
  const lines = [
    GENERATED_COMMENT,
    "",
    "# CSS Convention Rules",
    "",
    `Version: \`${convention.version}\``,
    `Rules: ${convention.rules.length} (A${counts.A} / B${counts.B} / C${counts.C})`,
    "",
    "| ID | Class | Category | Level | Stylelint rule | Summary |",
    "| --- | --- | --- | --- | --- | --- |",
    ...orderRulesByClass(convention.rules, convention.classes).map(
      (rule) =>
        `| \`${rule.id}\` | ${rule.class} | \`${rule.category}\` | \`${rule.level}\` | ${formatTableCode(
          rule.stylelintRule,
        )} | ${escapeTable(cleanInline(rule.summary))} |`,
    ),
  ];

  return `${lines.join("\n")}\n`;
}

const UI = {
  en: {
    referenceTitle: "Rule Reference",
    referenceDescription: "An entry point to FPM CSS Coding Conventions rules by Class A, B, and C.",
    generatedNotice: "This page is generated from the convention definition.",
    rulesByClass: "Rules by Class",
    classRules: "Class {className} Rules",
    classListItem: "- [{classRules}](./class-{classSlug}/) — {title}. {enforcement} {count} rules.",
    classDescription: "FPM CSS Coding Conventions Class {className} rules ({title}).",
    rules: "rules",
    backToReference: "Back to the rule reference",
    class: "Class",
    level: "Level",
    category: "Category",
    summary: "Summary",
    rationale: "Rationale",
    good: "Good",
    bad: "Bad",
    aiGuidance: "What AI and reviewers check",
    categories: {
      naming: "Naming",
      "file-structure": "File Structure",
      prefix: "Prefix",
      variables: "Variables",
      nesting: "Nesting",
      responsive: "Responsive",
      prohibited: "Prohibited",
      "js-integration": "JS Integration",
    },
  },
};

function getDocsUi(convention) {
  return convention.ui ?? UI.en;
}

function formatUi(template, values) {
  return Object.entries(values).reduce(
    (formatted, [key, value]) => formatted.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function renderStarlightRulesIndexPage(convention) {
  const ui = getDocsUi(convention);
  const counts = countByClass(convention.rules);
  const lines = [
    "---",
    `title: ${ui.referenceTitle}`,
    `description: ${ui.referenceDescription}`,
    "sidebar:",
    "  order: 3",
    `  label: ${ui.referenceTitle}`,
    "---",
    "",
    "<!-- GENERATED — DO NOT EDIT -->",
    "",
    `Version: \`${convention.version}\` / Rules: ${convention.rules.length} (A${counts.A} / B${counts.B} / C${counts.C})`,
    "",
    ui.generatedNotice,
    "",
    `## ${ui.rulesByClass}`,
    "",
    ...convention.classes.map((classDefinition) => {
      const className = classDefinition.id;
      const classRules = formatUi(ui.classRules, { className });
      return formatUi(ui.classListItem, {
        classRules,
        classSlug: className.toLowerCase(),
        title: cleanInline(classDefinition.title),
        enforcement: cleanInline(classDefinition.enforcement),
        count: counts[className],
      });
    }),
    "",
  ];

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderStarlightClassRulesPage(convention, className) {
  const ui = getDocsUi(convention);
  const counts = countByClass(convention.rules);
  const rules = convention.rules.filter((rule) => rule.class === className);
  const categoryOrder = [
    "naming",
    "file-structure",
    "prefix",
    "variables",
    "nesting",
    "responsive",
    "prohibited",
    "js-integration",
  ];
  const details = getClassDefinition(convention, className);
  const classRules = formatUi(ui.classRules, { className });
  const lines = [
    "---",
    `title: ${classRules}`,
    `description: ${formatUi(ui.classDescription, { className, title: details.title })}`,
    "sidebar:",
    `  label: ${classRules}`,
    "---",
    "",
    "<!-- GENERATED — DO NOT EDIT -->",
    "",
    `Version: \`${convention.version}\` / Rules: ${rules.length} (Class ${className}; all rules: A${counts.A} / B${counts.B} / C${counts.C})`,
    "",
    details.enforcement,
    "",
    `[${ui.backToReference}](../)`,
    "",
  ];

  for (const category of categoryOrder) {
    const categoryRules = rules.filter((rule) => rule.category === category);
    if (categoryRules.length === 0) continue;

    lines.push(`## ${categoryLabel(category, ui)}`, "");
    for (const rule of categoryRules) {
      lines.push(...renderStarlightRule(rule, ui), "");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderStarlightRule(rule, ui) {
  return [
    `### ${rule.id}: ${cleanInline(rule.title)}`,
    "",
    `- ${ui.class}: \`${rule.class}\``,
    `- ${ui.level}: \`${rule.level}\``,
    `- ${ui.category}: \`${rule.category}\``,
    `- stylelintRule: ${formatNullableCode(rule.stylelintRule)}`,
    "",
    `**${ui.summary}**`,
    "",
    cleanBlock(rule.summary),
    "",
    `**${ui.rationale}**`,
    "",
    cleanBlock(rule.rationale),
    "",
    `**${ui.good}**`,
    "",
    codeBlock(rule.good),
    "",
    `**${ui.bad}**`,
    "",
    codeBlock(rule.bad),
    "",
    `**${ui.aiGuidance}**`,
    "",
    cleanBlock(rule.aiGuidance),
  ];
}

function categoryLabel(category, ui) {
  return ui.categories[category] ?? category;
}

// ── SoT-derived digests shared by the skill and the AI rule files ────────────

// Class A/B: enforced by Stylelint. The AI's job is to satisfy them on the first
// pass and let the linter confirm.
function nonNegotiableLines(rules, classes) {
  return orderRulesByClass(rules, classes)
    .filter((rule) => getClassDefinition({ classes }, rule.class).stylelintEnforced)
    .map(
      (rule) =>
        `- \`${rule.id}\` (${rule.class}, \`${rule.stylelintRule}\`) — ${cleanInline(rule.title)}`,
    );
}

// Class C: not statically enforced. These are the rules the AI and reviewers own.
function advisoryLines(rules, classes, { withGuidance }) {
  const lines = [];
  for (const rule of orderRulesByClass(rules, classes).filter(
    (rule) => !getClassDefinition({ classes }, rule.class).stylelintEnforced,
  )) {
    lines.push(`- \`${rule.id}\` (C) — ${cleanInline(rule.title)}`);
    if (withGuidance) {
      lines.push(`  ${cleanInline(rule.aiGuidance)}`);
    }
  }
  return lines;
}

// Interior of the Claude Code SKILL.md generated block (full, with C guidance).
function renderSkillDigest(convention) {
  const { rules } = convention;
  return [
    "## Non-negotiable rules (enforced by Stylelint — satisfy them while generating and confirm with lint)",
    "",
    ...nonNegotiableLines(rules, convention.classes),
    "",
    "## Rules upheld by AI (Class C, not linted — follow them yourself when generating and reviewing)",
    "",
    ...advisoryLines(rules, convention.classes, { withGuidance: true }),
  ].join("\n");
}

// Interior of AGENTS.md / copilot-instructions.md generated blocks. Kept concise
// because these files are loaded broadly across tools; detail lives in the skill
// reference.
function renderCrossToolDigest(convention) {
  const { rules } = convention;
  return [
    "### Non-negotiable rules (enforced by Stylelint — satisfy them while generating and confirm with lint)",
    "",
    ...nonNegotiableLines(rules, convention.classes),
    "",
    "### Rules upheld by AI (Class C, not linted — follow them yourself when generating and reviewing)",
    "",
    ...advisoryLines(rules, convention.classes, { withGuidance: false }),
    "",
    "Details and good/bad examples: `.claude/skills/fpm-css/references/css-convention.md`",
    "Check CSS with `npx stylelint <path>` (or `pnpm lint:css` for the repository) and fix violations by rule ID.",
  ].join("\n");
}

// Cursor rule: fully generated `.mdc` (frontmatter + body). The DO-NOT-EDIT
// comment goes after the frontmatter because `.mdc` requires frontmatter first.
function renderCursorRule(convention) {
  const { rules } = convention;
  const counts = countByClass(rules);
  const lines = [
    "---",
    "description: Use FPM CSS Coding Conventions when writing, generating, or reviewing CSS: class naming, file splitting, .g-/.x-/.mode- prefixes, Custom Properties (--v-), nesting, and responsive behavior.",
    'globs: "**/*.css"',
    "alwaysApply: false",
    "---",
    "",
    GENERATED_COMMENT,
    "",
    "# FPM CSS Coding Conventions (Cursor rule)",
    "",
    `SoT: \`${SOURCE_FILE}\` / Version: \`${convention.version}\` / Rules: ${rules.length} (A${counts.A} / B${counts.B} / C${counts.C})`,
    "",
    "Follow this convention when writing, changing, or reviewing CSS. Classes A and B are enforced by Stylelint; Class C is upheld by AI and review.",
    "",
    "## Non-negotiable rules (enforced by Stylelint)",
    "",
    ...nonNegotiableLines(rules, convention.classes),
    "",
    "## Rules upheld by AI (Class C, not linted)",
    "",
    ...advisoryLines(rules, convention.classes, { withGuidance: true }),
    "",
    "## Check after generation",
    "",
    "After writing CSS, run `npx stylelint <path>` (`pnpm lint:css` for the repository) and fix violations by rule ID.",
    "Details and good/bad examples: `.claude/skills/fpm-css/references/css-convention.md`.",
  ];

  return `${lines.join("\n")}\n`;
}

function getClassDefinition(convention, className) {
  return convention.classes.find((classDefinition) => classDefinition.id === className);
}

function orderRulesByClass(rules, classes) {
  return classes.flatMap((classDefinition) =>
    rules.filter((rule) => rule.class === classDefinition.id),
  );
}

function countByClass(rules) {
  return rules.reduce(
    (counts, rule) => {
      counts[rule.class] += 1;
      return counts;
    },
    { A: 0, B: 0, C: 0 },
  );
}

function cleanInline(value) {
  return cleanBlock(value).replace(/\s+/g, " ");
}

function cleanBlock(value) {
  return String(value).trim();
}

function codeBlock(value) {
  const content = String(value).trimEnd();
  return `\`\`\`text\n${content}\n\`\`\``;
}

function formatNullableCode(value) {
  return value === null ? "`null`" : `\`${value}\``;
}

function formatTableCode(value) {
  return value === null ? "`null`" : `\`${escapeTable(value)}\``;
}

function escapeTable(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

await main();
