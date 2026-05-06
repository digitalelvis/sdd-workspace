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
- [ ] **Advanced CI/CD Orchestration**: Implement `release.yml` and `check-ci-status` patterns for version automation and gating.
- [ ] **Automated Security Guardrails**: Add `security-scan` capabilities with PR commenting and notification integration.
- [ ] **SDD Integrity Validation**: Implement `validate-skills` action to ensure workspace compliance.

### Architectural Refinement (Pending)

- [x] **Database Registry**: Extract `SupportedDatabase` logic to a modular `databases.json` registry.
- [x] **Tools & Concerns Registry**: Modularize Lint, CI/CD, and Security tools into a dedicated registry.
- [x] **Context-Aware Init**: Refactor `init` command to suggest tools based on detected Stack + Database.
- [] **Git Strategy & Workflow Selection**: Implement interactive selection for Git Flow variants and conditional CI/CD workflows (Husky, Commitlint, Storybook, etc.).
- [x] **Integrity First (No-Overwrite)**: Ensure `init` never overwrites existing configurations and only prompts for missing components.
- [x] **Find Skills**: Implement `find-skills` command to find skills by provider, category, or name.
- [x] **defaultSkillsProviders**: Implement defaultSkillsProviders in databases.json and stacks.json using Find Skills to install.

## 0.1.3: Expansion

- [ ] Implement `add` command for incremental skill/rule installation.
- [ ] Add support for more IDEs (WebStorm, IntelliJ).
- [ ] Enhance Analyzer for monorepo detection.
- [ ] Implement `apply` command for global workspace updates.
- [ ] Add more "Skills" to the default registry (e.g., Python-specific, Cloud-native).

## 0.1.4: Ecosystem

- [ ] Plugin system for external providers.
- [ ] Centralized "Skill Hub" for sharing community skills.
- [ ] CI/CD integration for automated workspace health checks.

## Status Tracking

- **Current Version**: 0.1.2
- **Last Achievement**: Implemented dynamic CI/CD workflow composer (`WorkflowComposer`).
- **Next Milestone**: Advanced CI/CD orchestration & security guardrails.
