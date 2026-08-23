# Environment

This is a local CLI, not a service, and it takes no environment variables at
all. Everything `bun run generate` needs — your appliances, your chart, where
the PDFs land — comes from the config file and the `--out` flag, both covered
in the [README](README.md#usage). There is no `.env` because there is nothing
for one to configure: grep the CLI's own code (`src/`) for `process.env` and
you get nothing back.

The variables below exist, but they belong to the tooling around the repo —
dev scripts and CI — not to the tool itself.

## Dev tooling (local)

| Variable         | Used by                      | Controls                                                                                                 | Example            |
| ---------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------ |
| `XDG_CACHE_HOME` | `scripts/lint-prose-ltex.ts` | Where the ~300 MB LTeX download is cached between runs. Optional — falls back to `$HOME/.cache` if unset | `/home/you/.cache` |
| `HOME`           | `scripts/lint-prose-ltex.ts` | Fallback base for the LTeX cache when `XDG_CACHE_HOME` isn't set. Already set by your shell              | `/home/you`        |

Neither needs to be set by hand for `bun run check` to work — they only
change where a cache lives, never whether a command succeeds.

## CI only (GitHub Actions secrets)

These are repository secrets under Settings → Secrets and variables →
Actions, not variables you export locally. Listed here so a workflow change
doesn't leave someone guessing what they're for.

| Variable        | Used by                         | Controls                                                                                                                                                                                                                 | Dummy value                            |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `RELEASE_TOKEN` | `.github/workflows/release.yml` | Fine-grained PAT scoped to this repo with `contents: read and write`. Without it the release job reports it did nothing and stops — see [CONTRIBUTING.md → Releasing](CONTRIBUTING.md#releasing)                         | `github_pat_11AAAAAAA0aaaaaaaaaaaaaa`  |
| `CODECOV_TOKEN` | `.github/workflows/ci.yml`      | Uploads coverage from the `check` job to Codecov                                                                                                                                                                         | `00000000-0000-0000-0000-000000000000` |
| `LEFTHOOK=0`    | `.github/workflows/release.yml` | Set inline by the release job before it pushes the changelog commit, so that push doesn't fire `pre-push` in a job that never ran `prose:sync`. Not a secret, just a convention worth knowing if you touch that workflow | `0`                                    |

No feature flags, no database, no auth and no third-party API keys — this
tool draws PDFs from a JSON file on disk and talks to nothing over the
network at run time.
