#!/usr/bin/env node

/**
 * Validate Sensitive Content Compliance
 *
 * Checks if any blocking items exist and reports deployment readiness
 *
 * Usage:
 *   npm run sensitive-content:validate           # Warn about blocking items (exit 0)
 *   npm run sensitive-content:validate -- --strict # Fail if blocking items exist (exit 1)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRACKER_FILE = join(__dirname, '..', 'data', 'sensitive-content-tracker.jsonl');

// Parse command-line arguments
const args = process.argv.slice(2);
const strict = args.includes('--strict');

console.log('\n' + '='.repeat(80));
console.log('SENSITIVE CONTENT COMPLIANCE VALIDATION');
console.log('='.repeat(80) + '\n');

// Read items
if (!existsSync(TRACKER_FILE)) {
  console.log('✅ No sensitive content tracking items found.');
  console.log('   Compliance check: PASS');
  console.log('   Safe to deploy.\n');
  process.exit(0);
}

const content = readFileSync(TRACKER_FILE, 'utf-8');
const lines = content.trim().split('\n').filter(line => line.trim());

if (lines.length === 0) {
  console.log('✅ No sensitive content tracking items found.');
  console.log('   Compliance check: PASS');
  console.log('   Safe to deploy.\n');
  process.exit(0);
}

const items = lines.map(line => JSON.parse(line));

// Count by status
const pending = items.filter(i => i.status === 'pending');
const inProgress = items.filter(i => i.status === 'in-progress');
const resolved = items.filter(i => i.status === 'resolved');
const deferred = items.filter(i => i.status === 'deferred');

// Find blocking items that aren't resolved
const blocking = items.filter(i => i.blocksDeployment && i.status !== 'resolved');
const blockingByType = {};
blocking.forEach(item => {
  blockingByType[item.issueType] = (blockingByType[item.issueType] || 0) + 1;
});

// Summary
console.log(`Total Tracked Items: ${items.length}`);
console.log(`  ✅ Resolved: ${resolved.length}`);
console.log(`  ⏳ Pending: ${pending.length}`);
console.log(`  🔄 In Progress: ${inProgress.length}`);
console.log(`  ⏸️  Deferred: ${deferred.length}`);

console.log('\n' + '-'.repeat(80) + '\n');

// Check for blocking items
if (blocking.length === 0) {
  console.log('✅ COMPLIANCE CHECK: PASS');
  console.log('   No blocking items found.');
  console.log('   All high-sensitivity content properly governed.');
  console.log('   Safe to deploy.\n');

  if (pending.length > 0 || inProgress.length > 0) {
    console.log(`ℹ️  Note: ${pending.length + inProgress.length} non-blocking item(s) pending`);
    console.log('   These do not prevent deployment but should be addressed.\n');
  }

  process.exit(0);
}

// Blocking items found
console.log('❌ COMPLIANCE CHECK: FAIL');
console.log(`   ${blocking.length} BLOCKING ISSUE(S) FOUND\n`);

console.log('The following items must be resolved before deployment:\n');

blocking.forEach(item => {
  const severityIcon = item.severity === 'blocker' ? '🚫' : '⚠️';
  console.log(`${severityIcon} ${item.id} [${item.severity}]`);
  console.log(`   File: ${item.filePath}`);
  console.log(`   Issue: ${item.issueType}`);
  console.log(`   Status: ${item.status}`);

  if (item.description) {
    console.log(`   Description: ${item.description}`);
  }

  if (item.requiredActions && item.requiredActions.length > 0) {
    console.log(`   Required Actions:`);
    item.requiredActions.slice(0, 3).forEach(action => {
      console.log(`     - ${action}`);
    });
    if (item.requiredActions.length > 3) {
      console.log(`     ... and ${item.requiredActions.length - 3} more`);
    }
  }

  console.log('');
});

console.log('-'.repeat(80) + '\n');

// Issue type summary
console.log('Issues by Type:');
Object.entries(blockingByType).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count}`);
});

console.log('\n' + '='.repeat(80));
console.log('NEXT STEPS');
console.log('='.repeat(80) + '\n');

console.log('1. Review blocking items:');
console.log('   npm run sensitive-content:list --blocking-only\n');

console.log('2. Fix each issue according to required actions\n');

console.log('3. Mark items as resolved:');
console.log('   npm run sensitive-content:resolve SC-XXX -- --commit <hash> --note "Fixed"\n');

console.log('4. Re-run validation:');
console.log('   npm run sensitive-content:validate --strict\n');

console.log('5. When all blocking items resolved, deploy:\n');
console.log('   npm run pre-deploy\n');

console.log('='.repeat(80) + '\n');

// Exit code
if (strict) {
  console.log('⚠️  Exiting with error code 1 (strict mode)');
  console.log('   Deployment blocked until issues resolved.\n');
  process.exit(1);
} else {
  console.log('ℹ️  Exiting with code 0 (warning mode)');
  console.log('   Deployment validation will fail in strict mode.\n');
  process.exit(0);
}
