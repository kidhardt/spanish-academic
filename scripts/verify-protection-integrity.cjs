#!/usr/bin/env node

/**
 * Protection System Integrity Verifier
 *
 * Verifies that critical protection system files haven't been tampered with.
 * Uses SHA-256 checksums to detect local modifications.
 *
 * Usage:
 *   npm run verify-protection-integrity
 *   OR
 *   node scripts/verify-protection-integrity.js
 *
 * Checksums are stored in .claude/data/protection-checksums.json
 * This file is generated during hook installation and updated on legitimate changes.
 *
 * Exit codes:
 *   0 = All files have valid checksums
 *   1 = Tampering detected
 *   2 = Configuration error
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
 * Calculate SHA-256 hash of a file
 */
function calculateChecksum(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Get list of files to check
 */
function getProtectedFiles() {
  return [
    'project-map.json',
    'scripts/pre-commit-check.js',
    'scripts/install-git-hooks.js',
    'scripts/ci-protection-check.cjs',
    'scripts/validate-project-map-schema.cjs',
    'scripts/verify-protection-integrity.cjs',
    '.github/CODEOWNERS'
  ];
}

/**
 * Load stored checksums
 */
function loadStoredChecksums() {
  const checksumsPath = path.join(process.cwd(), '.claude', 'data', 'protection-checksums.json');

  if (!fs.existsSync(checksumsPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(checksumsPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log.warning(`Could not load checksums: ${error.message}`);
    return null;
  }
}

/**
 * Save checksums
 */
function saveChecksums(checksums) {
  const dataDir = path.join(process.cwd(), '.claude', 'data');
  const checksumsPath = path.join(dataDir, 'protection-checksums.json');

  // Ensure directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const data = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    checksums: checksums
  };

  fs.writeFileSync(checksumsPath, JSON.stringify(data, null, 2));
}

/**
 * Generate fresh checksums
 */
function generateChecksums() {
  log.info('Generating fresh checksums for protection system files...\n');

  const files = getProtectedFiles();
  const checksums = {};
  let generated = 0;

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);

    if (fs.existsSync(filePath)) {
      const hash = calculateChecksum(filePath);
      checksums[file] = hash;
      log.success(`${file}: ${hash.substring(0, 12)}...`);
      generated++;
    } else {
      log.warning(`${file}: File not found (skipped)`);
    }
  }

  console.log(`\n${colors.green}Generated ${generated} checksum(s)${colors.reset}\n`);

  saveChecksums(checksums);
  log.success('Checksums saved to .claude/data/protection-checksums.json');

  return checksums;
}

/**
 * Verify checksums
 */
function verifyChecksums() {
  log.info('Verifying protection system integrity...\n');

  const storedData = loadStoredChecksums();

  if (!storedData || !storedData.checksums) {
    log.warning('No stored checksums found. Generating fresh checksums...\n');
    generateChecksums();
    log.info('\nRun this command again to verify against the newly generated checksums.');
    return { verified: true, firstRun: true };
  }

  const storedChecksums = storedData.checksums;
  const files = getProtectedFiles();

  const mismatches = [];
  const missing = [];
  let verified = 0;

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
      if (storedChecksums[file]) {
        missing.push(file);
        log.error(`${file}: MISSING (was present when checksums generated)`);
      } else {
        log.info(`${file}: Not found (expected)`);
      }
      continue;
    }

    const currentHash = calculateChecksum(filePath);
    const storedHash = storedChecksums[file];

    if (!storedHash) {
      log.warning(`${file}: No stored checksum (new file?)`);
      continue;
    }

    if (currentHash !== storedHash) {
      mismatches.push({
        file,
        stored: storedHash.substring(0, 12),
        current: currentHash.substring(0, 12)
      });
      log.error(`${file}: MODIFIED (checksum mismatch)`);
    } else {
      log.success(`${file}: OK`);
      verified++;
    }
  }

  console.log();

  const tampering = mismatches.length > 0 || missing.length > 0;

  if (tampering) {
    log.error(`${colors.bold}TAMPERING DETECTED${colors.reset}\n`);

    if (mismatches.length > 0) {
      console.error(`${colors.red}Modified files (${mismatches.length}):${colors.reset}`);
      mismatches.forEach(m => {
        console.error(`  - ${m.file}`);
        console.error(`    Stored:  ${m.stored}...`);
        console.error(`    Current: ${m.current}...`);
      });
      console.error();
    }

    if (missing.length > 0) {
      console.error(`${colors.red}Missing files (${missing.length}):${colors.reset}`);
      missing.forEach(f => console.error(`  - ${f}`));
      console.error();
    }

    console.error(`${colors.yellow}Possible causes:${colors.reset}`);
    console.error(`  1. Legitimate update: If you intentionally modified protection files, regenerate checksums:`);
    console.error(`     node scripts/verify-protection-integrity.js --generate`);
    console.error(`  2. Malicious tampering: Someone bypassed protection to weaken guardrails`);
    console.error(`  3. Git merge/rebase: Checksums may be stale after merging changes\n`);

    return { verified: false, mismatches, missing };
  }

  log.success(`${colors.bold}All ${verified} protection files verified${colors.reset}`);
  log.info(`Last checksum update: ${storedData.lastUpdated}`);

  return { verified: true };
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}${colors.bold}Protection System Integrity Verifier${colors.reset}\n`);

  // Check for --generate flag
  if (process.argv.includes('--generate')) {
    generateChecksums();
    console.log(`\n${colors.green}✓ Checksums generated successfully${colors.reset}`);
    console.log(`${colors.yellow}Note:${colors.reset} Commit .claude/data/protection-checksums.json to version control.\n`);
    process.exit(0);
  }

  // Verify checksums
  const result = verifyChecksums();

  if (result.firstRun) {
    console.log(`\n${colors.cyan}${colors.bold}First Run${colors.reset}`);
    console.log(`Checksums have been generated. Future runs will verify against these checksums.\n`);
    process.exit(0);
  }

  if (!result.verified) {
    console.log(`\n${colors.red}${colors.bold}INTEGRITY CHECK FAILED${colors.reset}\n`);
    process.exit(1);
  }

  console.log(`\n${colors.green}${colors.bold}✓ Integrity check passed${colors.reset}\n`);
  process.exit(0);
}

// Run
if (require.main === module) {
  main();
}

module.exports = { calculateChecksum, verifyChecksums, generateChecksums };
