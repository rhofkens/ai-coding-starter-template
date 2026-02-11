# Knowledge Changelog

Audit log of knowledge base updates.

---

## 2026-02-11

**Session:** Smart Update Detection for CLI Installer (v2.0.2)
**Plan:** `docs/plans/smart-update-detection.md`
**Session file:** `sessions/2026-02-11-smart-update-detection.md`

**Added to knowledge.md:**

- Code pattern: Pre-scan before copy pattern (separate detection from action)
- Code pattern: Data-driven optional items array
- Pitfall: @clack/prompts is TTY-only — piped stdin causes hangs
- Pitfall: Confirm defaults matter for safety (initialValue: false for destructive actions)

**Updated in knowledge.md:**

- Node.js recursive copy entry updated to reference `mergeDir()` with overwrite flag

---

## 2026-02-10

**Session:** Interactive CLI, Specialized Agents, and Design System (v2.0.0)
**Plan:** `docs/plans/extend-template-agents-and-interactive-cli.md`
**Session file:** `sessions/2026-02-10-interactive-cli-and-agents.md`

**Added to knowledge.md:**

- Architecture pattern: Separate core from optional template content
- Architecture pattern: Agent definition structure (frontmatter + input + process + best practices)
- Pitfall: Optional files in core directories cause "already exists" conflicts
- Pitfall: ESM `__dirname` equivalent using `fileURLToPath`
- Workflow tip: ADR upfront for breaking changes
- Workflow tip: Phased implementation with checkpoints
- Tool usage: @clack/prompts API overview
- Tool usage: `npm pack --dry-run` for pre-publish verification
- Code pattern: CLI colored output v2 with picocolors
- Code pattern: Create-plan agent integration by specific file path

**Updated in knowledge.md:**

- Zero-dependency CLI tools entry now notes superseding by ADR-002

---

## 2026-01-19

**Session:** Creating @rhofkens/ai-coding-starter npm Package
**Plan:** `docs/plans/npx-ai-coding-starter-tool.md`
**Session file:** `sessions/2026-01-19-npm-package-creation.md`

**Added to knowledge.md:**

- Architecture pattern: Zero-dependency CLI tools with pure Node.js
- Architecture pattern: Template bundling in npm packages
- Pitfall: npm 2FA publishing requires granular access token
- Pitfall: Scoped packages need `--access public`
- Pitfall: Empty directories need .gitkeep files
- Workflow tip: Clarify package naming early
- Workflow tip: npm link for local testing
- Workflow tip: npm deprecate for package redirects
- Tool usage: npm publish with token syntax
- Code pattern: Node.js recursive copy function
- Code pattern: CLI colored output with ANSI codes
- Debugging tip: npm 403 errors and 2FA

**Updated in knowledge.md:**

- N/A (initial creation)

**Removed from knowledge.md:**

- N/A (initial creation)
