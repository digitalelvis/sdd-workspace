# State

## Persistent Memory

### Decisions

- [2026-04-24] **Spec-Driven Mapping**: Initial codebase mapping completed using the `spec-driven` skill. Established 7 brownfield docs and project vision/roadmap.
- [2026-04-24] **Project Structure**: Confirmed that the project uses a Strategy/Factory pattern for providers and engines.
- [2026-04-26] **0.1.2 Concerns Resolution**: Decided to finalize 0.1.2 by addressing technical debt and architectural inconsistencies before proceeding to 0.1.3.
- [2026-05-10] **0.1.3 Local `.agents` policy**: Consumer workspaces treat `.agents/` as gitignored local material (`.agents/.gitignore` baseline `*`). **Canonical intent** for skills/stacks/agents is **[`sdd.yml`](../../sdd.yml)** — no separate agents manifest file. **`sdd-lock.yml` is out of scope for 0.1.3** (defer until `agents pull` targets mutable external sources). CLI will provide `agents doctor` / `pull` / `update` without requiring a lockfile in this repo yet. **Root `.gitignore` is not modified by scaffold.** Prior roadmap label **0.1.3 Expansion** was renamed to **0.1.4**; former **0.1.4 Ecosystem** is **0.1.5**.

### Blockers

- None currently identified.

### Learnings

- The project is a Node.js CLI written in TypeScript, targeting AI-friendly workspace setup.
- It strictly follows Conventional Commits and atomic tasks.
- Resource resolution is currently inconsistent across different engines and loaders.
- Gitignored `.agents/` improves secrecy for custom skills but can hide files from agents/tools that respect ignore rules; document trade-offs and optional IDE-specific overrides when needed.

### Todos

- [x] Implement `ResourcePathUtils` to unify path resolution.
- [x] Centralize version management using `package.json`.
- [x] Expand `framework-detector.ts` for multi-stack support.
- [x] Refactor `SDDEngine` to use `ResourceProvisioner`.
- [x] Add workspace validation checks.
- [x] Implement `find-skills` CLI command.
- [x] Implement `sdd doctor` (read-only: `sdd.yml` vs `.agents/` layout; no lockfile).
- [ ] Implement `sdd agents pull` / `agents update` against `sdd.yml` + registry (no `sdd-lock.yml` until external resolve).
- [ ] Wire init/apply post-step hint when `sdd.yml` lists skills but `.agents/` incomplete (once pull exists).

### Deferred Ideas

- **`sdd-lock.yml`** (or equivalent) after `agents pull` resolves non-bundled mutable sources.
- Plugin system for external providers (Phase 3).
- Centralized Skill Hub (Phase 3).
