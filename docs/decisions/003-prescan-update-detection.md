# ADR-003: Pre-scan Update Detection for Idempotent CLI Installer

## Status

Accepted

## Context

When users re-run the `@rhofkens/ai-coding-starter` CLI after a template version bump (e.g., v2.0.0 to v2.0.2), existing files were silently skipped. This meant updated template files (commands, skills, agents) never reached the user without manually deleting them first. There was no visibility into what was being skipped or why.

Four approaches were considered for handling existing files on re-install:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| A | Per-file overwrite prompts | Maximum user control | Too noisy for 15+ template files, poor UX |
| B | Version stamp file | Can diff versions, skip if same | Adds state tracking, stamp can be stale or missing, extra complexity |
| C | Content diffing / merge | Only overwrites changed files | High complexity, edge cases with user-modified files, overkill for templates |
| D | **Pre-scan with single confirm** | Clean UX, user stays in control, no state files | Overwrites all-or-nothing for core items (no per-file granularity) |

## Decision

We chose **Option D: Pre-scan with single confirmation prompt**.

The CLI performs a read-only scan of all core template items before copying anything. If existing files are detected, it shows a summary note and asks a single question: "Update existing files with latest templates?" This gives users clear visibility and control without overwhelming them.

**Key design choices:**

1. **Single confirm for core items** — One "Update existing files?" prompt rather than per-file. The core template is designed as a cohesive unit; partial updates would create inconsistencies.
2. **Optional items always overwrite when selected** — If a user explicitly says "Yes" to "Update Frontend Agent?", we overwrite. They made an active, informed choice.
3. **Smart label switching** — Optional item prompts dynamically show "Update X?" when the file exists or "Add X?" when new, so the user knows what they're getting into.
4. **No version tracking** — The scan detects state from the filesystem directly. No stamp file to maintain, no version comparison logic, no stale state risk. Users have git for rollback.

**Implementation pattern:**

- `scanDir()` / `scanItem()` — Read-only recursive scan returning `{ newFiles[], existingFiles[] }`
- `mergeDir()` / `copyItem()` — Accept `overwrite` flag, return `{ created, updated, skipped }` counts
- Summary categorizes results as Created / Updated / Kept

## Consequences

**Positive:**
- Users can now receive template updates without manual file deletion
- Clear visibility into what the installer detects and what it will do
- No persistent state files to manage or version stamps to maintain
- Fresh installs are unaffected — no extra prompts appear
- Summary distinguishes Created / Updated / Kept for full transparency

**Negative:**
- Core items are all-or-nothing: user cannot update `.claude/` but keep `CLAUDE.md` unchanged
- No content diffing means unchanged files get overwritten too (byte-identical copies)
- User-modified template files (e.g., customized `CLAUDE.md`) will be overwritten if user says "Yes"

**Mitigation:**
- All-or-nothing is appropriate because core template files are designed to work together
- Byte-identical overwrites are harmless (no functional impact, no git diff)
- Users have git to review and revert any unwanted overwrites via `git diff` / `git checkout`
- The confirm defaults to "No" to protect against accidental overwrites
