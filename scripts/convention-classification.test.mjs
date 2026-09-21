import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import yaml from "js-yaml";

const expectedRulesByClass = {
  A: [
    "CSS-PROHIBIT-002",
    "CSS-FILE-001",
    "CSS-FILE-002",
    "CSS-PREFIX-001",
    "CSS-PREFIX-002",
    "CSS-PREFIX-004",
    "CSS-NEST-002",
    "CSS-NEST-003",
    "CSS-VAR-002",
    "CSS-VAR-003",
    "CSS-VAR-004",
    "CSS-RESP-002",
  ],
  B: [
    "CSS-NAMING-001",
    "CSS-PROHIBIT-001",
    "CSS-PROHIBIT-003",
    "CSS-NEST-001",
    "CSS-VAR-001",
  ],
  C: [
    "CSS-NAMING-002",
    "CSS-PREFIX-003",
    "CSS-VAR-005",
    "CSS-RESP-001",
    "CSS-JS-001",
  ],
};
const expectedClassSequence = Object.entries(expectedRulesByClass).flatMap(([className, rules]) =>
  Array(rules.length).fill(className),
);
const aiGeneratedRuleFiles = [
  "../AGENTS.md",
  "../.github/copilot-instructions.md",
  "../.cursor/rules/fpm-css.mdc",
  "../.claude/skills/fpm-css/SKILL.md",
];

async function readConvention() {
  return yaml.load(await readFile(new URL("../rules/convention.yaml", import.meta.url), "utf8"));
}

function rulesByClass(rules) {
  return Object.fromEntries(
    Object.keys(expectedRulesByClass).map((className) => [
      className,
      rules.filter((rule) => rule.class === className).map((rule) => rule.id),
    ]),
  );
}

function generatedClassSequence(content) {
  return [...content.matchAll(/^- `CSS-[A-Z]+-[0-9]{3}` \(([ABC])(?:, `[^`]+`)?\)/gm)].map(
    (match) => match[1],
  );
}

test("Class A/B priority definitions and generated metadata stay synchronized", async () => {
  const convention = await readConvention();
  const generated = JSON.parse(
    await readFile(new URL("../rules/generated/rules.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(
    convention.classes.map(({ id, title, stylelintEnforced }) => ({ id, title, stylelintEnforced })),
    [
      {
        id: "A",
        title: "FPM-specific rules enforced by the custom Stylelint plugin",
        stylelintEnforced: true,
      },
      { id: "B", title: "Rules enforced by standard Stylelint rules", stylelintEnforced: true },
      { id: "C", title: "Advisory rules upheld by AI and review", stylelintEnforced: false },
    ],
  );
  assert.deepEqual(rulesByClass(convention.rules), expectedRulesByClass);
  assert.deepEqual(generated.classes, convention.classes);
  assert.deepEqual(generated.rules, convention.rules);
  assert.deepEqual(rulesByClass(generated.rules), expectedRulesByClass);

  for (const referencePath of [
    "../docs/src/content/docs/reference",
    "../docs/src/content/docs/ja/reference",
  ]) {
    const rulesIndex = await readFile(new URL(`${referencePath}/rules.md`, import.meta.url), "utf8");
    assert.match(rulesIndex, /Rules: 22 \(A12 \/ B5 \/ C5\)/);
    assert.ok(
      rulesIndex.indexOf("./class-a/") < rulesIndex.indexOf("./class-b/") &&
        rulesIndex.indexOf("./class-b/") < rulesIndex.indexOf("./class-c/"),
      referencePath,
    );

    for (const [className, expectedIds] of Object.entries(expectedRulesByClass)) {
      const page = await readFile(
        new URL(`${referencePath}/rules/class-${className.toLowerCase()}.md`, import.meta.url),
        "utf8",
      );
      const actualIds = page
        .split("\n")
        .filter((line) => line.startsWith("### CSS-"))
        .map((line) => line.match(/^### (CSS-[A-Z]+-[0-9]{3}):/)[1])
        .sort();

      assert.match(
        page,
        new RegExp(`Rules: ${expectedIds.length} \\(Class ${className}; all rules: A12 / B5 / C5\\)`),
      );
      assert.deepEqual(actualIds, [...expectedIds].sort());
    }
  }
});

test("AI generated rule digests follow the SoT Class A, B, C priority order", async () => {
  for (const path of aiGeneratedRuleFiles) {
    const content = await readFile(new URL(path, import.meta.url), "utf8");
    assert.deepEqual(generatedClassSequence(content), expectedClassSequence, path);
  }
});
