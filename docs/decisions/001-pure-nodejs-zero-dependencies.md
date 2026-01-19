# ADR-001: Pure Node.js Implementation (Zero Dependencies)

## Status
Accepted

## Context
When building the `@rhofkens/ai-coding-starter` CLI tool, we needed to decide how to implement file copying functionality. The tool copies template files (`.claude/`, `docs/`, `CLAUDE.md`, `LICENSE`) to initialize new projects with Claude Code configurations.

Three approaches were considered:

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| A | Pure Node.js with `fs` module | No dependencies, small package size, simple, works offline | More code to write for recursive copy |
| B | Use `fs-extra` package | Simpler recursive copy API, battle-tested | Adds a runtime dependency |
| C | Use `degit/tiged` approach | Template always up-to-date from repo | Requires network, more complex, git dependency |

## Decision
We chose **Option A: Pure Node.js with built-in `fs` module**.

The CLI uses only Node.js built-in modules (`fs`, `path`) with a custom `copyDir()` function for recursive directory copying. Node.js 16.7+ provides `fs.cp` with recursive support, but we implemented our own for broader compatibility and control.

**Key implementation details:**
- Custom `copyDir()` function handles recursive directory copying
- `fs.accessSync()` for existence checks
- `fs.copyFileSync()` for individual files
- `fs.mkdirSync()` with `recursive: true` for directory creation
- No external runtime dependencies in `package.json`

## Consequences

**Positive:**
- Zero runtime dependencies - smallest possible package size
- Works completely offline after `npx` downloads the package
- No supply chain security concerns from third-party dependencies
- Faster installation (no dependency tree to resolve)
- Full control over copying behavior and error handling

**Negative:**
- More code to maintain (custom `copyDir()` function)
- Must handle edge cases ourselves (permissions, symlinks, etc.)
- Cannot leverage battle-tested libraries like `fs-extra`

**Mitigation:**
- The `copyDir()` function is simple (~15 lines) and well-tested
- Edge cases are minimal for this use case (copying static template files)
- Node.js `fs` module is stable and well-documented
