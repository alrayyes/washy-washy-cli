/**
 * Refuses a releasing commit type on a change that ships nothing (#253).
 * `exclude-paths` can't do this for root files: release-please only matches
 * directories there.
 *
 * Usage: changed paths on stdin, one per line; the squash subject as argument.
 */
const RELEASING = /^(?:(?:feat|fix|perf|revert|deps)(?:\([^)]*\))?!?|\w+(?:\([^)]*\))?!):/;

/** What ends up in a binary, a package or the image. */
const ships = (file: string) =>
  file.startsWith("src/") || file.startsWith("man/") || file === "data/washy-washy.json.dist";

export function releaseProblem(subject: string, files: string[]): string | null {
  if (!RELEASING.test(subject) || files.some(ships)) return null;
  const dependencyBump =
    /^\w+\(deps\)/.test(subject) &&
    files.some((file) => file === "package.json" || file === "bun.lock");
  if (dependencyBump) return null;
  return `"${subject}" would cut a release, but nothing here ships. Use ci:, build: or chore:.`;
}

if (import.meta.main) {
  const files = (await Bun.stdin.text()).split("\n").filter(Boolean);
  const problem = releaseProblem(process.argv[2] ?? "", files);
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
}
