/**
 * Points flake.nix at a release: its version, and the hash of each asset it
 * fetches. Both move together, because a new version beside an old hash does not
 * build. release.yml runs this once the assets are uploaded (#337).
 *
 *   bun run scripts/update-flake.ts <version> <asset-dir>
 */
import { createHash } from "node:crypto";
import { join } from "node:path";

type Hashes = { x64: string; arm64: string; man: string };

const ASSETS: Record<keyof Hashes, string> = {
  x64: "washy-washy-cli-linux-x64",
  arm64: "washy-washy-cli-linux-arm64",
  man: "washy-washy-cli.1.gz",
};

export const sri = (bytes: Uint8Array) =>
  `sha256-${createHash("sha256").update(bytes).digest("base64")}`;

export function updateFlake(flake: string, version: string, hashes: Hashes): string {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`not a release version: ${version}`);

  // Each value is found by the line above it, so no hash can land on another
  // asset's.
  const values: [string, RegExp, string][] = [
    ["version", /(\bversion = ")[^"]*(?=";)/g, version],
    ["x64", /(bunArch = "x64";\s+hash = ")[^"]*(?=";)/g, hashes.x64],
    ["arm64", /(bunArch = "arm64";\s+hash = ")[^"]*(?=";)/g, hashes.arm64],
    ["man page", /(washy-washy-cli\.1\.gz";\s+hash = ")[^"]*(?=";)/g, hashes.man],
  ];

  return values.reduce((text, [name, pattern, value]) => {
    const found = text.match(pattern)?.length ?? 0;
    if (found !== 1) throw new Error(`expected one ${name} value in flake.nix, found ${found}`);
    return text.replace(pattern, (_, before: string) => `${before}${value}`);
  }, flake);
}

if (import.meta.main) {
  const [version, dir] = Bun.argv.slice(2);
  if (!version || !dir) {
    console.error("usage: bun run scripts/update-flake.ts <version> <asset-dir>");
    process.exit(1);
  }

  const hash = async (name: string) => sri(await Bun.file(join(dir, name)).bytes());
  const path = new URL("../flake.nix", import.meta.url).pathname;
  const flake = updateFlake(await Bun.file(path).text(), version, {
    x64: await hash(ASSETS.x64),
    arm64: await hash(ASSETS.arm64),
    man: await hash(ASSETS.man),
  });
  await Bun.write(path, flake);
}
