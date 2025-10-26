#!/usr/bin/env node

/**
 * Add Sensitive Content Tracking Item
 *
 * Creates a new tracking item for high-sensitivity content that needs
 * governance compliance (disclaimers, lastReviewed fields, etc.)
 *
 * Usage:
 *   npm run sensitive-content:add -- \
 *     --file "public/insights/article.html" \
 *     --type "missing-disclaimer" \
 *     --severity "high" \
 *     --warnings "funding-amounts,career-advice" \
 *     --description "Brief description" \
 *     --blocks-deployment
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
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

const filePath = getArg('--file');
const issueType = getArg('--type');
const severity = getArg('--severity');
const description = getArg('--description');
const warningsStr = getArg('--warnings');
const blocksDeployment = hasFlag('--blocks-deployment');

// Validation
if (!filePath) {
  console.error('❌ Error: --file is required');
  process.exit(1);
}

if (!issueType) {
  console.error('❌ Error: --type is required');
  console.error('Valid types: missing-disclaimer, missing-lastReviewed, outdated-amounts, unverified-claims, immigration-advice, financial-advice, legal-advice, career-advice, ranking-methodology');
  process.exit(1);
}

if (!severity) {
  console.error('❌ Error: --severity is required');
  console.error('Valid severities: blocker, high, medium, low');
  process.exit(1);
}

if (!description) {
  console.error('❌ Error: --description is required');
  process.exit(1);
}

const validTypes = [
  'missing-disclaimer',
  'missing-lastReviewed',
  'outdated-amounts',
  'unverified-claims',
  'immigration-advice',
  'financial-advice',
  'legal-advice',
  'career-advice',
  'ranking-methodology'
];

const validSeverities = ['blocker', 'high', 'medium', 'low'];

if (!validTypes.includes(issueType)) {
  console.error(`❌ Error: Invalid type "${issueType}"`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
  process.exit(1);
}

if (!validSeverities.includes(severity)) {
  console.error(`❌ Error: Invalid severity "${severity}"`);
  console.error(`Valid severities: ${validSeverities.join(', ')}`);
  process.exit(1);
}

// Parse warnings
const contentWarnings = warningsStr ? warningsStr.split(',').map(w => w.trim()) : [];

// Read existing items to generate next ID
let nextId = 1;
if (existsSync(TRACKER_FILE)) {
  const content = readFileSync(TRACKER_FILE, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());

  if (lines.length > 0) {
    const lastLine = lines[lines.length - 1];
    const lastItem = JSON.parse(lastLine);
    const lastIdNum = parseInt(lastItem.id.replace('SC-', ''), 10);
    nextId = lastIdNum + 1;
  }
}

const id = `SC-${String(nextId).padStart(3, '0')}`;

// Determine required actions based on issue type
const requiredActions = [];
if (issueType === 'missing-disclaimer') {
  if (contentWarnings.includes('funding-amounts') || contentWarnings.includes('stipend-amounts')) {
    requiredActions.push("Add HTML disclaimer: 'This is informational, not financial advice'");
  }
  if (contentWarnings.includes('immigration') || contentWarnings.includes('visa')) {
    requiredActions.push("Add HTML disclaimer: 'Not legal or immigration advice. Consult qualified attorney.'");
  }
  if (contentWarnings.includes('career-advice') || contentWarnings.includes('job-market')) {
    requiredActions.push("Add HTML disclaimer: 'General information only. Not professional career counseling.'");
  }
  if (contentWarnings.includes('rankings')) {
    requiredActions.push("Add HTML disclaimer: 'Rankings are subjective. Not a sole decision factor.'");
  }
  requiredActions.push(`Add lastReviewed field to JSON twin: ${new Date().toISOString().split('T')[0]}`);
}

if (issueType === 'missing-lastReviewed') {
  requiredActions.push(`Add lastReviewed: '${new Date().toISOString().split('T')[0]}' to JSON twin`);
}

if (issueType === 'outdated-amounts') {
  requiredActions.push('Verify funding/stipend amounts are current');
  requiredActions.push('Update amounts if changed');
  requiredActions.push('Add note documenting verification date');
}

if (issueType === 'unverified-claims') {
  requiredActions.push('Fact-check claims against official sources');
  requiredActions.push('Add citations or remove unverifiable claims');
}

// Create tracking item
const item = {
  id,
  createdAt: new Date().toISOString(),
  status: 'pending',
  filePath,
  issueType,
  severity,
  description,
  requiredActions,
  contentWarnings,
  blocksDeployment,
  assignedCommit: null,
  resolvedAt: null,
  resolvedBy: null,
  notes: [],
  deferredReason: null,
  relatedIssues: []
};

// Append to tracker file (JSONL format - one JSON object per line)
const line = JSON.stringify(item) + '\n';
writeFileSync(TRACKER_FILE, existsSync(TRACKER_FILE) ? readFileSync(TRACKER_FILE, 'utf-8') + line : line, 'utf-8');

console.log(`✅ Created tracking item: ${id}`);
console.log(`   File: ${filePath}`);
console.log(`   Type: ${issueType}`);
console.log(`   Severity: ${severity}`);
console.log(`   Blocks Deployment: ${blocksDeployment ? 'YES' : 'NO'}`);

if (requiredActions.length > 0) {
  console.log(`   Required Actions:`);
  requiredActions.forEach(action => {
    console.log(`     - ${action}`);
  });
}

console.log(`\nRun: npm run sensitive-content:list to see all items`);
