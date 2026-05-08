# ADR-002: Registry-Driven Architecture & Rules SSOT

**Status**: Accepted  
**Date**: 2026-04-26  
**Authors**: @digitalelvis  
**Branch**: `v0.1.x`

---

## Context

The initial implementation used a **Strategy Pattern** with dedicated TypeScript classes for each IDE (`VSCodeIdeProvider`, etc.), AI Agent (`CursorAgentProvider`, etc.), and Stack. While this provided strong typing, it led to **Provider Proliferation**:

1.  **Code Duplication**: Most providers shared identical logic (creating directories, writing files).
2.  **Maintenance Burden**: Adding a new IDE or Agent required modifying the core codebase and adding new classes.
3.  **Rule Inconsistency**: Rules were injected directly into agent-specific files (e.g., `.cursorrules`), making it difficult to maintain a single source of truth across multiple AI agents in the same workspace.

---

## Decision

We decided to transition to a **Registry-Driven Architecture** combined with a **Single Source of Truth (SSOT)** for AI rules.

### 1. Modular Registry System

The monolithic `registry.json` was split into a modular directory structure under `src/resources/registry/`:

- `skills.json`: Skills metadata and installation commands.
- `stacks.json`: Technology stack definitions, rule templates, and linter dependencies.
- `agents.json`: AI Agent configuration files and rule injection strategies.
- `ides.json`: IDE-specific workspace configuration directories and templates.

### 2. Generic Engines

`SDDEngine` and `EcosystemEngine` were refactored to be data-driven. Instead of instantiating specific provider classes, they now:

- Load and merge the modular registry via `RegistryLoader`.
- Execute generic logic (copying, templating, symlinking) based on the registry definition.

### 3. Rules SSOT

All AI instructions are now centralized in `.agents/rules/main.md`. Agent-specific files (like `.cursorrules`) are configured using a **Strategy** defined in the registry:

- **Reference**: The file is created with a pointer/link to `main.md`.
- **Symlink**: A symbolic link is created pointing to `main.md`.
- **File**: (Fallback) The full content is copied.

---

## Consequences

### Positive

- **Scalability**: Adding a new IDE or Agent now only requires a JSON update in the registry.
- **Maintainability**: Reduced the number of boilerplate classes by ~70%.
- **Consistency**: Guaranteed identical instructions across all AI agents used in a project.
- **Traceability**: Project "DNA" is clearly defined in `.agents/rules/`.

### Negative

- **Complexity in Loader**: `RegistryLoader` now needs to handle directory scanning and JSON merging.
- **Testing**: Tests must now mock the registry data more comprehensively.

---

## Alternatives Considered

- **Keep Strategy Classes**: Rejected because it didn't scale well with the goal of supporting dozens of IDEs and Agents.
- **Centralized Rules without Registry**: Rejected because we still needed metadata about _where_ and _how_ to inject those rules for each specific agent.
