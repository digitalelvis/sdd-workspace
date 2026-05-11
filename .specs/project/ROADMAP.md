# Roadmap

## Phase 1: Foundation (Current)

- [x] Basic CLI structure with Commander.
- [x] Strategy pattern for IDE and Agent providers.
- [x] Initial VSCode and Cursor support.
- [x] Configuration resolution (layers).
- [x] Basic workspace detection (Analyzer).
- [x] Jest unit testing suite.

## 0.1.2: Scalable Architecture & Stability

### Registry & Rules (Completed)

- [x] **Registry-Driven Providers**: Move IDE and Agent metadata to `registry.json`.
- [x] **Generic Engines**: Refactor `EcosystemEngine` and `SDDEngine` to use registry data.
- [x] **Rules SSOT**: Centralize rules in `.agents/rules/` for all agents.
- [x] **Symbolic Links/References**: Implement symlinks or reference prompts for `.cursorrules`, `.windsurfrules`, etc.
- [x] **Dynamic Skill Loading**: Support for more complex skill provisioning modes.
- [x] **CI/CD for Versioning**: Github Actions configured for version branches (`v*`).
- [x] **Registry Structuring**: Split monolithic `registry.json` into modular files.
- [x] **Advanced Rule Composition**: Support for modular rules and multi-rule injection.

### Concerns Resolution (Completed)

- [x] **Centralized Versioning**: Sync package.json version with CLI and generated configs.
- [x] **Unified Resource Resolution**: Centralize resource path logic in `ResourcePathUtils`.
- [x] **Analyzer Expansion**: Add support for Python, PHP, Laravel, and Vue detection.
- [x] **Engine Refactoring**: Extract resource provisioning logic into `ResourceProvisioner`.
- [x] **Workspace Validation**: Implement environment integrity checks.

### CI/CD & Security (Pending)

- [x] **Dynamic CI/CD Workflow Composer**: Implement `WorkflowComposer` to generate tailored GitHub Actions workflows based on selected tools (lint, test, build).

### Architectural Refinement (Pending)

- [x] **Database Registry**: Extract `SupportedDatabase` logic to a modular `databases.json` registry.
- [x] **Tools & Concerns Registry**: Modularize Lint, CI/CD, and Security tools into a dedicated registry.
- [x] **Context-Aware Init**: Refactor `init` command to suggest tools based on detected Stack + Database.
- [] **Git Strategy & Workflow Selection**: Implement interactive selection for Git Flow variants and conditional CI/CD workflows (Husky, Commitlint, Storybook, etc.).
- [x] **Integrity First (No-Overwrite)**: Ensure `init` never overwrites existing configurations and only prompts for missing components.
- [x] **Find Skills**: Implement `find-skills` command to find skills by provider, category, or name.
- [x] **defaultSkillsProviders**: Implement defaultSkillsProviders in databases.json and stacks.json using Find Skills to install.
- [] **Implement sdd YAML**: Migrate `sdd.config.json` → `sdd.yml` (local) and `~/.sddrc.json` → `~/.sddrc.yml` (global). Introduce a `YamlParser` utility (SRP) for all YAML I/O. Update `GlobalConfigManager`, `ConfigResolver`, `WorkspaceService`, `WorkspaceValidator`, and CLI commands to consume the new format. No JSON fallback.
  - Acceptance: `sdd init` generates `sdd.yml`; `sdd apply` reads `sdd.yml`; `sdd config` reads/writes `~/.sddrc.yml`; all unit tests green; no `JSON.parse` references in config layer.
- [] **Upgrade Find Command**: Replace `find-skills` with a unified `find` command. Support `find -s` (skills) or `find -r` (rules) with composable filters `--provider`, `--category`, `--name`. Introduce `ResourceSearchService` (OCP/DIP) extending search to both resource types without duplicating logic.
  - Acceptance: `sdd find -s --provider sdd`, `sdd find -r --category architecture` both return filtered results; `SkillService.resolveFromProviders` delegates to new service; unit tests cover skill+rule combinations.

## 0.1.3: Local `.agents` & `sdd.yml` validation

Treat `.agents/` as a **local dev artifact** (like `node_modules`): not committed by default. **Intent for skills/stacks/agents stays in [`sdd.yml`](../../sdd.yml)** (existing SSOT). No separate manifest file and **no `sdd-lock.yml` in this milestone** — reproducibility for bundled skills follows CLI + npm versioning until external `agents pull` exists.

- [x] **No root `.gitignore` mutation**: `WorkspaceService` must not append/create project `.gitignore` during scaffold (consumer repo owns root ignore policy).
- [x] **`sdd doctor`**: Read-only checks using `sdd.yml` (`skills`, stacks, etc.) vs actual layout under `.agents/` where applicable; clear WARN when tree missing or incomplete.
- [ ] **`sdd agents pull` / `update`**: Materialize or refresh artifacts from CLI/registry sources; never blindly overwrite `local/` without explicit flag.
- [ ] **Init hint**: After `init`/`apply`, suggest `agents pull` when configured skills imply a sync step and tree is incomplete (once pull exists).
- [ ] **Docs**: CONTRIBUTING/README note on `sdd.yml` as SSOT, gitignored `.agents/`, and optional private `local/` skills.

Spec: `.specs/features/agents-local-dev-manifest/spec.md`.

**Deferred (not 0.1.3):** `sdd-lock.yml` or equivalent lockfile — revisit when `agents pull` resolves **mutable external** sources (registry URLs, floating tags); until then `package-lock.json` + pinned CLI version suffice for this repo.

## 0.1.4: Expansion

- [ ] **CONTRIBUIT Guides**: We need create a guide for contrbibuite with new rules, skills, tools, stacks with references in commit and PR for validation.
- [ ] **Automated Security Guardrails**: Add `security-scan` capabilities with PR commenting and notification integration when a new commit is to include rules, skills, tools, stacks, etc.
- [ ] Implement `add -option [name]` command for incremental skill or rule installation.
- [ ] Add support for more IDEs (WebStorm, IntelliJ).
- [ ] Enhance Analyzer for monorepo detection.
- [ ] Implement `apply` command for global workspace updates.
- [ ] Add more "Skills" to the default registry (e.g., Python-specific, Cloud-native).

## 0.1.5: Ecosystem

- [ ] Plugin system for external providers.
- [ ] Centralized "Skill Hub" for sharing community skills.
- [ ] CI/CD integration for automated workspace health checks.

## Status Tracking

- **Current Version**: 0.1.3
- **Last Achievement**: **`sdd doctor`** shipped (read-only); **0.1.3** scoped for local `.agents` + **`sdd.yml` as SSOT** (no parallel manifest, no `sdd-lock.yml` in this line); scaffold no longer mutates root `.gitignore`.
- **Next Milestone**: `agents pull` / `update`; optional docs for `sdd.yml` + gitignored `.agents/`. Consider `sdd-lock.yml` only after external resolution exists.
