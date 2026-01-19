# Changelog

All notable changes to this project will be documented in this file.

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
