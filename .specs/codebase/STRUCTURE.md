# Directory Structure

```
.
├── .agents/             # AI Agent skills and rules
├── .specs/              # SDD Specification documents (PROJECT, CODEBASE, FEATURES)
├── src/
│   ├── analyzer/        # Workspace detection logic
│   ├── cli/             # CLI command definitions and handlers
│   │   └── commands/    # Modular command implementations
│   ├── config/          # Config resolution and management
│   ├── domain/          # Core enums, interfaces, and contracts
│   ├── resources/       # Templates, skills, and static data
│   └── scaffolder/      # Core engines and providers
│       ├── engines/     # Orchestrators for specific domains
│       └── providers/   # Platform-specific implementations (IDE, Agent, Stack)
├── tests/
│   └── unit/            # Unit tests mirroring src/ structure
├── dist/                # Compiled JavaScript output
├── docs/                # Project documentation
├── AGENTS.md            # Guidelines for AI agents
├── sdd.yml              # Workspace-specific SDD configuration
└── package.json         # Project manifest and dependencies
```
