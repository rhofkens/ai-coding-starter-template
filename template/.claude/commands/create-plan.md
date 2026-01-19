---
description: Create implementation plans for new features or changes
argument-hint: <feature-name>
allowed-tools: Read, Glob, Grep, Write, AskUserQuestion, Task
---

# Implementation Plan Generator

Create high-level implementation plans for features, changes, or improvements. Plans are stored in `docs/plans/` and focus on architecture, phases, and technical decisions—not code.

## Plan Storage Location

All plans are stored in: `docs/plans/`

Naming convention: `<feature-name-kebab-case>.md` or `<feature-name-kebab-case>-plan.md`

## Workflow

### Step 1: Gather User Context

Ask the user for:

1. **What needs to be implemented** - The feature, change, or improvement
2. **What needs to be researched** - External APIs, technologies, patterns
3. **Any constraints or preferences** - Technology preferences, scope boundaries
4. **Related context** - Links to issues, discussions, or external documentation

### Step 2: Research Existing Architecture

Before creating the plan, thoroughly research the codebase:

#### 2.1 Review Architecture Decision Records (ADRs)

Check `docs/decisions/` for relevant architectural decisions:

- Technology choices that may affect the implementation
- Patterns already established in the codebase
- Previous decisions related to this area

#### 2.2 Review Existing Documentation

Check these folders for relevant context:

- `docs/guidelines/` - Coding standards and patterns
- `docs/PRD/` - Product requirements and specifications

#### 2.3 Read Requested Reference Documentation (Optional)

If the user mentions specific technologies, APIs, or frameworks that may need external documentation:

1. **Check `docs/reference/`** for matching MD files
2. **Read any relevant reference files** that match the technologies mentioned
3. **Incorporate key details** into your research summary

If the user mentions a technology and no reference file exists, note this in the Open Questions section of the plan.

#### 2.4 Research the Codebase

Use exploration tools to find:

- Existing implementations that are similar or related
- Database schemas and entities involved
- Services and controllers that will be affected
- Frontend components and state management patterns
- API endpoints that need changes or additions

### Step 3: Draft the Plan

Create a comprehensive plan with the following sections:

**Required Sections:**

1. **Title** - `# [Feature Name] Implementation Plan`

2. **Executive Summary** - 2-3 sentences describing what this plan achieves

3. **Problem Statement / Context** - What problem does this solve? Why is it needed?

4. **Scope** - In Scope (what will be implemented) and Out of Scope (what will NOT be implemented)

5. **Research Summary** - Relevant ADRs, existing patterns found, external resources/links

6. **Technical Approach** - Present options (Option A, Option B, etc.) with pros/cons, then state recommended approach with reasoning

7. **Architecture / Design** - Data flow diagrams (ASCII), component interactions, database changes, API changes

8. **Implementation Phases** - Each phase should include:
   - Phase number and name (e.g., "Phase 1: Foundation")
   - Goal - what this phase achieves
   - Tasks - numbered list of work items
   - Dependencies - what must exist before this phase
   - Acceptance Criteria - table of testable criteria (see Step 5)
   - Manual Testing - checkbox list of test steps

9. **Files to Modify** - Separate lists for new files and modifications

10. **Risk Assessment** - Table with columns: Risk, Impact, Likelihood, Mitigation

11. **Open Questions** - Checkbox list of questions that need answering

12. **References** - Links to relevant documentation and external resources

### Step 4: Interactive Refinement

Present the draft plan to the user and iterate:

1. **Present options** for technical decisions and ask for preferences
2. **Ask clarifying questions** about scope or requirements
3. **Propose phase breakdowns** and get feedback on ordering
4. **Highlight risks** and discuss mitigations

Use `AskUserQuestion` to gather input on key decisions.

**Important:** Do NOT add acceptance criteria yet. Wait until all technical and functional questions have been resolved with the user.

### Step 5: Add Acceptance Criteria

**Only after all questions are resolved**, add formal acceptance criteria to each phase.

Acceptance criteria define the "definition of done" for each phase. They are different from manual testing steps:
- **Acceptance Criteria**: Define WHAT must be true (testable statements)
- **Manual Testing**: Define HOW to verify it (step-by-step actions)

#### Acceptance Criteria Format

Use a table format with three columns:

```markdown
| ID | Criterion | Verification |
|----|-----------|--------------|
| AC1.1 | Database migration creates `column_name` column (TYPE, constraints) | Query shows column |
| AC1.2 | API endpoint returns 200 status for valid request | API test |
| AC1.3 | Frontend displays error message when validation fails | UI interaction |
```

#### Writing Good Acceptance Criteria

**DO:**
- Make each criterion independently testable
- Use specific, measurable language ("creates column X" not "updates database")
- Include the expected behavior AND how to verify it
- Number criteria with phase prefix (AC1.1, AC1.2, AC2.1, etc.)
- Cover both happy path and edge cases
- Include regression criteria where existing behavior must be preserved

**DON'T:**
- Use vague language ("works correctly", "handles properly")
- Combine multiple requirements in one criterion
- Skip verification methods
- Forget negative cases (what should NOT happen)

### Step 6: Finalize and Save

Once the user approves the plan with acceptance criteria:

1. Write the final plan to `docs/plans/<feature-name>.md`
2. Summarize what was created including acceptance criteria count per phase
3. Suggest next steps (e.g., "Ready to start Phase 1 when you are")

## Plan Guidelines

**DO Include:**

- High-level architecture decisions
- Pseudo-code to illustrate approaches (not full implementations)
- ASCII diagrams for data flow and component interactions
- Tables for comparisons and risk assessment
- Formal acceptance criteria for each phase (added after user confirms requirements)
- Checkboxes for manual testing steps
- Phase dependencies (each phase builds on the previous)
- File paths for code that will be affected

**DO NOT Include:**

- Complete code implementations
- Exact line-by-line changes
- Time estimates or deadlines
- Promises about specific completion dates
- Acceptance criteria before requirements are finalized (ask questions first)

## Diagram Examples

**Data Flow:**

```text
User Input → Frontend Form → API Call → Backend Service
                                              ↓
                                        Database
                                              ↓
                                    External API (if needed)
```

**Component Hierarchy:**

```text
ParentComponent
├── ChildComponentA
│   └── GrandchildComponent
└── ChildComponentB
```

**Decision Tree:**

```text
                    ┌─────────────────┐
                    │  Need storage?  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Database      File System      Cloud Storage
```
