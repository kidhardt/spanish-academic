#!/usr/bin/env node

/**
 * Git Hooks Installer
 *
 * Installs pre-commit hook for file protection enforcement.
 * Creates .git/hooks/pre-commit that calls scripts/pre-commit-check.js
 *
 * Usage:
 *   npm run install-hooks
 *   OR
 *   node scripts/install-git-hooks.js
 *
 * What it does:
 *   1. Checks if .git/ directory exists (validates we're in a git repo)
 *   2. Creates .git/hooks/ directory if missing
 *   3. Writes pre-commit hook script
 *   4. Makes hook executable (Unix) or ensures it's runnable (Windows)
 *   5. Verifies installation
 *
 * Exit codes:
 *   0 = Success
 *   1 = Error (not a git repo, write failed, etc.)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`)
};

/**
 * Check if we're in a git repository
 */
function isGitRepo() {
  const gitDir = path.join(process.cwd(), '.git');
  return fs.existsSync(gitDir);
}

/**
 * Get the pre-commit hook content
 */
function getPreCommitHookContent() {
  // Use cross-platform shebang that works on both Unix and Windows Git Bash
  return `#!/bin/bash
#
# Pre-Commit Hook: File Protection Enforcement
# Auto-installed by scripts/install-git-hooks.js
#
# This hook runs scripts/pre-commit-check.js to enforce project-map.json rules.
# It blocks commits that violate file protection policies.
#
# To bypass (NOT RECOMMENDED): git commit --no-verify
# Bypasses are logged in .git/protection-overrides.log

# Ensure we're in repo root
cd "$(git rev-parse --show-toplevel)"

# Run the protection check
node scripts/pre-commit-check.js

# Capture exit code
EXIT_CODE=$?

# If check failed, block commit
if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi

# All checks passed
exit 0
`;
}

/**
 * Install pre-commit hook
 */
function installPreCommitHook() {
  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  const hookPath = path.join(hooksDir, 'pre-commit');

  // Create hooks directory if it doesn't exist
  if (!fs.existsSync(hooksDir)) {
    log.info('Creating .git/hooks/ directory...');
    fs.mkdirSync(hooksDir, { recursive: true });
    log.success('Created .git/hooks/');
  }

  // Check if pre-commit hook already exists
  if (fs.existsSync(hookPath)) {
    // Read existing hook
    const existing = fs.readFileSync(hookPath, 'utf8');

    // Check if it's our hook
    if (existing.includes('scripts/pre-commit-check.js')) {
      log.warning('Pre-commit hook already installed (contains reference to pre-commit-check.js)');
      log.info('To reinstall, delete .git/hooks/pre-commit and run this script again.');
      return { alreadyInstalled: true };
    } else {
      // Existing hook is not ours - back it up
      const backupPath = hookPath + '.backup-' + Date.now();
      log.warning(`Existing pre-commit hook found. Backing up to ${path.basename(backupPath)}`);
      fs.copyFileSync(hookPath, backupPath);
      log.success(`Backed up existing hook to ${backupPath}`);
    }
  }

  // Write the hook
  log.info('Installing pre-commit hook...');
  fs.writeFileSync(hookPath, getPreCommitHookContent(), { mode: 0o755 });

  // On Unix, ensure executable permission
  if (process.platform !== 'win32') {
    try {
      execSync(`chmod +x "${hookPath}"`, { stdio: 'ignore' });
      log.success('Made hook executable (chmod +x)');
    } catch (error) {
      log.warning('Could not chmod hook, but it may still work');
    }
  }

  log.success('Pre-commit hook installed successfully!');
  return { success: true };
}

/**
 * Verify installation
 */
function verifyInstallation() {
  log.info('Verifying installation...');

  const hookPath = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');

  // Check file exists
  if (!fs.existsSync(hookPath)) {
    log.error('Verification failed: .git/hooks/pre-commit does not exist');
    return false;
  }

  // Check file is readable
  try {
    const content = fs.readFileSync(hookPath, 'utf8');

    // Check contains our script reference
    if (!content.includes('scripts/pre-commit-check.js')) {
      log.error('Verification failed: Hook does not reference scripts/pre-commit-check.js');
      return false;
    }

    log.success('Hook file exists and contains correct script reference');
  } catch (error) {
    log.error(`Verification failed: Could not read hook file: ${error.message}`);
    return false;
  }

  // Check pre-commit-check.js exists
  const checkScriptPath = path.join(process.cwd(), 'scripts', 'pre-commit-check.js');
  if (!fs.existsSync(checkScriptPath)) {
    log.error('Verification failed: scripts/pre-commit-check.js not found');
    return false;
  }

  log.success('Check script exists at scripts/pre-commit-check.js');

  // Check project-map.json exists
  const projectMapPath = path.join(process.cwd(), 'project-map.json');
  if (!fs.existsSync(projectMapPath)) {
    log.error('Verification failed: project-map.json not found in repo root');
    return false;
  }

  log.success('Protection rules exist at project-map.json');

  // Validate project-map.json is valid JSON
  try {
    const content = fs.readFileSync(projectMapPath, 'utf8');
    JSON.parse(content);
    log.success('project-map.json is valid JSON');
  } catch (error) {
    log.error(`Verification failed: project-map.json is not valid JSON: ${error.message}`);
    return false;
  }

  // Test hook manually (dry run with no staged files)
  try {
    log.info('Running hook dry-run test...');
    execSync('node scripts/pre-commit-check.js', { stdio: 'pipe' });
    log.success('Hook executes without errors');
  } catch (error) {
    // Exit code 1 is ok (no staged files or protection block)
    // Exit code 2 is bad (configuration error)
    if (error.status === 2) {
      log.error('Verification failed: Hook execution returned configuration error');
      return false;
    }
    log.success('Hook executes (protection check functional)');
  }

  return true;
}

/**
 * Display next steps
 */
function displayNextSteps() {
  console.log(`\n${colors.bold}Installation Complete!${colors.reset}\n`);
  console.log('The file protection system is now active. Here\'s what to do next:\n');
  console.log(`${colors.cyan}1. Update .github/CODEOWNERS${colors.reset}`);
  console.log('   Replace @yourusername with your GitHub username or team name\n');
  console.log(`${colors.cyan}2. Configure GitHub branch protection${colors.reset}`);
  console.log('   Repository Settings → Branches → Add rule for "main" branch');
  console.log('   Enable: "Require review from Code Owners"\n');
  console.log(`${colors.cyan}3. Test the hook${colors.reset}`);
  console.log('   Try committing a change to a critical file (like CLAUDE.md)');
  console.log('   Expected: Hook should block the commit with a helpful message\n');
  console.log(`${colors.cyan}4. Educate your team${colors.reset}`);
  console.log('   Share docs/FILE_PROTECTION_SYSTEM.md with all contributors\n');
  console.log(`${colors.bold}Documentation:${colors.reset}`);
  console.log('   - docs/FILE_PROTECTION_SYSTEM.md (system overview)');
  console.log('   - CLAUDE.md (RULE 0: AI assistant protocol)');
  console.log('   - project-map.json (protection rules)\n');
  console.log(`${colors.bold}Quick Reference:${colors.reset}`);
  console.log('   - Check protected files: cat project-map.json');
  console.log('   - Test hook manually: node scripts/pre-commit-check.js');
  console.log('   - View hook logs: cat .git/protection-overrides.log\n');
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}${colors.cyan}Git Hooks Installer${colors.reset}`);
  console.log('Installing file protection pre-commit hook...\n');

  // Check we're in a git repo
  if (!isGitRepo()) {
    log.error('Not a git repository. Please run this script from the repo root.');
    log.info('If this is a new project, initialize git first: git init');
    process.exit(1);
  }

  log.success('Git repository detected');

  // Install hook
  try {
    const result = installPreCommitHook();

    if (result.alreadyInstalled) {
      console.log(`\n${colors.green}${colors.bold}✓ Hook already installed${colors.reset}\n`);
      console.log('No changes made. If you need to reinstall:');
      console.log('  1. rm .git/hooks/pre-commit');
      console.log('  2. npm run install-hooks\n');
      process.exit(0);
    }

  } catch (error) {
    log.error(`Failed to install hook: ${error.message}`);
    process.exit(1);
  }

  // Verify installation
  const verified = verifyInstallation();

  if (!verified) {
    console.log(`\n${colors.red}${colors.bold}Installation completed with warnings${colors.reset}\n`);
    console.log('The hook was written but verification failed.');
    console.log('Please review the errors above and fix any issues.\n');
    process.exit(1);
  }

  // Generate protection system checksums
  console.log(`\n${colors.bold}Generating protection system checksums...${colors.reset}\n`);
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/verify-protection-integrity.cjs --generate', { stdio: 'inherit' });
  } catch (error) {
    log.warning('Failed to generate checksums, but hook installation succeeded');
  }

  // Display next steps
  displayNextSteps();

  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { installPreCommitHook, verifyInstallation };
