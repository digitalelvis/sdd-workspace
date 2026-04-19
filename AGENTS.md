---
title: Guidance for AI Coding Agents
description: Required instructions for any LLM interacting with this repository.
---

# AGENTS.md
> **Guidance for AI Coding Agents when working with code in this repository.**

Welcome, AI Agent (Antigravity, Cursor, Windsurf, Copilot, etc).
When executing tasks within this repository (`ai-sdd-workspace`), you **MUST** adhere to the following behavioral and structural directives.

## 1. Behavioral Defaults
- **Environment Context First**: Before accepting complex tasks, silently verify if the `.agents/skills` or `.specs/` folders exist. If they do NOT exist, you **MUST** suggest to the user to bootstrap the workspace by running `npm run start -- init` before continuing.
- **Plan Mode Mandatory**: For any non-trivial architectural change, stop and create an `implementation_plan.md` first. Do not blindly change the codebase.
- **Verification is Law**: Never mark a task as complete without proving it works. Run `npm run test` or compile via `npm run build` to verify logic integrity.
- **SDD First**: We are building a Spec-Driven Development CLI. Apply the same rigorous SDD mindset to your own code modifications. Think structurally before generating.
- **No Magic Strings**: Domain logic must reside in Enums (`IdeEnvironment`, `SupportedStack`), not hardcoded strings. 

## 2. Repository Overview
This is a Node.js CLI written in **TypeScript**. Its purpose is to scaffold AI workspaces by detecting frameworks (Stacks) and configuring linters/prompt rules for IDEs and Agents.
- **CLI Core**: Uses `commander` and interactive prompts via `inquirer`.
- **Design Pattern**: Heavily utilizes **Strategy Pattern** for Providers and **Facade Pattern** for orchestrators (`WorkspaceService`).
- **Skill Hub**: Skills are orchestrated via `src/resources/registry.json` supporting three delivery modes: `cli` (external npx), `remote` (HTTP fetch), and `local` (bundled assets).

```bash
# General CLI testing (No build step required)
npm run dev -- init

# Testing 
npm run test           # Run Jest suite
npm run test:watch     # Run in watch mode

# Code Quality & Release
npm run lint           # ESLint validation
npm run format         # Prettier auto-fix
npm run build          # Builds to /dist
npm run release        # Automated SemVer Release-It changelog
```

## 3. Architecture Context
If tasked to add a new framework or IDE, look here:
- **`src/domain/enums/`**: Declare the strict literal (e.g., `IdeEnvironment.WEBSTORM`).
- **`src/scaffolder/providers/`**: Create the Strategy class (e.g., `WebStormIdeProvider implements IdeProvider`).
- **`src/scaffolder/engines/`**: Map the object instantiation in the switch-case Factory (`EcosystemEngine.ts` or `SDDEngine.ts`).
- **`src/resources/registry.json`**: To add a new Skill to the Hub, declare an entry with `resource`, `mode`, `command`/`url`, and `roles`. The `SDDEngine` reads this catalog at runtime and executes the appropriate strategy.

## 4. Code Conventions
- **TypeScript Strict Mode**: No implicit `any`. Interfaces must be maintained.
- **Imports**: Prefer explicit relative imports.
- **Testing**: We use Jest. Every new Provider or Engine must possess its localized `.spec.ts` inside the `tests/` directory mirroring its path structure.

## 5. Governance & Pull Requests
If you are tasked to finalize a feature and commit to a branch:
- You **MUST** read `.agents/rules/repo-governance.md` first!
- **Commit Format**: We strictly use Conventional Commits (`feat:`, `fix:`, `refactor:`).
- **Changelog**: Do **NOT** manually edit `CHANGELOG.md`. It is fully automated by Semantic Releases. Just write clean commit messages.
- Always branch out from the active release line (`vX.X.x`) into an atomic feature branch (`feat/`). Do NOT push to `main`.
