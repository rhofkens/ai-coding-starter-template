# ADR-002: Add @clack/prompts for Interactive CLI

## Status

Accepted

## Context

The `@rhofkens/ai-coding-starter` CLI tool is being extended with optional components (specialized agents, design system). Users need to choose which optional components to install. The current CLI copies everything unconditionally with no user interaction.

Three approaches were considered for adding interactive selection:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| A | @clack/prompts | Most modern/polished look, tiny footprint (~3 transitive deps), `group()` API ideal for multi-step selection, built-in `intro()`/`outro()` framing, TypeScript-first, actively maintained (v1.0.0 stable) | Adds dependencies (breaks zero-dep principle from ADR-001), ESM-only |
| B | @inquirer/prompts | Largest community, modular architecture, extensive docs | Heavier dependency tree, less visually cohesive out of the box |
| C | Pure Node.js readline | Maintains zero-dependency principle | Enormous effort for polished UX, no built-in styling, poor developer experience |

## Decision

We chose **Option A: @clack/prompts**.

This deliberately supersedes the zero-dependency principle established in ADR-001. The rationale:

1. **User experience justifies the trade-off** — The CLI now presents multiple choices with descriptions. A professional, styled terminal experience is essential for a good first impression of the template.
2. **Minimal dependency footprint** — @clack/prompts adds only ~3 tiny transitive dependencies (`@clack/core`, `picocolors`, `sisteransi`). This is far from a heavy dependency tree.
3. **Industry standard** — Used by modern CLI tools (SvelteKit CLI, Astro CLI). Well-maintained by the Astro core team under the bombshell-dev organization.
4. **Replaces manual ANSI code** — The existing hand-rolled ANSI color codes in `bin/cli.js` are replaced by `picocolors` (bundled with @clack/prompts), improving maintainability.

**Additional changes required:**
- Convert `bin/cli.js` from CommonJS to ESM (`"type": "module"` in package.json)
- Bump package version to v2.0.0 (semver major — new dependency + ESM is a breaking change to package internals)

## Consequences

**Positive:**
- Professional, modern terminal UI with connected prompt rail design
- Built-in cancellation handling (`isCancel()`)
- Styled logging replaces manual ANSI escape codes
- `group()` API simplifies multi-step interactive flows
- Consistent with modern CLI tooling ecosystem

**Negative:**
- No longer zero dependencies (breaks ADR-001 principle)
- Package size increases slightly
- ESM conversion required (CommonJS to ES modules)
- Requires Node.js version compatible with @clack/prompts

**Mitigation:**
- Dependency footprint remains minimal (~3 tiny transitive deps)
- ESM is invisible to end users (they just run `npx`)
- Node.js 16.7+ (our existing minimum) supports ESM
- @clack/prompts v1.0.0 is stable and well-maintained
