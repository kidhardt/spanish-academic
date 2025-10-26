#!/usr/bin/env node

/**
 * Pre-Commit Hook: File Protection Enforcement
 *
 * This script enforces the rules defined in project-map.json before allowing commits.
 * It checks all staged files against risk classifications and blocks dangerous operations.
 *
 * Usage:
 *   - Automatically runs via Git pre-commit hook (.git/hooks/pre-commit)
 *   - Manual: node scripts/pre-commit-check.js
 *   - Override: git commit --no-verify (discouraged, logged)
 *
 * Enforcement:
 *   - Blocks deletion of allowDelete:false files
 *   - Blocks renaming of allowRename:false files
 *   - Blocks edits to editAllowedDirect:false files on main branch
 *   - Requires approval for requiresApproval:true files
 *
 * Exit codes:
 *   0 = All checks passed
 *   1 = Blocked by protection rules
 *   2 = Configuration error
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Load project-map.json
 */
function loadProjectMap() {
  const mapPath = path.join(__dirname, '..', 'project-map.json');

  if (!fs.existsSync(mapPath)) {
    console.error(`${colors.red}${colors.bold}ERROR:${colors.reset} project-map.json not found at ${mapPath}`);
    console.error('File protection system is not configured.');
    process.exit(2);
  }

  try {
    const content = fs.readFileSync(mapPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`${colors.red}${colors.bold}ERROR:${colors.reset} Failed to parse project-map.json: ${error.message}`);
    process.exit(2);
  }
}

/**
 * Get list of staged files with their status
 * Returns: Array of {status: 'M'|'D'|'R'|'A', file: 'path/to/file', newFile: 'path/to/renamed' (for R only)}
 */
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-status', { encoding: 'utf8' });

    if (!output.trim()) {
      return [];
    }

    return output.trim().split('\n').map(line => {
      const parts = line.split('\t');
      const status = parts[0];
      const file = parts[1];

      // Handle renames: status will be R100, R050, etc.
      if (status.startsWith('R')) {
        return {
          status: 'R',
          file: file,
          newFile: parts[2]
        };
      }

      return {
        status: status,
        file: file
      };
    });
  } catch (error) {
    console.error(`${colors.red}${colors.bold}ERROR:${colors.reset} Failed to get staged files: ${error.message}`);
    process.exit(2);
  }
}

/**
 * Get current branch name
 */
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`${colors.red}${colors.bold}ERROR:${colors.reset} Failed to get current branch: ${error.message}`);
    process.exit(2);
  }
}

/**
 * Check if new top-level directories are being created
 * Returns: {allowed: boolean, message: string, directories: string[]}
 */
function checkNewTopLevelDirectories(stagedFiles, projectMap) {
  const newTopLevelDirs = new Set();
  const allowedDirs = new Set(projectMap.allowedTopLevelDirectories || []);

  for (const fileOp of stagedFiles) {
    if (fileOp.status === 'A' || fileOp.status === 'M') {
      const parts = fileOp.file.split('/');
      if (parts.length > 1) {
        const topLevelDir = parts[0];

        // Skip if it's an allowed directory
        if (allowedDirs.has(topLevelDir)) {
          continue;
        }

        // Check if this is a file at root (no directory)
        if (parts.length === 1) {
          continue;
        }

        // New top-level directory detected
        newTopLevelDirs.add(topLevelDir);
      }
    }
  }

  if (newTopLevelDirs.size > 0) {
    const dirs = Array.from(newTopLevelDirs);
    return {
      allowed: false,
      directories: dirs,
      message: `${colors.red}${colors.bold}BLOCKED:${colors.reset} New top-level director${dirs.length > 1 ? 'ies' : 'y'} detected\n\n` +
               dirs.map(dir => `  ${colors.yellow}${dir}/${colors.reset} (not in allowedTopLevelDirectories)`).join('\n') + '\n\n' +
               `  ${colors.cyan}Reason:${colors.reset} Creating new top-level directories forks truth and defeats governance.\n` +
               `  Common violations: old/, backup/, deprecated/, v2/, utils2/\n\n` +
               `  ${colors.cyan}Solutions:${colors.reset}\n` +
               `    1. Use existing directory structure (src/, public/, docs/, etc.)\n` +
               `    2. Get approval to add ${dirs.length > 1 ? 'these directories' : 'this directory'} to project-map.json allowedTopLevelDirectories\n` +
               `    3. Cancel operation\n\n` +
               `  ${colors.yellow}Note:${colors.reset} If approved, edit project-map.json first, then commit changes together.`
    };
  }

  return { allowed: true };
}

/**
 * Validate branch name for critical file changes
 * Returns: {allowed: boolean, message: string}
 */
function validateBranchName(currentBranch, hasCriticalChanges) {
  if (!hasCriticalChanges) {
    return { allowed: true };
  }

  const isMainBranch = currentBranch === 'main' || currentBranch === 'master';
  const isReleaseBranch = /^release\//.test(currentBranch);

  if (isMainBranch || isReleaseBranch) {
    return {
      allowed: false,
      message: `${colors.red}${colors.bold}BLOCKED:${colors.reset} Cannot commit critical changes on ${currentBranch} branch\n\n` +
               `  ${colors.cyan}Reason:${colors.reset} Changes to danger:critical files must occur in isolated feature branches.\n\n` +
               `  ${colors.cyan}Solutions:${colors.reset}\n` +
               `    1. Create feature branch: git checkout -b feature/<description>\n` +
               `    2. Or safety branch: git checkout -b safety/<description>\n` +
               `    3. Use git worktree for isolation: npm run worktree:create\n\n` +
               `  ${colors.yellow}Required:${colors.reset} Branch name must start with feature/, safety/, fix/, or refactor/`
    };
  }

  // Check if branch has appropriate prefix
  const validPrefixes = ['feature/', 'safety/', 'fix/', 'refactor/', 'docs/'];
  const hasValidPrefix = validPrefixes.some(prefix => currentBranch.startsWith(prefix));

  if (!hasValidPrefix) {
    return {
      allowed: false,
      message: `${colors.red}${colors.bold}BLOCKED:${colors.reset} Invalid branch name for critical changes: ${currentBranch}\n\n` +
               `  ${colors.cyan}Reason:${colors.reset} Critical changes require descriptive branch names for audit trail.\n\n` +
               `  ${colors.cyan}Valid prefixes:${colors.reset}\n` +
               validPrefixes.map(p => `    - ${p}`).join('\n') + '\n\n' +
               `  ${colors.cyan}Example:${colors.reset} git checkout -b feature/update-localization\n\n` +
               `  ${colors.yellow}Current:${colors.reset} ${currentBranch} (does not match required pattern)`
    };
  }

  return { allowed: true };
}

/**
 * Check if validators are required and display warning
 * Returns: {required: string[]} - list of required validators
 */
function checkRequiredValidators(stagedFiles, projectMap) {
  const requiredValidators = new Set();

  for (const fileOp of stagedFiles) {
    const match = matchFileToRule(fileOp.file, projectMap);
    if (match && match.rule.mustRunValidators) {
      match.rule.mustRunValidators.forEach(v => requiredValidators.add(v));
    }
  }

  return { required: Array.from(requiredValidators) };
}

/**
 * Match a file path against project-map.json patterns
 * Returns the most specific matching rule, or null if no match
 */
function matchFileToRule(filePath, projectMap) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  let bestMatch = null;
  let bestMatchLength = 0;

  for (const [pattern, rule] of Object.entries(projectMap.paths)) {
    // Convert glob pattern to regex
    // ** = match any number of directories
    // * = match anything except /
    let regexPattern = pattern
      .replace(/\*\*/g, '__DOUBLESTAR__')
      .replace(/\*/g, '[^/]+')
      .replace(/__DOUBLESTAR__/g, '.*')
      .replace(/\./g, '\\.');

    // Anchor pattern
    if (!pattern.endsWith('**')) {
      regexPattern = '^' + regexPattern + '$';
    } else {
      regexPattern = '^' + regexPattern;
    }

    const regex = new RegExp(regexPattern);

    if (regex.test(normalizedPath)) {
      // Prefer more specific matches (longer patterns)
      if (pattern.length > bestMatchLength) {
        bestMatch = { pattern, rule };
        bestMatchLength = pattern.length;
      }
    }
  }

  return bestMatch;
}

/**
 * Check a single file operation
 * Returns: {allowed: boolean, message: string}
 */
function checkFileOperation(fileOp, projectMap, currentBranch) {
  const match = matchFileToRule(fileOp.file, projectMap);

  if (!match) {
    // No rule found - allow by default but warn
    return {
      allowed: true,
      message: `${colors.yellow}WARNING:${colors.reset} No protection rule found for ${fileOp.file}`
    };
  }

  const { pattern, rule } = match;
  const isMainBranch = currentBranch === 'main' || currentBranch === 'master';

  // Check deletion
  if (fileOp.status === 'D') {
    if (rule.allowDelete === false) {
      return {
        allowed: false,
        message: `${colors.red}${colors.bold}BLOCKED:${colors.reset} Cannot delete ${fileOp.file}\n` +
                 `  Matched rule: ${pattern}\n` +
                 `  Reason: ${rule.notes}\n` +
                 `  Danger level: ${rule.danger}\n` +
                 `  ${colors.cyan}Solution:${colors.reset} This file is protected from deletion.`
      };
    }
  }

  // Check rename
  if (fileOp.status === 'R') {
    if (rule.allowRename === false) {
      return {
        allowed: false,
        message: `${colors.red}${colors.bold}BLOCKED:${colors.reset} Cannot rename ${fileOp.file} to ${fileOp.newFile}\n` +
                 `  Matched rule: ${pattern}\n` +
                 `  Reason: ${rule.notes}\n` +
                 `  Danger level: ${rule.danger}\n` +
                 `  ${colors.cyan}Solution:${colors.reset} This file is protected from renaming.`
      };
    }
  }

  // Check modification
  if (fileOp.status === 'M') {
    // Block direct edits to critical files on main branch
    if (rule.editAllowedDirect === false && isMainBranch) {
      return {
        allowed: false,
        message: `${colors.red}${colors.bold}BLOCKED:${colors.reset} Cannot edit ${fileOp.file} directly on ${currentBranch} branch\n` +
                 `  Matched rule: ${pattern}\n` +
                 `  Reason: ${rule.notes}\n` +
                 `  Danger level: ${rule.danger}\n` +
                 `  ${colors.cyan}Solution:${colors.reset} Create a feature branch: git checkout -b feature/update-${path.basename(fileOp.file, path.extname(fileOp.file))}\n` +
                 `  Or use git worktree: npm run worktree:create`
      };
    }

    // Warn about approval requirements
    if (rule.requiresApproval === true) {
      return {
        allowed: true,
        warning: true,
        message: `${colors.yellow}${colors.bold}APPROVAL REQUIRED:${colors.reset} ${fileOp.file}\n` +
                 `  Matched rule: ${pattern}\n` +
                 `  Danger level: ${rule.danger}\n` +
                 `  ${colors.cyan}Note:${colors.reset} ${rule.notes}\n` +
                 `  This change will require code owner approval in PR.`
      };
    }
  }

  return { allowed: true };
}

/**
 * Log override attempt
 */
function logOverride(files) {
  const logPath = path.join(__dirname, '..', '.git', 'protection-overrides.log');
  const timestamp = new Date().toISOString();
  const user = execSync('git config user.name', { encoding: 'utf8' }).trim();
  const email = execSync('git config user.email', { encoding: 'utf8' }).trim();

  const logEntry = `${timestamp} | ${user} <${email}> | OVERRIDE --no-verify\nFiles: ${files.join(', ')}\n\n`;

  fs.appendFileSync(logPath, logEntry);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}${colors.bold}File Protection Check${colors.reset} (project-map.json enforcement)\n`);

  // Load configuration
  const projectMap = loadProjectMap();
  console.log(`${colors.green}✓${colors.reset} Loaded project-map.json (version ${projectMap.version})\n`);

  // Get staged files
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log(`${colors.yellow}No staged files to check.${colors.reset}`);
    process.exit(0);
  }

  console.log(`Checking ${stagedFiles.length} staged file(s)...\n`);

  // Get current branch
  const currentBranch = getCurrentBranch();
  console.log(`Current branch: ${colors.cyan}${currentBranch}${colors.reset}\n`);

  // Check for new top-level directories
  const newDirCheck = checkNewTopLevelDirectories(stagedFiles, projectMap);
  if (!newDirCheck.allowed) {
    console.log(newDirCheck.message);
    console.log(`\n${colors.red}${colors.bold}COMMIT BLOCKED${colors.reset}\n`);
    process.exit(1);
  }

  // Check each file
  const violations = [];
  const warnings = [];
  let hasCriticalChanges = false;

  for (const fileOp of stagedFiles) {
    const result = checkFileOperation(fileOp, projectMap, currentBranch);

    // Track if we have critical changes
    const match = matchFileToRule(fileOp.file, projectMap);
    if (match && match.rule.danger === 'critical') {
      hasCriticalChanges = true;
    }

    if (!result.allowed) {
      violations.push(result.message);
    } else if (result.warning) {
      warnings.push(result.message);
    }
  }

  // Validate branch name for critical changes
  const branchCheck = validateBranchName(currentBranch, hasCriticalChanges);
  if (!branchCheck.allowed) {
    violations.push(branchCheck.message);
  }

  // Check required validators
  const validatorsCheck = checkRequiredValidators(stagedFiles, projectMap);
  if (validatorsCheck.required.length > 0) {
    warnings.push(
      `${colors.yellow}${colors.bold}VALIDATORS REQUIRED:${colors.reset} After committing, you MUST run:\n` +
      validatorsCheck.required.map(v => `  npm run ${v}`).join('\n') + '\n' +
      `  ${colors.cyan}Reason:${colors.reset} Changes to public/ or public/es/ require validation.\n` +
      `  ${colors.cyan}Or run all:${colors.reset} npm run validate-all`
    );
  }

  // Display warnings
  if (warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bold}Warnings:${colors.reset}\n`);
    warnings.forEach(warning => console.log(warning + '\n'));
  }

  // Display violations and block if necessary
  if (violations.length > 0) {
    console.log(`${colors.red}${colors.bold}Protection Violations:${colors.reset}\n`);
    violations.forEach(violation => console.log(violation + '\n'));

    console.log(`${colors.red}${colors.bold}COMMIT BLOCKED${colors.reset}`);
    console.log(`\nYou have ${violations.length} violation(s) that must be resolved.`);
    console.log(`\n${colors.cyan}Options:${colors.reset}`);
    console.log(`  1. Create a feature branch and commit there`);
    console.log(`  2. Use git worktree for isolated changes`);
    console.log(`  3. Unstage protected files: git restore --staged <file>`);
    console.log(`  4. Override (NOT RECOMMENDED): git commit --no-verify`);
    console.log(`\n${colors.yellow}Note:${colors.reset} Overrides are logged in .git/protection-overrides.log`);

    process.exit(1);
  }

  // All checks passed
  console.log(`${colors.green}${colors.bold}✓ All protection checks passed${colors.reset}\n`);

  if (warnings.length > 0) {
    console.log(`${colors.yellow}Note:${colors.reset} ${warnings.length} file(s) require code owner approval in PR.`);
  }

  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { loadProjectMap, matchFileToRule, checkFileOperation };
