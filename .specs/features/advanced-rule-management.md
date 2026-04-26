# Feature Spec: Advanced Rule Management

## 1. Problem Statement

Currently, a technology stack in the registry is limited to a single `ruleTemplateFile`. This makes it difficult to share rules across stacks (e.g., "Clean Code" rules applied to both Node.js and Python) or to compose complex rule sets from smaller, modular blocks.

## 2. Proposed Solution

Introduce a more flexible rule resolution system in the registry and `SDDEngine`:

- **Modular Rules**: Move individual rule sets to `src/resources/rules/*.md`.
- **Registry Composition**: Allow `StackDefinition` to specify a list of `defaultRules` (IDs matching the filenames in the rules directory).
- **Rule Resolution**: `SDDEngine` will resolve and concatenate these rules during the injection process.

## 3. Detailed Design

### 3.1 Registry Schema (`SkillRegistry.ts`)

Update `StackDefinition` to include an optional `defaultRules` array.

```typescript
export interface StackDefinition {
  defaultSkills: string[];
  ruleTemplateFile?: string; // Legacy support
  defaultRules?: string[]; // New: modular rules
  linterDependencies: string[];
}
```

### 3.2 Registry Content (`stacks.json`)

Example update:

```json
"nodejs": {
  "defaultSkills": ["tlc-spec-driven", "nodejs-best-practices"],
  "defaultRules": ["node-base", "code-quality"],
  "linterDependencies": ["eslint", "prettier"]
}
```

### 3.3 Resource Organization

- `src/resources/rules/node-base.md`
- `src/resources/rules/code-quality.md`
- `src/resources/rules/python-base.md`

### 3.4 SDDEngine Logic

`SDDEngine.inject` should:

1. Load `engineering-rules.md`.
2. For each selected stack:
   - If `defaultRules` exists, load and concatenate all referenced rule files.
   - If `ruleTemplateFile` exists (legacy), load it as well.
3. Combine everything into `.agents/rules/main.md`.

## 4. Verification Plan

- **Unit Tests**: Update `SDDEngine.spec.ts` to mock multiple rules and verify concatenation.
- **Integration Test**: Run `npm run dev -- init` and check if `.agents/rules/main.md` contains the combined rules.
