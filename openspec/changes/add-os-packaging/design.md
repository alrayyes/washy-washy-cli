## Context

See `proposal.md` — Why. Today's only distribution is source-via-Bun or the
GHCR image (`Dockerfile`, `publish-image.yml`, triggered on
`release: published`). Every `Bun.*` call in `src/` (`Bun.argv`,
`Bun.file(...).exists/.text/.json`) is confirmed to keep working inside a
`bun build --compile` binary, so no source changes are needed to make the
CLI standalone.

`release.yml` already gates every release on `check` passing on `main`
(`workflow_run`, `types: [completed]`, `if: conclusion == 'success'`) before
semantic-release runs — "all lights green" before a release exists is
already true. What doesn't exist yet is anything downstream of that release
publishing the OS packages the same automatic way `publish-image.yml`
publishes the container.

## Goals / Non-Goals

**Goals:**

- One binary artifact (`bun build --compile`), three thin wrappers around
  it (AUR, `.deb`, `.rpm`), a man page in every wrapper.
- Zero manual steps between a green `check` run and a package a user can
  install.
- CI proves installability, not just buildability, for every format.

**Non-Goals:**

- No apt/dnf repository hosting (self-hosted or PPA/COPR) — GitHub Release
  assets and the AUR are the only distribution points, per the confirmed
  least-resistance decision.
- No Windows/macOS binaries in this change — Arch/Debian/Fedora are all
  Linux, and npm distribution was explicitly dropped in favor of rpm.
- No change to `src/cli.ts`'s config resolution (env vars, XDG paths) —
  tracked separately in `washy-washy-cli#146`'s "Not in scope" note, filed
  before this change lands.

## Decisions

### Binary: `bun build --compile`, one per target

`bun build --compile --target=<platform> src/cli.ts --outfile dist/washy-washy-cli-<platform>`
for `linux-x64` and `linux-arm64`. Considered depending on an installed
Bun instead (`depends=('bun')` on Arch) — rejected because Bun isn't
packaged in Debian's repos, so the same dependency story can't work on all
three targets; a compiled binary sidesteps the question everywhere at once
instead of solving it three different ways.

### Man page: scdoc

Source lives at `man/washy-washy-cli.1.scd`, built with `scdoc` (already
the idiomatic choice for AUR packages) into `washy-washy-cli.1`, then
gzipped. Considered `pandoc` (heavier dependency, general-purpose tool for
a job `scdoc` does natively) and hand-written troff (no source format to
maintain, harder to keep in sync with real flags) — rejected both.

### Package builder: `nfpm` for `.deb`/`.rpm`

A single `nfpm.yaml` describes both outputs from the already-built binary
and man page — no `debian/` control tree, no `rpmbuild` spec, no
compiling inside the package build (the compile already happened). Matches
the confirmed least-resistance decision: nfpm wraps a prebuilt binary
instead of the scaffold repos' from-source approach.

### AUR: binary PKGBUILD, released via CI

`pkgname=washy-washy-cli-bin`. `source=` points at the GitHub Release's
`linux-x86_64`/`linux-aarch64` binary tarballs directly — never
`git.higherlearning.eu`, which returns a 404 on anonymous fetches even
for public repos (learned the hard way on the now-archived
`scaffold-arch-package`).
A release job regenerates `pkgver`, `sha256sums`, and `.SRCINFO`, then
pushes to `ssh://aur@aur.archlinux.org/washy-washy-cli-bin.git` using a
repo secret SSH key. No `makedepends`, no `build()` — `package()` only
copies the downloaded binary and man page into place.

### Everything triggers on `release: published`

Mirrors `publish-image.yml` exactly: a `workflow_dispatch` escape hatch for
re-running a failed publish against an existing tag, and the real trigger
is the GitHub Release semantic-release already only cuts after a green
`check` run. No new manual gate — "auto releases when all lights are
green" is what already happens; this change makes packaging one of the
things that follows from it automatically, same as the container image.

### CI verification: one job per distro, install and run for real

Three new `check.yml` jobs (mirroring the existing `dockerfile` job's "the
build compiling is worth less than the run proving it works"):

- `deb-install`: `debian:bookworm-slim` container, `dpkg -i` the built
  `.deb`, run `washy-washy-cli` against the bundled example chart, assert
  real PDFs come out.
- `rpm-install`: a Fedora container, `rpm -i`, same assertion.
- `aur-install`: an `archlinux:base` container, `makepkg` the PKGBUILD
  against a local build (not the published AUR git, so this runs on every
  PR, not just after publish), `pacman -U` the result, same assertion.

These run on every `check` invocation (PRs and `main`), not only on
release, so a packaging regression is caught before it ever reaches a
release — consistent with `check.yml`'s existing role as the gate nothing
skips.

## Risks / Trade-offs

- **AUR push failure is silent to CI** unless the release job's exit code
  is actually checked → treat it like `release.yml`'s own "is the token
  here?" pattern: fail loud with a clear message rather than swallowing a
  non-zero `git push`.
- **`bun build --compile` binary size** is untested — likely tens of MB
  since it embeds the Bun runtime → acceptable for a laundry-chart tool
  users install once; not a reason to complicate the design, but worth
  noting in the PR that reports actual sizes.
- **nfpm and scdoc are new tooling dependencies** → both are single
  statically linked binaries, pinned by exact version like every other
  tool in this repo; no ecosystem lock-in either represents.

## Migration Plan

Additive only — no existing behavior changes, no rollback beyond reverting
the change. The AUR package is new (nothing to migrate from), and adding
`.deb`/`.rpm` release assets doesn't affect the existing container image
publish path.
