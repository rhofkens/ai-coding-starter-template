#!/usr/bin/env node

/**
 * ai-coding-starter CLI
 * Initializes a project with Claude Code configurations for enterprise-grade AI-assisted development workflows
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`→ ${message}`, colors.cyan);
}

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
 * Main function
 */
function main() {
  // Handle --help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
${colors.bold}ai-coding-starter${colors.reset}

Initialize a project with Claude Code configurations for enterprise-grade AI-assisted development workflows.

${colors.bold}Usage:${colors.reset}
  npx @rhofkens/ai-coding-starter

${colors.bold}What it creates:${colors.reset}
  .claude/     Commands, agents, and skills for Claude Code
  docs/        Documentation folder structure
  CLAUDE.md    Project preferences for Claude
  LICENSE      MIT License template

${colors.bold}Options:${colors.reset}
  --help, -h   Show this help message

${colors.bold}More info:${colors.reset}
  https://github.com/roelandhofkens/ai-coding-starter-template
`);
    process.exit(0);
  }

  const targetDir = process.cwd();
  const templateDir = path.join(__dirname, '..', 'template');

  log(`\n${colors.bold}ai-coding-starter${colors.reset}`);
  log('Initializing Claude Code project structure...\n');

  // Check if template directory exists
  if (!exists(templateDir)) {
    logError('Template directory not found. Package may be corrupted.');
    process.exit(1);
  }

  // Track what was created vs skipped
  const created = [];
  const skipped = [];

  // Items to copy: [templateSubPath, targetSubPath, description]
  const items = [
    ['.claude', '.claude', '.claude/ folder with commands, agents, and skills'],
    ['docs', 'docs', 'docs/ folder structure'],
    ['CLAUDE.md', 'CLAUDE.md', 'CLAUDE.md project preferences'],
    ['LICENSE', 'LICENSE', 'LICENSE file']
  ];

  for (const [templateSubPath, targetSubPath, description] of items) {
    const srcPath = path.join(templateDir, templateSubPath);
    const destPath = path.join(targetDir, targetSubPath);

    // Check if source exists in template
    if (!exists(srcPath)) {
      logWarning(`Template missing: ${templateSubPath}`);
      continue;
    }

    // Check if destination already exists
    if (exists(destPath)) {
      skipped.push(description);
      logWarning(`Skipped: ${targetSubPath} (already exists)`);
      continue;
    }

    // Copy the item
    try {
      const srcStat = fs.statSync(srcPath);
      if (srcStat.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        // Ensure parent directory exists
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
      created.push(description);
      logSuccess(`Created: ${targetSubPath}`);
    } catch (err) {
      logError(`Failed to create ${targetSubPath}: ${err.message}`);
    }
  }

  // Summary
  console.log('');

  if (created.length === 0 && skipped.length > 0) {
    logInfo('All items already exist. Nothing to create.');
  } else if (created.length > 0) {
    log(`${colors.bold}${colors.green}Done!${colors.reset} Created ${created.length} item(s).\n`);
  }

  // Next steps
  if (created.length > 0) {
    log(`${colors.bold}Next steps:${colors.reset}`);
    log('1. Review and customize .claude/settings.local.example.json');
    log('   Rename to settings.local.json after customization');
    log('2. Update CLAUDE.md with project-specific preferences');
    log('3. Start coding with Claude!\n');
  }
}

// Run the CLI
try {
  main();
} catch (err) {
  logError(`Unexpected error: ${err.message}`);
  process.exit(1);
}
