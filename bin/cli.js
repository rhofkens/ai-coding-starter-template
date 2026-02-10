#!/usr/bin/env node

/**
 * ai-coding-starter CLI v2.0.0
 * Initializes a project with Claude Code configurations for enterprise-grade AI-assisted development workflows
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  intro, outro, cancel,
  confirm, isCancel,
  note, log, spinner,
} from '@clack/prompts';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Check if a path exists
 */
function exists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy a directory recursively
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy a single item (file or directory) from template to target
 * Returns true if created, false if skipped
 */
function copyItem(templateDir, targetDir, templateSubPath, description) {
  const srcPath = path.join(templateDir, templateSubPath);
  const destPath = path.join(targetDir, templateSubPath);
  const label = description || templateSubPath;

  if (!exists(srcPath)) {
    log.warn(`Template missing: ${label}`);
    return false;
  }

  if (exists(destPath)) {
    log.warn(`Skipped: ${label} (already exists)`);
    return false;
  }

  const srcStat = fs.statSync(srcPath);
  if (srcStat.isDirectory()) {
    copyDir(srcPath, destPath);
  } else {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }

  log.success(`Created: ${label}`);
  return true;
}

/**
 * Show help text
 */
function showHelp() {
  console.log(`
ai-coding-starter v2.0.0

Initialize a project with Claude Code configurations for
enterprise-grade AI-assisted development workflows.

Usage:
  npx @rhofkens/ai-coding-starter

Core components (always installed):
  .claude/        Commands, skills, and settings for Claude Code
  docs/           Documentation folder structure
  CLAUDE.md       Project preferences for Claude
  LICENSE         MIT License template

Optional components (interactive selection):
  Frontend Agent  React 19.x / shadcn / Vite best practices agent
  Backend Agent   Spring Boot 3.5+ / Java 25 best practices agent
  Design System   shadcn Nova / Indigo default design system

Options:
  --help, -h      Show this help message

More info:
  https://github.com/roelandhofkens/ai-coding-starter-template
`);
}

/**
 * Main function
 */
async function main() {
  // Handle --help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const targetDir = process.cwd();
  const templateDir = path.join(__dirname, '..', 'template');

  // Check if template directory exists
  if (!exists(templateDir)) {
    log.error('Template directory not found. Package may be corrupted.');
    process.exit(1);
  }

  intro('AI Coding Starter Template Installer for Claude Code');

  note(
    [
      pc.bold(pc.white('By Roeland Hofkens')),
      '',
      pc.cyan('https://www.bluefields.ai'),
      pc.cyan('https://www.linkedin.com/in/roelandhofkens'),
    ].join('\n'),
    'About'
  );

  // --- Core items (always installed) ---

  const s = spinner();
  s.start('Installing core components...');

  const coreItems = [
    ['.claude', '.claude/ commands, skills, and settings'],
    ['docs', 'docs/ folder structure'],
    ['CLAUDE.md', 'CLAUDE.md project preferences'],
    ['LICENSE', 'LICENSE file'],
  ];

  const created = [];
  const skipped = [];

  for (const [templateSubPath, description] of coreItems) {
    const wasCreated = copyItem(templateDir, targetDir, templateSubPath, description);
    if (wasCreated) {
      created.push(description);
    } else {
      skipped.push(description);
    }
  }

  s.stop('Core components installed.');

  // --- Optional components ---

  const addFrontend = await confirm({
    message: 'Add Frontend Agent (React 19.x / shadcn / Vite)?',
    active: 'Yes',
    inactive: 'No',
    initialValue: true,
  });

  if (isCancel(addFrontend)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }

  const addBackend = await confirm({
    message: 'Add Backend Agent (Spring Boot 3.5+ / Java 25)?',
    active: 'Yes',
    inactive: 'No',
    initialValue: true,
  });

  if (isCancel(addBackend)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }

  let addDesignSystem = false;

  if (addFrontend) {
    const dsAnswer = await confirm({
      message: 'Add Default Design System (shadcn Nova / Indigo)?',
      active: 'Yes',
      inactive: 'No',
      initialValue: true,
    });

    if (isCancel(dsAnswer)) {
      cancel('Setup cancelled.');
      process.exit(0);
    }

    addDesignSystem = dsAnswer;
  }

  // --- Build summary and copy optional items ---

  const optionalSummary = [];

  const optionalDir = path.join(templateDir, 'optional');

  if (addFrontend) {
    const agentSrc = path.join(optionalDir, 'agents/frontend-react.md');
    const agentDest = path.join(targetDir, '.claude/agents/frontend-react.md');

    if (exists(agentSrc) && !exists(agentDest)) {
      fs.mkdirSync(path.dirname(agentDest), { recursive: true });
      fs.copyFileSync(agentSrc, agentDest);
      optionalSummary.push('Frontend Agent (React 19.x / shadcn / Vite)');
      log.success('Created: Frontend Agent');
    } else if (exists(agentDest)) {
      log.warn('Skipped: Frontend Agent (already exists)');
    }
  }

  if (addBackend) {
    const agentSrc = path.join(optionalDir, 'agents/backend-springboot.md');
    const agentDest = path.join(targetDir, '.claude/agents/backend-springboot.md');

    if (exists(agentSrc) && !exists(agentDest)) {
      fs.mkdirSync(path.dirname(agentDest), { recursive: true });
      fs.copyFileSync(agentSrc, agentDest);
      optionalSummary.push('Backend Agent (Spring Boot 3.5+ / Java 25)');
      log.success('Created: Backend Agent');
    } else if (exists(agentDest)) {
      log.warn('Skipped: Backend Agent (already exists)');
    }
  }

  if (addDesignSystem) {
    const dsSrc = path.join(optionalDir, 'design-system/design-system.md');
    const dsDest = path.join(targetDir, 'docs/guidelines/ui/design-system.md');

    if (exists(dsSrc) && !exists(dsDest)) {
      fs.mkdirSync(path.dirname(dsDest), { recursive: true });
      fs.copyFileSync(dsSrc, dsDest);
      optionalSummary.push('Design System (shadcn Nova / Indigo)');
      log.success('Created: Design System');
    } else if (exists(dsDest)) {
      log.warn('Skipped: Design System (already exists)');
    }
  }

  // --- Summary ---

  const totalCreated = created.length + optionalSummary.length;

  if (totalCreated === 0 && skipped.length > 0) {
    log.info('All items already exist. Nothing to create.');
  } else {
    const summaryLines = [];

    if (created.length > 0) {
      summaryLines.push('Core:');
      for (const item of created) {
        summaryLines.push(`  + ${item}`);
      }
    }

    if (optionalSummary.length > 0) {
      if (summaryLines.length > 0) summaryLines.push('');
      summaryLines.push('Optional:');
      for (const item of optionalSummary) {
        summaryLines.push(`  + ${item}`);
      }
    }

    if (skipped.length > 0) {
      if (summaryLines.length > 0) summaryLines.push('');
      summaryLines.push('Skipped (already exist):');
      for (const item of skipped) {
        summaryLines.push(`  - ${item}`);
      }
    }

    if (summaryLines.length > 0) {
      note(summaryLines.join('\n'), 'Installation Summary');
    }
  }

  // --- Next steps ---

  const nextSteps = [
    '1. Review and customize .claude/settings.local.example.json',
    '   Rename to settings.local.json after customization',
    '2. Update CLAUDE.md with project-specific preferences',
    '3. Start coding with Claude!',
  ];

  note(nextSteps.join('\n'), 'Next Steps');

  outro("You're all set!");
}

// Run the CLI
main().catch((err) => {
  log.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
