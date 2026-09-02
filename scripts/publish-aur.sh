#!/usr/bin/env bash
# Publishes/updates the washy-washy-cli-bin AUR package for one release.
# Run from the repo root with VERSION set (the tag without its leading
# "v", e.g. "1.2.3") and an SSH key for the AUR's `aur` user already
# loaded (CI: the AUR_SSH_KEY secret; see openspec/changes/
# add-os-packaging/design.md for why this is a shared, dedicated key
# rather than anyone's personal one).
#
# The AUR repo is a separate git history from this one -- it's cloned
# fresh into a scratch directory each run, not kept as a subtree here.
set -euo pipefail

: "${VERSION:?VERSION must be set, e.g. VERSION=1.2.3}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRATCH="$(mktemp -d)"
trap 'rm -rf "$SCRATCH"' EXIT

echo "==> Bumping pkgver to $VERSION"
sed -i "s/^pkgver=.*/pkgver=$VERSION/" "$REPO_ROOT/PKGBUILD"

echo "==> Cloning the AUR package repo"
git clone ssh://aur@aur.archlinux.org/washy-washy-cli-bin.git "$SCRATCH/aur"
cp "$REPO_ROOT/PKGBUILD" "$SCRATCH/aur/PKGBUILD"

cd "$SCRATCH/aur"

echo "==> Recomputing checksums against the real release assets, per architecture"
# Deliberately not `updpkgsums PKGBUILD`: it resolves $CARCH from the
# machine actually running it (/etc/makepkg.conf hardcodes CARCH to the
# real arch, no env override reaches it), so on this job's single-arch
# runner it can only ever correctly checksum ITS OWN architecture --
# every other declared arch silently gets that same wrong checksum
# copied in instead of its real one. Confirmed live: sha256sums_aarch64
# was a byte-for-byte duplicate of the x86_64 binary's checksum, not the
# real arm64 asset's, for as long as this package has been published.
# See rules/packaging.md. Fetching and hashing each arch's own real
# source here instead, then writing the result straight into PKGBUILD.
# CARCH itself has to be set before this first source too -- PKGBUILD
# references it unconditionally (in the source= local filenames) and
# set -u trips over it otherwise. The actual value doesn't matter here;
# only $arch (the declared architecture list) is read at this point.
CARCH="${CARCH:-x86_64}" source PKGBUILD
for target_arch in "${arch[@]}"; do
  # A fresh subshell per arch, with CARCH pinned to *that* arch before
  # sourcing PKGBUILD again -- the only way to get source_<arch>'s own
  # local filenames and URLs to resolve correctly for an arch that isn't
  # this runner's real one.
  sums=()
  while IFS= read -r url; do
    sums+=("$(curl -fsSL "$url" | sha256sum | cut -d' ' -f1)")
  done < <(
    CARCH="$target_arch"
    source PKGBUILD
    declare -n sources="source_${target_arch}"
    for entry in "${sources[@]}"; do
      echo "${entry#*::}"
    done
  )
  python3 - "$target_arch" "${sums[@]}" <<'PYEOF'
import re
import sys

target_arch, *sums = sys.argv[1:]
with open("PKGBUILD") as f:
    content = f.read()

indent = "\n" + " " * 20
quoted = indent.join(f"'{s}'" for s in sums)
content, n = re.subn(
    rf"sha256sums_{target_arch}=\([^)]*\)",
    f"sha256sums_{target_arch}=({quoted})",
    content,
)
assert n == 1, f"expected exactly one sha256sums_{target_arch}=(...) block, found {n}"

with open("PKGBUILD", "w") as f:
    f.write(content)
PYEOF
done

echo "==> Regenerating .SRCINFO"
makepkg --printsrcinfo > .SRCINFO

# `git diff` (unstaged) never shows an untracked file as different, which
# a brand first publish always is -- `git add` then check the index
# against HEAD instead, which handles "nothing committed yet" the same
# way as "already published, nothing changed."
git add PKGBUILD .SRCINFO
if git diff --cached --quiet; then
  echo "No change against the published package; nothing to push."
  exit 0
fi

git -c user.name="washy-washy-cli release" -c user.email="ryan@andthensome.nl" \
  commit -m "release $VERSION"

echo "==> Pushing to the AUR"
# A failed push here must fail the job loudly, not get swallowed --
# `set -e` already does that, this echo just makes the failure legible
# in the Actions log rather than a bare non-zero exit.
git push origin master || {
  echo "::error::Failed to push washy-washy-cli-bin $VERSION to the AUR" >&2
  exit 1
}
