# Project Knowledge Base

Accumulated learnings from development sessions.

## Architecture & Patterns

- **Zero-dependency CLI tools**: Pure Node.js with `fs` and `path` modules is sufficient for simple file operations. Avoids supply chain risks and keeps package size minimal.
- **Template bundling**: Include template files directly in npm package rather than fetching from git - works offline and is more reliable.

## Common Pitfalls

- **npm 2FA publishing**: Regular npm tokens don't bypass 2FA. Must create "Granular Access Token" on npmjs.com with "bypass 2FA" option enabled.
- **Scoped package visibility**: Scoped packages (`@scope/name`) are private by default. Must use `--access public` flag when publishing.
- **Empty directories in npm**: npm doesn't include empty directories. Use `.gitkeep` placeholder files.

## Workflow Tips

- **Clarify naming early**: For npm packages, confirm scoped vs unscoped naming before implementation to avoid republishing.
- **Use npm link for testing**: Creates symlink to local package for testing without publishing. Changes are immediately available.
- **npm deprecate for redirects**: Use `npm deprecate <pkg> "Use @scope/new-pkg instead"` to redirect users after renaming.

## Tool Usage

- **npm publish with token**: `npm publish --access public --//registry.npmjs.org/:_authToken=TOKEN`
- **npm link workflow**: Run `npm link` in package dir, then command is available globally for testing.

## Code Patterns

- **Node.js recursive copy**: Custom `copyDir()` with `fs.readdirSync()` + `withFileTypes: true` for clean recursive directory copying.
- **CLI colored output**: Use ANSI codes (`\x1b[32m` for green, etc.) for colored terminal output without dependencies.

## Debugging Tips

- **npm publish errors**: 403 Forbidden usually means 2FA issue - check token permissions on npmjs.com.
