## 1. Ticket

- [ ] 1.1 File the issue with all four parts (description, background,
      acceptance criteria, definition of done) per the personal-project
      ticket-first convention, before any of the tasks below start.
      Reference `washy-washy-cli#146`'s deferred config-layering note.

## 2. Man page

- [ ] 2.1 Write `man/washy-washy-cli.1.scd` covering the CLI's real flags
      and usage; verify `scdoc < man/washy-washy-cli.1.scd | man -l -`
      renders cleanly with no scdoc warnings.
- [ ] 2.2 Add a `bun run build:man` script that runs `scdoc` and gzips the
      result to `dist/washy-washy-cli.1.gz`; verify the file exists after
      running it.

## 3. Standalone binary

- [ ] 3.1 Add a `bun run build:binary` script wrapping `bun build --compile`
      for `linux-x64` and `linux-arm64`; verify both binaries run
      `--help` (or equivalent) with no Bun installed on `$PATH`.
- [ ] 3.2 Verify the compiled binary against the bundled example chart
      produces byte-identical PDFs to `bun run generate` (same command,
      same `data/washy-washy.json.dist`).

## 4. Packaging

- [ ] 4.1 Add a pinned-version `nfpm.yaml` describing the `.deb` and
      `.rpm` outputs: the linux-x64 binary at `/usr/bin/washy-washy-cli`
      and the gzipped man page at `/usr/share/man/man1/`; verify
      `nfpm package --config nfpm.yaml --packager deb` and `--packager rpm`
      each produce a file.
- [ ] 4.2 Write `PKGBUILD` (`pkgname=washy-washy-cli-bin`) whose `source=`
      points at the release binary tarball on `github.com` (never
      `git.higherlearning.eu`); verify `makepkg` builds and
      `namcap washy-washy-cli-bin-*.pkg.tar.zst` reports no errors.
- [ ] 4.3 Write the AUR-publish script: regenerate `pkgver`, `sha256sums`
      via `updpkgsums`, and `.SRCINFO` via `makepkg --printsrcinfo`, then
      push to `ssh://aur@aur.archlinux.org/washy-washy-cli-bin.git`;
      verify by dry-running against a scratch AUR-shaped git remote (not
      the real AUR) until a real release exists to test against for real.

## 5. Release pipeline

- [ ] 5.1 Add a `build-packages` job to a workflow triggered on
      `release: published` (plus a `workflow_dispatch` re-run input,
      matching `publish-image.yml`'s shape): builds both binaries, the
      man page, both `nfpm` packages, and uploads all four plus the two
      raw binaries as release assets via `gh release upload`.
- [ ] 5.2 Add a `publish-aur` job to the same workflow, gated on
      `build-packages` succeeding, running the AUR-publish script against
      the real AUR remote using a repo secret SSH deploy key; verify it
      fails loudly (non-zero exit surfaces in the Actions UI) rather than
      swallowing a failed `git push`.
- [ ] 5.3 Add `actions/attest-build-provenance` for the binaries and
      packages in the same job, per `rules/releases.md`.

## 6. CI verification

- [ ] 6.1 Add a `deb-install` job to `check.yml`: build the `.deb` in a
      `debian:bookworm-slim` container, `dpkg -i` it, run
      `washy-washy-cli` against the bundled example chart, and assert
      real PDFs come out (`test -s`, mirroring the existing `dockerfile`
      job's assertions).
- [ ] 6.2 Add an `rpm-install` job: same shape, in a Fedora container with
      `rpm -i`.
- [ ] 6.3 Add an `aur-install` job: `makepkg` the PKGBUILD in an
      `archlinux:base` container against a local build (not the published
      AUR git), `pacman -U` the result, same PDF assertion.
- [ ] 6.4 Verify all three jobs run on every pull request, not only on
      release, by opening a throwaway PR and confirming they appear and
      pass.

## 7. Docs and verification

- [ ] 7.1 Update `README.md` with install instructions for AUR, `.deb`,
      and `.rpm`, each ending in `man washy-washy-cli` to confirm the man
      page landed.
- [ ] 7.2 Cut one real tagged release and confirm, by hand, that: the
      release carries all expected assets, `dpkg -i`/`rpm -i` each install
      a working command, the AUR package updated on `aur.archlinux.org`,
      and `man washy-washy-cli` works from all three. Close the ticket
      from 1.1 referencing this release.
