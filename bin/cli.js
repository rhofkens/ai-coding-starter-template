#!/usr/bin/env node

/**
 * ai-coding-starter CLI v2.0.2
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
 * Recursively scan a template directory against target to detect new vs existing files.
 * Read-only — no copying. Returns { newFiles: string[], existingFiles: string[] }.
 */
function scanDir(src, dest, basePath = '') {
  const newFiles = [];
  const existingFiles = [];

  if (!exists(src)) return { newFiles, existingFiles };

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relPath = basePath ? path.join(basePath, entry.name) : entry.name;

    if (entry.isDirectory()) {
      const sub = scanDir(srcPath, destPath, relPath);
      newFiles.push(...sub.newFiles);
      existingFiles.push(...sub.existingFiles);
    } else if (exists(destPath)) {
      existingFiles.push(relPath);
    } else {
      newFiles.push(relPath);
    }
  }

  return { newFiles, existingFiles };
}

/**
 * Scan a single template item (file or directory) to detect new vs existing files.
 * Returns { newFiles: string[], existingFiles: string[] }.
 */
function scanItem(templateDir, targetDir, templateSubPath) {
  const srcPath = path.join(templateDir, templateSubPath);
  const destPath = path.join(targetDir, templateSubPath);

  if (!exists(srcPath)) return { newFiles: [], existingFiles: [] };

  const srcStat = fs.statSync(srcPath);

  if (srcStat.isDirectory()) {
    return scanDir(srcPath, destPath, templateSubPath);
  }

  // Single file
  if (exists(destPath)) {
    return { newFiles: [], existingFiles: [templateSubPath] };
  }
  return { newFiles: [templateSubPath], existingFiles: [] };
}

/**
 * Merge-copy a directory recursively.
 * Creates directories as needed. When overwrite is false, skips existing files.
 * When overwrite is true, overwrites existing files.
 * Returns { created: number, updated: number, skipped: number } counts.
 */
function mergeDir(src, dest, overwrite = false) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      const sub = mergeDir(srcPath, destPath, overwrite);
      created += sub.created;
      updated += sub.updated;
      skipped += sub.skipped;
    } else if (exists(destPath)) {
      if (overwrite) {
        fs.copyFileSync(srcPath, destPath);
        updated++;
      } else {
        skipped++;
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
      created++;
    }
  }

  return { created, updated, skipped };
}

/**
 * Copy a single item (file or directory) from template to target.
 * For directories, merges content. When overwrite is true, overwrites existing files.
 * Returns 'created' | 'merged' | 'updated' | 'skipped' | 'missing'.
 */
function copyItem(templateDir, targetDir, templateSubPath, description, overwrite = false) {
  const srcPath = path.join(templateDir, templateSubPath);
  const destPath = path.join(targetDir, templateSubPath);
  const label = description || templateSubPath;

  if (!exists(srcPath)) {
    log.warn(`Template missing: ${label}`);
    return 'missing';
  }

  const srcStat = fs.statSync(srcPath);

  if (srcStat.isDirectory()) {
    const { created, updated, skipped } = mergeDir(srcPath, destPath, overwrite);
    if (updated > 0 && created > 0) {
      log.success(`Merged: ${label} (${created} new, ${updated} updated)`);
      return 'merged';
    } else if (updated > 0) {
      log.success(`Updated: ${label} (${updated} files)`);
      return 'updated';
    } else if (created > 0 && skipped > 0) {
      log.success(`Merged: ${label} (${created} new, ${skipped} existing)`);
      return 'merged';
    } else if (created > 0) {
      log.success(`Created: ${label}`);
      return 'created';
    } else if (skipped > 0) {
      log.info(`Kept: ${label} (${skipped} files unchanged)`);
      return 'skipped';
    } else {
      log.success(`Created: ${label}`);
      return 'created';
    }
  }

  // Single file
  if (exists(destPath)) {
    if (overwrite) {
      fs.copyFileSync(srcPath, destPath);
      log.success(`Updated: ${label}`);
      return 'updated';
    }
    log.info(`Kept: ${label} (already exists)`);
    return 'skipped';
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  log.success(`Created: ${label}`);
  return 'created';
}

/**
 * Show help text
 */
function showHelp() {
  console.log(`
ai-coding-starter v2.0.2

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

  // --- Pre-scan core items ---

  const coreItems = [
    ['.claude', '.claude/ commands, skills, and settings'],
    ['docs', 'docs/ folder structure'],
    ['CLAUDE.md', 'CLAUDE.md project preferences'],
    ['LICENSE', 'LICENSE file'],
  ];

  let allNewFiles = [];
  let allExistingFiles = [];

  for (const [templateSubPath] of coreItems) {
    const scan = scanItem(templateDir, targetDir, templateSubPath);
    allNewFiles.push(...scan.newFiles);
    allExistingFiles.push(...scan.existingFiles);
  }

  // --- Ask about updating existing files ---

  let overwriteCore = false;

  if (allExistingFiles.length > 0) {
    note(
      [
        `Found ${allExistingFiles.length} existing file${allExistingFiles.length === 1 ? '' : 's'} from a previous installation.`,
        `${allNewFiles.length} new file${allNewFiles.length === 1 ? '' : 's'} will be added.`,
      ].join('\n'),
      'Previous Installation Detected'
    );

    const updateAnswer = await confirm({
      message: 'Update existing files with latest templates?',
      active: 'Yes',
      inactive: 'No',
      initialValue: false,
    });

    if (isCancel(updateAnswer)) {
      cancel('Setup cancelled.');
      process.exit(0);
    }

    overwriteCore = updateAnswer;
  }

  // --- Install core items ---

  const s = spinner();
  s.start('Installing core components...');

  const createdItems = [];
  const updatedItems = [];
  const keptItems = [];

  for (const [templateSubPath, description] of coreItems) {
    const result = copyItem(templateDir, targetDir, templateSubPath, description, overwriteCore);
    if (result === 'created') {
      createdItems.push(description);
    } else if (result === 'updated' || result === 'merged') {
      updatedItems.push(description);
    } else {
      keptItems.push(description);
    }
  }

  s.stop('Core components installed.');

  // --- Pre-scan optional items ---

  const optionalDir = path.join(templateDir, 'optional');

  const optionalDefs = [
    {
      key: 'frontend',
      label: 'Frontend Agent (React 19.x / shadcn / Vite)',
      src: path.join(optionalDir, 'agents/frontend-react.md'),
      dest: path.join(targetDir, '.claude/agents/frontend-react.md'),
    },
    {
      key: 'backend',
      label: 'Backend Agent (Spring Boot 3.5+ / Java 25)',
      src: path.join(optionalDir, 'agents/backend-springboot.md'),
      dest: path.join(targetDir, '.claude/agents/backend-springboot.md'),
    },
    {
      key: 'designSystem',
      label: 'Design System (shadcn Nova / Indigo)',
      src: path.join(optionalDir, 'design-system/design-system.md'),
      dest: path.join(targetDir, 'docs/guidelines/ui/design-system.md'),
      dependsOn: 'frontend',
    },
  ];

  // Detect which optional items already exist
  const optionalExists = {};
  for (const def of optionalDefs) {
    optionalExists[def.key] = exists(def.dest);
  }

  // --- Optional component prompts with smart labels ---

  const optionalSelections = {};

  const frontendVerb = optionalExists.frontend ? 'Update' : 'Add';
  const addFrontend = await confirm({
    message: `${frontendVerb} Frontend Agent (React 19.x / shadcn / Vite)?`,
    active: 'Yes',
    inactive: 'No',
    initialValue: true,
  });

  if (isCancel(addFrontend)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }
  optionalSelections.frontend = addFrontend;

  const backendVerb = optionalExists.backend ? 'Update' : 'Add';
  const addBackend = await confirm({
    message: `${backendVerb} Backend Agent (Spring Boot 3.5+ / Java 25)?`,
    active: 'Yes',
    inactive: 'No',
    initialValue: true,
  });

  if (isCancel(addBackend)) {
    cancel('Setup cancelled.');
    process.exit(0);
  }
  optionalSelections.backend = addBackend;

  if (addFrontend) {
    const dsVerb = optionalExists.designSystem ? 'Update' : 'Add';
    const dsAnswer = await confirm({
      message: `${dsVerb} Default Design System (shadcn Nova / Indigo)?`,
      active: 'Yes',
      inactive: 'No',
      initialValue: true,
    });

    if (isCancel(dsAnswer)) {
      cancel('Setup cancelled.');
      process.exit(0);
    }
    optionalSelections.designSystem = dsAnswer;
  }

  // --- Copy optional items ---

  const optionalCreated = [];
  const optionalUpdated = [];

  for (const def of optionalDefs) {
    if (!optionalSelections[def.key]) continue;

    if (!exists(def.src)) {
      log.warn(`Template missing: ${def.label}`);
      continue;
    }

    const fileExists = optionalExists[def.key];
    fs.mkdirSync(path.dirname(def.dest), { recursive: true });
    fs.copyFileSync(def.src, def.dest);

    if (fileExists) {
      log.success(`Updated: ${def.label}`);
      optionalUpdated.push(def.label);
    } else {
      log.success(`Created: ${def.label}`);
      optionalCreated.push(def.label);
    }
  }

  // --- Summary ---

  const totalActions = createdItems.length + updatedItems.length + optionalCreated.length + optionalUpdated.length;

  if (totalActions === 0 && keptItems.length > 0) {
    log.info('All items already exist. Nothing changed.');
  } else {
    const summaryLines = [];

    // Created
    const allCreated = [
      ...createdItems.map(i => `  ${pc.green('+')} ${i}`),
      ...optionalCreated.map(i => `  ${pc.green('+')} ${i}`),
    ];
    if (allCreated.length > 0) {
      summaryLines.push(pc.bold('Created:'));
      summaryLines.push(...allCreated);
    }

    // Updated
    const allUpdated = [
      ...updatedItems.map(i => `  ${pc.cyan('↑')} ${i}`),
      ...optionalUpdated.map(i => `  ${pc.cyan('↑')} ${i}`),
    ];
    if (allUpdated.length > 0) {
      if (summaryLines.length > 0) summaryLines.push('');
      summaryLines.push(pc.bold('Updated:'));
      summaryLines.push(...allUpdated);
    }

    // Kept
    if (keptItems.length > 0) {
      if (summaryLines.length > 0) summaryLines.push('');
      summaryLines.push(pc.bold('Kept (unchanged):'));
      for (const item of keptItems) {
        summaryLines.push(`  ${pc.dim('=')} ${item}`);
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
