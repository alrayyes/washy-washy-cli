# os-packaging Specification

## Purpose

Lets an Arch, Debian/Ubuntu, or Fedora/RHEL user install and run washy-washy
as a regular command, the way they install everything else on their system,
without needing Bun, Node, or Docker.

## Requirements

### Requirement: Standalone binary

The system SHALL produce a standalone binary per supported platform on
every release, with no Bun or Node runtime dependency at the point of use.

#### Scenario: Binary runs without a JS runtime installed

- **WHEN** the compiled binary is invoked on a machine with neither Bun
  nor Node installed
- **THEN** it runs the CLI normally, producing the same output as
  `bun run src/cli.ts` with the same arguments

### Requirement: Man page

Every package format SHALL install a man page for the command.

#### Scenario: Man page readable after any install method

- **WHEN** the package is installed via any of the AUR, `.deb`, or `.rpm`
  paths
- **THEN** `man washy-washy-cli` displays the command's usage

### Requirement: AUR package

The system SHALL keep an AUR package (`washy-washy-cli-bin`) in sync with
each release, sourced from the release binary rather than built from
source.

#### Scenario: AUR package updates on release

- **WHEN** a new version is released
- **THEN** the AUR package's `PKGBUILD` and `.SRCINFO` are updated and
  pushed to `aur.archlinux.org` with no manual step

### Requirement: Debian package artifact

The system SHALL attach a `.deb` built from the release binary to every
GitHub Release.

#### Scenario: Installable without an apt repository

- **WHEN** a user downloads the `.deb` from a GitHub Release and runs
  `dpkg -i`
- **THEN** `washy-washy-cli` is available as a command on their `PATH`

### Requirement: RPM package artifact

The system SHALL attach an `.rpm` built from the release binary to every
GitHub Release.

#### Scenario: Installable without a dnf/yum repository

- **WHEN** a user downloads the `.rpm` from a GitHub Release and runs
  `rpm -i`
- **THEN** `washy-washy-cli` is available as a command on their `PATH`

### Requirement: Package installation is verified, not just built

CI SHALL prove each package format actually installs and runs before a
release is considered complete, not merely that it built.

#### Scenario: Each format is installed and exercised in its own distro

- **WHEN** CI runs for a release candidate
- **THEN** the `.deb` is installed and run inside a Debian container, the
  `.rpm` inside a Fedora container, and the PKGBUILD is built and
  installed inside an Arch container, each producing real output PDFs
  from the bundled example chart

### Requirement: Fully automatic publishing

Publishing every package format SHALL require no manual step beyond the
existing Conventional-Commits-driven release.

#### Scenario: Packages publish themselves on a green release

- **WHEN** `check` passes on `main` and semantic-release cuts a new
  version
- **THEN** the binaries, `.deb`, `.rpm`, man page, and AUR update all
  publish automatically, the same way `publish-image.yml` already
  publishes the container image on `release: published`
