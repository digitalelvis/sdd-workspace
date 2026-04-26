# AGENTS.md - The Project Brain

Welcome! This document outlines how we build software in this repository. We use **Spec-Driven Development (SDD)** and an evolutionary mission-based approach.

## 1. Orchestration & Planning (Orchestrator)

<!-- - **Output Skill**: Always use `.agents/skills/caveman` Caveman full Intensity. -->

Before making any complex changes, you **MUST** follow the `.agents/skills/spec-driven` workflow.

- **Primary Source of Truth**: `.specs/` (Requirements, Roadmap, State).
- **Core Workflow**:
  1. **Specify**: Define what we are doing in `.specs/features/`.
  2. **Design**: Plan the architecture (if needed).
  3. **Tasks**: Break down into atomic units in `.specs/project/ROADMAP.md` or a feature-specific `tasks.md`.
  4. **Execute**: Implement surgically.
- **Auto-Sizing**: Small tweaks (≤3 files) can skip formal specs but must still be documented in `STATE.md` if they impact logic.
