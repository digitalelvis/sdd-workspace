---
title: Contributing to SDD Workspace (@digitalelvis/sdd-workspace)
description: Guidelines and architectural documentation for contributing to the sdd CLI ecosystem.
---

First of all, thank you for taking the time to dedicate your engineering skills (or agentic capabilities) to contribute to `@digitalelvis/sdd-workspace`! 🎉

> **Note**: This document provides all the necessary information to get your local development environment set up, understand our Engine architecture via diagrams, and safely submit your Pull Requests under our governance structure.

## 🛠 Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- Global familiarity with [Spec-Driven Development (SDD)](https://github.com/tech-leads-club/agent-skills).

## 🚀 Setup

```bash
git clone https://github.com/digitalelvis/sdd-workspace.git
cd ai-sdd-workspace
npm install
npm run build
# The binary can be tested locally using: npm run sdd -- init
```

## 💻 Development Commands

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev -- init`   | Run CLI locally bypassing build    |
| `npm run build`         | Compile TypeScript into `/dist`    |
| `npm run test`          | Run all Jest Unit Tests            |
| `npm run lint`          | Lint codebase via ESLint           |
| `npm run release`       | Trigger automated SemVer changelog |

## 📐 Architecture & Domain Model

The `sdd` CLI utilizes a **4-layer hierarchical configuration system** before dispatching to specialized Engines. We separate the concept of "How an IDE looks" from "How an AI Agent behaves" using the **Strategy Pattern**.

### Core Processing Flow

```mermaid
graph TD
    CLI[index.ts CLI Prompt/Flags] --> CR[ConfigResolver]
    
    subgraph ConfigLayers [4-Layer Hierarchy]
        L1[Built-in Defaults]
        L2[Global: ~/.sddrc.json]
        L3[Local: sdd.config.json]
        L4[CLI Flags]
    end

    ConfigLayers -.-> CR
    CR --> |Resolved WorkspaceConfig| WS[WorkspaceService Facade]
    
    WS --> |Setup Rules/Agent Brains| SDD[SDDEngine]
    WS --> |Setup Linters/IDE Host| ECO[EcosystemEngine]

    SDD --> |Reads Catalog| REG["registry.json\n(Skill Hub)"]
    REG --> |Injects Skills| Agents[AgentProviders]
    ECO --> |Generates| IDE[IdeProviders]
    ECO --> |Detects| Stacks[StackProviders]
```

### Key Decisions (ADRs)
We document major architectural changes using **Architecture Decision Records**. Refer to the `docs/adr/` directory for historical context:
- [ADR-001: Workspace Configuration Architecture](./docs/adr/001-config-architecture.md)

## 📁 Project Structure

```text
ai-sdd-workspace/
├── src/
│   ├── analyzer/                 # Framework and Ecosystem Detectors
│   ├── cli/                      # NEW: Modular CLI layer (Commands & Actions)
│   │   ├── commands/             # Individual command factories
│   │   └── cli-handler.ts        # Global Commander orchestration
│   ├── config/                   # Hierarchical Config & Global Management
│   │   ├── GlobalConfigManager.ts # Business logic for ~/.sddrc.json
│   │   └── ConfigResolver.ts     # 4-layer merge engine
│   ├── domain/                   # Enums and Interfaces
│   ├── scaffolder/               # Core execution layers
│   ├── resources/                # Static assets bundled with the CLI
│   └── index.ts                  # Minimal Entrypoint
├── docs/
│   └── adr/                      # Architecture Decision Records
├── tests/                        # Jest test definitions
└── package.json
```

## ⭐ Extending the Ecosystem

### Adding new Stacks/IDEs
1. **Declare the Domain**: Add your literal string to the corresponding Enums (`IdeEnvironment.ts`, `SupportedStack.ts` or `AiAgent.ts`).
2. **Create the Provider Strategy**: Implement the interface (e.g. `WebStormIdeProvider implements IdeProvider`).
3. **Register in Factory**: Add the map to the respective engine (`EcosystemEngine.ts` or `SDDEngine.ts`).

### Adding a new Skill to the Hub
Add an entry to `src/resources/registry.json`:
```json
"my-skill": {
  "resource": "skill",
  "mode": "cli",
  "command": "npx -y publisher/skills install -s my-skill",
  "roles": ["backend"]
}
```

## 🔄 Release & Governance Process

We use **Release Branching** (`vX.Y.x`) and **Conventional Commits**.
Never develop directly on `main`.

| Commit Prefix | Version Bump  | Example                               |
| ------------- | ------------- | ------------------------------------- |
| `feat:`       | Minor (0.X.0) | `feat: add WebStorm ide support`      |
| `fix:`        | Patch (0.0.X) | `fix: correct linter path generation` |
| `docs:`       | No bump       | `docs: update README`                 |

> **Note**: Do NOT manually edit `CHANGELOG.md`. It is automated via `release-it`.

## 🤝 Submitting Contributions
1. **Fork** and **Branch** off the current active release line.
2. **Commit** with conventional commits.
3. **Push** and **Open** a Pull Request. Ensure all Jest tests are passing (`npm run test`).
