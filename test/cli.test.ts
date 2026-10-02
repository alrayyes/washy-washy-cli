import { describe, expect, test } from "bun:test";
import { HelpRequested, outputStem, parseArgs } from "../src/cli";

describe("outputStem", () => {
  test("names the PDFs after the input", () => {
    expect(outputStem("data/washy-washy.json")).toBe("washy-washy");
    expect(outputStem("/tmp/my-laundry.JSON")).toBe("my-laundry");
  });

  // Reading the .dist should still write washy-washy-phone.pdf, not
  // washy-washy.json-phone.pdf.
  test("does not let the .dist suffix leak into the filename", () => {
    expect(outputStem("data/washy-washy.json.dist")).toBe("washy-washy");
  });
});

describe("parseArgs", () => {
  test("defaults to the committed config path and out/", () => {
    expect(parseArgs([])).toEqual({ config: "data/washy-washy.json", out: "out" });
  });

  test("takes the config as a positional argument", () => {
    expect(parseArgs(["data/mine.json"]).config).toBe("data/mine.json");
  });

  test("takes --out (or -o)", () => {
    expect(parseArgs(["--out", "dist"]).out).toBe("dist");
    expect(parseArgs(["-o", "dist"]).out).toBe("dist");
  });

  test("rejects a second positional argument", () => {
    expect(() => parseArgs(["a.json", "b.json"])).toThrow(/unexpected argument: b\.json/);
  });

  test("rejects --out with nothing after it", () => {
    expect(() => parseArgs(["--out"])).toThrow(/--out needs a directory/);
  });

  // Exact text, not a substring match: the usage text is the only thing a
  // real `--help` invocation ever prints, so every line and the blank line
  // between them is load-bearing, not just the opening "Usage:" line.
  test("--help throws the exact usage text rather than running", () => {
    let caught: unknown;
    try {
      parseArgs(["--help"]);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(HelpRequested);
    expect((caught as Error).message).toBe(
      [
        "Usage: bun run generate [config] [--out <dir>]",
        "",
        "  config            machine+chart config to read (default: data/washy-washy.json,",
        "                    falling back to the committed .dist)",
        "  --out <dir>       where the six PDFs go (default: out)",
      ].join("\n"),
    );
  });
});
