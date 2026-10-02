import { type Config, configFromJson } from "@washy-washy/core";

/**
 * Which file to actually read. `data/washy-washy.json` describes one
 * household's laundry and is gitignored, so a fresh clone has only the
 * `.dist` beside it — fall back to that rather than failing on a checkout
 * that is perfectly fine. Falling back needs a `.dist` to exist, so naming a
 * file that simply is not there still fails, which is what you want when you
 * meant your own config and mistyped it.
 */
export async function resolveConfig(path: string): Promise<string> {
  if (await Bun.file(path).exists()) return path;
  if (await Bun.file(`${path}.dist`).exists()) return `${path}.dist`;
  throw new Error(`no such file: ${path}`);
}

/**
 * Resolves, reads and validates a config file, returning the file it
 * actually read alongside the parsed config — the caller needs that path
 * too, to name the output after it and to say where it read from.
 */
export async function loadConfig(path: string): Promise<{ file: string; config: Config }> {
  const file = await resolveConfig(path);
  const source = await Bun.file(file).text();
  try {
    return { file, config: configFromJson(source) };
  } catch (error) {
    throw new Error(
      // The `^` anchor is unreachable: every error `configFromJson` can
      // throw already starts with the literal "config: " (@washy-washy/core's
      // own `fail()` helper always prefixes it there, at position 0, and
      // never repeats it later in the message), so an anchored and an
      // unanchored `.replace()` of the first occurrence produce
      // byte-identical output for every message this code can ever see —
      // the same equivalent-mutant situation `washy-washy-core`#67 hit
      // with `bom: true` (see stryker.config.mjs for that PR).
      // Stryker disable next-line Regex
      `${file}: ${error instanceof Error ? error.message.replace(/^config: /, "") : error}`,
    );
  }
}
