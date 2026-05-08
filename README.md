# SDD Workspace 🚀

> [!WARNING]
> **Project Status: BETA**
> This project is currently in Beta. You may encounter bugs or breaking changes. We encourage you to report any issues and contribute to its evolution.

**The Intelligent Spec-Driven Development Engine for Modern Engineering Teams.**

`@digitalelvis/sdd-workspace` is a high-performance CLI designed to bootstrap and manage "AI-Friendly" ecosystems. It transforms your repository into a structured Spec-Driven Development (SDD) environment by automatically detecting your technology stack and injecting precision-engineered AI instructions, linter rules, and standardized directory structures.

---

## 💎 Core Philosophy

Spec-Driven Development (SDD) is a methodology that prioritizes **structural planning** over **code generation**. This CLI ensures that your AI agents (Cursor, Windsurf, Claude Code, etc.) operate as high-level engineers rather than simple autocomplete engines.

- **Intelligent Autonomy**: Detects hybrid stacks (e.g., Next.js + Prisma + Tailwind) and harmonizes rules.
- **Config-First Architecture**: Uses a 4-layer configuration hierarchy for maximum flexibility.
- **Project DNA Tracking**: We treat AI rules as code. We commit instructions to Git to ensure team consistency.

---

## 🚀 How to Use

### 1. Global Usage (Recommended)

Install the package globally to access the `sdd` command in any project on your machine. This is the best way to maintain productivity, allowing you to apply your favorite configurations instantly.

#### Installation

```bash
npm install -g @digitalelvis/sdd-workspace
```

#### Initializing an SDD Workspace in a project

```bash
cd /your-project
sdd init
```

#### Configure your Global Preferences

You will be highly productive by configuring your global preferences for skills, stacks, agents, etc. (stored in `~/.sddrc.yml`) which will be automatically applied to all new projects.

```bash
# Set Cursor as the default IDE and your favorite agents
sdd config set defaults.ide cursor
sdd config set defaults.agents antigravity,cursor
```

---

### 2. Usage via NPX (No Installation)

If you wish to use the tool without performing a global installation, you can run it directly via NPX:

```bash
cd /your-project
npx @digitalelvis/sdd-workspace init
```

---

### 3. Local Usage (Development & Contribution)

To test source code changes or contribute to the project:

```bash
# Clone the repository
git clone https://github.com/digitalelvis/sdd-workspace.git
cd ai-sdd-workspace
npm install

# Build and run locally
npm run build
npm run sdd -- init
```

---

## 🛠️ Main Commands

| Command                       | Description                                                          |
| :---------------------------- | :----------------------------------------------------------------- |
| `sdd init`                    | Detects the stack and generates the `sdd.yml` file.                |
| `sdd apply`                   | Synchronizes the workspace with current `sdd.yml` rules.           |
| `sdd config list`             | Lists all global configurations in `~/.sddrc.yml`.                 |
| `sdd config set <path> <val>` | Sets a global value (e.g., `sdd config set defaults.ide vscode`). |
| `sdd find -s`                 | Search skills by provider, category, or name.                      |
| `sdd find -r`                 | Search rules by provider, category, or name.                       |
| `sdd add --skill <name>`      | (Beta) Adds a specific skill via registry.                         |

---

## 📂 Project Structure

After running `sdd init`, your project will follow the SDD Premium standard:

```text
├── .agents/
│   ├── rules/          # Agent behavioral rules (Committed)
│   └── skills/         # Specialized technical knowledge (Committed)
├── .specs/             # Specification documentation (Source of Truth)
├── sdd.yml             # Declarative workspace configuration
├── .cursorrules        # Entry point for Cursor AI
└── .windsurfrules     # Entry point for Windsurf
```

---

## 🧩 Supported Ecosystems

- **Agents**: Antigravity, Cursor, Windsurf, Copilot, Kiro.
- **IDEs**: Cursor, Windsurf, VS Code, WebStorm.
- **Stacks**: Next.js, React, Node.js, Python, Laravel, Vue, and more.

---

## 🤝 Contribution

Refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for architecture details and code standards.

---

## 📞 Support & Contact

- **Elvis Lopes**
- **Email**: [elvislopesdigital@gmail.com](mailto:elvislopesdigital@gmail.com)
- **WhatsApp**: [+55 (48) 99626-6204](https://wa.me/5548996266204)

---

_Built with ❤️ for the next generation of AI-Native Engineers._
