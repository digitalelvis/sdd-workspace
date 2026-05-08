# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2](https://github.com/digitalelvis/sdd-workspace/compare/0.1.0...0.1.2) (2026-05-08)

### ⚠ BREAKING CHANGES

- **config,cli:** workspace config file is now sdd.yml (was sdd.config.json);
  global config is now ~/.sddrc.yml (was ~/.sddrc.json); sdd find replaces sdd find-skills


### 🚀 Features

- **analyzer:** expand framework detection and add workspace validation ([e683595](https://github.com/digitalelvis/sdd-workspace/commit/e683595d2a9f52296c08ee648bb97a863e242756))
- **ci:** add automated release workflow on merge to main ([fc0db97](https://github.com/digitalelvis/sdd-workspace/commit/fc0db97aac2ac262e47bed2ae105d4918573826c))
- **cicd:** implement dynamic workflow composer for GitHub Actions ([82755eb](https://github.com/digitalelvis/sdd-workspace/commit/82755ebbef10427560d64f84b6efd81641f6251b))
- **cli:** implement find-skills command and provider discovery ([08c5975](https://github.com/digitalelvis/sdd-workspace/commit/08c597585c853273f4f0d3efc28eba75e608d269))
- **config,cli:** migrate to YAML config and add unified find command ([cd55438](https://github.com/digitalelvis/sdd-workspace/commit/cd554381747d1e468a4b7e725f01548113a04bce))
- **engine:** implement modular rule management and refactor SDDEngine ([327ce7d](https://github.com/digitalelvis/sdd-workspace/commit/327ce7d48b3d6ca23e3a1e1545754f2ee0b29513))
- **git:** dynamic Git Strategy Selection via Registry ([27906c1](https://github.com/digitalelvis/sdd-workspace/commit/27906c17d3338fc8db629bd4730c46f343f94ab9))
- implement registry-driven architecture and modular registry ([febb4d1](https://github.com/digitalelvis/sdd-workspace/commit/febb4d1aa4b8d6188a3b4267e7fa3bcad3629bf7))
- **init:** implement context-aware multi-step wizard for init command ([041c419](https://github.com/digitalelvis/sdd-workspace/commit/041c419c264ad9bddd3168532c11007f93f398b8))
- **registry:** implement modular database registry and registry-driven detector ([21f1384](https://github.com/digitalelvis/sdd-workspace/commit/21f138471cb2d085fef359ae5ea344a8203668dd))
- **registry:** implement tools and concerns registry with existence checker ([f144d41](https://github.com/digitalelvis/sdd-workspace/commit/f144d41d7842171f49ff8d512a946a6de218a0f7))
- unified skill provisioning and init command improvements for v0.1.1 ([4831948](https://github.com/digitalelvis/sdd-workspace/commit/4831948b30fb6c3022e25f35adcdf377fc9b1580))

### 🩹 Fixes

- **ci:** allow release line branches (vX.Y.x) in branch-governance check ([c871fa3](https://github.com/digitalelvis/sdd-workspace/commit/c871fa3e4d9ee5b061e607845e179ed52aac570a))
- **sdd:** rename AGENT.md to AGENTS.md and inject orchestration block on existing files ([977e7e1](https://github.com/digitalelvis/sdd-workspace/commit/977e7e19cea6b6b8af929bd0fd7be11babb5de92))

### ✨ Refactors

- **engine:** extract ResourceProvisioner from SDDEngine ([17e2901](https://github.com/digitalelvis/sdd-workspace/commit/17e29019b948bb46d6fca0c84b146f6eea474912))
- **engine:** unified resource resolution via ResourcePathUtils ([ec6f2c0](https://github.com/digitalelvis/sdd-workspace/commit/ec6f2c030574af3029a13d5e203e8ddbb79ec4fb))
- **registry:** align git strategy implementation with resource provisioner ([be4d407](https://github.com/digitalelvis/sdd-workspace/commit/be4d407198c8ca57c75bb57d2d4346446b0f02a8))

### 📖 Documentation

- **cli:** update README with find-skills command ([d4d36ff](https://github.com/digitalelvis/sdd-workspace/commit/d4d36ff4e094b1591a6c28220f631e4cd9010963))
- **roadmap:** update roadmap and state for 0.1.2 completion ([4143f41](https://github.com/digitalelvis/sdd-workspace/commit/4143f411a72bfe71783999e7d5aec2fdbb02255d))
- **specs:** update ARCHITECTURE.md and feature specs status to completed ([4289eca](https://github.com/digitalelvis/sdd-workspace/commit/4289ecafbc69706965f6f10402251328a5b24a32))
- update README, CONTRIBUTING, and codebase specs for v0.1.2 ([12873a4](https://github.com/digitalelvis/sdd-workspace/commit/12873a479459f2a6ea6e526af882dc46eab5784a))
- update roadmap with phase 2 achievements ([b22aa1f](https://github.com/digitalelvis/sdd-workspace/commit/b22aa1f5ff9886cf072a196f41d5259dfa811a65))
## [0.1.0](https://github.com/digitalelvis/sdd-workspace/compare/10ee85f7b3df71fa447101054774aad896425c7d...0.1.0) (2026-04-20)

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

### ✨ Refactors

- decouple framework and ide generation using Strategy pattern engines ([097a81f](https://github.com/digitalelvis/sdd-workspace/commit/097a81f3d3172399dc0ed54c49ab96cf6e5a21fb))
- rename templates to resources, registry.json with resource flag ([e6b18d2](https://github.com/digitalelvis/sdd-workspace/commit/e6b18d27f7a45328d35b175ca9e63857b479019d))

### 📖 Documentation

- add global AGENTS.md instructions for repository AI interactions ([9d807a7](https://github.com/digitalelvis/sdd-workspace/commit/9d807a7b7df05e25dc2915976c1bff2a3c211349))
- update CONTRIBUTING and AGENTS with resources/, registry.json and Skill Hub ([6fce027](https://github.com/digitalelvis/sdd-workspace/commit/6fce027a1cce74a02bb5b017e65e01debc495baa))
- update documentation to reflect v0.0.2 config system and sdd branding ([1e932a6](https://github.com/digitalelvis/sdd-workspace/commit/1e932a64710cfd5193c625f156d48b5fc9bff81f))
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
