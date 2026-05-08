---
title: Guidance for AI Coding Agents
description: Required instructions for any LLM interacting with this repository.
---

# AGENTS.md

> **Guidance for AI Coding Agents when working with code in this repository.**

Welcome, AI Agent (Antigravity, Cursor, Windsurf, Copilot, etc).
When executing tasks within this repository (`@digitalelvis/sdd-workspace`), you **MUST** adhere to the following behavioral and structural directives.

## 1. Behavioral Defaults

- **Environment Context First**: Before accepting complex tasks, silently verify if the `.agents/skills`, `.specs/`, and `sdd.yml` exist. If they do NOT exist, you **MUST** suggest to the user to bootstrap the workspace by running `npm run start -- init` before continuing.
- **Plan Mode Mandatory**: For any non-trivial architectural change, stop and create an `implementation_plan.md` first. Do not blindly change the codebase.
- **Verification is Law**: Never mark a task as complete without proving it works. Run `npm run test` or compile via `npm run build` to verify logic integrity.
- **SDD First**: We are building a Spec-Driven Development CLI. Apply the same rigorous SDD mindset to your own code modifications. Think structurally before generating.
- **No Magic Strings**: Domain logic must reside in Enums (`IdeEnvironment`, `SupportedStack`), not hardcoded strings.
- **Git Strategy Awareness**: This project **commits** AI rules (`.cursorrules`, `.agents/skills/`) as project DNA. Only ephemeral cache files (`.cursor/`, `.windsurf/`) are ignored.

## 2. Repository Overview

This is a Node.js CLI written in **TypeScript**. Its purpose is to scaffold AI workspaces by detecting frameworks (Stacks) and configuring linters/prompt rules for IDEs and Agents.

- **CLI Core**: Uses `commander` and interactive prompts via `inquirer`.
- **Design Pattern**: Heavily utilizes **Strategy Pattern** for Providers and **Facade Pattern** for orchestrators (`WorkspaceService`).
- **Config Flow**: Uses a 4-layer `ConfigResolver` (Built-in -> Global -> Local -> CLI Flags) to resolve the final `WorkspaceConfig`.
- **Skill Hub**: Skills are orchestrated via `src/resources/registry.json`.

```bash
# General CLI testing (No build step required)
npm run dev -- init

# Testing
npm run test           # Run Jest suite

# Code Quality & Release
npm run build          # Builds to /dist
npm run release        # Automated SemVer Release-It changelog
```

## 3. Architecture Context

If tasked to modify behavior or add support:

- **`src/config/`**: Where the hierarchy resolution logic lives (`ConfigResolver.ts`).
- **`src/domain/enums/`**: Declare the strict literal (e.g., `IdeEnvironment.WEBSTORM`).
- **`src/scaffolder/providers/`**: Create the Strategy class (e.g., `WebStormIdeProvider`).
- **`src/scaffolder/engines/`**: Map the object instantiation in the switch-case Factory (`EcosystemEngine.ts` or `SDDEngine.ts`).

## 4. Code Conventions

- **TypeScript Strict Mode**: No implicit `any`. Interfaces must be maintained.
- **Imports**: Prefer explicit relative imports.
- **Testing**: We use Jest. Every new Provider or Engine must possess its localized `.spec.ts` inside the `tests/` directory mirroring its path structure.

## 5. Governance & Pull Requests

If you are tasked to finalize a feature and commit to a branch:

- You **MUST** read `.agents/rules/git-governance.md` first!
- **Commit Format**: We strictly use Conventional Commits (`feat:`, `fix:`, `refactor:`).
- Always branch out from the active release line into an atomic feature branch (`feat/`). Do NOT push to `main`.
