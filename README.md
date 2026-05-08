# SDD Workspace 🚀

> [!WARNING]
> **Project Status: BETA**
> We are shaping the future of AI-Assisted Engineering. Join us in evolving this engine!

**The Universal Bridge Between Human Intent and AI Execution.**

`sdd-workspace` is a high-performance CLI designed to level up how developers and teams build software. It is a **standardization engine** that ensures every member of your team—from Junior to Staff Engineer—delivers code that respects the project's architecture, patterns, and domain rules.

---

## 💎 The Philosophy: Engineering Excellence for Everyone

In the AI era, the bottleneck is no longer "how to code," but **"how to design."** Most AI tools fail because they lack architectural context. **Spec-Driven Development (SDD)** solves this by prioritizing structural planning over raw generation.

### Why SDD Workspace?

*   **📈 Level Up Your Team**: It acts as an invisible mentor. By injecting precision-engineered rules, it guides developers of all levels to follow senior-level patterns, reducing architectural errors and technical debt.
*   **🪙 Token Efficiency & Cost Optimization**: Stop wasting money on bloated prompts. By using a modular "Skills" and "Rules" system, the engine only provides the necessary context for each task. This minimizes context-window noise, prevents AI "forgetfulness," and drastically reduces token consumption in every request.
*   **🤖 Multi-Agent Orchestration**: Seamlessly coordinate between different AI personalities (e.g., a *Cutter* for code, a *Linter* for quality, and an *Architect* for specs). The workspace creates a unified environment where different agents (Cursor, Windsurf, Claude Code) can collaborate without conflicting instructions.
*   **🎯 Zero-Hallucination Context**: Turn your AI agents into domain experts. The CLI automatically detects your stack (Next.js, Laravel, React, etc.) and harmonizes rules so the AI understands your specific **Project DNA**.
*   **⚡ Faster Delivery, Better Quality**: Stop the "prompt-error-fix" cycle. By defining specs first, your first iteration is closer to the final product, drastically reducing lead time and rework.
*   **🤝 Unified Standards (Git-Synced)**: Eliminate "Shadow Architecture." All AI instructions and skills are committed to Git. Your team stays in sync, ensuring consistent output across the entire repository.

---

## 🚀 Getting Started

### 1. Global Usage (Recommended)
Install globally to apply your favorite configurations and "scaffolders" instantly to any project.

```bash
npm install -g sdd-workspace

# Initialize in your project
sdd init
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
npx sdd-workspace init
```

---

### 3. Local Usage (Development & Contribution)

To test source code changes or contribute to the project:

```bash
# Clone the repository
git clone https://github.com/digitalelvis/sdd-workspace.git
cd sdd-workspace

# npm install also runs `prepare`, which installs Husky git hooks
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

Built with ❤️ to empower the next generation of AI-Augmented Engineering and Development.