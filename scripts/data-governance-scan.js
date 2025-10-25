#!/usr/bin/env node

/**
 * Data Governance Scan Script
 *
 * Enforces governance rules on high-sensitivity content (visa/immigration, AI ethics, funding)
 * Validates BOTH English and Spanish content for:
 * - Required disclaimers in HTML
 * - lastReviewed field in JSON twins
 * - Conservative, factual language (no guarantees/promises)
 *
 * Usage: npm run data-governance-scan
 *
 * Spanish Academic 2026
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// High-sensitivity topic patterns
const SENSITIVE_TOPICS = {
  visa_immigration: {
    keywords: [
      /\bvisa\b/i,
      /\bimmigration\b/i,
      /\bf-1\b/i,
      /\bj-1\b/i,
      /\bopt\b/i,
      /\bcpt\b/i,
      /\buscis\b/i,
      /\bwork authorization\b/i,
      /\bwork permit\b/i,
      /\bgreen card\b/i,
      /\bpermanent resident\b/i,
      /\bstem opt\b/i,
    ],
    requiredDisclaimer: /not legal advice|not immigration advice|consult.*immigration attorney|consult.*lawyer/i,
    name: 'Visa/Immigration',
  },
  ai_ethics: {
    keywords: [
      /\bai ethics\b/i,
      /\bartificial intelligence.*ethics\b/i,
      /\bchatgpt\b/i,
      /\bgpt-\d/i,
      /\bclaude\b/i,
      /\bllm\b/i,
      /\blarge language model/i,
      /\bacademic integrity.*ai\b/i,
      /\bplagiarism.*ai\b/i,
      /\bai.*disclosure\b/i,
    ],
    requiredDisclaimer: /ai policies vary|check.*institutional policy|verify.*university.*ai policy|consult.*instructor/i,
    name: 'AI Ethics/Disclosure',
  },
  funding_guarantees: {
    keywords: [
      /\bguaranteed funding\b/i,
      /\bfull funding\b/i,
      /\bstipend guarantee\b/i,
      /\btuition waiver\b/i,
      /\bfellowship guarantee\b/i,
    ],
    requiredDisclaimer: /subject to change|verify.*current|contact.*department|not guaranteed|may vary/i,
    name: 'Funding Guarantees',
  },
  academic_integrity: {
    keywords: [
      /\bacademic integrity\b/i,
      /\bacademic dishonesty\b/i,
      /\bplagiarism policy\b/i,
      /\bcheating\b/i,
      /\bmisconduct\b/i,
    ],
    requiredDisclaimer: /consult.*code of conduct|verify.*institutional policy|check.*honor code/i,
    name: 'Academic Integrity',
  },
};

// Prohibited language patterns (promises/guarantees)
const PROHIBITED_PATTERNS = [
  { pattern: /\bguarantees? (that |you |admission|acceptance|funding)/i, message: 'Prohibited guarantee language' },
  { pattern: /\bpromises? (that |you |to |admission|acceptance)/i, message: 'Prohibited promise language' },
  { pattern: /\bwill (definitely|certainly|surely) (get|receive|be admitted)/i, message: 'Prohibited certainty language' },
  { pattern: /\b100% (chance|guaranteed|certain)/i, message: 'Prohibited absolute language' },
  { pattern: /\byou will be admitted\b/i, message: 'Prohibited admission guarantee' },
  { pattern: /\byou will receive funding\b/i, message: 'Prohibited funding guarantee' },
];

// Track statistics
let pagesProcessed = 0;
let errorCount = 0;
let warningCount = 0;
let sensitiveContentFound = 0;

/**
 * Detect if content contains sensitive topics
 */
function detectSensitiveTopics(text) {
  const detected = [];

  for (const [key, topic] of Object.entries(SENSITIVE_TOPICS)) {
    const hasKeyword = topic.keywords.some(pattern => pattern.test(text));
    if (hasKeyword) {
      detected.push({ key, ...topic });
    }
  }

  return detected;
}

/**
 * Check for prohibited language patterns
 */
function checkProhibitedLanguage(text) {
  const violations = [];

  for (const { pattern, message } of PROHIBITED_PATTERNS) {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      violations.push({
        message,
        snippet: match ? match[0] : 'match found',
      });
    }
  }

  return violations;
}

/**
 * Validate a single HTML file and its JSON twin
 */
function validateFile(htmlPath) {
  const relPath = relative(PUBLIC_DIR, htmlPath);

  try {
    const html = readFileSync(htmlPath, 'utf-8');
    const $ = load(html);

    // Get text content for analysis
    const bodyText = $('main, article, body').text();

    const errors = [];
    const warnings = [];

    // Detect sensitive topics
    const sensitiveTopics = detectSensitiveTopics(bodyText);

    if (sensitiveTopics.length === 0) {
      // No sensitive content, skip validation
      pagesProcessed++;
      return null;
    }

    sensitiveContentFound++;

    // Check for prohibited language
    const prohibited = checkProhibitedLanguage(bodyText);
    if (prohibited.length > 0) {
      prohibited.forEach(({ message, snippet }) => {
        errors.push(`${message}: "${snippet}"`);
      });
    }

    // For each sensitive topic, verify disclaimer exists
    sensitiveTopics.forEach(topic => {
      const hasDisclaimer = topic.requiredDisclaimer.test(bodyText);
      if (!hasDisclaimer) {
        errors.push(`Missing required disclaimer for ${topic.name}`);
      }
    });

    // Check for JSON twin
    const jsonPath = htmlPath.replace(/\.html$/, '.json');

    if (!existsSync(jsonPath)) {
      errors.push('Missing JSON twin (required for governance tracking)');
    } else {
      try {
        const jsonContent = JSON.parse(readFileSync(jsonPath, 'utf-8'));

        // Check for lastReviewed field
        if (!jsonContent.lastReviewed) {
          errors.push('Missing "lastReviewed" field in JSON twin (required for sensitive content)');
        } else {
          // Validate date format (ISO 8601)
          const datePattern = /^\d{4}-\d{2}-\d{2}$/;
          if (!datePattern.test(jsonContent.lastReviewed)) {
            errors.push(`Invalid "lastReviewed" format: "${jsonContent.lastReviewed}" (expected YYYY-MM-DD)`);
          } else {
            // Check if date is too old (> 1 year)
            const reviewDate = new Date(jsonContent.lastReviewed);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            if (reviewDate < oneYearAgo) {
              warnings.push(`Content not reviewed in over 1 year (lastReviewed: ${jsonContent.lastReviewed})`);
            }
          }
        }

        // Check for legalSensitivity or governanceSensitivity flag
        if (!jsonContent.legalSensitivity && !jsonContent.governanceSensitivity) {
          warnings.push('Missing governance sensitivity flag in JSON twin (recommended for tracking)');
        }

      } catch (jsonError) {
        errors.push(`Error parsing JSON twin: ${jsonError.message}`);
      }
    }

    pagesProcessed++;

    // Report errors and warnings
    if (errors.length > 0) {
      console.error(`\n❌ ${relPath}`);
      sensitiveTopics.forEach(topic => {
        console.error(`   📋 Sensitive Topic: ${topic.name}`);
      });
      errors.forEach(err => console.error(`   • ${err}`));
      errorCount += errors.length;
    }

    if (warnings.length > 0) {
      console.warn(`\n⚠️  ${relPath}`);
      sensitiveTopics.forEach(topic => {
        console.warn(`   📋 Sensitive Topic: ${topic.name}`);
      });
      warnings.forEach(warn => console.warn(`   • ${warn}`));
      warningCount += warnings.length;
    }

    return {
      filePath: htmlPath,
      relPath,
      sensitiveTopics,
      errors,
      warnings,
    };

  } catch (error) {
    console.error(`\n❌ Error processing ${relPath}: ${error.message}`);
    errorCount++;
    return null;
  }
}

/**
 * Check bilingual parity for sensitive content
 */
function checkBilingualParity(enResults, esResults) {
  console.log('\n' + '='.repeat(60));
  console.log('🌐 Checking Bilingual Governance Parity\n');

  const parityErrors = [];

  // Build map of English sensitive pages
  const enSensitivePages = new Map();
  enResults.forEach(result => {
    if (result && result.sensitiveTopics.length > 0) {
      // Get corresponding Spanish path
      const enRelPath = relative(PUBLIC_DIR, result.filePath);
      enSensitivePages.set(enRelPath, result);
    }
  });

  // Build map of Spanish sensitive pages
  const esSensitivePages = new Map();
  esResults.forEach(result => {
    if (result && result.sensitiveTopics.length > 0) {
      const esRelPath = relative(PUBLIC_DIR, result.filePath);
      // Remove 'es/' prefix to compare with English
      const normalizedPath = esRelPath.replace(/^es[/\\]/, '');
      esSensitivePages.set(normalizedPath, result);
    }
  });

  // Check for English pages without Spanish governance
  enSensitivePages.forEach((result, enPath) => {
    if (!esSensitivePages.has(enPath)) {
      console.error(`❌ English sensitive content without Spanish governance: ${enPath}`);
      parityErrors.push(`Missing Spanish governance for: ${enPath}`);
    }
  });

  // Check for Spanish pages without English governance
  esSensitivePages.forEach((result, normalizedPath) => {
    if (!enSensitivePages.has(normalizedPath)) {
      console.error(`❌ Spanish sensitive content without English governance: es/${normalizedPath}`);
      parityErrors.push(`Missing English governance for: es/${normalizedPath}`);
    }
  });

  if (parityErrors.length === 0) {
    console.log('✅ Bilingual governance parity maintained');
  } else {
    console.log(`\n❌ ${parityErrors.length} parity violation(s) found`);
  }

  return parityErrors;
}

/**
 * Main execution
 */
async function main() {
  console.log('🛡️  Data Governance Scan\n');
  console.log('='.repeat(60));
  console.log('Scanning for high-sensitivity content:');
  console.log('  • Visa/Immigration');
  console.log('  • AI Ethics/Disclosure');
  console.log('  • Funding Guarantees');
  console.log('  • Academic Integrity\n');
  console.log('='.repeat(60));

  // Find all HTML files
  const allFiles = await glob('**/*.html', {
    cwd: PUBLIC_DIR,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  if (allFiles.length === 0) {
    console.log('⚠️  No HTML files found in /public/');
    return;
  }

  // Separate English and Spanish files
  const enFiles = allFiles.filter(f => {
    const relPath = relative(PUBLIC_DIR, f);
    return !relPath.startsWith('es/') && !relPath.startsWith('es\\');
  });
  const esFiles = allFiles.filter(f => {
    const relPath = relative(PUBLIC_DIR, f);
    return relPath.startsWith('es/') || relPath.startsWith('es\\');
  });

  console.log(`\nFound ${allFiles.length} HTML file(s)`);
  console.log(`  • English: ${enFiles.length} file(s)`);
  console.log(`  • Spanish: ${esFiles.length} file(s)\n`);

  console.log('Validating governance compliance...\n');

  // Validate English files
  const enResults = [];
  for (const filePath of enFiles) {
    const result = validateFile(filePath);
    enResults.push(result);
  }

  // Validate Spanish files
  const esResults = [];
  for (const filePath of esFiles) {
    const result = validateFile(filePath);
    esResults.push(result);
  }

  // Check bilingual parity
  const parityErrors = checkBilingualParity(enResults, esResults);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`📄 Total pages scanned: ${allFiles.length}`);
  console.log(`🛡️  Sensitive content found: ${sensitiveContentFound} page(s)`);
  console.log(`❌ Errors: ${errorCount + parityErrors.length}`);
  console.log(`⚠️  Warnings: ${warningCount}`);

  // Categorize results
  const allResults = [...enResults, ...esResults].filter(r => r !== null);
  const passedPages = allResults.filter(r => r.errors.length === 0 && r.warnings.length === 0);
  const warningPages = allResults.filter(r => r.errors.length === 0 && r.warnings.length > 0);
  const errorPages = allResults.filter(r => r.errors.length > 0);

  if (sensitiveContentFound > 0) {
    console.log(`\n✅ Passed governance: ${passedPages.length} page(s)`);
    console.log(`⚠️  Warnings only: ${warningPages.length} page(s)`);
    console.log(`❌ Governance errors: ${errorPages.length} page(s)`);
  }

  if (errorCount > 0 || parityErrors.length > 0) {
    console.log('\n❌ Data governance validation FAILED');
    console.log('💡 Fix errors before deployment to ensure compliance with RULE 3');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n⚠️  Data governance validation passed with warnings');
    console.log('💡 Review warnings to improve governance quality');
  } else if (sensitiveContentFound === 0) {
    console.log('\n✅ No sensitive content found - governance scan complete');
  } else {
    console.log('\n✅ All data governance checks passed!');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
