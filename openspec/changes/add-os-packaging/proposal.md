## Why

Today the only way to run washy-washy is from source with Bun or via the
GHCR container image. Neither is a "regular command" — there's no path for
an Arch, Debian/Ubuntu, or Fedora/RHEL user to install it the way they
install everything else on their system.

## What Changes

- Add a `bun build --compile` step (per target platform) to the release
  pipeline, producing a standalone binary with no Bun/Node runtime
  dependency. Verified against the current source: every `Bun.*` call in
  `src/` (`Bun.argv`, `Bun.file(...).exists/.text/.json`) still works
  inside a compiled binary, so this needs no code changes.
- Package that binary three ways, all sourced from GitHub Release assets,
  no separate repo hosting:
  - **AUR**: a binary `PKGBUILD` (`pkgname=washy-washy-cli-bin`) whose
    `source=` points at the tagged release tarball/binary on
    `github.com`, pushed to `ssh://aur@aur.archlinux.org/washy-washy-cli-bin.git`.
    Never sourced from `git.higherlearning.eu` — that instance returns a
    404 on anonymous fetches even for public repos.
  - **`.deb`**: built with `nfpm` from the compiled binary, attached as a
    release asset. Installed with `dpkg -i`; no apt repository.
  - **`.rpm`**: built with `nfpm` from the same binary, attached as a
    release asset. Installed with `rpm -i`; no dnf/yum repository.
- Generate and ship a man page (`washy-washy-cli(1)`) in all three
  packages — `usr/share/man/man1/` for the `.deb`/`.rpm` via `nfpm`'s
  `contents`, and the PKGBUILD's `package()` step for the AUR.
- CI proves each package actually installs and runs, not just that it
  builds: install the `.deb` in a Debian container and the `.rpm` in a
  Fedora container, `makepkg`/`pacman -U` the PKGBUILD in an Arch
  container, and run the installed command against the bundled example
  chart in each — mirroring the existing `dockerfile` job's "the build
  compiling is worth less than the run proving it works."
- Add `actions/attest-build-provenance` to the release job, per
  `rules/releases.md`'s unconditional-provenance guidance. No cosign, no
  SBOM, no GitHub Packages publish — this repo has nothing package-shaped
  for GitHub Packages to carry, and goreleaser isn't in play (this is a
  Bun/TypeScript project, not Go).
- Update `README.md` with install instructions per package format once
  each is verified working.

## Capabilities

### New Capabilities

- `os-packaging`: building a standalone CLI binary per platform on
  release and distributing it as an AUR package, a `.deb`, and a `.rpm`,
  all installable without a hosted package repository.

### Modified Capabilities

_None._ This adds a new distribution path; it doesn't change any existing
CLI behavior or requirement.

## Impact

- `.github/workflows/` — a new or extended release job builds the
  compiled binaries and runs `nfpm` for `.deb`/`.rpm`; a separate job or
  script pushes the PKGBUILD to the AUR git remote; new CI jobs install
  and smoke-test each package format in its own distro container.
- A new man page source lives in this repo (format TBD in design.md) and
  is built alongside the binary.
- New AUR-side git history at `ssh://aur@aur.archlinux.org/washy-washy-cli-bin.git`,
  owned outside this repo.
- `README.md` gains an install section per package format.
- New secrets: an AUR SSH deploy key (`nfpm`/`bun build --compile` need
  no new secrets beyond what release already uses).
- Per this project's ticket-first convention for personal projects, an
  issue with the four standard parts must exist before implementation
  starts.
