import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * #339: nix-flake is a required check, so the published reports wait for it
 * like every other required job in this workflow that runs on a push to main.
 */
const { jobs } = Bun.YAML.parse(
  readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
) as { jobs: Record<string, { needs?: string[]; steps?: { run?: string }[] }> };

test("the reports wait for the flake to build", () => {
  expect(jobs.reports?.needs).toContain("nix-flake");
});

// #341: the runner is x86_64, so building never touches the arm64 binary.
test("nix-flake verifies the aarch64 hash", () => {
  const script = jobs["nix-flake"]?.steps?.map((step) => step.run ?? "").join("\n");
  expect(script).toContain("asset=.#packages.aarch64-linux.default.asset");
  expect(script).toContain("nix store prefetch-file --expected-hash");
});
