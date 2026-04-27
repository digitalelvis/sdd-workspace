# Feature Spec: Git Strategy Selection

## Goal
Support standardized Git workflows by injecting specific AI rules and documentation that guide developers/agents in branching, committing, and environment management.

## Architecture
- **Registry**: `src/resources/registry/git-strategies.json`
- **Rules**: `src/resources/rules/git/[strategy].md`

## Strategy Definitions

### 1. GitHub Flow (Agile/CD)
- Short-lived feature branches.
- Direct merge to `main` via PR.
- Continuous deployment.

### 2. Git Flow (Structured/Release)
- `develop` and `main` branches.
- `feature/`, `release/`, and `hotfix/` branches.
- Ideal for versioned products.

### 3. Jira-Driven Environment Flow (Enterprise)
- Branch names prefixed with Jira IDs (e.g., `PROJ-123-feat`).
- Environment branches (e.g., `staging`, `production`) mapped to specific Jira status updates.
- Audit trail and compliance focus.

## Proposed Changes
1. **Registry Creation**: Define the three strategies with descriptions and required rule files.
2. **Rules Authoring**: Create markdown rules for each strategy explaining the branching and commit conventions.
3. **Injector Update**: `SDDEngine` should include the selected strategy rules in the `main.md` composition.

## Verification
- Select "Jira-Driven Environment Flow" during `init`.
- Verify that rules regarding "Jira IDs in branch names" appear in `.agents/rules/main.md`.
