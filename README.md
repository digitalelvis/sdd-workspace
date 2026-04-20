# AI-SDD Workspace 🚀

**The Intelligent Spec-Driven Development Engine for Modern Engineering Teams.**

AI-SDD Workspace is a high-performance CLI designed to bootstrap and manage "AI-Friendly" ecosystems. It transforms your repository into a structured Spec-Driven Development (SDD) environment by automatically detecting your technology stack and injecting precision-engineered AI instructions, linter rules, and standardized directory structures.

---

## 💎 Core Philosophy

Spec-Driven Development (SDD) is a methodology that prioritizes **structural planning** over **code generation**. This CLI ensures that your AI agents (Cursor, Windsurf, Claude Code, etc.) operate as high-level engineers rather than simple autocomplete engines.

- **Intelligent Autonomy**: Detects hybrid stacks (e.g., Next.js + Prisma + Tailwind) and harmonizes rules.
- **Config-First Architecture**: Uses a 4-layer configuration hierarchy for maximum flexibility.
- **Project DNA Tracking**: Unlike older tools, we treat AI rules as code. We commit instructions to Git to ensure team consistency.
- **Zero-Friction Adoption**: One command to initialize, one command to keep in sync.

---

## 🛠️ The `sdd.config.json` System

The heartbeat of your workspace is the `sdd.config.json` file. It serves as a declarative state of your SDD environment.

### 4-Layer Configuration Hierarchy
Our engine resolves settings using a "Nearest Wins" priority model:
1. **CLI Flags** (`--ide`, `--agents`) — *Highest Priority*
2. **Local Config** (`sdd.config.json`)
3. **Global Config** (`~/.sddrc.json`)
4. **Built-in Defaults** (CLI internal registry) — *Lowest Priority*

---

## 🚀 Getting Started

### Installation
```bash
# Initialize a new or existing project
npx ai-sdd-workspace init
```

### Main Commands

| Command | Description |
| :--- | :--- |
| `sdd init` | Bootstraps the project, detects stack, and generates `sdd.config.json`. |
| `sdd apply` | Synchronizes the workspace with the current `sdd.config.json`. |

---

## 📂 Project Structure

After running `sdd init`, your project will receive a premium SDD layout:

```text
├── .agents/
│   ├── rules/          # Behavioral rules for AI Agents (Committed)
│   └── skills/         # Specialized domain knowledge (Committed)
├── .specs/             # SDD Specification documents (The Source of Truth)
├── sdd.config.json     # Declarative workspace configuration
├── .cursorrules        # High-level entry point for Cursor AI
└── .windsurfrules     # High-level entry point for Windsurf
```

### Git Strategy
We adhere to professional repo hygiene. 
- **COMMITTED**: `.agents/rules/`, `.agents/skills/`, `.specs/`, `sdd.config.json`, `.cursorrules`.
- **IGNORED**: AI agent caches and ephemeral session data (`.cursor/`, `.windsurf/`, `.antigravity/`).

---

## 🧩 Supported Ecosystems

### Agents (The Brains)
- **Antigravity**, **Cursor Engine**, **Windsurf Flow**, **GitHub Copilot**, **Kiro**.

### IDEs (The Hosts)
- **Cursor**, **Windsurf**, **VS Code**, **WebStorm** (Coming Soon).

### Stacks (The Context)
- **Next.js**, **React**, **Node.js**, **Python**, **Laravel**, **Vue**, and more.

---

## 🤝 Contributing

We build with SOLID principles and DDD-inspired architecture.
1. **Standard Testing**: `npm run test`
2. **Standard Formatting**: `npm run format`
3. **Architecture**: Read [CONTRIBUTING.md](./CONTRIBUTING.md) for strategy & provider details.

---

## 📜 Credits
Inspired by and adapted from the [Tech Leads Club Agent Skills](https://github.com/tech-leads-club/agent-skills).

---
*Built with ❤️ for the next generation of AI-Native Engineers.*
