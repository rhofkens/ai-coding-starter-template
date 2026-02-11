# Smart Update Detection for CLI Installer

## Executive Summary

Replace the blind skip-or-merge logic with a pre-scan that detects previous installations and asks the user whether to update existing files or only add new ones. This gives users control over updates when re-running the installer after a template version bump.

## Problem Statement

When the installer encounters existing files, it silently skips them. This means:
- Users who upgrade from v2.0.0 to v2.0.2 never get updated template files (commands, skills, agents)
- There's no way to refresh files without manually deleting them first
- The user has no visibility into what's being skipped or why

## Scope

**In Scope:**
- Pre-scan core template items to detect new vs existing files
- Show detection summary and ask user whether to update existing files
- Adjust optional item prompts to say "Update" instead of "Add" when file already exists
- Pass overwrite flag through mergeDir/copyItem

**Out of Scope:**
- Per-file granular overwrite prompts (too noisy)
- File content diffing or merging
- Backup mechanism (users have git)
- Version tracking / stamp file

## Research Summary

**Relevant ADRs:**
- ADR-002: @clack/prompts for Interactive CLI — confirms we use `confirm()`, `note()`, `spinner()`, `log.*()` for user interaction

**Existing patterns in `bin/cli.js`:**
- `mergeDir()` — recursive directory copy, file-level skip
- `copyItem()` — single-item copy dispatcher, returns status string
- `exists()` — sync path existence check
- Core items: always installed via loop over `coreItems` array
- Optional items: individual copy blocks with manual exists check

**@clack/prompts primitives available:**
- `confirm()` — Yes/No with active/inactive labels, initialValue
- `note()` — styled box for summaries
- `select()` — single choice from list (not needed here)
- `spinner()` — progress indicator
- `log.success()`, `log.warn()`, `log.info()` — styled log lines

## Technical Approach

### Flow Change

```
Current:                          Proposed:

1. Intro + About                  1. Intro + About
2. Spinner → copy core            2. Pre-scan core items (silent)
   (skip existing files)          3. If existing files found:
3. Prompt optional items             → Show summary note
4. Copy optional (skip existing)     → Confirm: "Update existing files?"
5. Summary                        4. Spinner → install core (with overwrite flag)
                                  5. Prompt optional items
                                     → "Update X?" if exists, "Add X?" if new
                                  6. Copy optional (overwrite if user selected)
                                  7. Summary (created / updated / kept)
```

### Key Design Decisions

1. **Single confirm for core items** — One "Update existing files?" prompt, not per-file. Keeps UX clean.
2. **Optional items always overwrite when selected** — If user explicitly says "Yes" to "Update Frontend Agent?", we overwrite. They made an active choice.
3. **Smart label switching** — Optional confirm messages change from "Add X?" to "Update X?" based on pre-scan.
4. **Summary distinguishes created/updated/kept** — Clear feedback on what happened.

## Implementation

### Files to Modify

- `bin/cli.js` — All changes in this single file

### Phase 1: Add Scan Functions

#### 1.1 Add `scanDir()` function

Read-only recursive scan. Walks a template directory against the target and categorizes files.

```
scanDir(src, dest, basePath = '') → { newFiles: string[], existingFiles: string[] }
```

- Recurses into subdirectories
- For each file: checks if `destPath` exists
- Returns relative paths for display

#### 1.2 Add `scanItem()` function

Wrapper like `copyItem` but read-only. For directories calls `scanDir`, for single files checks existence.

```
scanItem(templateDir, targetDir, templateSubPath) → { newFiles: string[], existingFiles: string[] }
```

### Phase 2: Update Copy Functions

#### 2.1 Update `mergeDir()` signature

```
mergeDir(src, dest, overwrite = false) → { created, updated, skipped }
```

- When `overwrite=true` and file exists: overwrite it, count as `updated`
- When `overwrite=false` and file exists: skip it, count as `skipped`
- New files always copied, count as `created`

#### 2.2 Update `copyItem()` signature

```
copyItem(templateDir, targetDir, templateSubPath, description, overwrite = false)
  → 'created' | 'merged' | 'updated' | 'skipped' | 'missing'
```

- For directories: pass `overwrite` to `mergeDir`, report merged/updated/skipped
- For single files with `overwrite=true`: overwrite and return `'updated'`

### Phase 3: Rewrite `main()` Flow

#### 3.1 Core items section

```
a. Pre-scan all core items → aggregate newFiles and existingFiles across all 4 items
b. If existingFiles.length > 0:
   - note() showing: "Previous installation detected. N existing files found."
   - confirm("Update existing files with latest templates?", initialValue: false)
   - Set overwrite flag based on answer
c. Start spinner, install core items passing overwrite flag
d. Track created[], updated[], kept[] arrays for summary
```

Note: `initialValue: false` defaults to "No" — safe default, don't overwrite unless user opts in.

#### 3.2 Optional items section

```
a. Pre-scan each optional file to check existence
b. Change confirm message dynamically:
   - File exists: "Update Frontend Agent (React 19.x / shadcn / Vite)?"
   - File new:    "Add Frontend Agent (React 19.x / shadcn / Vite)?"
c. When user selects an optional item, always copy (overwrite=true)
   — they made an explicit choice
```

#### 3.3 Summary section

Three categories in the installation summary note:

```
Created:
  + docs/ folder structure
  + LICENSE file

Updated:
  ~ .claude/ commands, skills, and settings
  ~ CLAUDE.md project preferences

Kept (not updated):
  - Frontend Agent
```

### Phase 4: Version Bump + Changelog

- Bump `package.json` to `2.0.2`
- Update version strings in `bin/cli.js`
- Add `CHANGELOG.md` entry for v2.0.2

## Verification

### Test Scenario 1: Fresh install (no existing files)
```bash
rm -rf /tmp/test-cli && mkdir /tmp/test-cli && cd /tmp/test-cli
node ~/Projects/Ai/ai-coding-starter-template/bin/cli.js
```
Expected: No "previous installation" prompt. All items show "Created". Same flow as today.

### Test Scenario 2: Full previous install, user says YES to update
```bash
# Run installer once fully, then run again
cd /tmp/test-cli && node ~/Projects/Ai/ai-coding-starter-template/bin/cli.js
```
Expected: Shows "Previous installation detected". User confirms update. Core items show "Updated". Optional items show "Update X?" labels.

### Test Scenario 3: Full previous install, user says NO to update
Same as above but decline the update confirm.
Expected: Core items show "Kept" for existing. Any new files still created. Optional items show "Update X?" — user can decline individually.

### Test Scenario 4: Partial install (some files exist, some don't)
```bash
rm -rf /tmp/test-cli && mkdir -p /tmp/test-cli/.claude
echo '{}' > /tmp/test-cli/.claude/settings.json
echo '# My Project' > /tmp/test-cli/CLAUDE.md
cd /tmp/test-cli && node ~/Projects/Ai/ai-coding-starter-template/bin/cli.js
```
Expected: Detects existing files. New files always created, existing files updated or kept based on user choice. Merge message shows accurate counts.
