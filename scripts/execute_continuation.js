#!/usr/bin/env node

/**
 * Execute Continuation Director
 *
 * Implements the continuation-director.md skill programmatically
 * Generates timestamped continuation files for session resumption
 *
 * Usage: npm run continue
 *
 * Spanish Academic 2026
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const CONTINUATIONS_DIR = join(PROJECT_ROOT, '.claude/skills/generating-continuations/references/continuations');

// Helper to run shell commands safely
function run(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      cwd: PROJECT_ROOT,
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    }).trim();
  } catch (error) {
    if (options.ignoreError) {
      return `Error: ${error.message}`;
    }
    throw error;
  }
}

// Generate timestamp filename
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

// Query beads system
function queryBeads() {
  console.log('📊 Querying beads system...');

  const listJson = run('bd list --json', { silent: true, ignoreError: true });
  const readyJson = run('bd ready --json', { silent: true, ignoreError: true });

  if (listJson.startsWith('Error')) {
    console.warn('⚠️  Warning: Could not query beads system');
    console.warn('   Make sure beads is installed: https://github.com/steveyegge/beads');
    return null;
  }

  try {
    const allBeads = JSON.parse(listJson || '[]');
    const readyBeads = JSON.parse(readyJson || '[]');

    const completed = allBeads.filter(b => b.status === 'closed');
    const inProgress = allBeads.filter(b => b.status === 'in_progress');

    return {
      total: allBeads.length,
      completed: completed,
      completedCount: completed.length,
      inProgress: inProgress,
      inProgressCount: inProgress.length,
      ready: readyBeads.slice(0, 5), // First 5 ready beads
      nextBead: readyBeads[0] || null,
    };
  } catch (error) {
    console.warn('⚠️  Warning: Could not parse beads JSON');
    return null;
  }
}

// Determine current phase from GETTING_STARTED.md
function getCurrentPhase() {
  console.log('📖 Reading GETTING_STARTED.md...');

  try {
    const gettingStarted = readFileSync(join(PROJECT_ROOT, 'GETTING_STARTED.md'), 'utf-8');

    // Look for "← CURRENT" marker or last completed phase
    const lines = gettingStarted.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match: ## Phase N: Title ← CURRENT
      if (line.match(/##\s*Phase\s+(\d+):\s*([^←]+).*CURRENT/i)) {
        const match = line.match(/##\s*Phase\s+(\d+):\s*([^←]+)/);
        return {
          number: match[1],
          title: match[2].trim(),
        };
      }
    }

    // Fallback: find first phase without COMPLETE marker
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/##\s*Phase\s+(\d+):/i) && !line.includes('COMPLETE')) {
        const match = line.match(/##\s*Phase\s+(\d+):\s*(.+)/);
        return {
          number: match[1],
          title: match[2].replace(/←.*/, '').trim(),
        };
      }
    }

    return { number: '?', title: 'Unknown Phase' };
  } catch (error) {
    console.warn('⚠️  Warning: Could not read GETTING_STARTED.md');
    return { number: '?', title: 'Unknown Phase' };
  }
}

// Get git status
function getGitStatus() {
  console.log('🔍 Checking git status...');

  const gitStatus = run('git status --short', { silent: true, ignoreError: true });

  if (gitStatus.startsWith('Error')) {
    return 'Not a git repository or git not available';
  }

  return gitStatus.trim() || 'No uncommitted changes';
}

// Parse git status to list files
function parseGitFiles(gitStatus) {
  if (!gitStatus || gitStatus === 'No uncommitted changes') {
    return 'No files modified';
  }

  const lines = gitStatus.split('\n');
  const files = lines.map(line => {
    const parts = line.trim().split(/\s+/);
    const status = parts[0];
    const file = parts.slice(1).join(' ');
    return `- [${status}] ${file}`;
  });

  return files.join('\n');
}

// Generate continuation content
function generateContinuation(beads, phase, gitStatus) {
  const timestamp = new Date().toISOString();
  const humanTime = new Date().toLocaleString();

  // Handle case where beads query failed
  if (!beads) {
    const gitFiles = parseGitFiles(gitStatus);

    return `# Continuation: Spanish Academic 2026
**Generated:** ${timestamp}
**Session End:** ${humanTime}

---

## Progress Summary

⚠️  **Beads system unavailable** - Could not query project state

Please check:
- Is beads installed? https://github.com/steveyegge/beads
- Run manually: \`bd list --json\`

---

## Current Phase

**Phase ${phase.number}: ${phase.title}**

**See:** [GETTING_STARTED.md](../../../../GETTING_STARTED.md) for next steps

---

## Recent Changes

**Git Status:**
\`\`\`
${gitStatus}
\`\`\`

**Files Created/Modified:**
${gitFiles}

---

## Project Context

**Location:** \`m:\\VS SpAca\\spanish-academic\\\`

**Architecture:** Static-first with React islands, bilingual (/ ↔ /es/)

**Governance:** See [CLAUDE.md](../../../../CLAUDE.md) for rules

**Documentation:**
- [MOBILE_FIRST.md](../../../../docs/MOBILE_FIRST.md)
- [LOCALIZATION_FIRST.md](../../../../docs/LOCALIZATION_FIRST.md)
- [PHASE_ORDER_RATIONALE.md](../../../../docs/PHASE_ORDER_RATIONALE.md)

---

## Key Commands

\`\`\`bash
# Beads management
bd ready
bd list --json
bd update <id> --status in_progress
bd close <id> --reason "..."

# Build & validation
npm run generate-json
npm run type-check

# Continuation
npm run continue
\`\`\`

---

**Next Session:** Review GETTING_STARTED.md for current phase and next bead.
`;
  }

  // Normal flow with beads data
  const { nextBead, completed, inProgress, ready, total, completedCount, inProgressCount } = beads;

  const completedList = completed.slice(-5).reverse().map(b =>
    `- ${b.id}: ${b.title} ✅`
  ).join('\n') || '- None yet';

  const inProgressList = inProgress.length > 0
    ? inProgress.map(b => `- ${b.id}: ${b.title}`).join('\n')
    : '- None';

  const readyList = ready.map(b => `- ${b.id}: ${b.title}`).join('\n') || '- None (all blocked or complete)';

  const gitFiles = parseGitFiles(gitStatus);

  const nextBeadInfo = nextBead ? `
**Next Bead:** ${nextBead.id}
**Title:** ${nextBead.title}
**Description:** ${nextBead.description || 'See GETTING_STARTED.md for details'}
**Priority:** ${nextBead.priority}
**Estimated Time:** See GETTING_STARTED.md
` : '**All beads complete or blocked** - Review GETTING_STARTED.md';

  const nextSteps = nextBead ? `
1. **Start next bead:**
   \`\`\`bash
   bd update ${nextBead.id} --status in_progress
   \`\`\`

2. **Follow instructions** in GETTING_STARTED.md Phase ${phase.number}

3. **Validate work** using appropriate npm scripts

4. **Close bead** when complete:
   \`\`\`bash
   bd close ${nextBead.id} --reason "Clear description of completion"
   \`\`\`
` : `
**Next:** Review GETTING_STARTED.md to determine next phase or unblock beads.
`;

  return `# Continuation: Spanish Academic 2026
**Generated:** ${timestamp}
**Session End:** ${humanTime}

---

## Progress Summary

✅ **Completed Beads:** ${completedCount} / ${total}

**Recent Completions (last 5):**
${completedList}

📋 **In Progress:** ${inProgressCount}
${inProgressList}

⏳ **Ready to Start:** ${ready.length}
${readyList}

---

## Current Phase

**Phase ${phase.number}: ${phase.title}**

${nextBeadInfo}

**See:** [GETTING_STARTED.md](../../../../GETTING_STARTED.md) for full roadmap

---

## Recent Changes

**Git Status:**
\`\`\`
${gitStatus}
\`\`\`

**Files Created/Modified This Session:**
${gitFiles}

---

## Project Context

**Location:** \`m:\\VS SpAca\\spanish-academic\\\`

**Architecture:** Static-first with React islands, bilingual (/ ↔ /es/)

**Governance:** See [CLAUDE.md](../../../../CLAUDE.md) for inviolable rules

**Documentation:**
- [MOBILE_FIRST.md](../../../../docs/MOBILE_FIRST.md) - Responsive design principles
- [LOCALIZATION_FIRST.md](../../../../docs/LOCALIZATION_FIRST.md) - Bilingual architecture
- [PHASE_ORDER_RATIONALE.md](../../../../docs/PHASE_ORDER_RATIONALE.md) - Why scripts before templates
- [CONTINUATION_SYSTEM_IMPLEMENTATION.md](../../../../docs/CONTINUATION_SYSTEM_IMPLEMENTATION.md) - This system's docs

---

## Key Commands

\`\`\`bash
# Beads management
bd ready                              # Show ready beads
bd list --json                        # List all beads
bd update <id> --status in_progress   # Start a bead
bd close <id> --reason "..."          # Complete a bead

# Build & validation
npm run generate-json                 # Create JSON twins ✅
npm run validate-localization         # Check bilingual parity (after bead 4)
npm run accessibility-scan            # WCAG AA validation (after bead 5)
npm run type-check                    # TypeScript compilation

# Development
npm run dev                           # Start Vite dev server
npm run build                         # Build React islands
npm run preview                       # Preview production build

# Continuation
npm run continue                      # Generate continuation (end session)
\`\`\`

---

## Next Steps
${nextSteps}

---

**Ready to continue!${nextBead ? ` Next bead: ${nextBead.id} - ${nextBead.title}` : ' Review project status.'}**
`;
}

// Main execution
async function main() {
  console.log('🔄 Generating continuation file...\n');

  const beads = queryBeads();
  const phase = getCurrentPhase();
  const gitStatus = getGitStatus();

  console.log('\n📝 Compiling continuation data...');

  const content = generateContinuation(beads, phase, gitStatus);
  const filename = `${getTimestamp()}.md`;
  const filepath = join(CONTINUATIONS_DIR, filename);

  writeFileSync(filepath, content, 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Continuation saved!');
  console.log('='.repeat(60));
  console.log(`\n📁 Location: .claude/skills/directors/continuations/${filename}`);

  if (beads) {
    console.log('\n📊 Summary:');
    console.log(`   - Completed: ${beads.completedCount} beads`);
    console.log(`   - In Progress: ${beads.inProgressCount} beads`);
    if (beads.nextBead) {
      console.log(`   - Next: ${beads.nextBead.id} - ${beads.nextBead.title}`);
    }
    console.log(`   - Phase: Phase ${phase.number} - ${phase.title}`);
  }

  console.log('\n💡 Next session:');
  console.log('   Say to Claude: "continue from where we left off"');
  console.log('   Claude will automatically find and load this continuation.\n');
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
