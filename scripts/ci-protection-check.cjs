#!/usr/bin/env node

/**
 * CI Protection Check
 *
 * Server-side enforcement of file protection rules.
 * Mirrors pre-commit-check.js logic but reads changed files from CI diff instead of git staged.
 *
 * Usage:
 *   node scripts/ci-protection-check.js <changed-files.txt>
 *
 * Input format (git diff --name-status output):
 *   M	path/to/file1.js
 *   D	path/to/file2.ts
 *   R100	old/path.md	new/path.md
 *   A	new/file.json
 *
 * Exit codes:
 *   0 = All checks passed
 *   1 = Protection violations detected
 *   2 = Configuration error
 */

const fs = require('fs');
const path = require('path');

// Import shared functions from pre-commit-check.js
const { loadProjectMap, matchFileToRule } = require('./pre-commit-check.js');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Parse changed files from git diff output
 */
function parseChangedFiles(diffFilePath) {
  if (!fs.existsSync(diffFilePath)) {
    console.error(`${colors.red}ERROR:${colors.reset} Changed files list not found: ${diffFilePath}`);
    process.exit(2);
  }

  const content = fs.readFileSync(diffFilePath, 'utf8');
  const lines = content.trim().split('\n').filter(line => line.length > 0);

  return lines.map(line => {
    const parts = line.split('\t');
    const status = parts[0];

    // Handle renames
    if (status.startsWith('R')) {
      return {
        status: 'R',
        file: parts[1],
        newFile: parts[2]
      };
    }

    return {
      status: status,
      file: parts[1]
    };
  });
}

/**
 * Check file operations (same logic as pre-commit hook)
 */
function checkFileOperation(fileOp, projectMap, branchName) {
  const match = matchFileToRule(fileOp.file, projectMap);

  if (!match) {
    return { allowed: true };
  }

  const { pattern, rule } = match;
  const isProtectedBranch = branchName === 'main' || branchName === 'master' || /^release\//.test(branchName);

  // Check deletion
  if (fileOp.status === 'D') {
    if (rule.allowDelete === false) {
      return {
        allowed: false,
        message: `Cannot delete ${fileOp.file}\n` +
                 `  Rule: ${pattern} (danger: ${rule.danger})\n` +
                 `  ${rule.notes}`
      };
    }
  }

  // Check rename
  if (fileOp.status === 'R') {
    if (rule.allowRename === false) {
      return {
        allowed: false,
        message: `Cannot rename ${fileOp.file} → ${fileOp.newFile}\n` +
                 `  Rule: ${pattern} (danger: ${rule.danger})\n` +
                 `  ${rule.notes}`
      };
    }
  }

  // Check modification on protected branches
  if (fileOp.status === 'M' || fileOp.status === 'A') {
    if (rule.editAllowedDirect === false && isProtectedBranch) {
      return {
        allowed: false,
        message: `Cannot edit ${fileOp.file} on ${branchName} branch\n` +
                 `  Rule: ${pattern} (danger: ${rule.danger})\n` +
                 `  ${rule.notes}\n` +
                 `  This should have been caught by pre-commit hook.`
      };
    }
  }

  return { allowed: true };
}

/**
 * Check for new top-level directories
 */
function checkNewTopLevelDirectories(changedFiles, projectMap) {
  const newTopLevelDirs = new Set();
  const allowedDirs = new Set(projectMap.allowedTopLevelDirectories || []);

  for (const fileOp of changedFiles) {
    if (fileOp.status === 'A' || fileOp.status === 'M') {
      const parts = fileOp.file.split('/');
      if (parts.length > 1) {
        const topLevelDir = parts[0];
        if (!allowedDirs.has(topLevelDir)) {
          newTopLevelDirs.add(topLevelDir);
        }
      }
    }
  }

  if (newTopLevelDirs.size > 0) {
    const dirs = Array.from(newTopLevelDirs);
    return {
      allowed: false,
      message: `New top-level ${dirs.length > 1 ? 'directories' : 'directory'} detected: ${dirs.join(', ')}\n` +
               `  Not in allowedTopLevelDirectories\n` +
               `  This violates governance rules and should have been blocked by pre-commit hook.`
    };
  }

  return { allowed: true };
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}${colors.bold}CI File Protection Check${colors.reset}\n`);

  // Get changed files path from args
  const diffFilePath = process.argv[2];
  if (!diffFilePath) {
    console.error(`${colors.red}ERROR:${colors.reset} Usage: node ci-protection-check.js <changed-files.txt>`);
    process.exit(2);
  }

  // Load project map
  const projectMap = loadProjectMap();
  console.log(`${colors.green}✓${colors.reset} Loaded project-map.json (version ${projectMap.version})\n`);

  // Parse changed files
  const changedFiles = parseChangedFiles(diffFilePath);
  console.log(`${colors.cyan}Checking ${changedFiles.length} changed file(s)...${colors.reset}\n`);

  if (changedFiles.length === 0) {
    console.log(`${colors.green}✓ No files changed${colors.reset}`);
    process.exit(0);
  }

  // Get branch name from environment
  const branchName = process.env.GITHUB_REF_NAME || process.env.GITHUB_HEAD_REF || 'unknown';
  console.log(`Branch: ${colors.cyan}${branchName}${colors.reset}\n`);

  // Check for new top-level directories
  const newDirCheck = checkNewTopLevelDirectories(changedFiles, projectMap);
  if (!newDirCheck.allowed) {
    console.error(`${colors.red}${colors.bold}❌ PROTECTION VIOLATION:${colors.reset}`);
    console.error(newDirCheck.message);
    console.error(`\n${colors.yellow}⚠️  This should have been caught by pre-commit hook.${colors.reset}`);
    console.error(`${colors.yellow}⚠️  Possible --no-verify bypass detected.${colors.reset}\n`);
    process.exit(1);
  }

  // Check each file
  const violations = [];

  for (const fileOp of changedFiles) {
    const result = checkFileOperation(fileOp, projectMap, branchName);

    if (!result.allowed) {
      violations.push(result.message);
    }
  }

  // Report results
  if (violations.length > 0) {
    console.error(`${colors.red}${colors.bold}❌ PROTECTION VIOLATIONS DETECTED${colors.reset}\n`);
    violations.forEach((violation, i) => {
      console.error(`${i + 1}. ${violation}\n`);
    });
    console.error(`${colors.yellow}⚠️  These violations should have been caught by pre-commit hook.${colors.reset}`);
    console.error(`${colors.yellow}⚠️  Possible --no-verify bypass detected.${colors.reset}\n`);
    console.error(`${colors.red}${colors.bold}CI CHECK FAILED${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.green}${colors.bold}✓ All CI protection checks passed${colors.reset}\n`);
  process.exit(0);
}

// Run
if (require.main === module) {
  main();
}

module.exports = { checkFileOperation, checkNewTopLevelDirectories };
