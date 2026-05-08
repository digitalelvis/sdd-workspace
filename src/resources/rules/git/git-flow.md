# Git Flow (Structured/Release)

This project follows the strict Git Flow branching model.

## Core Branches

- **`main`**: Reflects the current production state.
- **`develop`**: The integration branch for features.

## Supporting Branches

- **`feature/*`**: Branched from `develop`. Must be merged back into `develop`.
- **`release/*`**: Branched from `develop` when preparing a new release. Used for final bug fixes and version bumps. Merged into `main` and `develop`.
- **`hotfix/*`**: Branched from `main` to address critical production issues. Merged into `main` and `develop`.

## Commit Conventions

- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- Ensure commits are atomic.

## Process Flow

1. Create a `feature/` branch from `develop`.
2. Commit your work.
3. Open a Pull Request against `develop`.
4. Release branches are created periodically from `develop` and merged to `main` upon release.
