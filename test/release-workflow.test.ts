import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * #337: flake.nix sat on 3.1.2 while releases moved on. The release run is the
 * only moment the new assets exist, so it is what has to move the flake.
 */
type Step = { run?: string; with?: Record<string, string>; env?: Record<string, string> };
type Job = { needs?: string[]; if?: string; steps: Step[] };
const { jobs } = Bun.YAML.parse(
  readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8"),
) as { jobs: Record<string, Job> };

test("a release opens a pull request updating the flake once its assets are up", () => {
  const job = jobs["update-flake"];

  expect(job?.needs).toContain("build-packages");
  expect(job?.if).toContain("needs.build-packages.result == 'success'");
  const run = job?.steps.map((s) => s.run ?? "").join("\n");
  expect(run).toContain("gh release download");
  expect(run).toContain("scripts/update-flake.ts");
  expect(run).toContain("gh pr create");
  // GITHUB_TOKEN's pushes start no workflow run, so the checks would never report.
  expect(job?.steps.some((s) => s.env?.GH_TOKEN?.includes("secrets.RELEASE_TOKEN"))).toBe(true);
  expect(job?.steps.some((s) => s.with?.token?.includes("secrets.RELEASE_TOKEN"))).toBe(true);
});
