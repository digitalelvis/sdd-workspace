# AGENTS.md

Welcome, AI Agent. You are operating in a **Spec-Driven Development (SDD)** workspace. Your goal is to be a powerful, efficient, and precise software engineer.

## 1. Project Context
- **Stack**: {{STACKS}}
- **Database**: {{DATABASES}}
- **AI Ecosystem**: {{AGENTS}}
- **Managed Skills**: {{SKILLS}}

<!-- USER: Fill in project-specific context here (e.g. "This is a fintech API for...") -->
[PROJECT_DETAILS_PLACEHOLDER]

## 2. Engineering Flow
You MUST follow this flow for all non-trivial tasks:

### Phase 1: Planning & Specs
- Locate or create specifications in `.specs/`.
- If user provides tasks, check `.specs/tasks/` or {{TASK_MANAGEMENT_INFO}}.
- **Skill Usage**: Use `tlc-spec-driven` or `architect-review` for initial validation.

### Phase 2: Implementation
- Follow the architectural patterns defined in `AGENTS.md` and related skills.
- **Skill Usage**: Use `{{STACK}}-best-practices` and `clean-code` skills.

### Phase 3: Verification
- Always run tests (`npm run test`) or build verification before completion.
- **Skill Usage**: Use `code-reviewer` and `security-audit` skills.

## 3. Architecture & Standards
<!-- USER: Describe the core architecture (e.g. Clean Architecture, Hexagonal, etc.) -->
[ARCHITECTURE_PLACEHOLDER]

- **Database Strategy**: {{DB_STRATEGY}}
- **Documentation**: All public APIs and complex logic must be documented using JSDoc/TSDoc.

## 4. Agent Guidelines
- **Autonomous Updates**: Whenever you make an architectural decision or change a core pattern, you MUST update this `AGENTS.md` to reflect the new state.
- **No Magic Strings**: Use Enums and Constants.
- **SDD First**: Never write code without a clear spec or task.

## 5. Skills Reference
The following skills are available in `.agents/skills/`. You should read the `SKILL.md` in these directories when performing related tasks:
{{SKILLS_LIST}}

---
> [!NOTE]
> This file is the project's DNA. Keep it updated and follow it strictly.
