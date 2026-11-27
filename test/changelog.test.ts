import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * #343: release-please inserts a new entry before the first version heading
 * that follows a newline. A heading on line 1 is skipped, so newer releases
 * landed underneath it.
 */
const changelog = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const versions = [...changelog.matchAll(/^##+ \[?(\d+\.\d+\.\d+)/gm)].map((m) => m[1] as string);

test("a title comes before the first release", () => {
  expect(changelog).toStartWith("# Changelog\n\n## ");
});

test("releases are listed newest first", () => {
  expect(versions).toEqual([...versions].sort((a, b) => Bun.semver.order(b, a)));
});
