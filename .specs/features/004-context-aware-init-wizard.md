# Feature Spec: Context-Aware Init Wizard

## Goal
Transform the `init` command into an intelligent, multi-step wizard that summarizes detection results and allows for granular, safe configuration.

## Interaction Design

### Step 1: Detection Summary
```text
🚀 Detectamos o seguinte DNA no seu projeto:
- Stack: Next.js + React
- Database: PostgreSQL (Prisma)
- Segurança: JWT, Helmet (existentes)
```

### Step 2: Tooling & Concerns
- List Linters, Testers, and Utilities.
- Pre-select items that are NOT detected but are recommended for the detected stack.
- Mark detected items as "Installed" (cannot be unselected or are locked).

### Step 3: Git Strategy
- Radio selection for the 3 Git Strategies (GitHub Flow, Git Flow, Jira-Driven).

### Step 4: Final Injection
- Summary of what will be created/injected.
- Confirmation prompt.

## Technical Implementation
- **Command**: `src/cli/commands/init/action.ts`
- **Wizard Library**: `inquirer` (List, Checkbox, Confirm).
- **Safety**: `ExistenceChecker` is used at each step to disable or hide already-configured tools.

## Verification
- Test various combinations (e.g., empty dir vs existing Next.js project).
- Ensure the summary accurately reflects the `Analyzer` output.
- Confirm that no files are overwritten during the process.
