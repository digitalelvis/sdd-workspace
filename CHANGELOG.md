## 0.1.0 (2026-04-20)

### 🚀 Features

- complete Phase 2 with offline SDD skills, interactive IDE selection, and dynamic template routing ([1788ece](https://github.com/digitalelvis/sdd-workspace/commit/1788ece1a6199e2e2d8d66df45c877e2f2b3bb38))
- complete phase 3 - solid core architecture, strict linting injection, and removed claude code ([03c13a3](https://github.com/digitalelvis/sdd-workspace/commit/03c13a3b2fddaa3d2aad8ce84195b6ba0d4a0441))
- implement 4-layer config system with ConfigResolver and sdd apply command ([cebbc86](https://github.com/digitalelvis/sdd-workspace/commit/cebbc86bebdc92f44b3a4cd3371b567a2cd46bc6))
- implement release-it semantic automation and open-source governance guidelines ([760e399](https://github.com/digitalelvis/sdd-workspace/commit/760e39937cc81b2a94bde93bb6387c7b406e3a6b))
- initial cli structure, github templates, and framework detection ([10ee85f](https://github.com/digitalelvis/sdd-workspace/commit/10ee85f7b3df71fa447101054774aad896425c7d))
- major refactor - registry-driven architecture, hierarchical configs and @digitalelvis/sdd-workspace branding ([80b1129](https://github.com/digitalelvis/sdd-workspace/commit/80b1129fcd2afce2fb13cec4f8694ac8f080bb12))
- news skills templates to aditional context ([dcbbf2f](https://github.com/digitalelvis/sdd-workspace/commit/dcbbf2f0a8c9fef08d522c98a67c9fbf0a909eae))
- refactor CLI to a modular architecture with isolated commands ([9c13452](https://github.com/digitalelvis/sdd-workspace/commit/9c13452db71542408c8b12327f2be263d60b5cde))
- refactor SDDEngine into Hybrid Skill Hub with cli/remote/local registry strategy ([34f5698](https://github.com/digitalelvis/sdd-workspace/commit/34f56981d53788b8aa9661dc9997b4bc81d33e36))

### 🩹 Fixes

- add missing eslint and prettier configurations for the CLI project ([9ca4292](https://github.com/digitalelvis/sdd-workspace/commit/9ca4292bc02ce749e5084bf4d0eb3844facb0b62))
- adjust local skill paths in registry to include skills/ prefix ([5ea7b5d](https://github.com/digitalelvis/sdd-workspace/commit/5ea7b5d3a2362b47f8cee7e22ef0b7d031cdc5d5))
- resolve lint errors and add missing typescript-eslint dependencies ([1af8275](https://github.com/digitalelvis/sdd-workspace/commit/1af82758fe5900c898536ed5b54d294061c8dfc3))
- resolve resource path calculation for local development and update sdd.config ([5fba69b](https://github.com/digitalelvis/sdd-workspace/commit/5fba69be07ec8aa2ed949f8006701c5623f4fe57))

### 💅 Refactors

- decouple framework and ide generation using Strategy pattern engines ([097a81f](https://github.com/digitalelvis/sdd-workspace/commit/097a81f3d3172399dc0ed54c49ab96cf6e5a21fb))
- rename templates to resources, registry.json with resource flag ([e6b18d2](https://github.com/digitalelvis/sdd-workspace/commit/e6b18d27f7a45328d35b175ca9e63857b479019d))

### 📖 Documentation

- add global AGENTS.md instructions for repository AI interactions ([9d807a7](https://github.com/digitalelvis/sdd-workspace/commit/9d807a7b7df05e25dc2915976c1bff2a3c211349))
- update CONTRIBUTING and AGENTS with resources/, registry.json and Skill Hub ([6fce027](https://github.com/digitalelvis/sdd-workspace/commit/6fce027a1cce74a02bb5b017e65e01debc495baa))
- update documentation to reflect v0.0.2 config system and sdd branding ([1e932a6](https://github.com/digitalelvis/sdd-workspace/commit/1e932a64710cfd5193c625f156d48b5fc9bff81f))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository Governance Rule for AI Agents and Contributors (`.agents/rules/repo-governance.md`).
- Centralized `SDDEngine` and `EcosystemEngine` utilizing pure Facade architecture.
- Full Strategy Pattern coverage for `IdeProvider` (Antigravity, Cursor, Windsurf, VSCode).
- Native AI Support for `.kirorules`, `.github/copilot-instructions.md`, and `.agent/rules/rule.md`.
- Comprehensive Unit Test coverage for AI Agents rules mapping (`AgentProviders.spec.ts`, `SDDEngine.spec.ts`).

### Changed

- Domain logic completely refactored to decouple Frameworks into `SupportedStack` Enums.
- Switched physical CLI argument processing to `IdeEnvironment` Domain Enum to prevent hardcoded injections.

## [0.0.1] - 2024-04-16

### Added

- Initial build of `ai-sdd-workspace` CLI.
- Dynamic Scaffold for `tlc-spec-driven` capabilities across `nodejs`, `react`, and `nextjs` architectures.
- Interactive terminal bootstrap using `inquirer`.
- Custom Linter and Prettier auto-injection logic.
