# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-10

### Added

- Interactive CLI installer powered by @clack/prompts
- Frontend Agent (React 19.x / shadcn / Vite) - optional specialized agent
- Backend Agent (Spring Boot 3.5+ / Java 25) - optional specialized agent
- Default Design System (shadcn Nova / Indigo) - optional, placed in docs/guidelines/ui/
- create-plan command now consults agent definitions for best practices
- About section with author info and links in the installer

### Changed

- CLI converted from CommonJS to ESM
- Package version bumped to 2.0.0
- Node.js minimum version raised to 18.0.0
- Added @clack/prompts as dependency (see ADR-002)
- Core components always installed; optional components selected interactively
- Improved log messages with descriptive labels instead of file paths
- `--help` output now lists all core and optional components

### Architecture Decisions

- ADR-002: Add @clack/prompts for Interactive CLI (supersedes ADR-001 zero-dependency approach)

## [1.0.0] - 2026-01-19

### Added

- Initial release of `@rhofkens/ai-coding-starter`
- CLI tool executable via `npx @rhofkens/ai-coding-starter`
- Template files for Claude Code workflow:
  - `.claude/commands/` - 6 command files (adr, commit, commit-atomic, create-plan, update-knowledge, validate-plan)
  - `.claude/agents/` - reference-researcher agent
  - `.claude/skills/` - update-docs skill with Mintlify support
  - `.claude/settings.local.example.json` - example permissions config
- Documentation folder structure (`docs/`)
- `CLAUDE.md` project preferences template
- MIT License template
- `--help` flag for usage information
- Skip behavior for existing files (non-destructive)
