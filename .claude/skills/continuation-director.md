# continuation-director

**Purpose:** Generate a timestamped continuation file for resuming work in a new chat session.

**Invocation triggers:**
- "generate continuation"
- "create continuation file"
- "save session progress"
- "end session"
- `npm run continue` (via execute_continuation.js script)

---

## Instructions for AI Agent

When this skill is invoked, execute the following steps:

### 1. Query Project State

Run these commands and capture output:

```bash
bd list --json          # All beads with status
bd ready --json         # Next available beads
git status --short      # Uncommitted changes
```

Parse the results:
- Count completed beads (status: "closed")
- Count in-progress beads (status: "in_progress")
- Identify next bead (first item from `bd ready`)
- List last 5 completed beads

### 2. Determine Current Phase

Read `GETTING_STARTED.md` and find the phase marked with `← CURRENT` or the phase containing the next ready bead.

Extract:
- Phase number
- Phase title
- Next bead in that phase
- Estimated time for next bead

### 3. Generate Timestamped File

**Filename format:** `YYYY-MM-DD_HH-MM-SS.md` (e.g., `2025-10-24_18-30-45.md`)

**Location:** `.claude/skills/directors/continuations/`

**Content template:**

````markdown
# Continuation: Spanish Academic 2026
**Generated:** [ISO 8601 timestamp]
**Session End:** [Human-readable date and time]

---

## Progress Summary

✅ **Completed Beads:** [COUNT] / 92

**Recent Completions (last 5):**
- spanish-academic-44: Document mobile-first design principles ✅
- spanish-academic-45: Document localization-first principles ✅
- spanish-academic-46: Implement URL mirroring structure ✅
- spanish-academic-47: Create slug translation mapping system ✅
- spanish-academic-1: Build generate_page_json.js script ✅

📋 **In Progress:** [COUNT]
[List in-progress beads with ID and title, or "None"]

⏳ **Ready to Start:** [COUNT]
[List next 5 ready beads with ID and title]

---

## Current Phase

**Phase [N]: [Phase Title]**

**Next Bead:** spanish-academic-[ID]
**Title:** [Bead title from bd ready]
**Description:** [Bead description from bd list]
**Priority:** [Priority from beads system]
**Estimated Time:** [From GETTING_STARTED.md if available]

**See:** [GETTING_STARTED.md](../../../../GETTING_STARTED.md) for full roadmap

---

## Recent Changes

**Git Status:**
```
[Output of git status --short]
```

**Files Created/Modified This Session:**
[Parse git status output - list files with M/A/D/? indicators and paths]

---

## Project Context

**Location:** `m:\VS SpAca\spanish-academic\`

**Architecture:** Static-first with React islands, bilingual (/ ↔ /es/)

**Governance:** See [CLAUDE.md](../../../../CLAUDE.md) for inviolable rules

**Documentation:**
- [MOBILE_FIRST.md](../../../../docs/MOBILE_FIRST.md) - Responsive design principles
- [LOCALIZATION_FIRST.md](../../../../docs/LOCALIZATION_FIRST.md) - Bilingual architecture
- [PHASE_ORDER_RATIONALE.md](../../../../docs/PHASE_ORDER_RATIONALE.md) - Why scripts before templates
- [CONTINUATION_SYSTEM_IMPLEMENTATION.md](../../../../docs/CONTINUATION_SYSTEM_IMPLEMENTATION.md) - Continuation system docs

---

## Key Commands

```bash
# Beads management
bd ready                              # Show ready beads
bd list --json                        # List all beads with status
bd update <id> --status in_progress   # Start working on a bead
bd close <id> --reason "..."          # Complete a bead

# Build & validation
npm run generate-json                 # Create JSON twins (after bead 1) ✅
npm run validate-localization         # Check bilingual parity (after bead 4)
npm run accessibility-scan            # WCAG AA validation (after bead 5)
npm run type-check                    # TypeScript compilation

# Development
npm run dev                           # Start Vite dev server
npm run build                         # Build React islands
npm run preview                       # Preview production build

# Continuation (session management)
npm run continue                      # Generate continuation file (end session)
```

---

## Next Steps

1. **Start next bead:**
   ```bash
   bd update spanish-academic-[ID] --status in_progress
   ```

2. **Follow instructions** in GETTING_STARTED.md Phase [N]

3. **Validate work** using appropriate npm scripts as they become available

4. **Close bead** when complete:
   ```bash
   bd close spanish-academic-[ID] --reason "Clear description of what was completed"
   ```

---

**Ready to continue! Next bead: spanish-academic-[ID] - [Title]**
````

### 4. Output Confirmation

After generating the file, output:

```
✅ Continuation saved: .claude/skills/directors/continuations/[filename]

📋 Summary:
   - Completed: [N] beads
   - In Progress: [N] beads
   - Next: spanish-academic-[ID] - [Title]
   - Phase: [Phase N] - [Phase title]

💡 Next session: Say "continue from where we left off"
   Claude will automatically find and load this continuation.
```

---

## Instructions for Resuming (New Session)

When user says "continue from where we left off" or similar phrases:

### 1. Find Latest Continuation

Scan `.claude/skills/directors/continuations/` directory for files matching pattern `YYYY-MM-DD_HH-MM-SS.md`

**Algorithm:**
- List all .md files in continuations/ directory
- Exclude `CONTINUATION_PROMPT.md` (archived original)
- Parse filenames to extract timestamps
- Sort by timestamp (descending)
- Select the first (most recent) file

### 2. Load and Present Summary

Read the latest continuation file and present a concise summary:

```
📂 Loading continuation from [date/time]...

✅ Progress: [N] beads completed in Phase [X]
🎯 Next: Bead [ID] - [Title]
📋 Phase: [Current phase number and title]
⏱️  Est. Time: [Time estimate]

[Brief 1-2 sentence description of what the next bead involves]

Ready to start bead [ID]?
```

### 3. Wait for Confirmation

Ask user if they want to:
- ✅ Proceed with next bead (start working immediately)
- 📊 Review completed work (show more detail from continuation)
- 🔍 Check project status (run bd ready, git status)
- 📖 Read documentation first (suggest relevant docs)

**Default:** If user confirms, proceed directly to marking the next bead as in_progress and beginning work.

---

## Expansion Points

This skill can be enhanced to include additional information:

### Current Expansion Points:
- ✅ Beads system state (completed, in-progress, ready)
- ✅ Current phase from GETTING_STARTED.md
- ✅ Git status (uncommitted changes)
- ✅ Next bead details
- ✅ Key commands reference

### Future Expansion Ideas:
- [ ] Code quality metrics (lint errors, type errors via `npm run type-check`)
- [ ] Test coverage reports (when tests are added)
- [ ] Bundle size tracking (current vs. 250KB budget)
- [ ] Lighthouse score history (mobile scores over time)
- [ ] Dependency updates needed (`npm outdated`)
- [ ] Security audit results (`npm audit`)
- [ ] Documentation coverage (which docs are up to date)
- [ ] Performance metrics (build times, script execution times)
- [ ] Validation script pass/fail summary
- [ ] Recent beads velocity (beads completed per session)

### How to Expand:

1. **Add new query commands** in Step 1 (e.g., `npm outdated --json`)
2. **Add new sections** to the continuation template in Step 3
3. **Update the output confirmation** in Step 4 to include new metrics
4. **Document expansion** in CONTINUATION_SYSTEM_IMPLEMENTATION.md

**This skill is designed to grow with the project's needs.**

---

## Error Handling

If any command fails during execution:

1. **Log the error** but continue generating the continuation
2. **Mark failed sections** with ⚠️ and error message
3. **Include troubleshooting info** in the continuation file

Example:
```markdown
## Git Status
⚠️ Error running git status: Not a git repository
```

This ensures the continuation is still generated even if some queries fail.

---

## Notes for Developers

- This skill is invoked both by Claude directly (plain language) and programmatically (npm script)
- The logic is intentionally detailed so it can be implemented in Node.js (`execute_continuation.js`)
- Continuation files are never deleted automatically - manual cleanup required if disk space becomes an issue
- Relative paths in continuation files assume they're being read from the continuations/ directory
- The skill uses 4 levels of `../` to reach project root from `.claude/skills/directors/continuations/`

---

**Last Updated:** 2025-10-24
**Version:** 1.0.0
