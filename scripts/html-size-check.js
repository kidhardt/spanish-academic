#!/usr/bin/env node

/**
 * HTML Size Check
 *
 * Enforces lightweight initial HTML payload (<50KB uncompressed)
 * Scans /public/ for all HTML files and reports size violations
 *
 * Why 50KB?
 * - Mobile-first constraint: fast initial page load on slow connections
 * - Critical rendering path: HTML should load in <1 second on 3G
 * - Separate from JavaScript bundle limit (250KB)
 * - Forces disciplined content structure
 *
 * Spanish Academic 2026
 * Bead: spanish-academic-68
 */

import { readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// Configuration
const MAX_HTML_SIZE_KB = 50;
const MAX_HTML_SIZE_BYTES = MAX_HTML_SIZE_KB * 1024;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

/**
 * Format file size in human-readable format
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)}KB`;
}

/**
 * Check HTML file size
 */
function checkHtmlSize(filePath) {
  const stats = statSync(filePath);
  const sizeBytes = stats.size;
  const sizeKB = sizeBytes / 1024;
  const relativePath = relative(PUBLIC_DIR, filePath);

  return {
    path: relativePath,
    sizeBytes,
    sizeKB,
    exceedsLimit: sizeBytes > MAX_HTML_SIZE_BYTES,
    percentOfLimit: (sizeBytes / MAX_HTML_SIZE_BYTES) * 100,
  };
}

/**
 * Main validation function
 */
async function validateHtmlSizes() {
  console.log(
    `${colors.cyan}HTML Size Check${colors.reset} - Enforcing <${MAX_HTML_SIZE_KB}KB payload\n`
  );

  // Find all HTML files in /public/
  const htmlFiles = await glob('**/*.html', {
    cwd: PUBLIC_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/assets/**'],
  });

  if (htmlFiles.length === 0) {
    console.log(
      `${colors.yellow}⚠ No HTML files found in /public/${colors.reset}\n`
    );
    console.log('This is expected if templates haven\'t been created yet.');
    process.exit(0);
  }

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Check each file
  const results = htmlFiles.map((file) => checkHtmlSize(file));

  // Separate violations from compliant files
  const violations = results.filter((r) => r.exceedsLimit);
  const compliant = results.filter((r) => !r.exceedsLimit);

  // Report violations
  if (violations.length > 0) {
    console.log(
      `${colors.red}❌ HTML Size Violations (${violations.length} files exceed ${MAX_HTML_SIZE_KB}KB):${colors.reset}\n`
    );

    violations
      .sort((a, b) => b.sizeBytes - a.sizeBytes)
      .forEach((result) => {
        const overage = result.sizeKB - MAX_HTML_SIZE_KB;
        console.log(
          `  ${colors.red}✗${colors.reset} ${result.path}: ${colors.red}${formatSize(result.sizeBytes)}${colors.reset} (${overage.toFixed(2)}KB over limit, ${result.percentOfLimit.toFixed(1)}% of budget)`
        );
      });

    console.log('');
  }

  // Report compliant files (summary only)
  if (compliant.length > 0) {
    console.log(
      `${colors.green}✓ Compliant files: ${compliant.length}${colors.reset}`
    );

    // Show largest compliant files
    const largestCompliant = compliant
      .sort((a, b) => b.sizeBytes - a.sizeBytes)
      .slice(0, 5);

    if (largestCompliant.length > 0) {
      console.log(`\n${colors.gray}Largest compliant files:${colors.reset}`);
      largestCompliant.forEach((result) => {
        console.log(
          `  ${colors.gray}${result.path}: ${formatSize(result.sizeBytes)} (${result.percentOfLimit.toFixed(1)}% of budget)${colors.reset}`
        );
      });
    }
  }

  // Summary statistics
  const totalSize = results.reduce((sum, r) => sum + r.sizeBytes, 0);
  const avgSize = totalSize / results.length;
  const maxSize = Math.max(...results.map((r) => r.sizeBytes));

  console.log(`\n${colors.cyan}Statistics:${colors.reset}`);
  console.log(`  Total files: ${results.length}`);
  console.log(`  Total size: ${formatSize(totalSize)}`);
  console.log(`  Average size: ${formatSize(avgSize)}`);
  console.log(`  Largest file: ${formatSize(maxSize)}`);
  console.log(`  Budget limit: ${MAX_HTML_SIZE_KB}KB per file`);

  // Recommendations if violations exist
  if (violations.length > 0) {
    console.log(`\n${colors.yellow}Recommendations:${colors.reset}`);
    console.log(
      `  1. ${colors.gray}Remove inline CSS - use external stylesheets${colors.reset}`
    );
    console.log(
      `  2. ${colors.gray}Remove inline JavaScript - use external scripts${colors.reset}`
    );
    console.log(
      `  3. ${colors.gray}Minimize HTML comments and whitespace${colors.reset}`
    );
    console.log(
      `  4. ${colors.gray}Split long pages into multiple pages with pagination${colors.reset}`
    );
    console.log(
      `  5. ${colors.gray}Move repetitive content to shared components${colors.reset}`
    );
    console.log(
      `  6. ${colors.gray}Lazy-load below-the-fold content${colors.reset}`
    );

    console.log(
      `\n${colors.red}❌ HTML size check FAILED${colors.reset} - ${violations.length} file(s) exceed ${MAX_HTML_SIZE_KB}KB\n`
    );
    process.exit(1);
  }

  console.log(
    `\n${colors.green}✅ HTML size check PASSED${colors.reset} - All files under ${MAX_HTML_SIZE_KB}KB\n`
  );
  process.exit(0);
}

// Run validation
validateHtmlSizes().catch((error) => {
  console.error(`${colors.red}Error during HTML size check:${colors.reset}`, error);
  process.exit(1);
});
