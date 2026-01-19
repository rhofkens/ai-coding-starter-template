---
description: Analyze changes and create Architecture Decision Records
argument-hint: [plan-file]
allowed-tools: Bash(git:*), Read, Glob, Grep, Write, AskUserQuestion
---

# Architecture Decision Record (ADR) Generator

Generate ADRs from code changes and architectural decisions made during development.

## Usage Modes

**Mode 1: No arguments** - `/adr`
Analyzes recent changes in the context window and since the last commit to extract architectural decisions.

**Mode 2: With plan file** - `/adr docs/plans/feature/my-plan.md`
Analyzes all changes related to a specific implementation plan, including commit history, to extract architectural decisions made during that feature's implementation.

## ADR Storage Location

All ADRs are stored in: `docs/decisions/`

## ADR Format

Follow the existing format in the decisions folder:

```markdown
# ADR-XXX: Title

## Status
Accepted | Proposed | Deprecated | Superseded

## Context
Describe the context and problem that led to this decision.

## Decision
Describe the decision that was made and how it addresses the context.

## Consequences
**Positive:**
- Benefits of this decision

**Negative:**
- Drawbacks or trade-offs

**Mitigation:**
- How negative consequences are addressed
```

## Workflow

### Step 1: Gather Context

#### Mode 1: No Arguments (Recent Changes)

Analyze recent changes to identify architectural decisions:

```bash
# Check recent commits
git log --oneline -20

# See changes since last commit
git diff HEAD~1

# See uncommitted changes
git diff

# See changed files
git diff --name-only HEAD~5
```

Also review the conversation context for discussions about:
- Technology choices
- Design patterns adopted
- Infrastructure decisions
- API design choices
- Database schema decisions
- Frontend architecture choices
- Integration approaches

#### Mode 2: Plan File Provided

When a plan file is provided (e.g., `$ARGUMENTS` = `docs/plans/feature/my-plan.md`):

1. **Read the plan file** to understand:
   - The feature being implemented
   - Planned architecture and approach
   - Key components and files involved

2. **Search commit history** for related changes:
   ```bash
   # Search commits mentioning the feature/plan
   git log --oneline --all --grep="<feature-keywords>"

   # Search for commits touching related files
   git log --oneline -- <files-mentioned-in-plan>
   ```

3. **Analyze the implementation** by reading:
   - Files mentioned in the plan
   - Files changed in related commits
   - Compare planned approach vs actual implementation

4. **Extract decisions** that were made during implementation:
   - Deviations from the original plan
   - Technology choices made
   - Design patterns adopted
   - Trade-offs and compromises

### Step 2: Review Existing ADRs

Check what decisions are already documented:

```bash
ls docs/decisions/
```

Read existing ADRs to:
- Avoid duplicating existing decisions
- Understand the numbering scheme
- Maintain consistent formatting
- Identify if any existing ADR needs updating

### Step 3: Identify New Decisions

ADRs are for **high-level architectural decisions**, not implementation details.

**ADR-worthy decisions:**

- Choosing a technology stack or major framework
- Adopting a new architectural pattern (e.g., event-driven, CQRS)
- Significant infrastructure decisions (e.g., monorepo vs multi-repo, CI/CD approach)
- Cross-cutting concerns (e.g., authentication strategy, error handling approach)
- Major integration patterns with external services
- Fundamental API design philosophy changes
- Significant trade-offs that affect the entire system

**NOT ADR-worthy (too granular):**

- Adding a new database table or schema
- Creating a new API endpoint
- Adding a new component or service class
- Bug fixes or minor refactoring
- Configuration changes
- Adding new fields to existing models

### Step 4: Present Proposals to User

For each identified decision, present a summary:

```
ADR-XXX: [Proposed Title]
Summary: [2-3 sentence description of the decision]
Relates to: [Files or components affected]
```

Ask the user to approve which ADRs should be created.

### Step 5: Write Approved ADRs

For each approved ADR:

1. Determine the next ADR number (check existing files)
2. Create the file: `docs/decisions/XXX-adr-kebab-case-title.md`
3. Write the full ADR content following the format
4. Include specific details from the code changes

### Step 6: Report Back

After writing ADRs, provide a summary:
- List of ADRs created with file paths
- Brief description of each decision documented
- Remind user to review the ADRs at the file locations

## Decision Categories

When analyzing changes, look for decisions in these areas:

**Backend (Java/Spring Boot):**
- Service architecture patterns
- API endpoint design
- Database schema and JPA decisions
- Integration with external services
- Error handling approaches
- Security implementations

**Frontend (React/TypeScript):**
- Component architecture
- State management approaches
- API client patterns
- UI/UX implementation choices
- Performance optimizations

**Infrastructure:**
- Deployment configurations
- CI/CD pipeline decisions
- Environment management
- Monitoring and logging approaches

**Cross-cutting:**
- Authentication/authorization
- Data flow patterns
- Error handling strategies
- Testing approaches
