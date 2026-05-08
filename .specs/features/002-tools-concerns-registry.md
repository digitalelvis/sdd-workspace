# Feature Spec: Tools & Concerns Registry

## Goal

Establish a centralized registry for all development tools (Linters, Testers, Utilities) to enable conditional installation and "Integrity First" checks.

## Architecture

- **Registry**: `src/resources/registry/tools.json`
- **Utility**: `src/utils/ExistenceChecker.ts`

## Registry Schema

```json
{
  "eslint": {
    "type": "linter",
    "displayName": "ESLint",
    "defaultSkills": [],
    "defaultSkillsProviders": [],
    "defaultRules": ["eslint-rules"],
    "configFiles": [
      ".eslintrc",
      ".eslintrc.json",
      ".eslintrc.js",
      ".eslintrc.yaml"
    ],
    "dependencies": ["eslint", "eslint-config-next"],
    "recommendedStacks": ["nodejs", "react", "nextjs"]
  },
  "husky": {
    "type": "git-hook",
    "displayName": "Husky",
    "defaultSkills": [],
    "defaultSkillsProviders": [],
    "defaultRules": ["eslint-rules"],
    "configFiles": [".husky", ".huskyrc"],
    "dependencies": ["husky"],
    "recommendedStacks": ["all"]
  }
}
```

## Proposed Changes

1. **Registry Creation**: Initialize `tools.json` with ESLint, Prettier, Husky, Commitlint, Storybook, Jest, Vitest, and Zod.
2. **Existence Check Logic**: Implement `ExistenceChecker.isAlreadyInstalled(toolName)` which checks for both config files and `package.json` dependencies.
3. **Registry Integration**: Update `ConfigResolver` to include tool metadata in the resolved configuration.

## Verification

- Create a project with an existing `.eslintrc.json`.
- Verify that `ExistenceChecker` returns `true` for ESLint.
- Ensure `sdd init` identifies the tool as already present.
