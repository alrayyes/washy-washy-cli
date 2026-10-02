import { describe, expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ironSetting, parseMachine } from "@washy-washy/core";
import { DIST_MACHINE, loadMachine } from "../src/machine";

const MINIMAL = {
  washer: {
    name: "Test Washer",
    capacity: "1–8 kg",
    programs: ["Off", "Cottons", "Wool"],
    temperatures: ["cold", "30", "60"],
    spins: ["0", "800"],
    options: ["Eco"],
  },
  iron: {
    name: "Test Iron",
    settings: [
      { key: "min", dots: "", label: "MIN", detail: "no heat", steam: false },
      { key: "1", dots: "•", label: "•", detail: "synthetics", steam: false },
      { key: "2", dots: "••", label: "••", detail: "wool", steam: true },
    ],
  },
};

async function machineFile(contents: unknown): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "machine-"));
  const path = join(dir, "machine.json");
  await writeFile(path, JSON.stringify(contents));
  return path;
}

describe("parseMachine", () => {
  test("takes a machine described entirely in data", () => {
    const machine = parseMachine(MINIMAL);

    expect(machine.washer.programs).toEqual(["Off", "Cottons", "Wool"]);
    expect(machine.iron.settings).toHaveLength(3);
  });

  // The dial angles come from the order of this list, so a missing programme
  // does not just omit a tick — it moves every other one.
  test("insists the dial has positions to draw", () => {
    const noPrograms = { ...MINIMAL, washer: { ...MINIMAL.washer, programs: [] } };
    expect(() => parseMachine(noPrograms)).toThrow(/programs/);
  });

  test("insists on the parts a card cannot be drawn without", () => {
    expect(() => parseMachine({ washer: MINIMAL.washer })).toThrow(/iron/);
    expect(() => parseMachine({ iron: MINIMAL.iron })).toThrow(/washer/);
    expect(() => parseMachine("not a machine at all")).toThrow();
  });

  /**
   * There used to be a reserved key here: a setting called "none" was refused,
   * because "none" was how a row said do not iron this. The `ironing` boolean
   * carries that now, so every key a fascia might print is available again.
   */
  test("allows a thermostat position called none", () => {
    const named = {
      ...MINIMAL,
      iron: {
        ...MINIMAL.iron,
        settings: [...MINIMAL.iron.settings, { key: "none", label: "x", detail: "", steam: false }],
      },
    };
    expect(parseMachine(named).iron.settings.map((setting) => setting.key)).toContain("none");
  });
});

describe("loadMachine", () => {
  test("reads a machine from a file", async () => {
    const machine = await loadMachine(await machineFile(MINIMAL));
    expect(machine.washer.name).toBe("Test Washer");
  });

  // Same rule as the chart: your own file is gitignored, so a fresh clone has
  // only the .dist beside it.
  test("falls back to the committed .dist", async () => {
    const machine = await loadMachine(DIST_MACHINE);
    expect(machine.washer.programs.length).toBeGreaterThan(1);
  });

  // Distinct from the test above: DIST_MACHINE already names the `.dist`
  // file directly, so `loadMachine(DIST_MACHINE)` never actually takes the
  // fallback branch — the plain path exists under that exact name already.
  // A fresh directory with only a `.dist` beside a name that does not exist
  // is what actually exercises the fallback.
  test("falls back to a fresh .dist when your own file is not there", async () => {
    const dir = await mkdtemp(join(tmpdir(), "machine-"));
    const path = join(dir, "machine.json");
    await writeFile(`${path}.dist`, JSON.stringify(MINIMAL));

    const machine = await loadMachine(path);
    expect(machine.washer.name).toBe("Test Washer");
  });

  // Exact message, not a substring regex: the regex used to match by
  // coincidence even when the "no such machine file" throw was skipped
  // entirely, because the fallback ".dist" path Bun.file(...).json() then
  // failed to read also contains "no/such/machine.json" as a prefix — the
  // "is not valid JSON" wrapper (below) starts with the same file name.
  test("says which file it could not read", async () => {
    await expect(loadMachine("no/such/machine.json")).rejects.toThrow(
      "no such machine file: no/such/machine.json",
    );
  });

  test("says the file is not valid JSON, distinct from a validation failure", async () => {
    const dir = await mkdtemp(join(tmpdir(), "machine-"));
    const path = join(dir, "machine.json");
    await writeFile(path, "not json");

    await expect(loadMachine(path)).rejects.toThrow(`${path} is not valid JSON:`);
  });

  // Exact suffix, not a substring match: @washy-washy/core's own error
  // always starts with a "machine: " prefix, and this is what proves
  // loadMachine actually strips it rather than merely not obscuring the
  // "iron is missing" text some other way.
  test("wraps a parseMachine validation failure with the file name, prefix stripped", async () => {
    const dir = await mkdtemp(join(tmpdir(), "machine-"));
    const path = join(dir, "machine.json");
    await writeFile(path, JSON.stringify({ washer: MINIMAL.washer }));

    await expect(loadMachine(path)).rejects.toThrow(`${path}: iron is missing`);
  });
});

describe("ironSetting", () => {
  test("finds a position by the key a row writes", () => {
    const machine = parseMachine(MINIMAL);
    expect(ironSetting(machine, "2")?.label).toBe("••");
    expect(ironSetting(machine, "nope")).toBeUndefined();
  });
});
