#!/usr/bin/env node

/**
 * Designate Localization Parity Status
 *
 * Manually designate a page as PARITY or NON-PARITY
 *
 * Usage:
 *   npm run parity:designate -- --path "/scholarship/article.html" --parity false --reason "scholarly-article-original-language" --language "es"
 *   npm run parity:designate -- --path "/insights/article.html" --parity true
 */

import { appendFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRACKER_FILE = join(__dirname, '..', '..', '.claude', 'data', 'localization-parity.jsonl');

// Parse command-line arguments
const args = process.argv.slice(2);

function getArg(name) {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

let path = getArg('path');
const parityStr = getArg('parity');
const reason = getArg('reason');
const language = getArg('language');

// Normalize path: ensure it starts with / and has no backslashes
if (path) {
  path = path.replace(/\\/g, '/'); // Convert backslashes to forward slashes
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
}

// Validation
if (!path) {
  console.error('❌ Error: --path is required');
  console.log('\nUsage:');
  console.log('  npm run parity:designate -- --path "/scholarship/article.html" --parity false --reason "scholarly-article-original-language" --language "es"');
  process.exit(1);
}

if (parityStr === null) {
  console.error('❌ Error: --parity is required (true or false)');
  process.exit(1);
}

const parity = parityStr === 'true';

if (!parity && !reason) {
  console.error('❌ Error: --reason is required for NON-PARITY designation');
  console.log('\nValid reasons:');
  console.log('  - scholarly-article-original-language');
  console.log('  - language-specific-content');
  console.log('  - cultural-specific-resource');
  console.log('  - original-publication');
  process.exit(1);
}

if (!parity && !language) {
  console.error('❌ Error: --language is required for NON-PARITY designation (en or es)');
  process.exit(1);
}

// Validate reason
const validReasons = [
  'scholarly-article-original-language',
  'language-specific-content',
  'cultural-specific-resource',
  'original-publication',
];

if (!parity && !validReasons.includes(reason)) {
  console.error(`❌ Error: Invalid reason "${reason}"`);
  console.log('\nValid reasons:');
  validReasons.forEach(r => console.log(`  - ${r}`));
  process.exit(1);
}

// Create tracking entry
const entry = {
  path,
  parity,
  reason: parity ? null : reason,
  language: parity ? null : language,
  decidedBy: 'user',
  decidedAt: new Date().toISOString(),
};

// Append to tracking file
const line = JSON.stringify(entry) + '\n';
appendFileSync(TRACKER_FILE, line, 'utf-8');

console.log('\n✅ Parity designation recorded\n');
console.log(`   Path: ${path}`);
console.log(`   Parity: ${parity ? 'YES (bilingual required)' : 'NO (single language)'}`);
if (!parity) {
  console.log(`   Reason: ${reason}`);
  console.log(`   Language: ${language}`);
}
console.log(`   Decided: ${entry.decidedAt}`);
console.log(`   Decided By: user`);
console.log('\n📝 Next Steps:\n');

if (!parity) {
  console.log(`1. Add metadata to ${path}:`);
  console.log('   <meta name="localization_parity" content="false">');
  console.log(`   <meta name="parity_reason" content="${reason}">`);
  console.log(`   <meta name="page_language" content="${language}">\n`);
  console.log('2. Validation will skip bilingual checks for this page\n');
} else {
  console.log(`1. Ensure ${path} has bilingual counterpart`);
  console.log('2. Add standard parity metadata (path_en, path_es, hreflang)\n');
}

console.log('3. Run: npm run validate-localization\n');
