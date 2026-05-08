# Technology Stack

## Core
- **Runtime**: Node.js (>=20.x recommended)
- **Language**: TypeScript (Strict Mode)
- **CLI Framework**: [Commander.js](https://commanderjs.org/)
- **Interactive Prompts**: [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- **Visuals**: [Chalk](https://github.com/chalk/chalk) for terminal styling

## Development & Tooling
- **Build Tool**: `tsc` (TypeScript Compiler)
- **Task Runner**: `npm` scripts
- **Linter**: [ESLint](https://eslint.org/) with TypeScript support
- **Formatter**: [Prettier](https://prettier.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged)
- **Commit Linting**: [@commitlint/cli](https://commitlint.js.org/) + `@commitlint/config-conventional`
- **Config format**: [js-yaml](https://github.com/nodeca/js-yaml) — workspace config stored as `sdd.yml` / `~/.sddrc.yml`

## Testing
- **Framework**: [Jest](https://jestjs.io/)
- **Helper**: `ts-jest` for direct TS execution in tests

## Release & Versioning
- **Manager**: [release-it](https://github.com/release-it/release-it)
- **Changelog**: `@release-it/conventional-changelog`
