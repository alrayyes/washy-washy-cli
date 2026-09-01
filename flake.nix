{
  description = "Turns a JSON chart of laundry piles into a phone PDF and a printable PDF";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachSystem [ "x86_64-linux" "aarch64-linux" ] (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        # Kept in sync with .release-please-manifest.json by hand --
        # release-please owns that file, not this one.
        version = "3.1.1";

        # A prebuilt binary, wrapped rather than built from source --
        # unlike this account's Go/Python flakes (movie-planner,
        # hush-hush, linkwarden-obsidian-sync), which all build for
        # real against nixpkgs' own package sets. `bun build --compile`
        # can't be reproduced that way: building it with nixpkgs' own
        # `bun` links against whatever libicu/libstdc++ that build
        # happens to carry, which almost never matches the running
        # system's -- the binary still runs, but silently falls back to
        # Bun's own CLI menu instead of the embedded script, for every
        # argument including --help (confirmed directly; see
        # PKGBUILD's own comments for the same finding against
        # `makepkg`'s strip pass). The release job sidesteps this by
        # building with Bun's official installer inside a pinned
        # debian:bookworm-slim container, so this flake fetches that
        # same release asset instead -- the one genuinely portable
        # artifact, same asset URLs and per-architecture split the
        # PKGBUILD already uses.
        archInfo = {
          x86_64-linux = {
            bunArch = "x64";
            hash = "sha256-pjK8Co2tMZAA2T3FNOfunKPNkulw9lMbCOLQikapTZM=";
          };
          aarch64-linux = {
            bunArch = "arm64";
            hash = "sha256-T7dajnyMJC94EhNXUhFdKQ8Pg9Xohcof0oIkit8k3vQ=";
          };
        }.${system};

        binary = pkgs.fetchurl {
          url = "https://github.com/alrayyes/washy-washy-cli/releases/download/v${version}/washy-washy-cli-linux-${archInfo.bunArch}";
          hash = archInfo.hash;
        };

        # Same release asset the AUR PKGBUILD installs -- already
        # scdoc-generated and gzipped by the release job's own `bun run
        # build:man` step, so this is a straight fetch-and-install, not
        # a regeneration (which would need Bun in this flake too, the
        # exact thing wrapping a prebuilt binary is meant to avoid).
        manPage = pkgs.fetchurl {
          name = "washy-washy-cli.1.gz";
          url = "https://github.com/alrayyes/washy-washy-cli/releases/download/v${version}/washy-washy-cli.1.gz";
          hash = "sha256-xZNK4eMyEr/9iu7lS6vhwug8o0LehcO1CC1+kQTg4Gg=";
        };
      in
      {
        packages.default = pkgs.stdenvNoCC.mkDerivation {
          pname = "washy-washy-cli";
          inherit version;

          dontUnpack = true;
          nativeBuildInputs = [ pkgs.installShellFiles ];

          installPhase = ''
            runHook preInstall
            install -Dm755 ${binary} $out/bin/washy-washy-cli
            installManPage ${manPage}
            runHook postInstall
          '';

          meta = {
            description = "Turns a JSON chart of laundry piles into a phone PDF and a printable PDF";
            homepage = "https://github.com/alrayyes/washy-washy-cli";
            license = pkgs.lib.licenses.gpl3Plus;
            mainProgram = "washy-washy-cli";
            platforms = [
              "x86_64-linux"
              "aarch64-linux"
            ];
          };
        };

        apps.default = flake-utils.lib.mkApp { drv = self.packages.${system}.default; };
      }
    );
}
