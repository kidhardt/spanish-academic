#!/usr/bin/env node

/**
 * List Sensitive Content Tracking Items
 *
 * Displays all tracked items with filtering options
 *
 * Usage:
 *   npm run sensitive-content:list                    # All items
 *   npm run sensitive-content:list -- --blocking-only # Only items that block deployment
 *   npm run sensitive-content:list -- --severity high # Only high severity
 *   npm run sensitive-content:list -- --status pending # Only pending items
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRACKER_FILE = join(__dirname, '..', 'data', 'sensitive-content-tracker.jsonl');

// Parse command-line arguments
const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};
const hasFlag = (flag) => args.includes(flag);

const blockingOnly = hasFlag('--blocking-only');
const severityFilter = getArg('--severity');
const statusFilter = getArg('--status');

// Read items
if (!existsSync(TRACKER_FILE)) {
  console.log('✅ No sensitive content tracking items found.');
  console.log('   All clear!');
  process.exit(0);
}

const content = readFileSync(TRACKER_FILE, 'utf-8');
const lines = content.trim().split('\n').filter(line => line.trim());

if (lines.length === 0) {
  console.log('✅ No sensitive content tracking items found.');
  console.log('   All clear!');
  process.exit(0);
}

let items = lines.map(line => JSON.parse(line));

// Apply filters
if (blockingOnly) {
  items = items.filter(item => item.blocksDeployment);
}

if (severityFilter) {
  items = items.filter(item => item.severity === severityFilter);
}

if (statusFilter) {
  items = items.filter(item => item.status === statusFilter);
}

if (items.length === 0) {
  console.log('✅ No items match the specified filters.');
  process.exit(0);
}

// Display header
console.log('\n' + '='.repeat(80));
console.log('SENSITIVE CONTENT TRACKING ITEMS');
console.log('='.repeat(80) + '\n');

// Group by status
const pending = items.filter(i => i.status === 'pending');
const inProgress = items.filter(i => i.status === 'in-progress');
const resolved = items.filter(i => i.status === 'resolved');
const deferred = items.filter(i => i.status === 'deferred');

const blocking = items.filter(i => i.blocksDeployment && i.status !== 'resolved');

// Summary
console.log(`Total Items: ${items.length}`);
console.log(`  Pending: ${pending.length}`);
console.log(`  In Progress: ${inProgress.length}`);
console.log(`  Resolved: ${resolved.length}`);
console.log(`  Deferred: ${deferred.length}`);

if (blocking.length > 0) {
  console.log(`\n⚠️  ${blocking.length} item(s) BLOCK DEPLOYMENT`);
}

console.log('\n' + '-'.repeat(80) + '\n');

// Helper to truncate file paths
const truncatePath = (path, maxLen = 45) => {
  if (path.length <= maxLen) return path;
  const parts = path.split('/');
  if (parts.length <= 2) return '...' + path.slice(-maxLen);

  // Show first and last parts
  return parts[0] + '/.../' + parts[parts.length - 1];
};

// Helper for status emoji
const statusEmoji = (status) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'in-progress': return '🔄';
    case 'resolved': return '✅';
    case 'deferred': return '⏸️';
    default: return '❓';
  }
};

// Helper for severity color/emoji
const severityEmoji = (severity) => {
  switch (severity) {
    case 'blocker': return '🚫';
    case 'high': return '⚠️';
    case 'medium': return '🔶';
    case 'low': return 'ℹ️';
    default: return '❓';
  }
};

// Display items
items.forEach(item => {
  const statusIcon = statusEmoji(item.status);
  const severityIcon = severityEmoji(item.severity);
  const blocksIcon = item.blocksDeployment ? '🔒' : '  ';

  console.log(`${statusIcon} ${item.id} ${severityIcon} [${item.severity}] ${blocksIcon}`);
  console.log(`   File: ${item.filePath}`);
  console.log(`   Type: ${item.issueType}`);
  console.log(`   Status: ${item.status}`);

  if (item.description) {
    console.log(`   Description: ${item.description}`);
  }

  if (item.contentWarnings && item.contentWarnings.length > 0) {
    console.log(`   Warnings: ${item.contentWarnings.join(', ')}`);
  }

  if (item.requiredActions && item.requiredActions.length > 0) {
    console.log(`   Required Actions:`);
    item.requiredActions.forEach(action => {
      console.log(`     - ${action}`);
    });
  }

  if (item.status === 'resolved') {
    console.log(`   Resolved: ${item.resolvedAt} by ${item.resolvedBy}`);
    if (item.assignedCommit) {
      console.log(`   Commit: ${item.assignedCommit}`);
    }
  }

  if (item.status === 'deferred' && item.deferredReason) {
    console.log(`   Deferred Reason: ${item.deferredReason}`);
  }

  if (item.notes && item.notes.length > 0) {
    console.log(`   Notes:`);
    item.notes.forEach(note => {
      console.log(`     [${note.timestamp}] ${note.author}: ${note.content}`);
    });
  }

  console.log('');
});

console.log('-'.repeat(80));

// Final summary
if (blocking.length > 0) {
  console.log(`\n⚠️  WARNING: ${blocking.length} item(s) block deployment`);
  console.log('   These must be resolved before production launch.');
  console.log('\n   Run: npm run sensitive-content:validate --strict to check deployment readiness');
} else if (pending.length > 0 || inProgress.length > 0) {
  console.log(`\nℹ️  ${pending.length + inProgress.length} item(s) need attention (not blocking)`);
} else {
  console.log('\n✅ All items resolved!');
}

console.log('');
