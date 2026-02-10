# Project Knowledge Base

Accumulated learnings from development sessions.

## Architecture & Patterns

- **Zero-dependency CLI tools**: Pure Node.js with `fs` and `path` modules is sufficient for simple file operations. Avoids supply chain risks and keeps package size minimal. (Superseded in v2.0.0 by @clack/prompts for interactive UX — see ADR-002.)
- **Template bundling**: Include template files directly in npm package rather than fetching from git - works offline and is more reliable.
- **Separate core from optional content**: When a CLI offers optional components, keep optional files in a separate directory tree (e.g., `template/optional/`) rather than inside the core directories that get bulk-copied. This avoids "already exists" conflicts during installation.
- **Agent definition structure**: Follow the pattern: YAML frontmatter (name, description, tools, model, permissionMode) + Input section (what user provides) + Process section (workflow steps) + Best practices sections. Keep agent definitions principles-only, no code samples.

## Common Pitfalls

- **npm 2FA publishing**: Regular npm tokens don't bypass 2FA. Must create "Granular Access Token" on npmjs.com with "bypass 2FA" option enabled.
- **Scoped package visibility**: Scoped packages (`@scope/name`) are private by default. Must use `--access public` flag when publishing.
- **Empty directories in npm**: npm doesn't include empty directories. Use `.gitkeep` placeholder files.
- **Optional files in core directories**: Don't place selectable/optional files inside directories that are bulk-copied as core items — they'll get copied during core setup and then conflict during optional setup.
- **ESM __dirname equivalent**: ESM doesn't have `__dirname`. Use `path.dirname(fileURLToPath(import.meta.url))` with `import { fileURLToPath } from 'node:url'`.

## Workflow Tips

- **Clarify naming early**: For npm packages, confirm scoped vs unscoped naming before implementation to avoid republishing.
- **Use npm link for testing**: Creates symlink to local package for testing without publishing. Changes are immediately available.
- **npm deprecate for redirects**: Use `npm deprecate <pkg> "Use @scope/new-pkg instead"` to redirect users after renaming.
- **ADR upfront for breaking changes**: Create ADRs before implementation when introducing breaking changes (like adding dependencies). Clarifies the decision for the whole session.
- **Phased implementation with checkpoints**: For multi-part features, implement in phases with manual review checkpoints between each. Works well for agent definitions and CLI changes that need user review.

## Tool Usage

- **npm publish with token**: `npm publish --access public --//registry.npmjs.org/:_authToken=TOKEN`
- **npm link workflow**: Run `npm link` in package dir, then command is available globally for testing.
- **@clack/prompts**: Modern terminal UI library for interactive CLI prompts. ESM-only. Key API: `intro()`, `outro()`, `confirm()`, `note()`, `spinner()`, `log.*()`, `isCancel()`, `cancel()`. Import `picocolors` separately for custom colored text within note boxes.
- **npm pack --dry-run**: Shows exactly which files would be included in the published package without actually publishing. Good pre-publish check.

## Code Patterns

- **Node.js recursive copy**: Custom `copyDir()` with `fs.readdirSync()` + `withFileTypes: true` for clean recursive directory copying.
- **CLI colored output (v1)**: Use ANSI codes (`\x1b[32m` for green, etc.) for colored terminal output without dependencies.
- **CLI colored output (v2)**: Use `picocolors` (bundled with @clack/prompts) for `pc.bold()`, `pc.cyan()`, `pc.white()` etc.
- **Create-plan agent integration**: Reference specific agent files by path in create-plan instructions (not "scan all agents") to keep instructions focused and predictable.

## Debugging Tips

- **npm publish errors**: 403 Forbidden usually means 2FA issue - check token permissions on npmjs.com.
