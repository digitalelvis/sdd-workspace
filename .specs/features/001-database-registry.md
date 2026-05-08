# Feature Spec: Database Registry

## Goal
Decouple database-specific logic and rules from the core engine, allowing for a scalable way to add support for new databases.

## Architecture
- **Registry**: `src/resources/registry/databases.json`
- **Rules**: `src/resources/rules/[db-name]-rules.md`
- **Detection**: `src/analyzer/DatabaseDetector.ts` (updated to use registry keys)

## Registry Schema
```json
{
  "postgresql": {
    "displayName": "PostgreSQL",
    "defaultRules": ["engineering-rules", "postgres-rules"],
    "defaultSkills": ["postgres-best-practices"],
    "detectionFiles": ["prisma/schema.prisma", "docker-compose.yml", "package.json:pg"]
  }
}
```

## Proposed Changes
1. **Registry Creation**: Initialize `databases.json` with Postgres, MongoDB, MySQL, and SQLite.
2. **Enum Refactor**: Update `SupportedDatabase` to dynamically reflect registry keys.
3. **Injector Update**: `SDDEngine` must now query the database registry to find associated rules and skills.
4. **Analyzer Update**: Refactor `DatabaseDetector` to iterate over registry `detectionFiles` instead of hardcoded strings.

## Verification
- Run `sdd init` in a project with `prisma/schema.prisma` and verify PostgreSQL is auto-detected.
- Verify that `postgres-rules.md` is injected into `.agents/rules/main.md`.
