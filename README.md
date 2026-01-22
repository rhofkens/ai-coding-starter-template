# AI coding starter

Initialize a project with Claude Code configurations for enterprise-grade AI-assisted development workflows.

Similar to Maven archetypes, this tool bootstraps your project with the right folder structure and settings for working with Claude Code.

## Usage

```bash
npx @rhofkens/ai-coding-starter
```

Or install globally:

```bash
npm install -g @rhofkens/ai-coding-starter
ai-coding-starter
```

## What's Included

Running this tool creates the following structure in your current directory:

```
your-project/
├── .claude/
│   ├── agents/
│   │   └── reference-researcher.md    # Research agent for external APIs
│   ├── commands/
│   │   ├── adr.md                     # Architecture Decision Record generator
│   │   ├── commit.md                  # Git commit workflow
│   │   ├── commit-atomic.md           # Atomic commit grouping
│   │   ├── create-plan.md             # Implementation plan generator
│   │   ├── update-knowledge.md        # Session learning capture
│   │   └── validate-plan.md           # Plan validation tool
│   ├── skills/
│   │   └── update-docs/               # Documentation management skill
│   └── settings.local.example.json    # Example permissions config
├── docs/
│   ├── decisions/                     # Architecture Decision Records
│   ├── guidelines/                    # Coding standards
│   ├── knowledge/                     # Accumulated learnings
│   │   └── sessions/                  # Session logs
│   ├── plans/                         # Implementation plans
│   ├── PRD/                           # Product requirements
│   └── reference/                     # External API documentation
├── CLAUDE.md                          # Project preferences for Claude
└── LICENSE                            # MIT License
```

## After Initialization

1. **Review settings**: Copy `settings.local.example.json` to `settings.local.json` and customize permissions
2. **Update CLAUDE.md**: Modify project preferences to match your workflow
3. **Start coding**: Use the included commands like `/commit`, `/create-plan`, `/adr`

## Features

### Commands (invoke with `/command-name`)

- **commit** - Conventional commit workflow with quality checks
- **commit-atomic** - Group related changes into logical commits
- **adr** - Generate Architecture Decision Records
- **create-plan** - Create implementation plans with acceptance criteria
- **update-knowledge** - Capture session learnings
- **validate-plan** - Validate implementation against plans

### Agents

- **reference-researcher** - Research external APIs and create reference documentation

### Skills

- **update-docs** - Manage documentation with Mintlify support

## Requirements

- Node.js >= 16.7.0

## License

MIT
