#!/usr/bin/env node

/**
 * List Localization Parity Designations
 *
 * Display all parity designations with filtering options
 *
 * Usage:
 *   npm run parity:list                    # All designations
 *   npm run parity:list -- --parity false  # Only NON-PARITY pages
 *   npm run parity:list -- --parity true   # Only PARITY pages
 */

import { readFileSync, existsSync } from 'fs';
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

const parityFilter = getArg('parity');

console.log('\n' + '='.repeat(80));
console.log('LOCALIZATION PARITY DESIGNATIONS');
console.log('='.repeat(80) + '\n');

// Read tracking file
if (!existsSync(TRACKER_FILE)) {
  console.log('ℹ️  No parity designations found.');
  console.log('   All pages use default PARITY behavior (bilingual required)\n');
  console.log('To designate a page:');
  console.log('  npm run parity:designate -- --path "/page.html" --parity false --reason "..." --language "es"\n');
  process.exit(0);
}

const content = readFileSync(TRACKER_FILE, 'utf-8');
const lines = content
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('#'));

if (lines.length === 0) {
  console.log('ℹ️  No parity designations found.');
  console.log('   All pages use default PARITY behavior (bilingual required)\n');
  process.exit(0);
}

const entries = lines.map(line => JSON.parse(line));

// Filter if requested
let filtered = entries;
if (parityFilter !== null) {
  const filterValue = parityFilter === 'true';
  filtered = entries.filter(e => e.parity === filterValue);
}

// Count by parity status
const parityCount = entries.filter(e => e.parity).length;
const nonParityCount = entries.filter(e => !e.parity).length;

console.log(`Total Designations: ${entries.length}`);
console.log(`  ✅ PARITY (bilingual): ${parityCount}`);
console.log(`  🔀 NON-PARITY (single language): ${nonParityCount}`);

if (parityFilter !== null) {
  console.log(`\nFiltered to: ${parityFilter === 'true' ? 'PARITY only' : 'NON-PARITY only'}`);
}

console.log('\n' + '-'.repeat(80) + '\n');

// Display entries
filtered.forEach(entry => {
  const icon = entry.parity ? '✅' : '🔀';
  const status = entry.parity ? 'PARITY' : 'NON-PARITY';

  console.log(`${icon} ${status}: ${entry.path}`);

  if (!entry.parity) {
    console.log(`   Reason: ${entry.reason}`);
    console.log(`   Language: ${entry.language}`);
  }

  console.log(`   Decided: ${new Date(entry.decidedAt).toLocaleString()}`);
  console.log(`   Decided By: ${entry.decidedBy}`);
  console.log('');
});

console.log('-'.repeat(80) + '\n');

// Summary by reason (for NON-PARITY)
if (nonParityCount > 0) {
  console.log('NON-PARITY Reasons:');
  const reasonCounts = {};
  entries.filter(e => !e.parity).forEach(e => {
    reasonCounts[e.reason] = (reasonCounts[e.reason] || 0) + 1;
  });

  Object.entries(reasonCounts).forEach(([reason, count]) => {
    console.log(`  - ${reason}: ${count}`);
  });
  console.log('');
}

console.log('='.repeat(80) + '\n');
