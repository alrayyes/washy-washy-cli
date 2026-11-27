import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * #339: nix-flake is a required check, so the published reports wait for it
 * like every other required job that runs on a push to main.
 */
const { jobs } = Bun.YAML.parse(
  readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
) as { jobs: Record<string, { needs?: string[] }> };

test("the reports wait for the flake to build", () => {
  expect(jobs.reports?.needs).toContain("nix-flake");
});
