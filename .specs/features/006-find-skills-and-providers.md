# Feature Spec: Find Skills & Multi-Provider Support

## Goal
Enable users and the engine to discover skills based on provider (e.g., MongoDB, Supabase), category (e.g., database, security), or name. This supports the automated installation of recommended skills via `defaultSkillsProviders`.

## Architecture
- **Service**: `src/resources/SkillService.ts`
- **Command**: `src/cli/commands/find-skills/`
- **Registry**: `src/resources/registry/skills.json` (using new `provider` and `categories` fields)

## Proposed Changes

### 1. SkillService Logic
Implement a search function that filters the `skills.json` registry:
```typescript
interface SearchQuery {
  provider?: string;
  category?: string;
  name?: string;
}

findSkills(query: SearchQuery): string[] // returns skill IDs
```

### 2. SDDEngine Integration
Update `SDDEngine` to handle `defaultSkillsProviders`:
- If a stack or database defines `defaultSkillsProviders`, the engine calls `SkillService.findSkills({ provider })`.
- All found skills are added to the injection list.

### 3. CLI Command
Add `sdd find-skills [query]` to allow manual discovery.
- Options: `--provider`, `--category`.

## Verification
- Run `sdd find-skills --provider mongodb`.
- Verify it returns `mongodb-connection`, `mongodb-schema-design`, etc.
- Initialize a project with `mongodb` and verify that provider-specific skills are suggested/installed.
