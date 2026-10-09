import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assembleReports, renderIndex } from "../scripts/assemble-reports";

let root: string;
let out: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "reports-in-"));
  out = await mkdtemp(join(tmpdir(), "reports-out-"));
  await mkdir(join(root, "coverage/html"), { recursive: true });
  await writeFile(join(root, "junit.xml"), "<testsuites/>");
  await writeFile(join(root, "coverage/lcov.info"), "TN:\nend_of_record\n");
  await writeFile(join(root, "coverage/coverage.xml"), "<coverage/>");
  await writeFile(join(root, "coverage/html/index.html"), "<html>cov</html>");
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
  await rm(out, { recursive: true, force: true });
});

const meta = { commit: "abc1234", date: "2026-10-09T10:00:00Z" };

describe("assembleReports", () => {
  test("lays the tests and coverage out as the site serves them", async () => {
    await assembleReports({ root, out, ...meta });
    expect(await readFile(join(out, "tests/unit.xml"), "utf8")).toBe("<testsuites/>");
    expect(await readFile(join(out, "coverage/coverage.xml"), "utf8")).toBe("<coverage/>");
    expect(await readFile(join(out, "coverage/lcov.info"), "utf8")).toBe("TN:\nend_of_record\n");
    expect(await readFile(join(out, "coverage/index.html"), "utf8")).toBe("<html>cov</html>");
  });

  test("writes a tests page and a top-level index with the commit and date", async () => {
    await assembleReports({ root, out, ...meta });
    expect(await readFile(join(out, "tests/index.html"), "utf8")).toContain('href="unit.xml"');
    const index = await readFile(join(out, "index.html"), "utf8");
    expect(index).toContain('href="tests/"');
    expect(index).toContain('href="coverage/"');
    expect(index).toContain('href="coverage/coverage.xml"');
    expect(index).toContain("abc1234");
    expect(index).toContain("2026-10-09T10:00:00Z");
  });

  test("refuses to run when an input is missing", async () => {
    await rm(join(root, "coverage/coverage.xml"));
    await expect(assembleReports({ root, out, ...meta })).rejects.toThrow(
      "missing report input: coverage/coverage.xml",
    );
  });
});

describe("renderIndex", () => {
  test("escapes what it is given", () => {
    const html = renderIndex("a <b>", [{ label: "x & y", href: 'z"' }]);
    expect(html).toContain("a &lt;b&gt;");
    expect(html).toContain("x &amp; y");
    expect(html).toContain("z&quot;");
  });

  test("puts the note under the title when there is one", () => {
    expect(renderIndex("T", [], "built from abc")).toContain("<p>built from abc</p>");
    expect(renderIndex("T", [])).not.toContain("<p>");
  });
});
