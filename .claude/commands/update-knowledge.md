---
description: Persist learnings from the current session to long-term knowledge
argument-hint: [plan-file]
allowed-tools: Bash(git:*), Read, Glob, Grep, Write, AskUserQuestion
---

# Update Knowledge

Capture learnings from the current work session and persist them to long-term knowledge files.

## Usage Modes

**Mode 1: No arguments** - `/update-knowledge`

Analyzes recent uncommitted changes, recent commits, and recently modified plans/ADRs to extract learnings from the current session.

**Mode 2: With plan file** - `/update-knowledge docs/plans/video-project/my-feature.md`

Focuses on learnings specifically related to the implementation of the given plan. Analyzes commits and changes associated with that plan's implementation.

## Storage Locations

- **Session logs:** `docs/knowledge/sessions/` - Individual session learnings
- **General knowledge:** `docs/knowledge/knowledge.md` - Accumulated learnings
- **Changelog:** `docs/knowledge/changelog.md` - Audit log of knowledge updates

## Workflow

### Step 1: Gather Context

#### Mode 1: No Arguments (Recent Session)

Analyze recent work to understand what happened in the session:

**1.1 Uncommitted changes:**

```bash
git status
git diff --name-only
```

Read the changed files to understand what was worked on.

**1.2 Recent commits:**

```bash
git log --oneline -10
git diff HEAD~5 --name-only
```

Review commits from this session to understand completed work.

**1.3 Recent plans:**

```bash
ls -lt docs/plans/video-project/ | head -5
```

Read the most recently modified plan to understand the implementation context.

**1.4 Recent ADRs:**

```bash
ls -lt docs/decisions/ | head -3
```

Read any recently created or modified ADRs.

#### Mode 2: Plan File Provided

When a plan file is provided (e.g., `$ARGUMENTS` = `docs/plans/video-project/my-feature.md`):

**1.1 Read the plan file:**

Understand the feature being implemented, the planned approach, and key components involved.

**1.2 Find related commits:**

```bash
# Search commits mentioning the feature/plan keywords
git log --oneline --all --grep="<feature-keywords>"

# Search for commits touching files mentioned in the plan
git log --oneline -- <files-mentioned-in-plan>
```

**1.3 Analyze implementation vs plan:**

- Compare what was planned vs what was actually implemented
- Identify deviations and why they occurred
- Note challenges encountered during implementation

**1.4 Find related ADRs:**

Check if any ADRs were created during this plan's implementation:

```bash
ls -lt docs/decisions/
```

Read ADRs that relate to decisions made during this implementation.

### Step 2: Generate Session Learnings

Based on the gathered context, identify learnings in these categories:

**What went well:**

- Approaches that worked effectively
- Tools or patterns that were helpful
- Successful problem-solving strategies

**What didn't go well:**

- Things that took multiple iterations to get right
- AI recommendations that didn't work as expected
- Misunderstandings or miscommunications
- User frustrations during the session

**What to avoid in the future:**

- Anti-patterns discovered
- Approaches that caused problems
- Common pitfalls identified

### Step 3: Write Session Log

Create a new session file in `docs/knowledge/sessions/`:

**Filename format:** `YYYY-MM-DD-brief-topic.md`

**Session log format:**

```markdown
# Session: [Brief Topic Description]

**Date:** YYYY-MM-DD
**Focus:** [Main area of work]
**Plan:** [path/to/plan.md or "N/A" if no plan]

## Summary

[2-3 sentences describing what was accomplished]

## What Went Well

- [Bullet point]
- [Bullet point]

## What Didn't Go Well

- [Bullet point with context]
- [Bullet point with context]

## Learnings

- [Technical insight or pattern discovered]
- [Workflow improvement identified]
- [Tool usage tip]

## Avoid in Future

- [Anti-pattern or pitfall]
- [Approach that caused issues]
```

**Guidelines:**

- Keep it concise - bullet points, not paragraphs
- Focus on technical aspects, code, and workflow
- Note user experience issues and frustrations
- Include specific examples where helpful
- Don't include sensitive data or credentials

### Step 4: Update General Knowledge

Read the existing `docs/knowledge/knowledge.md` file (create if it doesn't exist).

**Knowledge file format:**

```markdown
# Project Knowledge Base

Accumulated learnings from development sessions.

## Architecture & Patterns

- [Pattern or architectural insight]

## Common Pitfalls

- [Pitfall and how to avoid it]

## Workflow Tips

- [Workflow optimization]

## Tool Usage

- [Tool-specific tip or configuration]

## Code Patterns

- [Useful code pattern or idiom]

## Debugging Tips

- [Debugging approach that works well]
```

**Update process:**

1. Read existing knowledge file
2. Compare session learnings with existing entries
3. Add new learnings that aren't already captured
4. Consolidate or update existing entries if session provides better insight
5. Remove duplicates

### Step 5: Update Changelog

Append to `docs/knowledge/changelog.md`:

```markdown
## YYYY-MM-DD

**Session:** [Brief topic]
**Plan:** [path/to/plan.md or "N/A"]
**Session file:** `sessions/YYYY-MM-DD-brief-topic.md`

**Added to knowledge.md:**
- [New entry 1]
- [New entry 2]

**Updated in knowledge.md:**
- [Updated entry description]

**Removed from knowledge.md:**
- [Removed entry if applicable]
```

### Step 6: Report Summary

Present a summary to the user:

1. **Session summary** - What was analyzed and key observations
2. **Learnings captured** - Bullet list of main learnings from session
3. **Knowledge updates** - What was added/updated in the general knowledge
4. **File locations** - Paths to created/updated files

## Example Output

```text
## Knowledge Update Complete

### Session Summary
Analyzed 5 uncommitted files, 3 recent commits, and the
cartesia-tts-integration plan.

### Key Learnings from This Session
- Nested markdown code blocks break linting - use indentation instead
- Screenshot validation needs max retry limit to prevent loops
- User management features should be verified against actual UI

### Updates to Knowledge Base
Added to knowledge.md:
- Markdown code block nesting pitfall
- Screenshot capture validation workflow

Session log saved: docs/knowledge/sessions/2026-01-09-documentation-updates.md
```

## Important Notes

- Focus on learnings that will help future sessions
- Don't capture implementation details - those belong in code comments or docs
- Keep entries actionable and specific
- Avoid generic statements like "communication is important"
- Technical focus: code, architecture, tools, workflow
