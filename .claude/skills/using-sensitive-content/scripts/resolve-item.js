#!/usr/bin/env node

/**
 * Resolve Sensitive Content Tracking Item
 *
 * Marks a tracking item as resolved with commit hash and notes
 *
 * Usage:
 *   npm run sensitive-content:resolve SC-001 -- \
 *     --commit "abc123def" \
 *     --note "Added financial disclaimer and verified amounts"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRACKER_FILE = join(__dirname, '..', 'data', 'sensitive-content-tracker.jsonl');

// Parse command-line arguments
const args = process.argv.slice(2);
const itemId = args[0];

const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};

const commitHash = getArg('--commit');
const note = getArg('--note');

// Validation
if (!itemId || !itemId.match(/^SC-\d{3}$/)) {
  console.error('❌ Error: Valid item ID required (e.g., SC-001)');
  console.error('Usage: npm run sensitive-content:resolve SC-001 -- --commit abc123 --note "Fixed"');
  process.exit(1);
}

if (!commitHash) {
  console.error('❌ Error: --commit is required');
  console.error('   Provide the git commit hash where this item was resolved');
  process.exit(1);
}

if (!commitHash.match(/^[a-f0-9]{7,40}$/)) {
  console.error('❌ Error: Invalid commit hash format');
  console.error('   Expected 7-40 hexadecimal characters');
  process.exit(1);
}

// Read items
if (!existsSync(TRACKER_FILE)) {
  console.error('❌ Error: No tracking items found');
  process.exit(1);
}

const content = readFileSync(TRACKER_FILE, 'utf-8');
const lines = content.trim().split('\n').filter(line => line.trim());
const items = lines.map(line => JSON.parse(line));

// Find item
const itemIndex = items.findIndex(item => item.id === itemId);

if (itemIndex === -1) {
  console.error(`❌ Error: Item ${itemId} not found`);
  console.error('   Run: npm run sensitive-content:list to see all items');
  process.exit(1);
}

const item = items[itemIndex];

// Check if already resolved
if (item.status === 'resolved') {
  console.error(`❌ Error: Item ${itemId} is already resolved`);
  console.error(`   Resolved at: ${item.resolvedAt}`);
  console.error(`   Resolved by: ${item.resolvedBy}`);
  console.error(`   Commit: ${item.assignedCommit}`);
  process.exit(1);
}

// Update item
item.status = 'resolved';
item.assignedCommit = commitHash;
item.resolvedAt = new Date().toISOString();
item.resolvedBy = 'Claude Code'; // Could be parameterized

if (note) {
  item.notes.push({
    timestamp: new Date().toISOString(),
    author: 'Claude Code',
    content: note
  });
}

// Write back
items[itemIndex] = item;
const newContent = items.map(item => JSON.stringify(item)).join('\n') + '\n';
writeFileSync(TRACKER_FILE, newContent, 'utf-8');

console.log(`✅ Resolved item: ${itemId}`);
console.log(`   File: ${item.filePath}`);
console.log(`   Commit: ${commitHash}`);
if (note) {
  console.log(`   Note: ${note}`);
}

// Check if any blocking items remain
const remainingBlocking = items.filter(i => i.blocksDeployment && i.status !== 'resolved');

if (remainingBlocking.length > 0) {
  console.log(`\n⚠️  ${remainingBlocking.length} blocking item(s) still pending`);
  console.log('   Run: npm run sensitive-content:list --blocking-only');
} else {
  console.log('\n✅ No blocking items remain - ready for deployment validation');
  console.log('   Run: npm run sensitive-content:validate --strict');
}
