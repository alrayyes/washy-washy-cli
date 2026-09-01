## [2.16.0](https://github.com/alrayyes/washy-washy-cli/compare/v2.15.0...v2.16.0) (2026-08-22)

### Features

* validate-config and new-config commands, config schema autocomplete ([#112](https://github.com/alrayyes/washy-washy-cli/issues/112)) ([5fd7c1d](https://github.com/alrayyes/washy-washy-cli/commit/5fd7c1dc0f5436d271b1cd5ae48dd617dbed6557)), closes [#23](https://github.com/alrayyes/washy-washy-cli/issues/23)

## [3.1.2](https://github.com/alrayyes/washy-washy-cli/compare/v3.1.1...v3.1.2) (2026-09-01)


### Bug Fixes

* **cli:** --help exits 0, not 1 ([#175](https://github.com/alrayyes/washy-washy-cli/issues/175)) ([93392f7](https://github.com/alrayyes/washy-washy-cli/commit/93392f7ff7def4f7e7d2414b28575f834dbe25cc))
* **flake:** bump to v3.1.1 and its real asset hashes ([#174](https://github.com/alrayyes/washy-washy-cli/issues/174)) ([1bf598d](https://github.com/alrayyes/washy-washy-cli/commit/1bf598d0ef4a553a18489e002951e742b0edc9b8))
* **release:** use RELEASE_TOKEN for release-please-action ([#173](https://github.com/alrayyes/washy-washy-cli/issues/173)) ([57ca86a](https://github.com/alrayyes/washy-washy-cli/commit/57ca86a376101e12bf516a203a637b273a784823))

## [3.1.1](https://github.com/alrayyes/washy-washy-cli/compare/v3.1.0...v3.1.1) (2026-09-01)


### Bug Fixes

* **aur:** point x86_64 source at the real washy-washy-cli-linux-x64 asset ([#171](https://github.com/alrayyes/washy-washy-cli/issues/171)) ([7db262e](https://github.com/alrayyes/washy-washy-cli/commit/7db262e90352304fb736ec4dbbfbca91d6d6bede))
* **deps:** bump @washy-washy/pdf from 2.3.5 to 2.3.7 ([#166](https://github.com/alrayyes/washy-washy-cli/issues/166)) ([51fd5a5](https://github.com/alrayyes/washy-washy-cli/commit/51fd5a51ff9f8b1d3e406d4390b801003f61303a))
* **docs:** regenerate stale example PDFs and screenshots ([#172](https://github.com/alrayyes/washy-washy-cli/issues/172)) ([84079c9](https://github.com/alrayyes/washy-washy-cli/commit/84079c9a94a093d1c8166d30988442f67b6f436e))

## [3.1.0](https://github.com/alrayyes/washy-washy-cli/compare/v3.0.0...v3.1.0) (2026-09-01)


### Features

* package washy-washy-cli for Nix/NixOS via a flake.nix ([#161](https://github.com/alrayyes/washy-washy-cli/issues/161)) ([c86c1fb](https://github.com/alrayyes/washy-washy-cli/commit/c86c1fb3aebd64ca2b4db0d356b2e3f971284b59)), closes [#160](https://github.com/alrayyes/washy-washy-cli/issues/160)


### Bug Fixes

* **release:** install gh in the packaging container ([#163](https://github.com/alrayyes/washy-washy-cli/issues/163)) ([0fa286e](https://github.com/alrayyes/washy-washy-cli/commit/0fa286e6f82738321be431f1432c8022dd93840f)), closes [#162](https://github.com/alrayyes/washy-washy-cli/issues/162)
* **release:** use bash for the packaging step, add a re-run trigger ([#156](https://github.com/alrayyes/washy-washy-cli/issues/156)) ([e1a17bf](https://github.com/alrayyes/washy-washy-cli/commit/e1a17bf9e65370c8d820d337e97eeab634184882))
* **release:** wire NFPM_GOARCH to the bun target name, not the nfpm arch ([#159](https://github.com/alrayyes/washy-washy-cli/issues/159)) ([b3eb860](https://github.com/alrayyes/washy-washy-cli/commit/b3eb860dc557e78a36a9fb071adc47f262876eb1)), closes [#158](https://github.com/alrayyes/washy-washy-cli/issues/158)

## [3.0.0](https://github.com/alrayyes/washy-washy-cli/compare/v2.16.0...v3.0.0) (2026-08-31)


### ⚠ BREAKING CHANGES

* `bun run migrate-config` no longer exists. Anyone still on the old data/machine.json + data/washing-instructions.csv setup needs to hand-write data/washy-washy.json instead (see the README for the format), or migrate before upgrading.
* bump @washy-washy/pdf to 2.0.1 (breaking: render return shape, non-WinAnsi reporting) ([#131](https://github.com/alrayyes/washy-washy-cli/issues/131))

### Features

* bump @washy-washy/core to 1.3.0 (per-row reference citations) ([#127](https://github.com/alrayyes/washy-washy-cli/issues/127)) ([112eb74](https://github.com/alrayyes/washy-washy-cli/commit/112eb742a9f1707ac5e43aa730893d8de7faa0d6)), closes [#125](https://github.com/alrayyes/washy-washy-cli/issues/125)
* package the CLI for AUR, deb, and rpm ([#151](https://github.com/alrayyes/washy-washy-cli/issues/151)) ([2c5bef6](https://github.com/alrayyes/washy-washy-cli/commit/2c5bef61124e3d03ed149359d67b1de29bf9c712))
* swap @washy-washy/core and @washy-washy/pdf for published versions ([#113](https://github.com/alrayyes/washy-washy-cli/issues/113)) ([f7b4f45](https://github.com/alrayyes/washy-washy-cli/commit/f7b4f45887b98b7b1bdee9326b7962cb2e7a85fb)), closes [#94](https://github.com/alrayyes/washy-washy-cli/issues/94)
* write a per-pile card PDF using @washy-washy/pdf's renderCard ([#137](https://github.com/alrayyes/washy-washy-cli/issues/137)) ([4b5290a](https://github.com/alrayyes/washy-washy-cli/commit/4b5290a4e281f80baf2242f64203ce1e7e3ef6ca))


### Bug Fixes

* .gitignore never updated for the combined config ([#119](https://github.com/alrayyes/washy-washy-cli/issues/119)) ([2a597f3](https://github.com/alrayyes/washy-washy-cli/commit/2a597f3ebbf02115f8ad80dbed5d7d740de3ad36)), closes [#118](https://github.com/alrayyes/washy-washy-cli/issues/118)
* bump @washy-washy/core to 1.3.1 (duration field validation) ([#135](https://github.com/alrayyes/washy-washy-cli/issues/135)) ([0b1f067](https://github.com/alrayyes/washy-washy-cli/commit/0b1f067e02845ddc1e18709623ffd5921752f9f8))
* bump @washy-washy/pdf to 1.0.2 (two correctness fixes) ([#115](https://github.com/alrayyes/washy-washy-cli/issues/115)) ([f458914](https://github.com/alrayyes/washy-washy-cli/commit/f4589148a35197c1cc0999fe214ed432ad7f42e3)), closes [#114](https://github.com/alrayyes/washy-washy-cli/issues/114)
* bump @washy-washy/pdf to 1.0.3 (mix matrix contrast) ([#122](https://github.com/alrayyes/washy-washy-cli/issues/122)) ([e64e12a](https://github.com/alrayyes/washy-washy-cli/commit/e64e12a8ce5a8c6f34f1146b2244865d4e2e1ef9)), closes [#120](https://github.com/alrayyes/washy-washy-cli/issues/120)
* bump @washy-washy/pdf to 2.0.1 (breaking: render return shape, non-WinAnsi reporting) ([#131](https://github.com/alrayyes/washy-washy-cli/issues/131)) ([d086379](https://github.com/alrayyes/washy-washy-cli/commit/d086379f2d38442b32f42ac3dbe91656a433fd64)), closes [#128](https://github.com/alrayyes/washy-washy-cli/issues/128)
* bump @washy-washy/pdf to 2.3.5 (near-blank continuation pages) ([#136](https://github.com/alrayyes/washy-washy-cli/issues/136)) ([f72a0e0](https://github.com/alrayyes/washy-washy-cli/commit/f72a0e070f67017599755d095564aed27be1f028))
* **deps:** bump oven/bun from 1.3.14-alpine to 1.4.0-alpine ([dce5bec](https://github.com/alrayyes/washy-washy-cli/commit/dce5beca775ae68211a66340dfdc4b79371f3173))
* migrate-config/new-config now write biome-formatted JSON ([#117](https://github.com/alrayyes/washy-washy-cli/issues/117)) ([b765bc9](https://github.com/alrayyes/washy-washy-cli/commit/b765bc92fe9fe73ea327a3e0be6b4fc1713df036)), closes [#116](https://github.com/alrayyes/washy-washy-cli/issues/116)
* **release:** bootstrap release-please from the migration commit ([#154](https://github.com/alrayyes/washy-washy-cli/issues/154)) ([ee607a6](https://github.com/alrayyes/washy-washy-cli/commit/ee607a6dc2f4d5f8bab33f3d17c0e6043d98ab12))


### Miscellaneous Chores

* drop leftover CSV migration tooling and docs ([#141](https://github.com/alrayyes/washy-washy-cli/issues/141)) ([df27a32](https://github.com/alrayyes/washy-washy-cli/commit/df27a3286313df170912eabddc39b7da3f528db5)), closes [#140](https://github.com/alrayyes/washy-washy-cli/issues/140)

## [2.15.0](https://github.com/alrayyes/washy-washy-cli/compare/v2.14.0...v2.15.0) (2026-08-22)

### Features

* cut the CLI over to the combined machine+chart config ([#106](https://github.com/alrayyes/washy-washy-cli/issues/106)) ([c79b802](https://github.com/alrayyes/washy-washy-cli/commit/c79b8023ec921c32e9061ee853d9d29961e2868f)), closes [#102](https://github.com/alrayyes/washy-washy-cli/issues/102)

## [2.14.0](https://github.com/alrayyes/washy-washy-cli/compare/v2.13.0...v2.14.0) (2026-08-22)

### Features

* add the combined config loader and a migration command ([#105](https://github.com/alrayyes/washy-washy-cli/issues/105)) ([f72d048](https://github.com/alrayyes/washy-washy-cli/commit/f72d048e526591b6f17e7d1640f219353876733d))

## [2.13.0](https://github.com/alrayyes/washy-washy-cli/compare/v2.12.0...v2.13.0) (2026-08-22)

### Features

* **core:** mirror washy-washy-core's combined config module locally ([#104](https://github.com/alrayyes/washy-washy-cli/issues/104)) ([a688ade](https://github.com/alrayyes/washy-washy-cli/commit/a688ade41a3b6733094a6c208d51b83a7b6d33a7)), closes [washy-washy-core#14](https://github.com/alrayyes/washy-washy-core/issues/14) [94/#102](https://github.com/94/washy-washy-cli/issues/102) [#103](https://github.com/alrayyes/washy-washy-cli/issues/103)

## [2.12.0](https://github.com/alrayyes/washy-washy/compare/v2.11.0...v2.12.0) (2026-08-21)

### Features

* **web:** make the edit cards look like the read-only sheet's cards ([#93](https://github.com/alrayyes/washy-washy/issues/93)) ([5ceed9b](https://github.com/alrayyes/washy-washy/commit/5ceed9b1908d274c39bc7894300de98cb3e5d529)), closes [86/#89](https://github.com/86/washy-washy/issues/89)

## [2.11.0](https://github.com/alrayyes/washy-washy/compare/v2.10.0...v2.11.0) (2026-08-21)

### Features

* **web:** use typed inputs on the editable chart, not text everywhere ([#89](https://github.com/alrayyes/washy-washy/issues/89)) ([020fc6b](https://github.com/alrayyes/washy-washy/commit/020fc6bd8b7ceba338162d7a94c27acc3c87beb1))

## [2.10.0](https://github.com/alrayyes/washy-washy/compare/v2.9.0...v2.10.0) (2026-08-21)

### Features

* **web:** make the chart editable on the config page ([#86](https://github.com/alrayyes/washy-washy/issues/86)) ([8b50086](https://github.com/alrayyes/washy-washy/commit/8b500867540e2ae5be9368322d11738e44b902af)), closes [#83](https://github.com/alrayyes/washy-washy/issues/83) [#72](https://github.com/alrayyes/washy-washy/issues/72)

## [2.9.0](https://github.com/alrayyes/washy-washy/compare/v2.8.0...v2.9.0) (2026-08-21)

### Features

* **web:** add a site nav for Home and Config ([#85](https://github.com/alrayyes/washy-washy/issues/85)) ([61137a3](https://github.com/alrayyes/washy-washy/commit/61137a37a8e730c4e52336281f4206a8a2d10b5f))

## [2.8.0](https://github.com/alrayyes/washy-washy/compare/v2.7.0...v2.8.0) (2026-08-21)

### Features

* **web:** shareable URL for the current filter state ([#82](https://github.com/alrayyes/washy-washy/issues/82)) ([2f1cec0](https://github.com/alrayyes/washy-washy/commit/2f1cec0a7ab1723174a7342aeb52a7c257b38f12))

## [2.7.0](https://github.com/alrayyes/washy-washy/compare/v2.6.0...v2.7.0) (2026-08-21)

### Features

* **web:** a read-only page showing the full loaded config ([#81](https://github.com/alrayyes/washy-washy/issues/81)) ([dc4ae3b](https://github.com/alrayyes/washy-washy/commit/dc4ae3bb3a892dfc7a461fb3eb0aeb95dd124c74))

## [2.6.0](https://github.com/alrayyes/washy-washy/compare/v2.5.0...v2.6.0) (2026-08-21)

### Features

* **web:** upload and download a custom chart as JSON ([#62](https://github.com/alrayyes/washy-washy/issues/62)) ([8c2a379](https://github.com/alrayyes/washy-washy/commit/8c2a3799b1fbcac9fae713e2a247d5b1f3217472)), closes [#59](https://github.com/alrayyes/washy-washy/issues/59) [#61](https://github.com/alrayyes/washy-washy/issues/61) [#45](https://github.com/alrayyes/washy-washy/issues/45) [#43](https://github.com/alrayyes/washy-washy/issues/43) [#61](https://github.com/alrayyes/washy-washy/issues/61)

## [2.5.0](https://github.com/alrayyes/washy-washy/compare/v2.4.1...v2.5.0) (2026-08-21)

### Features

* **web:** persist filter and navigation state ([#61](https://github.com/alrayyes/washy-washy/issues/61)) ([3860268](https://github.com/alrayyes/washy-washy/commit/3860268329b00221fa3f0df1cc6459af68df4c40)), closes [#59](https://github.com/alrayyes/washy-washy/issues/59) [#44](https://github.com/alrayyes/washy-washy/issues/44) [#43](https://github.com/alrayyes/washy-washy/issues/43)

## [2.4.1](https://github.com/alrayyes/washy-washy/compare/v2.4.0...v2.4.1) (2026-08-21)

### Performance Improvements

* **web:** code-split the PDF renderer out of the main chunk ([#65](https://github.com/alrayyes/washy-washy/issues/65)) ([f3e2bde](https://github.com/alrayyes/washy-washy/commit/f3e2bde75edf9c56a8d5707b826ffdaec2f3db9c)), closes [#60](https://github.com/alrayyes/washy-washy/issues/60)

## [2.4.0](https://github.com/alrayyes/washy-washy/compare/v2.3.0...v2.4.0) (2026-08-21)

### Features

* **web:** render the six sheets in-browser with filters ([#59](https://github.com/alrayyes/washy-washy/issues/59)) ([2d6ffe6](https://github.com/alrayyes/washy-washy/commit/2d6ffe69c78f6330f8cf925aa7a2fadc9b42138a))

## [2.3.0](https://github.com/alrayyes/washy-washy/compare/v2.2.2...v2.3.0) (2026-08-18)

### Features

* **web:** scaffold apps/web on Astro with Cloudflare Pages deploy ([#49](https://github.com/alrayyes/washy-washy/issues/49)) ([e9882ab](https://github.com/alrayyes/washy-washy/commit/e9882ab929bc5efc60bedbb00c79fb26165ff4cb))

## [2.2.2](https://github.com/alrayyes/washy-washy/compare/v2.2.1...v2.2.2) (2026-08-18)

### Bug Fixes

* **deps:** bump @react-pdf/renderer from 4.6.0 to 4.6.1 ([a1f208d](https://github.com/alrayyes/washy-washy/commit/a1f208d6429991ba2713b5c1c136fa57d050157a))

## [2.2.1](https://github.com/alrayyes/washing-instructions/compare/v2.2.0...v2.2.1) (2026-08-17)

### Bug Fixes

* **deps:** commit-message prefix for the shipped ecosystem(s) ([#35](https://github.com/alrayyes/washing-instructions/issues/35)) ([4a1d3d9](https://github.com/alrayyes/washing-instructions/commit/4a1d3d9c973ef7ec4de902a6aeee8e90240ffa25))

## [2.2.0](https://github.com/alrayyes/washing-instructions/compare/v2.1.0...v2.2.0) (2026-08-16)

### Features

* validate the machine file against its JSON Schema ([#33](https://github.com/alrayyes/washing-instructions/issues/33)) ([f37993f](https://github.com/alrayyes/washing-instructions/commit/f37993f6914282f513daac6328dc798bc8f2071e)), closes [#32](https://github.com/alrayyes/washing-instructions/issues/32)

## [2.1.0](https://github.com/alrayyes/washing-instructions/compare/v2.0.0...v2.1.0) (2026-08-14)

### Features

* shoot a screenshot of every sheet, and catch a stale one ([#30](https://github.com/alrayyes/washing-instructions/issues/30)) ([15766d7](https://github.com/alrayyes/washing-instructions/commit/15766d75d254a05564f49568ad870a4ba0d26c1a)), closes [#29](https://github.com/alrayyes/washing-instructions/issues/29)

## [2.0.0](https://github.com/alrayyes/washing-instructions/compare/v1.2.1...v2.0.0) (2026-08-14)

### ⚠ BREAKING CHANGES

* the instruction CSV gains an `ironing` yes/no column and an
`ironing_notes` column, and `iron_setting` no longer accepts `none`. An existing
chart fails to parse until the ironing column is split in two. Both committed
charts are migrated; the run names the first row that disagrees.

### Features

* make ironing a boolean rather than a sentence to parse ([#28](https://github.com/alrayyes/washing-instructions/issues/28)) ([96a5c25](https://github.com/alrayyes/washing-instructions/commit/96a5c25666cc054dc9bdf239036e2837276d077d))

## [1.2.1](https://github.com/alrayyes/washing-instructions/compare/v1.2.0...v1.2.1) (2026-08-14)

### Bug Fixes

* stop the no-iron card repeating itself down the page ([#27](https://github.com/alrayyes/washing-instructions/issues/27)) ([da99fef](https://github.com/alrayyes/washing-instructions/commit/da99fefe13a107ca301994af04eb87a4afdb42f9))

## [1.2.0](https://github.com/alrayyes/washing-instructions/compare/v1.1.1...v1.2.0) (2026-08-13)

### Features

* add microfibre towels to the chart ([848101a](https://github.com/alrayyes/washing-instructions/commit/848101a55828d8a9ed368168d05621f42147edc4))
* set the reference sheet to fit rather than spill ([37fe04e](https://github.com/alrayyes/washing-instructions/commit/37fe04e71fb86fe67541d1acadadd87b318b65a4))

### Bug Fixes

* **release:** actually set LEFTHOOK=0 on the push ([#17](https://github.com/alrayyes/washing-instructions/issues/17)) ([851aa28](https://github.com/alrayyes/washing-instructions/commit/851aa28b10540055ba51bf30bf212183d7162b7d)), closes [#16](https://github.com/alrayyes/washing-instructions/issues/16)
* **release:** push the changelog with the hooks turned off ([#16](https://github.com/alrayyes/washing-instructions/issues/16)) ([25d91df](https://github.com/alrayyes/washing-instructions/commit/25d91df79103d16f062616c94f5d6e6141c57492)), closes [#12](https://github.com/alrayyes/washing-instructions/issues/12) [#14](https://github.com/alrayyes/washing-instructions/issues/14) [#15](https://github.com/alrayyes/washing-instructions/issues/15)

## [1.1.1](https://github.com/alrayyes/washing-instructions/compare/v1.1.0...v1.1.1) (2026-08-12)

### Bug Fixes

* **release:** write notes that list what landed ([#9](https://github.com/alrayyes/washing-instructions/issues/9)) ([ba7184d](https://github.com/alrayyes/washing-instructions/commit/ba7184d693a8310826bc161e1d9d74c3a09ea293))

## [1.1.0](https://github.com/alrayyes/washing-instructions/compare/v1.0.0...v1.1.0) (2026-08-11)

### Features

* **ci:** publish the container image, and build it before trusting it ([eb961ff](https://github.com/alrayyes/washing-instructions/commit/eb961ff0030dc390f2c6e850edd481d518d8688b))

### Bug Fixes

* **ci:** run the image as the user that owns the mount ([b976e19](https://github.com/alrayyes/washing-instructions/commit/b976e19cb6839b46a868623bc422dd61226e8615))

## 1.0.0 (2026-08-11)

### Features

* describe the appliances and validate the instruction CSV ([22cf6c1](https://github.com/alrayyes/washing-instructions/commit/22cf6c109a9aa33b4cf1e4ca7735d0c9f3109fb7))
* describe the CSV in a schema other tools can read ([2a2ce6e](https://github.com/alrayyes/washing-instructions/commit/2a2ce6eba4f22c2033297c38ac3734c21e1a96c7))
* make the appliances data instead of code ([65f3a00](https://github.com/alrayyes/washing-instructions/commit/65f3a00f8070b25a40675668007142cf22443edd))
* merge cards on the settings rather than on every attribute ([a6d2342](https://github.com/alrayyes/washing-instructions/commit/a6d234216bfe5d6e9acf930c78e75845078fe6f4))
* render the phone and printable PDFs ([c39904b](https://github.com/alrayyes/washing-instructions/commit/c39904bc76f87196ad26873aabd8c48423210315))
* run it in a container ([cc7010c](https://github.com/alrayyes/washing-instructions/commit/cc7010c4a4b3ad245e2ac76a26e6d605a0416ecb)), closes [#10](https://github.com/alrayyes/washing-instructions/issues/10)
* ship a dummy chart and keep your own out of git ([808614a](https://github.com/alrayyes/washing-instructions/commit/808614a1c287f84b45d76f950b954cddbe02c2f2))
* work out which piles can share a drum ([d8ad9be](https://github.com/alrayyes/washing-instructions/commit/d8ad9be0a334b5d31838cb55792b025534f0347a))

### Bug Fixes

* **ci:** install Vale without needing node ([8a1cc18](https://github.com/alrayyes/washing-instructions/commit/8a1cc188ef745e570a08643d513925daa715c641))
* **ci:** let commitlint read the repository it was given ([6f9d42e](https://github.com/alrayyes/washing-instructions/commit/6f9d42efec8480af484e8658985a9bebe5f40f7c))
* **ci:** let vale sync reach GitHub, and pin what it fetches ([4f57746](https://github.com/alrayyes/washing-instructions/commit/4f577461811b09b48b6bb800ae81766888fe1ffb))
* **ci:** make Dependabot's bumps land as Conventional Commits ([c231754](https://github.com/alrayyes/washing-instructions/commit/c2317542a9b7fe0f9eb52704ce6c574f25d6d94d))
* **ci:** release with a token the ruleset lets through ([54a1794](https://github.com/alrayyes/washing-instructions/commit/54a1794ed71906f28fb3e964b39b02d052476d62))
* **ci:** run LTeX on the Java it ships with ([d444d79](https://github.com/alrayyes/washing-instructions/commit/d444d797d10e92586b727d9bbc360b3838f46c58))
* **ci:** run semantic-release on Node, and stop failing without a token ([0dfb127](https://github.com/alrayyes/washing-instructions/commit/0dfb127bc8fc5cd3dafdb5e6308c59bb739d1274))
* **ci:** run Vale on a glibc image ([f72271b](https://github.com/alrayyes/washing-instructions/commit/f72271bf16d7176ca2723e37837e8899cab7f001))
