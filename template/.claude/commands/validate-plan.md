---
description: Validate implementation against a plan and reconcile discrepancies
argument-hint: <plan-file-path>
allowed-tools: Bash(git:*), Read, Glob, Grep, Write, AskUserQuestion, Task
---

# Validate Plan Implementation

Validate that an implementation matches its plan, identify discrepancies, and update the plan to reflect the final implementation.

## Usage

`/validate-plan docs/plans/my-feature.md`

A plan file path is **required**. This command will:
1. Compare the plan against the actual implementation
2. Present discrepancies for user review
3. Update the plan with a changelog documenting what changed

## Workflow

### Step 1: Read and Analyze the Plan

Read the plan file (`$ARGUMENTS`) and extract:

1. **Scope section** - What was in scope vs out of scope
2. **Implementation Phases** - Each phase with its tasks
3. **Files to Modify** - Lists of new files and modified files
4. **Technical Approach** - Architecture and design decisions
5. **Manual Testing Checklist** - Items that should have been tested

Create a structured checklist of all items that should have been implemented.

### Step 2: Gather Implementation Evidence

#### 2.1 Find Related Commits

Search git history for commits related to this plan:

```bash
# Extract keywords from plan title/content
git log --oneline --all --grep="<feature-keywords>"

# Find commits touching files mentioned in the plan
git log --oneline -- <files-mentioned-in-plan>

# Get detailed changes from related commits
git show --name-only <commit-hash>
```

#### 2.2 Analyze Current Code State

Check if files mentioned in the plan exist and contain expected functionality:

- Use Glob to verify file existence
- Use Grep to search for key classes, functions, or patterns mentioned in the plan
- Use Read to examine specific implementations

#### 2.3 Check Uncommitted Changes

Review current session changes that may relate to this plan:

```bash
git status
git diff --name-only
git diff HEAD~10 --name-only
```

### Step 3: Build Discrepancy Report

Compare the plan against the implementation to identify:

#### Missing Implementations (Plan → Code)

Items in the plan that are NOT in the code:
- Phases/tasks marked as in-scope but not implemented
- Files listed in "Files to Modify" that weren't created/modified
- Features described but not found in codebase
- API endpoints or database changes not present

#### Extra Implementations (Code → Plan)

Items in the code that are NOT in the plan:
- Additional files created beyond what was planned
- Extra features or functionality added
- Different technical approaches than described
- Additional database changes or API endpoints

### Step 4: Present Missing Implementations

For each missing item, present to the user:

```text
## Missing Implementations

These items were planned but not found in the implementation:

### 1. [Item Description]
**Source:** [Phase/Section in plan]
**Expected:** [What was expected]
**Status:** Not found in codebase

[ ] This is acceptable (intentionally skipped or deferred)
[ ] This needs to be implemented
```

Use `AskUserQuestion` to gather user decisions on each category of missing items:

**Question:** "How should we handle these missing implementations?"
**Options:**
- "Acceptable - Mark as intentionally skipped"
- "Needs implementation - Keep as TODO"
- "Deferred - Move to future work"
- "Other (explain)"

### Step 5: Present Extra Implementations

For each extra item, present to the user:

```text
## Extra Implementations

These items were implemented but not in the original plan:

### 1. [Item Description]
**Location:** [File path or commit]
**What it does:** [Brief description]

[ ] Add to plan (this was a good addition)
[ ] Document as deviation (explain why it diverged)
```

Use `AskUserQuestion` to gather user decisions:

**Question:** "How should we document these extra implementations?"
**Options:**
- "Add to plan - These were good additions"
- "Document as deviation - Explain the change"
- "Remove from scope - Mark as out of scope"
- "Other (explain)"

### Step 6: Update the Plan

Based on user decisions, update the plan file with:

#### 6.1 Add/Update Implementation Status Section

Add a new section after the Executive Summary or at the end:

```markdown
## Implementation Status

**Validation Date:** YYYY-MM-DD
**Overall Status:** Completed | Partially Completed | Completed with Changes

### Completed Items
- [x] Phase 1: [Name] - Completed as planned
- [x] Phase 2: [Name] - Completed with modifications (see changelog)

### Intentionally Skipped
- [ ] [Item] - Reason: [User-provided reason]

### Deferred to Future Work
- [ ] [Item] - Deferred: [Reason]
```

#### 6.2 Add Changelog Section

Add a changelog at the end of the plan:

```markdown
---

## Changelog

### YYYY-MM-DD - Implementation Validation

**Completed:**
- [List of items completed as planned]

**Added (not in original plan):**
- [Item] - [Brief description of what was added and why]

**Skipped (intentionally not implemented):**
- [Item] - Reason: [User-provided reason]

**Changed (different from plan):**
- [Item] - Original: [what was planned], Actual: [what was implemented], Reason: [why]

**Deferred:**
- [Item] - Moved to: [future plan or backlog]
```

#### 6.3 Update Scope Section (if needed)

If items were added or removed, update the "In Scope" and "Out of Scope" sections to reflect the final state.

### Step 7: Report Summary

Provide a summary to the user:

```text
## Plan Validation Complete

**Plan:** [path/to/plan.md]
**Validation Date:** YYYY-MM-DD

### Summary
- Items Completed as Planned: X
- Items Added (extra implementations): Y
- Items Skipped (intentionally): Z
- Items Deferred: W

### Changes Made to Plan
- Added Implementation Status section
- Added Changelog with validation results
- Updated Scope section (if applicable)

### Next Steps
[Suggest any follow-up actions if needed]
```

## Discrepancy Analysis Guidelines

### What to Check For

**Backend:**
- Services, controllers, repositories mentioned in plan
- Database entities and migrations
- API endpoints (check controller mappings)
- Configuration classes and properties
- Exception handling and validation

**Frontend:**
- Components listed in plan
- Types and interfaces
- API client functions
- State management updates
- UI/UX features described

**Infrastructure:**
- Configuration files
- Environment variables
- Database migrations

### Evidence Sources

When determining if something was implemented, check:
1. **File existence** - Does the file exist?
2. **Key patterns** - Are the expected classes/functions present?
3. **Git history** - Was it added/modified in related commits?
4. **Functional completeness** - Does it do what was described?

### Handling Ambiguity

If unsure whether something was implemented:
- Read the actual code to understand what exists
- Ask the user for clarification if needed
- Document uncertainty in the discrepancy report

## Important Notes

- Always read the actual code, don't assume based on file names
- Consider partial implementations (e.g., feature exists but incomplete)
- Respect the user's decisions on what to keep/skip/defer
- The goal is an accurate historical record, not perfection
- Keep changelog entries concise but informative
