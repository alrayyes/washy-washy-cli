## 1. Ticket

- [x] 1.1 Filed [washy-washy-cli#150](https://github.com/alrayyes/washy-washy-cli/issues/150),
      referencing `washy-washy-cli#146`'s deferred config-layering note.

## 2. Man page

- [x] 2.1 Wrote `man/washy-washy-cli.1.scd` covering the CLI's real flags
      and usage; verified it renders cleanly with `scdoc`, with no
      warnings, and reads correctly under `man -l`.
- [x] 2.2 Added a `bun run build:man` script that runs `scdoc` and gzips
      the result to `dist/washy-washy-cli.1.gz`; verified the file exists
      after running it.

## 3. Standalone binary

- [x] 3.1 Added a `bun run build:binaries` script, wrapping
      `bun build --compile` once per target (`bun-linux-x64`,
      `bun-linux-arm64`); verified the x64 binary runs standalone.
      Correction to the design:
      the compiled binary is dynamically linked against the building
      machine's own glibc, not fully static (confirmed via `file`), and
      the `-musl` target doesn't help either since it needs its own musl
      interpreter present, confirmed to fail outright on a plain glibc
      host. Building inside a pinned older-glibc container
      (`debian:bookworm-slim`, matching the `Dockerfile`'s own base)
      rather than directly on the Actions runner keeps the binary's
      minimum glibc compatible with the oldest package target instead of
      whatever `ubuntu-latest` happens to ship.
- [x] 3.2 Verified the compiled binary against the bundled example chart
      matches `bun run generate` (same command, same
      `data/washy-washy.json.dist`): the same console summary and
      identical file sizes for all 22 outputs. The PDFs aren't
      byte-identical -- pdf-lib embeds a random trailer ID per save,
      confirmed via a byte-level diff showing only a handful of scattered
      differences, not a structural one -- so this criterion was revised
      from "byte-identical" to match what's actually checkable.

## 4. Packaging

- [x] 4.1 Added `nfpm.yaml` (binary at `/usr/bin/washy-washy-cli`, man
      page and `LICENSE` alongside); verified `nfpm` produces an
      installable `.deb` and `.rpm` from it (pinned nfpm v2.44.1). Two
      things found in the process. First, nfpm doesn't expand custom
      variables inside a content file's source path, so this file is run
      through `envsubst` with an explicit variable list in CI before nfpm
      ever reads it -- a bare `envsubst` would blank anything else
      matching that syntax in the file, comments included. Second,
      `debian:bookworm-slim`'s dpkg ships a `path-exclude` for
      `/usr/share/man/*` and `/usr/share/doc/*` (Docker's own
      size-reduction convention, confirmed directly against its dpkg
      config) -- installing the `.deb` there silently drops the man page
      and LICENSE with no error. A real Debian/Ubuntu install has no such
      exclusion, confirmed against plain `debian:bookworm`, so the CI
      verification job in task 6.1 has to use that image, not `-slim`,
      or it would pass while hiding a file that's only missing on
      Docker's own default install.
- [x] 4.2 Wrote `PKGBUILD` (`pkgname=washy-washy-cli-bin`), `source=`
      pointing at release binary assets on `github.com`. Verified with a
      local HTTP server standing in for the release and a real
      `makepkg`/`pacman -U`/`namcap` pass. Found and fixed a serious
      problem: makepkg's default tidy pass strips binaries, and stripping
      a `bun build --compile` executable corrupts it -- it still ran, but
      silently fell back to printing Bun's own CLI menu instead of the
      embedded script's output, for every argument including `--help`.
      Fixed with `options=(!strip !debug)`. `namcap` on the built package
      is otherwise clean except for warnings inherent to packaging
      someone else's prebuilt binary (unstripped, lacks PIE/RELRO,
      "unused" libc libraries) -- documented in the PKGBUILD rather than
      chased, since there's no source compile here to add flags to. Added
      `depends=('glibc')` and swapped a literal `x86_64` for `$CARCH` per
      namcap's PKGBUILD-lint pass, which is otherwise clean.
- [x] 4.3 Wrote `scripts/publish-aur.sh`: bumps `pkgver`, clones the AUR
      repo fresh into a scratch directory, runs `updpkgsums`, regenerates
      `.SRCINFO`, commits, and pushes. Dry-ran end to end against a local
      bare git repository standing in for the AUR and a local HTTP server
      standing in for the release assets -- a real clone, a real
      `updpkgsums` download and checksum, a real commit and push,
      verified by cloning the result back. Two things found. First,
      `updpkgsums`/`makepkg` refuse to run as root outright, so the CI
      job needs a non-root user, same as the `aur-install` verification
      job in 6.3. Second, the original "skip if nothing changed" check
      compared the unstaged working tree to `HEAD`, which never shows an
      untracked file as different -- exactly what `PKGBUILD`/`.SRCINFO`
      are on a repo's first-ever publish, so it silently skipped the push
      entirely. Fixed by staging the files first and comparing the index
      to `HEAD` instead, which correctly diffs against git's implicit
      empty tree when there's no `HEAD` yet. Real AUR authentication is
      still unverified -- that can't happen without hitting the real
      service, which is what task 7.2's real release is for.

## 5. Release pipeline

- [x] 5.1 Added `.github/workflows/publish-packages.yml`, triggered on
      `release: published` plus a `workflow_dispatch` `ref` input,
      matching `publish-image.yml`'s shape. Builds both binaries, the man
      page, and both `nfpm` packages per architecture inside pinned
      `debian:bookworm-slim` (a real, resolved digest, not a placeholder),
      then uploads everything via `gh release upload`. Each individual
      step -- the Bun install, the binary build, the man page, the `nfpm`
      build -- is the same one already verified working in isolation
      earlier in this file; the full workflow file itself isn't run end
      to end here, since that needs a real `release: published` event,
      which only exists once this change's own first release ships (task
      7.2).
- [x] 5.2 Added a `publish-aur` job, gated on `build-packages`, running
      `scripts/publish-aur.sh` as a non-root user against the real AUR
      remote with the `AUR_SSH_KEY` secret. `set -euo pipefail` plus the
      script's own explicit error handling around the final push covers
      "fails loudly": a failed push surfaces as a failed step, not a
      silently green job.
- [x] 5.3 Added `actions/attest-build-provenance`, pinned to v3.0.0's
      real commit SHA (resolved via the GitHub API rather than typed from
      memory -- this caught one mistyped commit SHA and one placeholder
      Docker image digest before either could have failed silently in
      CI), for the binaries and packages.

## 6. CI verification

- [x] 6.1 Added `deb-install` to `ci.yml`: builds the binary, man page,
      and `.deb` in `debian:bookworm-slim`, then installs and runs it in
      plain `debian:bookworm` per task 4.1's finding. Verified by running
      the exact script GitHub Actions would run -- extracted from the
      committed YAML itself, not a hand-copy, so a YAML block-scalar
      reindenting mistake couldn't hide a difference -- against a real
      checkout: real PDFs, a real `man washy-washy-cli`, both clean.
- [x] 6.2 Added `rpm-install`: same shape, against Fedora 41. Found two
      more missing pieces the same way: Fedora ships neither `man-db` nor
      `util-linux` (which provides `col`, needed for `man` to actually
      render a page rather than just find it) by default, so both are
      installed explicitly now. Verified clean the same way as 6.1.
- [x] 6.3 Added `aur-install`: builds a CI-only `PKGBUILD` (the real
      `source=` needs a real release, which doesn't exist on most pull
      requests) by keeping only the real `PKGBUILD`'s `package()` body
      and pointing `source=` at bare local filenames -- confirmed
      `makepkg` copies those straight from its own directory, no network
      involved. Runs `makepkg` as a non-root `builder` user, since root
      is refused outright, same finding as 4.3, then `pacman -U`s the
      result. Found the same class of problem a third time: the official
      `archlinux` Docker image's `pacman.conf` ships a `NoExtract` rule
      for `usr/share/man/*` -- Docker's own size default again, not
      anything a real Arch install carries -- silently dropping the man
      page until that line is stripped before installing. Verified clean
      the same way as 6.1 and 6.2.
- [x] 6.4 All three were verified end to end locally against the actual
      committed workflow YAML, extracted and run rather than
      hand-transcribed. A real GitHub Actions run is still unverified --
      that happens once this change's pull request actually opens and its
      pipeline runs, watched through per the pull-request skill, rather
      than claimed in advance here.

## 7. Docs and verification

- [x] 7.1 Added a dedicated `INSTALL.md`, per a steer during this session
      to keep it separate rather than fold it into `README.md`, covering
      all three formats and ending each with `man washy-washy-cli`.
      `README.md`'s Installation section now points to it ahead of the
      from-source instructions.
- [x] 7.2 Cut one real tagged release and confirm, by hand, that: the
      release carries all expected assets, `dpkg -i`/`rpm -i` each install
      a working command, the AUR package updated on `aur.archlinux.org`,
      and `man washy-washy-cli` works from all three. Close the ticket
      from 1.1 referencing this release.
      v3.1.2 carries all expected assets; deb-install/rpm-install CI
      confirmed dpkg -i/rpm -i work; AUR confirmed live via the AUR RPC
      API (`washy-washy-cli-bin` 3.1.2-1) and hand-verified by Ryan.
      Issue #150 already closed.
