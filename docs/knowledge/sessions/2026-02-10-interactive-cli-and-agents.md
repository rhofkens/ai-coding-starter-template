# Session: Interactive CLI, Specialized Agents, and Design System (v2.0.0)

**Date:** 2026-02-10
**Focus:** Extending the starter template with optional agents, design system, and interactive CLI
**Plan:** `docs/plans/extend-template-agents-and-interactive-cli.md`

## Summary

Extended the ai-coding-starter template from a silent file copier to an interactive installer with optional specialized agents (frontend React, backend Spring Boot), a default design system (shadcn Nova / Indigo), and @clack/prompts-powered terminal UI. Converted CLI from CommonJS to ESM, bumped to v2.0.0.

## What Went Well

- Phased implementation with manual checkpoints worked well for iterative review of agent definitions and CLI behavior
- @clack/prompts v1.0.0 was straightforward to integrate — the `intro()`/`outro()`/`confirm()`/`note()`/`spinner()` API mapped directly to our needs
- Using a reference-researcher agent to document the @clack/prompts API before implementation saved time
- Keeping agent definitions principles-only (no code samples) made them concise and reviewable
- Creating the ADR upfront (before implementation) clarified the dependency trade-off for the whole session

## What Didn't Go Well

- Optional files (agents, design system) were initially placed inside the core template directories (`.claude/agents/`, `docs/guidelines/ui/`), which meant they got copied during core setup and then showed "already exists" when the optional copy tried to run. Had to restructure to `template/optional/` to separate core from optional content.
- The `copyItem` function initially logged raw file paths (`Created: docs`) instead of descriptions (`Created: docs/ folder structure`), requiring a follow-up fix to pass descriptions through.
- `picocolors` needed to be imported separately for colored text inside `note()` boxes — @clack/prompts doesn't expose color utilities directly.

## Learnings

- **Separate core from optional template content**: When a CLI offers optional components, keep optional files in a separate directory tree (e.g., `template/optional/`) rather than inside the core directories that get bulk-copied. This avoids "already exists" conflicts.
- **@clack/prompts uses picocolors internally**: Import `picocolors` directly (it's a transitive dependency) for custom colored text within `note()` or `log` calls.
- **ESM conversion for CLI tools**: Adding `"type": "module"` to package.json and using `import` is invisible to npx users. The `__dirname` equivalent in ESM is `path.dirname(fileURLToPath(import.meta.url))`.
- **Agent definition structure**: Follow the pattern: YAML frontmatter (name, description, tools, model, permissionMode) + Input section (what user provides) + Process section (workflow steps) + Best practices sections.
- **ADR superseding**: When a new ADR supersedes an old one, update the old ADR's status to link to the new one.
- **Create-plan agent integration**: Making create-plan reference specific agent files by path (not "scan all agents") keeps the instruction focused and predictable.

## Avoid in Future

- Don't place optional/selectable files inside directories that are bulk-copied as core items
- Don't log raw file paths to users when descriptive labels are available
- Don't make create-plan instructions too generic ("read all agents") — be specific about which files to consult
