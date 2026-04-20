# ADR-001: Workspace Configuration Architecture

**Status**: Accepted  
**Date**: 2026-04-20  
**Authors**: @digitalelvis  
**Branch**: `feat/config-system`

---

## Context

The `ai-sdd-workspace` CLI operated as a stateless one-shot scaffolder: run `sdd init`, inject rules, and exit. There was no mechanism for developers to customise defaults globally across projects or declare workspace intent declaratively within a project.

This created three concrete problems:

1. **No reproducibility** — A second `sdd init` on the same project could produce different output if the defaults changed.
2. **No personal defaults** — Every developer had to answer the same prompts for every new project.
3. **No incremental evolution** — Once initialized, there was no idiomatic way to add/remove skills or tools from a workspace without re-running `init` interactively.

---

## Decision

Adopt a **4-layer hierarchical configuration system** with merge semantics:

```
Built-in Defaults  (src/config/defaults.ts)
    ↓ overridden by
Global Config      (~/.sddrc.json)
    ↓ overridden by
Local Config       (./sdd.config.json)
    ↓ overridden by
CLI Flags          (Commander options at runtime)
```

### Key contracts

- **`ConfigSchema.ts`** — TypeScript interfaces: `WorkspaceConfig`, `LocalWorkspaceConfig`, `GlobalUserConfig`.
- **`defaults.ts`** — Hard-coded fallback values; centralises constants previously scattered in `StackProvider` implementations and `index.ts`.
- **`ConfigResolver.ts`** — Stateless class that loads, merges, and returns a `WorkspaceConfig`. Engines receive only the resolved config.

### Skill merge strategy

Skills are merged **additively**, not by replacement:

```
final_skills = (localInclude || stackDefaults) ∪ globalAdd ∪ localAdd − localExclude
```

- If `skills.include` is set in the local config, it **overrides** the stack defaults entirely.
- If only `skills.add` is set, it is **merged on top** of the stack defaults.
- `skills.exclude` removes entries from the final set regardless of origin.

---

## Consequences

### Positive
- **Reproducibility**: Committing `sdd.config.json` captures the exact workspace intent — any team member running `sdd apply` gets the same result.
- **Developer ergonomics**: Global `~/.sddrc.json` eliminates repetitive prompts for personal preferences.
- **Engine isolation**: `SDDEngine` and `EcosystemEngine` remain unchanged — they receive resolved lists, not config objects.
- **Extensible**: `ResourceType` enum in `SkillRegistry.ts` allows future resources (tools, templates) to be managed through the same config surface area.

### Negative / Risks
- **New concept to learn**: Developers need to understand the 4-layer precedence.
- **Config drift**: Manual edits to `sdd.config.json` that diverge from installed state need `sdd apply` to re-sync.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|---|---|
| Single flat config (no layers) | No way to separate personal preferences from project intent |
| cosmiconfig library | Extra dependency; our schema is simple enough to hand-roll |
| YAML format | JSON is already parsed natively by Node; adding YAML requires a dep |
| Merge into `package.json` | Conflates project metadata with workspace management config |
