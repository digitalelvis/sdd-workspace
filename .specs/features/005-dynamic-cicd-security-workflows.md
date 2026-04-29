# Feature Spec: Dynamic CI/CD & Security Workflows

## Goal
Generate tailored GitHub Action workflows by composing modular templates based on the user's specific stack, database, and selected tools.

## Architecture
- **Engine**: `src/scaffolder/engines/WorkflowComposer.ts`
- **Templates**: `src/resources/templates/workflows/`
- **Actions**: `src/resources/templates/actions/`

## Workflow Composition Logic
The `WorkflowComposer` will assemble a `main.yml` (or similar) by combining:
1. **Trigger Base**: `on: [push, pull_request]`
2. **Build Job**: Specific to the stack (e.g., `npm ci`, `npm run build`).
3. **Lint Job**: Included if a linter is selected/detected.
4. **Test Job**: Included if a testing tool is selected/detected.
5. **Security Job**: Includes `security-scan` if selected.
6. **Integrity Job**: Includes `validate-skills` to check SDD health.

## Key Actions
- `release.yml`: Automated versioning logic.
- `check-ci-status`: Gating logic for releases.
- `security-scan`: Integration with Snyk/Trivy or custom scripts.
- `validate-skills`: Check if `.agents/rules` and `.agents/skills` are present and up to date.

## Implementation Details
- **No Static Overwrite**: If `.github/workflows/ci.yml` exists, the composer will create `ci-sdd.yml` or append to a non-destructive location.
- **Dynamic Assembly**: Uses string templates or a YAML builder to ensure valid syntax.

## Verification
- Initialize a "React + Vitest" project.
- Verify the generated CI workflow includes the `test` job with `npm run test`.
- Verify the `security-scan` action is present in the workflow.

## Draft Implementation Plan & Open Questions

### Open Questions
1. **YAML Composition Strategy**: Should we concatenate the YAML blocks as simple strings (which requires careful indentation handling) or use an AST parser (like the `yaml` package) to programmatically assemble the structure?
2. **Generic Action Injections**: Should files like `release.yml` and `validate-skills.yml` be always injected across all generated workflows, or should they be conditionally activated based on the selected Git Strategy?
3. **Refactoring Scope**: Should we entirely deprecate `CICDEngine.ts` or refactor it into an orchestrator that utilizes the new `WorkflowComposer`?

### Draft Implementation Steps
- **Step 1:** Create `WorkflowComposer.ts` to replace/augment `CICDEngine`.
- **Step 2:** Scaffold the base modular templates inside `src/resources/templates/workflows/jobs/` (build, lint, test, security, integrity).
- **Step 3:** Scaffold the action templates inside `src/resources/templates/actions/`.
- **Step 4:** Implement the composition logic within `WorkflowComposer.ts`, dynamically reading `resolvedConfig.resolvedTools` to decide which jobs to append.
- **Step 5:** Modify `WorkspaceService.ts` to trigger `WorkflowComposer` instead of the legacy `CICDEngine`.
- **Step 6:** Add unit tests (`WorkflowComposer.spec.ts`) asserting correct conditional job assembly.
