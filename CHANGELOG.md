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
