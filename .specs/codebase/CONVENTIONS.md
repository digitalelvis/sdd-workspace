# Conventions

## Coding Standards

- **TypeScript Strict Mode**: No implicit `any`. Interfaces must be maintained and exported where necessary.
- **Explicit Imports**: Prefer explicit relative imports or defined aliases.
- **No Magic Strings**: Domain logic must reside in Enums (`IdeEnvironment`, `SupportedStack`), not hardcoded strings.
- **Naming**:
  - Files: `kebab-case` for CLI files, `PascalCase` for classes/providers.
  - Classes/Interfaces: `PascalCase`.
  - Variables/Functions: `camelCase`.
  - Constants: `SCREAMING_SNAKE_CASE`.

## Git Standards

- **Conventional Commits**: Use `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`, `test:`.
  Rules are defined in `commitlint.config.js` and enforced automatically by the `commit-msg` Husky hook.
- **Branching**: Develop in `feat/` or `fix/` branches off the active `vX.Y.x` release line. Never push directly to `main`.
- **Governance**: Atomic commits. One task per commit. See `.agents/rules/git-governance.md` for the full branching model.
- **Pre-commit**: `lint-staged` runs ESLint + Prettier on staged `src/` files before every commit.

## Directory Structure Mirroring

- Every class or provider in `src/` should have a corresponding `.spec.ts` in the `tests/unit/` directory, mirroring the path structure.

## Documentation

- **Agents.md**: Rules for AI agents must be updated when architectural changes occur.
- **Specs**: Every major feature must have a spec in `.specs/features/`.
