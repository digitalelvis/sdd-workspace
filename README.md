# AI - SDD Enginee for Workspaces

An open-source CLI tool to quickly bootstrap "AI-Friendly", Spec-Driven Development (SDD) ecosystems. This tool analyzes the current project (Next.js, React, Node.js) and injects the appropriate files, linter rules, testing environments, and AI-context configuration files.

## Core Features

- **Framework Detection**: Analyzes `package.json` to automatically detect Node.js, Next.js, or React.js.
- **Agent Skill Internalization**: Vendored, fully offline integration of SDD Agent Skills (adapted from [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills)).
- **Interactive Multi-IDE Setup**: Specify tools through a UI or CLI args to scaffold specific directories natively (e.g., `.cursor/rules/`, `.claude/skills/`).
- **Workspace Hygiene**: Automatically configures `.gitignore` to prevent AI runtime configuration bloat while keeping the `.specs/` logic tracked.

## Usage

Run the CLI in your existing or newly created project directory:

```bash
npx ai-sdd-workspace init
```

### CLI Arguments

You can bypass the interactive prompt by specifying your AI tools natively:

```bash
npx ai-sdd-workspace init --cursor --antigravity --claude --windsurf --vscode
```

## Contributing

We use GitHub Projects and Issues. Please check the `.github` templates before opening a PR.

## Ethics & Credits
The underlying SDD behavior rules and schema pipelines were inspired by and adapted from the official SDD guidelines of [Tech Leads Club Agent Skills](https://github.com/tech-leads-club/agent-skills).
