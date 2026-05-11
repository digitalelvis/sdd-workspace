# Feature: Local `.agents` as dev artifact + `sdd.yml` validation

## Problem

- Mutating the project root `.gitignore` during scaffold is invasive and couples CLI behavior to consumer repo policy.
- Teams need rules/skills that behave like **local dev dependencies** (similar to `node_modules`): refreshable by command, and safe for **sensitive or proprietary** content that must not land in Git.

## Goals

1. **G1 — No root `.gitignore` edits by default**: Provisioning must not append or create root `.gitignore` for AI/workspace rules (handled in `WorkspaceService`; regression-tested).
2. **G2 — Ignore boundary at `.agents/`**: Under `.agents/`, default policy is “everything ignored unless explicitly un-ignored” via `.agents/.gitignore` (`*` baseline), so accidental commits of local skills/rules/cache are unlikely.
3. **G3 — SSOT for intent is `sdd.yml`**: Skill lists and workspace intent live in the existing local config (`skills.include` / `exclude`, stacks, agents, etc.) — **no separate manifest file** (avoids drift vs a second YAML).
4. **G4 — CLI lifecycle**: Commands (phased): `agents doctor` (read-only), then `agents pull` / `update` when implemented.
5. **G5 — Separation of public vs sensitive**: Support namespaces such as `vendor/` (regenerable) vs `local/` (never committed; developer or team secrets).

## Non-goals (this iteration)

- **`sdd-lock.yml`** / lockfile for pinned hashes — **deferred** until `agents pull` resolves mutable external sources (see Deferred Ideas in STATE). This CLI repo: bundled skills + `package-lock.json` + CLI version suffice for reproducibility today.
- Encrypted skill vaults or enterprise secret backends (defer to later).
- Replacing the built-in `src/resources` registry for the CLI package itself (that remains the shipped SSOT for published skills).

## Requirements

| ID        | Requirement                                                                                                                                                          | Verification                                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| AGENTS-01 | `WorkspaceService.execute` must not write or append to `<target>/.gitignore`.                                                                                        | Unit test: no `writeFileSync`/`appendFileSync` on root `.gitignore`.                                                     |
| AGENTS-02 | Document validation rules: `doctor` reads **`sdd.yml`** (existing schema) and compares resolved skills and expected rules to paths under `.agents/` when applicable. | Parser reuses existing config layer; doctor tests.                                                                       |
| AGENTS-03 | `sdd doctor` reports: `sdd.yml` present/readable, `.agents/` layout vs **resolved** skills and expected rules, gaps (missing dirs/files). No lockfile required.      | Implemented: [`src/analyzer/Doctor.ts`](../../../src/analyzer/Doctor.ts), tests in `tests/unit/analyzer/Doctor.spec.ts`. |
| AGENTS-04 | `sdd agents pull` materializes declared artifacts into `.agents/` from CLI/registry sources without overwriting `local/` unless `--force` (future).                  | Integration-style test with temp dir.                                                                                    |
| AGENTS-05 | Init or apply logs hint for `agents pull` when appropriate **once pull exists** and tree incomplete.                                                                 | Manual UAT + optional stdout snapshot.                                                                                   |

## Design notes

- **Intent**: [`sdd.yml`](../../../sdd.yml) at workspace root (same contract as [`WorkspaceConfig`](../../../src/config/ConfigSchema.ts)).
- **Git**: Root `.gitignore` changes are **policy of the consumer repo**; CLI does not silently edit it.
- **Cursor / tooling visibility**: Tools that hide gitignored files may not index `.agents/`; document trade-offs (optional IDE overrides out of scope).

## Open questions

- Should `pull` support Git URLs for private skill packs, or only packaged tarball/registry IDs?
- Exact default subdirectory layout: `.agents/vendor/` vs flat mirror of current injection paths.

## References

- Roadmap: `.specs/project/ROADMAP.md` section **0.1.3**.
- State: `.specs/project/STATE.md`.
