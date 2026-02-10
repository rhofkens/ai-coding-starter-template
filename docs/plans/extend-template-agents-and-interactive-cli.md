# Extend Template with Specialized Agents and Interactive CLI - Implementation Plan

## Executive Summary

Extend the ai-coding-starter template with two specialized agent definitions (Frontend React 19/shadcn/Vite and Backend Spring Boot 3.5+/Java 25), a default shadcn Nova design system document, an interactive CLI installer powered by @clack/prompts, and integration of agent best practices into the create-plan command.

## Problem Statement / Context

The current template provides a general-purpose development workflow (planning, commits, ADRs, knowledge capture) but lacks specialized agent guidance for the two most common tech stacks: modern React frontends and Spring Boot backends. Users installing the template get the same setup regardless of their project type. By adding optional specialized agents and a design system, we can provide immediate, opinionated guidance out of the box. The CLI currently copies everything with no user choice—adding interactivity will let users pick only what they need while presenting a professional terminal experience.

## Scope

### In Scope
1. **Frontend agent definition** — React 19.x, shadcn components, Vite, high-level UI best practices (no code samples)
2. **Backend agent definition** — Spring Boot 3.5+, Java 25, high-level backend best practices (no code samples)
3. **Design system document** — shadcn Nova / Indigo color scheme, placed in `docs/guidelines/ui/`
4. **Interactive CLI** — Replace silent copy with @clack/prompts interactive selection
5. **Create-plan integration** — Instruct create-plan to consult agent definitions for best practices
6. **Manual review checkpoints** between phases

### Out of Scope
- Code samples or boilerplate project scaffolding (React app, Spring Boot app)
- Automated testing
- CI/CD pipeline setup
- IDE-specific configurations
- Full design tokens / Figma export

## Research Summary

### Existing Architecture
- **ADR-001**: Zero-dependency CLI using pure Node.js — this will change with @clack/prompts addition
- **CLI**: `bin/cli.js` (185 lines), CommonJS, copies 4 items unconditionally
- **Template structure**: `.claude/agents/` has one agent (reference-researcher), `docs/guidelines/` exists but is empty
- **Create-plan command**: Already reads from `docs/guidelines/`, `docs/reference/`, and `docs/decisions/` — good extension point
- **Package**: `@rhofkens/ai-coding-starter`, Node >=16.7.0, zero deps currently

### Terminal UI Framework Decision
**Recommendation: @clack/prompts** (v1.0.0 stable)

| Option | Pros | Cons |
|--------|------|------|
| **@clack/prompts** | Most modern look, tiny footprint (~3 transitive deps), `group()` API perfect for our flow, `intro()`/`outro()` framing, TypeScript-first | Adds dependencies (breaking zero-dep), ESM-only in v1.0 |
| @inquirer/prompts | Largest community, modular | Heavier, less visually cohesive |
| Pure Node.js readline | Zero deps maintained | Ugly, enormous effort for polished UX |

**Impact on ADR-001**: Adding @clack/prompts means we leave the zero-dependency approach. This is a deliberate trade-off — the interactive selection UX justifies the minimal dependency addition. A new ADR should be created to document this decision.

## Architecture / Design

### New File Structure

```text
template/
├── .claude/
│   ├── agents/
│   │   ├── reference-researcher.md          (existing)
│   │   ├── frontend-react.md                (NEW - optional)
│   │   └── backend-springboot.md            (NEW - optional)
│   └── commands/
│       └── create-plan.md                   (MODIFY)
├── docs/
│   └── guidelines/
│       └── ui/
│           └── design-system.md             (NEW - optional)
└── CLAUDE.md                                (existing)
```

### CLI Interaction Flow

```text
npx @rhofkens/ai-coding-starter
         │
         ▼
┌──────────────────────────────┐
│  intro: "ai-coding-starter"  │
└──────────┬───────────────────┘
           ▼
  Core setup (always copied):
  - .claude/ (commands, skills, settings)
  - docs/ folder structure
  - CLAUDE.md, LICENSE
           │
           ▼
  ◆ Add Frontend Agent (React 19 / shadcn / Vite)?
  │  → Description of what it provides
           │
           ▼
  ◆ Add Backend Agent (Spring Boot 3.5+ / Java 25)?
  │  → Description of what it provides
           │
           ▼
  ◆ Add Default Design System (shadcn Nova / Indigo)?
  │  → Description of what it provides
  │  → Only shown if Frontend Agent was selected
           │
           ▼
  Show summary of selections
           │
           ▼
  Copy files based on selections
           │
           ▼
┌──────────────────────────────┐
│  outro: "You're all set!"    │
└──────────────────────────────┘
```

### Create-Plan Integration

The create-plan command will get a new research step between 2.2 and 2.3:

```text
Step 2.2b: Review Agent Definitions
  → Read .claude/agents/ for any specialized agents
  → Extract best practices sections
  → Incorporate into plan constraints
```

## Technical Approach

### Agent Definitions — Content Strategy

Both agents will follow the same markdown structure as `reference-researcher.md` (frontmatter + instructions) but contain **principles and guidelines only**, no code:

**Sections for each agent:**
1. Frontmatter (name, description, tools, model)
2. Role & Purpose
3. Core Principles (SOLID, KISS, DRY, etc. — tailored to the stack)
4. Architecture Best Practices (stack-specific patterns)
5. Key Areas of Expertise (categorized by concern)
6. Design System Awareness (frontend only — instruction to check `docs/guidelines/ui/`)
7. What NOT To Do (anti-patterns)

### CLI Refactoring Approach

**Option A: Convert to ESM + @clack/prompts** (Recommended)
- Change `package.json` to `"type": "module"`
- Rewrite `bin/cli.js` using ES module imports
- Add `@clack/prompts` as dependency
- Use `group()` for interactive flow, `confirm()` for each option
- Pros: Clean, modern, full Clack API access
- Cons: Breaking change to package internals (not user-facing)

**Option B: Keep CJS + dynamic import**
- Keep CommonJS but use `await import('@clack/prompts')`
- Requires making `main()` async
- Pros: Minimal structural change
- Cons: Awkward pattern, still adds dependency

**Recommendation: Option A** — Since users only run `npx`, the CJS/ESM distinction is invisible to them. ESM is the modern standard and aligns with @clack/prompts.

### Design System Document

The design system markdown will live at: **`template/docs/guidelines/ui/design-system.md`**

User will provide the content for this file during Phase 2. The directory structure will be created, and the user will be prompted to paste/copy their design system document into the target path.

## Resolved Decisions

| Question | Decision |
|----------|----------|
| ADR timing | Create ADR-002 upfront in Phase 1 (before implementation begins) |
| Design system content | User will provide the markdown content; path: `template/docs/guidelines/ui/design-system.md` |
| shadcn versioning | Stay version-agnostic in the frontend agent definition |
| Version bump | v2.0.0 (breaking change: new dependency + ESM conversion) |
| `--help` output | List all components including optional agents and design system |

## Implementation Phases

### Phase 1: ADR & Agent Definitions

**Goal:** Document the dependency decision upfront and create the two specialized agent markdown files

**Tasks:**

1. Create `docs/decisions/002-add-clack-prompts-interactive-cli.md` — ADR documenting the decision to add @clack/prompts, departing from the zero-dependency approach in ADR-001. Rationale: professional interactive UX justifies the minimal dependency addition.
2. Create `template/.claude/agents/frontend-react.md` — Frontend agent definition with React 19.x, shadcn (version-agnostic), Vite best practices. Principles and guidelines only, no code samples.
3. Create `template/.claude/agents/backend-springboot.md` — Backend agent definition with Spring Boot 3.5+, Java 25 best practices. Principles and guidelines only, no code samples.
4. Mirror both agent files to `.claude/agents/` (local project copy)

**Dependencies:** None

**Manual Testing:**

- [ ] Review ADR-002 for clear reasoning and proper format
- [ ] Review frontend agent definition for completeness and appropriate level of detail
- [ ] Review backend agent definition for completeness and appropriate level of detail
- [ ] Verify no code samples are included, only principles and guidelines
- [ ] Verify frontmatter format matches reference-researcher.md pattern
- [ ] Verify shadcn references are version-agnostic

> **CHECKPOINT: User reviews ADR and both agent definitions before proceeding**

---

### Phase 2: Design System & Folder Structure

**Goal:** Add the `docs/guidelines/ui/` folder and design system document

**Tasks:**

1. Create `template/docs/guidelines/ui/` directory structure
2. Prompt user to provide the design system markdown content at `template/docs/guidelines/ui/design-system.md`
3. Add instruction to frontend agent to check `docs/guidelines/ui/` for design system files
4. Mirror to local `docs/guidelines/ui/`

**Dependencies:** Phase 1 (frontend agent must exist to add the design system reference)

**Manual Testing:**

- [ ] Verify `docs/guidelines/ui/design-system.md` exists in template
- [ ] Verify frontend agent references the design system folder
- [ ] Review design system content for accuracy

> **CHECKPOINT: User reviews design system document and folder structure**

---

### Phase 3: Create-Plan Command Integration

**Goal:** Update create-plan to consult agent definitions for best practices

**Tasks:**

1. Add new research step "2.2b: Review Agent Definitions" to `template/.claude/commands/create-plan.md`
2. Instruct create-plan to read `.claude/agents/` for specialized agents present in the project
3. Extract and incorporate best practices from agent definitions into plan constraints
4. Mirror changes to `.claude/commands/create-plan.md`

**Dependencies:** Phase 1 (agents must exist to be referenced)

**Manual Testing:**

- [ ] Review updated create-plan.md for correct integration
- [ ] Verify the new step references agent definitions properly
- [ ] Dry-run: mentally trace through create-plan flow with agents present

> **CHECKPOINT: User reviews create-plan changes**

---

### Phase 4: Interactive CLI with @clack/prompts

**Goal:** Replace silent copy with interactive selection using @clack/prompts

**Tasks:**

1. Add `@clack/prompts` as a dependency in `package.json`
2. Set `"type": "module"` in `package.json`
3. Bump version to `2.0.0` in `package.json`
4. Rewrite `bin/cli.js` as ESM with @clack/prompts:
   - `intro()` banner
   - Always copy core items (.claude base, docs structure, CLAUDE.md, LICENSE) — same skip-if-exists logic
   - `confirm()` for Frontend Agent with description of what it provides
   - `confirm()` for Backend Agent with description of what it provides
   - `confirm()` for Design System (conditional — only shown if Frontend Agent was selected)
   - `note()` summary of what will be installed
   - Copy selected optional items
   - `outro()` with next steps
5. Handle cancellation gracefully with `isCancel()` / `cancel()`
6. Update `--help` to list all components (core and optional agents/design system)
7. Update Node engine requirement if needed (check @clack/prompts minimum)

**Dependencies:** Phases 1-3 (all content must exist before CLI can offer it)

**Manual Testing:**

- [ ] Run `node bin/cli.js` in clean directory — verify full interactive flow
- [ ] Test selecting all options — all files created correctly
- [ ] Test selecting no optional items — only core files created
- [ ] Test selecting Frontend Agent only — agent copied, no design system prompt shown
- [ ] Test selecting Frontend + Design System — both copied
- [ ] Test selecting Backend only — agent copied
- [ ] Test Ctrl+C cancellation — graceful exit
- [ ] Test `--help` flag — shows help text with all components listed
- [ ] Test in directory where items already exist — skip logic works
- [ ] Verify terminal output looks professional and polished

> **CHECKPOINT: User tests CLI interactively before finalizing**

---

### Phase 5: Documentation & Finalization

**Goal:** Update README, CHANGELOG, and finalize for publish

**Tasks:**

1. Update `README.md` to reflect new interactive features, optional agents, and design system
2. Update `CHANGELOG.md` with v2.0.0 changes
3. Verify `--help` output is comprehensive and accurate

**Dependencies:** Phase 4

**Manual Testing:**

- [ ] Review README accuracy
- [ ] Run `node bin/cli.js --help` — verify updated help text lists all components

---

## Files to Modify

### New Files

| File | Description |
|------|-------------|
| `docs/decisions/002-add-clack-prompts-interactive-cli.md` | ADR for adding @clack/prompts (Phase 1) |
| `template/.claude/agents/frontend-react.md` | Frontend agent definition |
| `template/.claude/agents/backend-springboot.md` | Backend agent definition |
| `template/docs/guidelines/ui/design-system.md` | Default shadcn Nova / Indigo design system (user-provided) |

### Modified Files

| File | Change |
|------|--------|
| `bin/cli.js` | Full rewrite: ESM + @clack/prompts interactive flow |
| `package.json` | Add `@clack/prompts` dep, set `"type": "module"`, bump to v2.0.0 |
| `template/.claude/commands/create-plan.md` | Add agent definition research step |
| `.claude/commands/create-plan.md` | Mirror of template create-plan changes |
| `README.md` | Document new features and optional components |
| `CHANGELOG.md` | v2.0.0 version history |

### Mirrored Files (keep template/ and local .claude/ in sync)
| Template | Local |
|----------|-------|
| `template/.claude/agents/frontend-react.md` | `.claude/agents/frontend-react.md` |
| `template/.claude/agents/backend-springboot.md` | `.claude/agents/backend-springboot.md` |
| `template/.claude/commands/create-plan.md` | `.claude/commands/create-plan.md` |

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking zero-dependency principle | Medium | Certain | Create ADR documenting rationale; @clack/prompts has minimal transitive deps |
| ESM conversion breaks npx execution | High | Low | Test thoroughly with `npx` from npm registry; Node 16.7+ supports ESM |
| Agent definitions too prescriptive or too vague | Medium | Medium | Manual review checkpoint; iterate with user feedback |
| @clack/prompts v1.0 has breaking changes | Low | Low | Pin version in package.json |
| Design system becomes outdated | Low | Medium | Document as "default starting point, customize to your needs" |

## Open Questions

All questions resolved — see "Resolved Decisions" section above.

## References

- [@clack/prompts documentation](https://www.clack.cc/)
- [@clack/prompts npm](https://www.npmjs.com/package/@clack/prompts)
- [shadcn/ui documentation](https://ui.shadcn.com/)
- [React 19 documentation](https://react.dev/)
- [Spring Boot reference](https://docs.spring.io/spring-boot/reference/)
- [Existing ADR-001: Zero Dependencies](docs/decisions/001-pure-nodejs-zero-dependencies.md)
- [Existing CLI implementation](bin/cli.js)
