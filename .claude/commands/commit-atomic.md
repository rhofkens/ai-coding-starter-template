---
description: Analyze changes and create logical atomic commits
allowed-tools: Bash(git:*), Bash(mvn:*), Bash(npm:*), Read, Glob, Grep, AskUserQuestion
---

# Atomic Commit Workflow

Analyze all pending changes and group them into logical atomic commits, where each commit represents a single coherent change.

## Step 1: Analyze All Changes

First, gather information about all pending changes:

```bash
git status
git diff --name-only
git diff --name-only --cached
```

Read the changed files to understand what each change does.

## Step 2: Group Changes Logically

Analyze the changes and group them by logical relationship. Consider:

- **Feature groups**: Files that implement the same feature together
- **Bug fix groups**: Related fixes that solve the same issue
- **Refactoring groups**: Related code restructuring
- **Documentation groups**: Docs that describe the same feature/change (including `docs/plans/` folder)
- **Configuration groups**: Related config changes

### Grouping Guidelines

- Backend service + its DTO + its controller = one commit
- Frontend component + its styles + its tests = one commit
- Implementation code + its documentation/plan = one commit
- Database migration + entity changes = one commit
- Keep unrelated changes in separate commits

## Step 3: Present Commit Groups for Approval

Before making any commits, present the proposed groupings to the user using AskUserQuestion or by listing them clearly:

**Example format:**

```text
I've analyzed the changes and suggest the following atomic commits:

Commit 1: feat(backend): add user authentication endpoint
  - src/main/java/auth/AuthController.java
  - src/main/java/auth/AuthService.java
  - src/main/java/dto/LoginRequest.java

Commit 2: docs: add authentication implementation plan
  - docs/plans/authentication-plan.md

Commit 3: fix(frontend): correct button alignment on login page
  - src/components/LoginButton.tsx
```

Ask the user to approve, modify, or reject the groupings before proceeding.

## Step 4: Pre-commit Quality Checks

Before committing, run quality checks based on what files are being committed:

**For Java files:**

```bash
cd /Users/roelandhofkens/Projects/Ai/video-story-creator/backend && mvn spotless:apply compile
```

**For frontend files:**

```bash
cd /Users/roelandhofkens/Projects/Ai/video-story-creator && npm run lint:frontend
```

## Step 5: Create Atomic Commits

For each approved group, create a separate commit:

1. Stage only the files for that group: `git add <file1> <file2> ...`
2. Create commit with conventional format
3. Verify with `git status`
4. Repeat for next group

## Commit Message Format

Use conventional commits format:

```text
type(scope): description (1-72 chars)

- Detail about change 1
- Detail about change 2
```

**Valid types:** feat, fix, docs, style, refactor, test, chore

## Important Rules

- Do NOT include any Claude references or attribution
- Do NOT add "Co-Authored-By" lines
- Keep commit messages professional and focused
- Each commit should be self-contained and buildable
- Use HEREDOC for multi-line commit messages:

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

- Detail 1
- Detail 2
EOF
)"
```

## Workflow Summary

1. Run `git status` and `git diff --name-only` to see all changes
2. Read changed files to understand context
3. Group related changes logically
4. Present groups to user and get approval
5. Run quality checks
6. Create atomic commits one group at a time
7. Verify final state with `git status`
