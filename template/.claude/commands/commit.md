---
description: Commit all changes to git with conventional commit format
allowed-tools: Bash(git:*), Bash(npm:*), AskUserQuestion
---

# Git Commit Workflow

Commit all staged and unstaged changes to git, following the project's commit conventions.

## Pre-commit Steps

Before committing, run any configured quality checks for your project (linting, formatting, type checking, etc.).

## Commit Message Format

The project uses **conventional commits**:

```
type(scope): description
```

### Valid types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style/formatting (no logic change)
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

### Rules:
- Scope is optional: `feat: add new feature` or `feat(backend): add new feature`
- Description must be 1-72 characters
- Use lowercase for type and scope
- Use imperative mood in description ("add" not "added")

### Examples:
```
feat: add presentation upload functionality
fix(backend): correct database connection issue
docs: update setup instructions
refactor(frontend): simplify state management
```

## Commit Message Body (Optional)

For complex changes, add a body with bullet points explaining the changes:

```
fix: properly check presigned URL expiration before refreshing

- Fixed URL expiration check to parse actual expiration time from presigned URL
- Only refresh URLs that are actually expired or within 5 minutes of expiring
```

## Important Rules

- Do NOT include any Claude references or attribution
- Do NOT add "Generated with Claude Code" or similar footers
- Do NOT add "Co-Authored-By: Claude" or similar
- Keep commit messages professional and focused on the changes made
- Use HEREDOC format for commit messages to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

- Detail 1
- Detail 2
EOF
)"
```

## Workflow

1. Run `git status` to see all changes
2. Run `git diff` to review the changes
3. Run `git log --oneline -5` to see recent commit style
4. Run quality checks (lint, format) as needed
5. Stage all relevant files with `git add`
6. Draft the commit message and present it to the user for approval
7. Once approved, create the commit
8. Verify with `git status` after commit
