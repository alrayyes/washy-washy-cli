import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/** #349: `dependencies` is what an install of the tool pulls in. */
const root = new URL("..", import.meta.url).pathname;
const { dependencies } = JSON.parse(readFileSync(`${root}package.json`, "utf8")) as {
  dependencies: Record<string, string>;
};
const source = [...new Bun.Glob("src/**/*.ts").scanSync(root)]
  .map((file) => readFileSync(`${root}${file}`, "utf8"))
  .join("\n");

test.each(Object.keys(dependencies))("src imports %s", (name) => {
  expect(source).toContain(`from "${name}`);
});
