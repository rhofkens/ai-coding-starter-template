# npx ai-coding-starter Tool Implementation Plan

## Executive Summary

Create an npm package `@rhofkens/ai-coding-starter` that can be executed via `npx @rhofkens/ai-coding-starter` to initialize a new project with Claude Code configurations, commands, agents, skills, and documentation folder structure for enterprise-grade AI-assisted development workflows.

## Problem Statement / Context

Starting a new project with proper Claude Code configurations requires manually copying files from an existing template or setting up the folder structure from scratch. This is time-consuming and error-prone. Similar to Maven archetypes in the Java world, we need a quick way to bootstrap a project with the right AI coding workflow settings.

The tool will:
1. Copy `.claude/` folder (commands, agents, skills, settings example)
2. Copy `docs/` folder structure (empty directories for decisions, guidelines, knowledge, plans, PRD, reference)
3. Copy `CLAUDE.md` project preferences file
4. Provide a seamless `npx` experience without requiring global installation

## Scope

### In Scope
- Create npm package structure with bin script
- Bundle template files within the package
- Copy template files to current working directory
- Handle existing files/folders gracefully (prompt or skip)
- Publish to npmjs.com
- Basic CLI feedback (success/error messages)

### Out of Scope
- Interactive prompts for customization options
- Multiple template variants
- Git repository initialization
- Post-init hooks or scripts
- Version checking or updates
- Analytics or telemetry

## Research Summary

### Relevant Patterns

**npx-executable packages** follow a standard structure:
- `package.json` with `bin` field pointing to executable
- Shebang (`#!/usr/bin/env node`) at top of bin file
- `files` field to include only necessary files in published package

**Similar tools for reference:**
- `create-react-app` - Complex scaffolding with prompts
- `degit` - Simple project scaffolding from git repos
- `tiged` - Modern fork of degit

### Template Contents to Bundle

```
template/
├── .claude/
│   ├── agents/
│   │   └── reference-researcher.md
│   ├── commands/
│   │   ├── adr.md
│   │   ├── commit-atomic.md
│   │   ├── commit.md
│   │   ├── create-plan.md
│   │   ├── update-knowledge.md
│   │   └── validate-plan.md
│   ├── skills/
│   │   └── update-docs/
│   │       ├── MINTLIFY_REFERENCE.md
│   │       ├── SCREENSHOT_CAPTURE.md
│   │       └── SKILL.md
│   └── settings.local.example.json
├── docs/
│   ├── decisions/
│   ├── guidelines/
│   ├── knowledge/
│   │   └── sessions/
│   ├── plans/
│   ├── PRD/
│   └── reference/
├── CLAUDE.md
└── LICENSE
```

## Technical Approach

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Pure Node.js with fs module** | No dependencies, small package size, simple | More code to write for recursive copy |
| B: Use fs-extra package | Simpler recursive copy API, battle-tested | Adds a dependency |
| C: Use degit/tiged approach (fetch from git) | Template always up-to-date from repo | Requires network, more complex, git dependency |

### Decision: Option A (Pure Node.js)

Use pure Node.js with built-in `fs` module. Node 16+ has `fs.cp` with recursive support, making this straightforward without dependencies.

**Rationale:**
- Zero runtime dependencies
- Smallest possible package size
- Works offline after installation
- No network requests needed

## Architecture / Design

### Package Structure

```
ai-coding-starter/
├── bin/
│   └── cli.js              # Entry point with shebang
├── template/               # All template files
│   ├── .claude/
│   ├── docs/
│   ├── CLAUDE.md
│   └── LICENSE
├── package.json
├── README.md
└── LICENSE
```

### Execution Flow

```
User runs: npx ai-coding-starter
              │
              ▼
┌─────────────────────────────────┐
│  cli.js executes                │
│  - Get current working dir      │
│  - Locate template directory    │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Check for existing files       │
│  - .claude/ folder              │
│  - docs/ folder                 │
│  - CLAUDE.md                    │
└─────────────────────────────────┘
              │
              ▼
     ┌────────┴────────┐
     │  Files exist?   │
     └────────┬────────┘
        Yes   │   No
         │    │    │
         ▼    │    ▼
   Warn and   │   Copy all
   skip those │   template files
         │    │    │
         └────┴────┘
              │
              ▼
┌─────────────────────────────────┐
│  Print success message          │
│  with next steps                │
└─────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Package Setup

**Goal:** Create the npm package structure with proper configuration

**Tasks:**
1. Create new directory `ai-coding-starter` (separate from template repo)
2. Initialize package.json with proper metadata
3. Create bin/cli.js with shebang and basic structure
4. Set up package.json bin field
5. Create README.md for the npm package

**Dependencies:** None

**Acceptance Criteria:**

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC1.1 | package.json has name "@rhofkens/ai-coding-starter" | Read package.json |
| AC1.2 | package.json has bin field pointing to "./bin/cli.js" | Read package.json |
| AC1.3 | package.json has files field including "bin" and "template" | Read package.json |
| AC1.4 | cli.js has proper shebang `#!/usr/bin/env node` | Read first line |
| AC1.5 | Running `node bin/cli.js` executes without syntax errors | Run command |

**Manual Testing:**
- [ ] Run `node bin/cli.js` in package directory
- [ ] Verify no errors are thrown

---

### Phase 2: Template Bundling

**Goal:** Bundle all template files within the package

**Tasks:**
1. Create template/ directory structure
2. Copy .claude/ folder contents (rename settings.local.json to settings.local.example.json)
3. Create empty docs/ subdirectories
4. Copy CLAUDE.md
5. Copy LICENSE

**Dependencies:** Phase 1 complete

**Acceptance Criteria:**

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC2.1 | template/.claude/commands/ contains all 6 command files | List directory |
| AC2.2 | template/.claude/agents/ contains reference-researcher.md | List directory |
| AC2.3 | template/.claude/skills/update-docs/ contains 3 files | List directory |
| AC2.4 | template/.claude/settings.local.example.json exists | File exists |
| AC2.5 | template/docs/ has 6 subdirectories (decisions, guidelines, knowledge, plans, PRD, reference) | List directory |
| AC2.6 | template/docs/knowledge/sessions/ subdirectory exists | Directory exists |
| AC2.7 | template/CLAUDE.md exists | File exists |
| AC2.8 | template/LICENSE exists | File exists |

**Manual Testing:**
- [ ] Verify all template files are present
- [ ] Compare template contents with source repo

---

### Phase 3: CLI Implementation

**Goal:** Implement the file copying logic

**Tasks:**
1. Implement function to get template directory path (relative to cli.js)
2. Implement function to check for existing files/folders
3. Implement recursive copy function using Node.js fs.cp
4. Add handling for .claude folder (dot folder handling)
5. Add colored console output for user feedback
6. Handle errors gracefully with helpful messages

**Dependencies:** Phase 2 complete

**Acceptance Criteria:**

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC3.1 | Running in empty directory copies all template files | Run and verify |
| AC3.2 | .claude folder is copied correctly (not ignored as dotfile) | Check .claude exists |
| AC3.3 | docs/ subdirectories are created as empty folders | Check directories |
| AC3.4 | Existing .claude folder triggers skip warning | Run with existing folder |
| AC3.5 | Existing docs folder triggers skip warning | Run with existing folder |
| AC3.6 | Existing CLAUDE.md triggers skip warning | Run with existing file |
| AC3.7 | Success message displays what was created | Read console output |
| AC3.8 | Error in copy operation shows helpful message | Force error scenario |

**Manual Testing:**
- [ ] Create empty test directory
- [ ] Run `node /path/to/bin/cli.js` from test directory
- [ ] Verify .claude/ folder created with all contents
- [ ] Verify docs/ folder created with subdirectories
- [ ] Verify CLAUDE.md created
- [ ] Run again to verify skip warnings appear

---

### Phase 4: Local Testing

**Goal:** Test the package locally before publishing

**Tasks:**
1. Use `npm link` to test globally
2. Test `npx` style execution with local package
3. Verify in multiple test directories
4. Test edge cases (permissions, existing files, etc.)

**Dependencies:** Phase 3 complete

**Acceptance Criteria:**

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC4.1 | `npm link` succeeds without errors | Run command |
| AC4.2 | `ai-coding-starter` command works after link | Run in test dir |
| AC4.3 | Package works in directory with spaces in path | Test with spaced path |
| AC4.4 | Package works when some target files already exist | Test partial existing |
| AC4.5 | Unlink works cleanly (`npm unlink`) | Run unlink |

**Manual Testing:**
- [ ] Run `npm link` in package directory
- [ ] Create test directory and run `ai-coding-starter`
- [ ] Verify all files created correctly
- [ ] Create another test with existing CLAUDE.md, verify partial copy
- [ ] Run `npm unlink ai-coding-starter`

---

### Phase 5: Publishing to npm

**Goal:** Publish the package to npmjs.com

**Tasks:**
1. Verify npm login status
2. Run `npm publish` dry run to check what will be published
3. Verify package.json version is appropriate (1.0.0)
4. Publish to npm registry
5. Test with `npx ai-coding-starter` in a fresh directory

**Dependencies:** Phase 4 complete, npm account ready

**Acceptance Criteria:**

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC5.1 | `npm whoami` shows logged in user | Run command |
| AC5.2 | `npm publish --dry-run` shows correct files | Check output |
| AC5.3 | Package published successfully | npmjs.com shows package |
| AC5.4 | `npx ai-coding-starter` works in fresh directory | Test in new folder |
| AC5.5 | Package page on npmjs.com shows README | Visit package page |

**Manual Testing:**
- [ ] Run `npm whoami` to verify login
- [ ] Run `npm publish --dry-run` and verify file list
- [ ] Run `npm publish`
- [ ] Wait 1-2 minutes for propagation
- [ ] Create fresh directory outside any npm project
- [ ] Run `npx ai-coding-starter`
- [ ] Verify all files created correctly

---

### Phase 6: Documentation & Cleanup

**Goal:** Finalize documentation and clean up

**Tasks:**
1. Update README.md with usage instructions
2. Add CHANGELOG.md
3. Update source template repo README to reference the npm package
4. Consider adding a --help flag

**Dependencies:** Phase 5 complete

**Acceptance Criteria:**

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC6.1 | README.md includes installation/usage section | Read file |
| AC6.2 | README.md includes what's included section | Read file |
| AC6.3 | README.md includes customization notes | Read file |
| AC6.4 | `npx ai-coding-starter --help` shows usage info | Run command |

**Manual Testing:**
- [ ] Read README and verify clarity
- [ ] Run `npx ai-coding-starter --help`
- [ ] Have someone unfamiliar try to use it

---

## Files to Create

### New Package (ai-coding-starter/)

| File | Purpose |
|------|---------|
| package.json | npm package configuration |
| bin/cli.js | Main executable script |
| README.md | Package documentation |
| LICENSE | MIT License |
| CHANGELOG.md | Version history |
| template/.claude/* | All Claude config files |
| template/docs/* | Empty doc directories |
| template/CLAUDE.md | Project preferences |
| template/LICENSE | License for initialized projects |

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Package name already taken on npm | High | Low | Check availability before starting; have backup names |
| Node.js fs.cp not available (Node < 16.7) | Medium | Low | Specify engines in package.json; implement fallback |
| Template files get out of sync with source | Medium | Medium | Document update process; consider automation later |
| Permission issues copying dotfiles | Low | Low | Test on multiple systems; clear error messages |

## Open Questions

- [x] Package name: `@rhofkens/ai-coding-starter` (scoped)
- [x] Single template vs variants: Single template
- [x] Settings file handling: Include as example file
- [x] Git initialization: No git operations
- [x] npm account: Already have one
- [x] Docs folder content: Empty directories only

## References

- [npm package.json documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Creating and publishing npm packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [Node.js fs.cp documentation](https://nodejs.org/api/fs.html#fscpsrc-dest-options-callback)
- [npx execution](https://docs.npmjs.com/cli/v9/commands/npx)

## Usage After Implementation

Once published, users can initialize any new project with:

```bash
# Navigate to your new project directory
cd my-new-project

# Initialize with AI coding starter template
npx @rhofkens/ai-coding-starter

# Output:
# ✓ Created .claude/ folder with commands, agents, and skills
# ✓ Created docs/ folder structure
# ✓ Created CLAUDE.md project preferences
#
# Next steps:
# 1. Review and customize .claude/settings.local.example.json
# 2. Rename to settings.local.json after customization
# 3. Update CLAUDE.md with project-specific preferences
# 4. Start coding with Claude!
```

---

## Implementation Status

**Validation Date:** 2026-01-19
**Overall Status:** Completed

### Completed Items
- [x] Phase 1: Package Setup - Completed as planned
- [x] Phase 2: Template Bundling - Completed as planned
- [x] Phase 3: CLI Implementation - Completed as planned
- [x] Phase 4: Local Testing - Completed as planned
- [x] Phase 5: Publishing to npm - Completed (scoped package)
- [x] Phase 6: Documentation & Cleanup - Completed as planned

### Intentionally Skipped
None

### Deferred to Future Work
None

---

## Changelog

### 2026-01-19 - Implementation Validation

**Completed:**
- All 6 phases completed successfully
- Package published to npmjs.com as `@rhofkens/ai-coding-starter`
- CLI working via `npx @rhofkens/ai-coding-starter`
- All template files bundled correctly
- --help flag implemented
- Skip behavior for existing files working

**Changed (different from original plan):**
- Package name changed from `ai-coding-starter` (unscoped) to `@rhofkens/ai-coding-starter` (scoped) - User preference for consistent npm namespace
- Unscoped package `ai-coding-starter` was published first, then deprecated in favor of scoped version

**Added (not in original plan):**
- `package-lock.json` - Auto-generated by npm (expected)

**Skipped:**
None

**Deferred:**
None
