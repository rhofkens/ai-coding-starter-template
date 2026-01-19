# Session: Creating @rhofkens/ai-coding-starter npm Package

**Date:** 2026-01-19
**Focus:** Building and publishing an npx-executable CLI tool
**Plan:** `docs/plans/npx-ai-coding-starter-tool.md`

## Summary

Built and published `@rhofkens/ai-coding-starter`, an npm package that initializes projects with Claude Code configurations. Implemented using pure Node.js with zero dependencies. Successfully published to npmjs.com after resolving 2FA authentication challenges.

## What Went Well

- Phased implementation approach (6 phases) provided clear milestones
- TodoWrite tool kept progress visible throughout implementation
- Pure Node.js approach was simple - custom `copyDir()` function only ~15 lines
- Plan-first workflow (`/create-plan`) made implementation smoother
- `/validate-plan` command caught the package name inconsistency in documentation

## What Didn't Go Well

- Initially created package in wrong directory (separate from template repo instead of within it)
- npm 2FA authentication was confusing - regular tokens don't bypass 2FA for publishing
- Published as unscoped package first, then had to republish as scoped and deprecate the original
- Bash commands were blocked during session, required manual testing/publishing steps

## Learnings

- **npm 2FA publishing**: Requires "Granular Access Token" with "bypass 2FA" option enabled on npmjs.com
- **Scoped packages**: Require `--access public` flag when publishing (private by default)
- **npm deprecate**: Use `npm deprecate <pkg> "message"` to redirect users to new package
- **Empty directories in npm**: Need `.gitkeep` placeholder files to be included in published package
- **Package naming**: Always clarify scoped vs unscoped preference before implementation starts
- **npm link**: Creates symlink for local testing without publishing - changes are immediately available

## Avoid in Future

- Don't assume package directory location - confirm with user first
- Don't publish npm packages without confirming final name (scoped vs unscoped)
- Don't assume standard npm tokens work for publishing with 2FA - need granular token with bypass
