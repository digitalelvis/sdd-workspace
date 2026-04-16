"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specTemplates = void 0;
exports.specTemplates = {
    specInit: `# Specification Document

## 1. Objective / Feature Name
Describe at a high level what is being built.

## 2. Problem Statement
Why are we building this?

## 3. Desired Outcomes
What metrics or behaviors determine success?

## 4. Non-Goals
What are we explicitly NOT going to build right now?
`,
    planInit: `# Technical Plan

## 1. Architecture Overview
Provide a high level diagram or explanation.

## 2. Data Models / Schemas
List new tables, columns, or interfaces.

## 3. Integration Points
Describe APIs or internal modules to interact with.
`,
    taskInit: `# Task Tracker

- [ ] Task 1: Setup infrastructure (DB tables/configs).
- [ ] Task 2: Implement domain logic & tests.
- [ ] Task 3: Expose via APIs or UI Components.
- [ ] Task 4: E2E validation.
`
};
