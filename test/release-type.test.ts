import { expect, test } from "bun:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { releaseProblem } from "../scripts/release-type.ts";

/**
 * #253: only a change that ships should cut a release. release-please matches
 * `exclude-paths` as directory prefixes alone, so root files rely on the commit
 * type, and this is what holds the type to the files.
 */
test.each([
  ["fix: stop the card repeating", ["src/cli.ts"]],
  ["feat: add a section to the man page", ["man/washy-washy-cli.1.scd"]],
  ["fix: correct the example chart", ["data/washy-washy.json.dist"]],
  ["fix(deps): bump @washy-washy/core", ["package.json", "bun.lock"]],
  ["fix(deps): bump a transitive dependency", ["bun.lock"]],
  ["ci: retry the upload", [".github/workflows/release.yml"]],
  ["chore(deps): bump oven/bun", ["Dockerfile"]],
  ["chore(main): release 4.0.3", ["CHANGELOG.md", "package.json"]],
])("allows %s", (subject, files) => {
  expect(releaseProblem(subject, files)).toBeNull();
});

test.each([
  ["fix(aur): repair the checksum", ["PKGBUILD"]],
  ["fix(deps): bump oven/bun", ["Dockerfile"]],
  ["fix: correct a script", ["package.json", "scripts/new-config.ts"]],
  ["feat(nix): add a flake", ["flake.nix"]],
  ["perf: faster build", ["nfpm.yaml"]],
  ["revert: undo the flake", ["flake.nix"]],
  ["deps: bump the runtime", ["Dockerfile"]],
  ["chore!: drop an install route", ["PKGBUILD"]],
])("refuses %s", (subject, files) => {
  expect(releaseProblem(subject, files)).toContain("would cut a release");
});

const root = new URL("..", import.meta.url).pathname;
const read = (file: string) => readFileSync(`${root}${file}`, "utf8");

const { packages } = JSON.parse(read("release-please-config.json")) as {
  packages: Record<string, { "exclude-paths": string[] }>;
};

test.each(packages["."]?.["exclude-paths"] ?? [])("exclude-paths %s is a directory", (path) => {
  expect(existsSync(`${root}${path}`) && statSync(`${root}${path}`).isDirectory()).toBe(true);
});

// A base image bump touches only the Dockerfile, so its type has to be quiet.
test("Dependabot's base image bumps don't release", () => {
  const { updates } = Bun.YAML.parse(read(".github/dependabot.yml")) as {
    updates: {
      "package-ecosystem": string;
      directory: string;
      "commit-message": { prefix: string };
    }[];
  };
  const image = updates.find((u) => u["package-ecosystem"] === "docker" && u.directory === "/");
  expect(image?.["commit-message"].prefix).toBe("chore");
});

test("the required check job runs it on pull requests", () => {
  const { jobs } = Bun.YAML.parse(read(".github/workflows/ci.yml")) as {
    jobs: Record<string, { steps: { if?: string; run?: string }[] }>;
  };
  const step = jobs.check?.steps.find((s) => s.run?.includes("scripts/release-type.ts"));
  expect(step?.if).toBe("github.event_name == 'pull_request'");
});
