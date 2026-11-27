import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { sri, updateFlake } from "../scripts/update-flake";

// The real flake, not a stand-in: an edit that moves a line out from under the
// script fails here rather than in the release job.
const flake = readFileSync(new URL("../flake.nix", import.meta.url), "utf8");
const hashes = { x64: "sha256-x64=", arm64: "sha256-arm64=", man: "sha256-man=" };

test("hashes an asset the way fetchurl wants it", () => {
  expect(sri(new TextEncoder().encode("abc"))).toBe(
    "sha256-ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=",
  );
});

test("sets the version and each asset's own hash", () => {
  const out = updateFlake(flake, "9.8.7", hashes);

  expect(out).toContain('version = "9.8.7";');
  expect(out).toMatch(/bunArch = "x64";\s+hash = "sha256-x64=";/);
  expect(out).toMatch(/bunArch = "arm64";\s+hash = "sha256-arm64=";/);
  expect(out).toMatch(/washy-washy-cli\.1\.gz";\s+hash = "sha256-man=";/);
});

test("changes nothing else", () => {
  const blank = (text: string) => text.replace(/(version|hash) = "[^"]*";/g, "");

  expect(blank(updateFlake(flake, "9.8.7", hashes))).toBe(blank(flake));
});

test("refuses a flake it cannot place every value in", () => {
  expect(() => updateFlake(flake.replace('bunArch = "arm64";', ""), "9.8.7", hashes)).toThrow(
    "arm64",
  );
});

test("refuses a version that is not a release number", () => {
  expect(() => updateFlake(flake, "v9.8.7", hashes)).toThrow("v9.8.7");
});
