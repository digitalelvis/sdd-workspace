---
name: Open Source Workspace Governance
description: Operational requirements containing version control, SemVer, Pull Request policies, and branch structures for interactions between SDD Agents.
---

# Repository Governance: Versioning & SDD Workflow

As an Artificial Intelligence Agent or Human Developer acting within the `ai-sdd-workspace` repository, it is strictly mandatory that any code writing, review, or Pull Request that affects this codebase adheres to the following Rules.

## 1. Branching Model (Release Branches)
Never develop features or request Merges (PRs) directly into the `main` branch!
This project utilizes the **Release Branches** policy.
- **`main`**: Strictly restricted. It serves as a clean mirror of the current published package on NPM.
- **`vX.Y.x`** *(e.g., `v0.1.x`, `v1.0.x`)*: These are the **Development Main-lines**. All features of the respective "series" are built and targeted for submission towards the active release branch.
- **`feat/`** and **`fix/`**: Shallow and atomic branches created on demand branching off from the current "main-line" (e.g., branching off from `v1.0.x`). All development happens within them, and they return via Pull Request to the *Release Branch*.

## 2. Commit Standards
Commits must strictly follow the global [Conventional Commits](https://www.conventionalcommits.org/) convention.
This is mandatory for our automated systems to bundle versions automatically.

**Valid Types:**
- `feat:` (Addition of new rules, engines, or stacks)
- `fix:` (Bug fixes and memory leak corrections in a physical file or CLI behavior)
- `refactor:` (Typing changes, design patterns like Strategy, code cleanups)
- `chore:` (Internal configurations, package updates, tooling, linting, modifying this document)
- `docs:` (Updates to README, .specs, or SDD Skills)
- `test:` (Writing isolated Unit Tests within the `tests/` directory)

*Example:* `feat: add AntigravityIdeProvider for workspace setups`

## 3. Pull Request Manifesto
Every PR requires the following tickets validated by the Agents or Developers:
1. **Pass Unit Tests**: Ensure code sanity by running the local `npm run test` command before formalizing the submission. No TS compilation (`npm run build`) is allowed to fail.
2. **Automated Changelog (`release-it`)**: Do **NOT** edit `CHANGELOG.md` manually! Our pipeline runs `release-it` to automatically scrape commit messages. Your only duty is to ensure your PR adopts rigorous Conventional Commits (`feat:`, `fix:`). The automation will inject emojis, author names, and hashes.
3. **Core SDD Focus:** No architectural AI Engine or Native Framework additions should be implemented without a pre-existing draft document located precisely inside `.specs/`.

This is a mandatory regulation. Without meeting these three criteria, discard and abort the generation of any repository mutation artifact.
