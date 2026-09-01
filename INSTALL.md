# Installing washy-washy-cli

Four ways to get `washy-washy-cli` as a regular command, no Bun or Docker
required. All four come from the same standalone binary, built once per
release and published as GitHub Release assets — see
`openspec/changes/add-os-packaging/design.md` for how.

## Arch Linux (AUR)

```sh
git clone https://aur.archlinux.org/washy-washy-cli-bin.git
cd washy-washy-cli-bin
makepkg -si
```

Or with an AUR helper: `paru -S washy-washy-cli-bin` /
`yay -S washy-washy-cli-bin`.

## Nix / NixOS (flakes)

```sh
nix run github:alrayyes/washy-washy-cli
```

Or `nix profile install github:alrayyes/washy-washy-cli` to keep it. No
hosted binary cache — a first run/install fetches the same release binary
the AUR package installs (see `flake.nix`), not something Nix builds from
source.

## Debian / Ubuntu (.deb)

Download the `.deb` from the
[latest release](https://github.com/alrayyes/washy-washy-cli/releases/latest),
then:

```sh
sudo dpkg -i washy-washy-cli_*.deb
```

There's no apt repository — each release's `.deb` is a self-contained
download, not something `apt update` will ever find on its own.

## Fedora / RHEL (.rpm)

Download the `.rpm` from the
[latest release](https://github.com/alrayyes/washy-washy-cli/releases/latest),
then:

```sh
sudo rpm -i washy-washy-cli-*.rpm
```

Same deal as the `.deb`: no dnf/yum repository, a direct download per
release.

## After installing, any way

```sh
man washy-washy-cli
washy-washy-cli --help
```

If neither works, something went wrong during installation — see
[`README.md`](README.md#usage) for what running it should actually look
like, and open an issue if the two disagree.
