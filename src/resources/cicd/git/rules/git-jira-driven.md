---
trigger: always_on
---

# Repository Governance & Git Flow Regulation

# Git Strategy: Jira-Driven Environment Flow

## 📌 Branch Hierarchy

- **main**: Production only. Mirror of the live environment.
- **staging**: UAT / Pre-production. Source for stabilization.
- **develop**: Development integration. The source for all new work.

## 🌿 Temporary Branches

Every task must have its own branch named after the Management Tool ID.

- **Pattern**: `[PROJECT-ID]-[NUMBER]` (e.g., `PROJ-123`)
- **Source**: Always branch off `develop`.
- **Target**: Pull Request to `develop`.

## 🚨 Hotfix Workflow

1. Branch from `main`: `hotfix/[PROJECT-ID]-[NUMBER]`
2. Merge to `main` (for immediate fix).
3. **Backport**: Merge `main` back into `staging` AND `develop` immediately.

---

## 2. Commit Standards (Conventional Commits)

Strict adherence to the [Conventional Commits 1.0.0](https://conventionalcommits.org) specification is mandatory for automated versioning via `release-it`.

**Type Reference Table:**

| Type       | Purpose                                               | Impact        |
| :--------- | :---------------------------------------------------- | :------------ |
| `feat`     | New rules, engines, stacks, or capabilities           | Minor Version |
| `fix`      | Bug fixes, memory leaks, or CLI behavior corrections  | Patch Version |
| `refactor` | Code changes that neither fix a bug nor add a feature | None          |
| `docs`     | Updates to README, `.specs`, or SDD Skills            | None          |
| `chore`    | Internal configs, dependencies, or governance updates | None          |
| `perf`     | Performance improvements                              | Patch/Minor   |
| `test`     | Adding or correcting isolated Unit Tests in `tests/`  | None          |

**Breaking Changes:** Append `!` after the type/scope (e.g., `feat(api)!:`) and include the `BREAKING CHANGE:` footer.

---

## 3. Commit Format

**Structure:**

    <type>(<scope>): <description>

    [optional body]

    [optional footer(s)]

- **Imperative mood**: Use "add", not "added" or "adds".
- **Atomic**: One task per commit.
- **Scope**: Lowercase module name (e.g., `auth`, `engine`, `cli`).

---

**This regulation is mandatory. Failure to meet these criteria will result in the abortion of any repository artifact generation.**
