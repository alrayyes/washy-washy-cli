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

echo "==> Recomputing checksums against the real release assets"
# updpkgsums needs makepkg's own tooling (base-devel) present -- the CI
# job installing this script runs it inside an archlinux container for
# exactly that reason.
updpkgsums PKGBUILD

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
