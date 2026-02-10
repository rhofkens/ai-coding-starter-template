# AI coding starter

Initialize a project with Claude Code configurations for enterprise-grade AI-assisted development workflows.

Similar to Maven archetypes, this tool bootstraps your project with the right folder structure and settings for working with Claude Code. The interactive installer lets you choose optional specialized agents and a design system.

## Usage

```bash
npx @rhofkens/ai-coding-starter
```

Or install globally:

```bash
npm install -g @rhofkens/ai-coding-starter
ai-coding-starter
```

## Interactive Installer

The CLI guides you through setup with an interactive prompt:

1. **Core components** are always installed (commands, skills, settings, docs structure)
2. **Optional components** are selected interactively:
   - **Frontend Agent** - React 19.x / shadcn / Vite best practices
   - **Backend Agent** - Spring Boot 3.5+ / Java 25 best practices
   - **Design System** - shadcn Nova / Indigo default design system (only offered when Frontend Agent is selected)

## What's Included

### Core (always installed)

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

### Optional: Frontend Agent

Adds `.claude/agents/frontend-react.md` - a specialized agent for building modern UIs with:

- React 19.x, shadcn/ui components, Vite, Tailwind CSS
- Component design, state management, and performance best practices
- Accessibility and responsive design guidelines
- Design system awareness (reads from `docs/guidelines/ui/` if present)
- KISS, DRY, and separation of concerns principles

### Optional: Backend Agent

Adds `.claude/agents/backend-springboot.md` - a specialized agent for building backends with:

- Spring Boot 3.5+, Java 25
- Layered architecture, REST API design, data persistence best practices
- Spring Security, error handling, and observability guidelines
- SOLID, KISS, and DRY principles

### Optional: Design System

Adds `docs/guidelines/ui/design-system.md` - a default design system based on:

- shadcn/ui Nova style (compact, dense)
- Indigo primary color with Stone neutral palette
- OKLCH color space with full light/dark mode tokens
- Component patterns, spacing, typography, and do/don't conventions

The frontend agent automatically reads this file to ensure UI work follows the design system.

## After Initialization

1. **Review settings**: Copy `settings.local.example.json` to `settings.local.json` and customize permissions
2. **Update CLAUDE.md**: Modify project preferences to match your workflow
3. **Start coding**: Use the included commands like `/commit`, `/create-plan`, `/adr`

## Features

### Commands (invoke with `/command-name`)

- **commit** - Conventional commit workflow with quality checks
- **commit-atomic** - Group related changes into logical commits
- **adr** - Generate Architecture Decision Records
- **create-plan** - Create implementation plans with acceptance criteria (consults agent best practices when agents are present)
- **update-knowledge** - Capture session learnings
- **validate-plan** - Validate implementation against plans

### Agents

- **reference-researcher** - Research external APIs and create reference documentation
- **frontend-react** (optional) - Frontend specialist for React 19.x / shadcn / Vite
- **backend-springboot** (optional) - Backend specialist for Spring Boot 3.5+ / Java 25

### Skills

- **update-docs** - Manage documentation with Mintlify support

## Requirements

- Node.js >= 18.0.0

## License

MIT
