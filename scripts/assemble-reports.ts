// Gathers the reports CI produced into the directory the site serves at
// apis.ryankes.eu/washy-washy-cli/reports/. Run it as
// `bun scripts/assemble-reports.ts <out-dir>` from the repo root, after the
// check job has written junit.xml and coverage/. COMMIT and BUILD_DATE come
// from the environment so the index says which commit it describes.
//
// It refuses to run when an input is missing: a half-populated reports
// directory would deploy, replace the last good one, and 404 the links the
// catalogue points at.
import { access, cp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface IndexLink {
  label: string;
  href: string;
}

const REQUIRED = [
  "junit.xml",
  "coverage/lcov.info",
  "coverage/coverage.xml",
  "coverage/html/index.html",
];

const escapeHtml = (text: string) => Bun.escapeHTML(text);

// GitHub Pages has no directory listing, so every directory a link points at
// needs a page of its own. No colours of its own: `color-scheme` lets the
// browser's default link and background colours follow light and dark mode.
export function renderIndex(title: string, links: IndexLink[], note?: string): string {
  const items = links
    .map(
      ({ label, href }) => `      <li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`,
    )
    .join("\n");
  const noteHtml = note === undefined ? "" : `\n      <p>${escapeHtml(note)}</p>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light dark; }
      body { font: 1rem/1.5 system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }
      li { margin: 0.5rem 0; }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(title)}</h1>${noteHtml}
      <ul>
${items}
      </ul>
    </main>
  </body>
</html>
`;
}

const exists = (path: string) =>
  access(path).then(
    () => true,
    () => false,
  );

export async function assembleReports({
  root,
  out,
  commit,
  date,
}: {
  root: string;
  out: string;
  commit: string;
  date: string;
}) {
  for (const path of REQUIRED) {
    if (!(await exists(join(root, path)))) {
      throw new Error(`missing report input: ${path}`);
    }
  }

  await mkdir(join(out, "tests"), { recursive: true });
  await cp(join(root, "junit.xml"), join(out, "tests/unit.xml"));
  await writeFile(
    join(out, "tests/index.html"),
    renderIndex("Test results", [{ label: "Unit tests (JUnit XML)", href: "unit.xml" }]),
  );

  await cp(join(root, "coverage/html"), join(out, "coverage"), { recursive: true });
  await cp(join(root, "coverage/lcov.info"), join(out, "coverage/lcov.info"));
  await cp(join(root, "coverage/coverage.xml"), join(out, "coverage/coverage.xml"));

  await writeFile(
    join(out, "index.html"),
    renderIndex(
      "washy-washy-cli reports",
      [
        { label: "Tests", href: "tests/" },
        { label: "Unit tests (JUnit XML)", href: "tests/unit.xml" },
        { label: "Coverage (HTML)", href: "coverage/" },
        { label: "Coverage (Cobertura XML)", href: "coverage/coverage.xml" },
        { label: "Coverage (lcov)", href: "coverage/lcov.info" },
      ],
      `Commit ${commit}, built ${date}.`,
    ),
  );
}

if (import.meta.main) {
  const out = process.argv[2];
  if (!out) {
    console.error("usage: bun scripts/assemble-reports.ts <out-dir>");
    process.exit(2);
  }
  await assembleReports({
    root: process.cwd(),
    out,
    commit: process.env.COMMIT ?? "unknown",
    date: process.env.BUILD_DATE ?? new Date().toISOString(),
  });
}
