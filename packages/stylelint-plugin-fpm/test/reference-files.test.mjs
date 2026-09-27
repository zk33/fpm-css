import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stylelint from "stylelint";

const sharedConfig = fileURLToPath(new URL("../../stylelint-config-fpm/index.cjs", import.meta.url));

test.each([
  [true, "--v-screen-sm", true],
  [true, "--v-screen-typo", false],
  [false, "--v-screen-sm", false],
  [false, "--v-screen-typo", false]
])("referenceFiles=%s, custom media=%s, accepted=%s", async (withReferences, name, accepted) => {
  const directory = await mkdtemp(path.join(tmpdir(), "fpm-reference-files-"));
  try {
    const definitions = path.join(directory, "_v.css");
    await writeFile(definitions, "@custom-media --v-screen-sm (width < 600px);\n");
    const result = await stylelint.lint({
      code: `.header {\n  @media (${name}) {\n    color: red;\n  }\n}\n`,
      codeFilename: path.join(directory, "_header.css"),
      config: {
        extends: [sharedConfig],
        ...(withReferences ? { referenceFiles: [definitions] } : {})
      }
    });
    const warnings = result.results[0].warnings;
    if (accepted) {
      expect(warnings).toEqual([]);
    } else {
      expect(warnings).toHaveLength(1);
      expect(warnings[0].rule).toBe("no-unknown-custom-media");
      expect(warnings[0].text).toContain(name);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
