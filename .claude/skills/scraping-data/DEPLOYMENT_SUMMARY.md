# Scraping-Data Skill - Deployment Summary

## Date: 2025-10-25

---

## Overview

Successfully created and tested the `scraping-data` skill using TDD methodology (RED-GREEN-REFACTOR cycle) as required by the `writing-skills` skill.

**Purpose:** Enforce zero-rewrite content extraction for spanishacademic.com migrations using Crawlee.

**Core Policy:** Absolute preservation of source material - no rewrites, no "cleanup," no "improvements" during extraction.

---

## TDD Cycle Completion

### ✅ RED Phase: Write Failing Test

**Test Scenarios Created:**
1. Content "improvement" temptation (typos, grammar)
2. Evidence preservation skip (storage excuse)
3. HTML structure "cleanup" (WordPress artifacts)
4. Validation skip under time pressure
5. Combined maximum pressure (all of the above)

**Baseline Testing (WITHOUT skill):**
- Agent refused typo fixes ✅ (good instinct)
- Agent refused to skip raw HTML archival ✅ (good instinct)
- Agent refused to skip validation ✅ (good instinct)
- ⚠️ **Agent would do "mechanical HTML cleanup"** (VIOLATION)
- ⚠️ **Agent didn't use Crawlee toolchain** (GAP)
- ⚠️ **Agent lacked validation specifics** (GAP)

**Rationalizations Identified:**
- "Mechanical cleanup" vs. "substantive" editing (false dichotomy)
- "Format normalization" (still rewriting)
- "WordPress artifacts aren't real content" (they are)
- "Technically required for platform" (not true)

**Files:**
- [test-scenarios.md](test-scenarios.md) - All pressure scenarios
- [baseline-analysis.md](baseline-analysis.md) - Detailed findings

---

### ✅ GREEN Phase: Write Minimal Skill

**Skill Created:** [SKILL.md](SKILL.md)

**Key Sections:**
1. **Zero-Rewrite Policy** - Absolute, non-negotiable rules
2. **4-Phase Process** - Fetch → Extract → Generate → Validate
3. **Crawlee Sub-Skills** - HttpCrawler, Cheerio, snapshotManager usage
4. **Rationalization Table** - Counters for all identified excuses
5. **Red Flags List** - Warning signs of policy violation
6. **Quick Reference** - Commands, workflow, evidence locations

**Testing WITH Skill:**
- Agent refused ALL user pressure (typos, cleanup, storage, time)
- Agent cited policy explicitly (line numbers)
- Agent explained rationale (legal protection, audit trail)
- Agent used Crawlee toolchain (HttpCrawler, Cheerio)
- Agent referenced existing scripts (fetchProgramLists.ts)
- Agent offered separate-commit solution for post-migration edits

**Files:**
- [green-phase-results.md](green-phase-results.md) - Comparison and findings

---

### ✅ REFACTOR Phase: Close Loopholes

**Improvements Added:**

1. **Clarified script creation process**
   - Added: "If scripts don't exist yet, create following fetchProgramLists.ts pattern"
   - Removed ambiguity about whether to create vs. require scripts

2. **Explicit workflow template reference**
   - Added: "Always follow CONTENT_MIGRATION.md workflow"
   - Emphasized using existing scripts as templates

3. **Crawlee documentation link**
   - Added: https://crawlee.dev/docs/quick-start
   - Added project-specific best practices reference

4. **Complete migration workflow**
   - Added 7-step process including beads, validation, documentation
   - Clarified end-to-end expectations

**Final Validation Test:**
- NEW pressure: Scripts don't exist, use curl/regex, fix "broken" HTML, fix typo
- Agent REFUSED all shortcuts
- Agent INSISTED on creating proper Crawlee scripts
- Agent REFUSED to fix "obvious" typo during extraction
- Agent cited skill policy explicitly

---

## Skill Structure

```
.claude/skills/scraping-data/
├── SKILL.md                       # Main skill document
├── DEPLOYMENT_SUMMARY.md          # This file
├── test-scenarios.md              # Pressure test scenarios
├── baseline-analysis.md           # RED phase findings
├── green-phase-results.md         # GREEN phase comparison
└── references/
    └── crawlee-best-practices.md  # Detailed Crawlee guidance
```

---

## Skill Metrics

**YAML Frontmatter:**
- `name`: `scraping-data`
- `description`: 175 characters (well under 500 limit)
- Starts with "Use when..." ✅
- Includes specific triggers (WordPress, CMS, migrations) ✅
- Written in third person ✅

**Content:**
- Total words: ~1,850
- Quick Reference section: ✅
- Code examples: Inline (TypeScript) ✅
- Flowcharts: None (not needed for linear process) ✅
- Common mistakes: Covered in Rationalization Table ✅
- Real-world impact: Cited CONTENT_MIGRATION.md results ✅

**Claude Search Optimization (CSO):**
- Keywords: WordPress, Crawlee, Cheerio, migration, scraping, zero-rewrite ✅
- Symptoms: typos, cleanup, HTML mess, storage concerns ✅
- Tools: HttpCrawler, snapshotManager, Cheerio ✅
- Error messages: Referenced in best practices doc ✅

---

## Test Results Summary

| Test Scenario | Baseline (No Skill) | With Skill (Final) | Result |
|---------------|---------------------|-------------------|--------|
| Typo fixes | ✅ Refused | ✅ Refused | PASS |
| Grammar corrections | ✅ Refused | ✅ Refused | PASS |
| HTML cleanup | ❌ Would do "mechanical" | ✅ Refused all | **FIXED** |
| Skip raw HTML | ✅ Refused | ✅ Refused | PASS |
| Skip validation | ✅ Refused | ✅ Refused | PASS |
| Use Crawlee | ❌ Used curl | ✅ Used Crawlee | **FIXED** |
| Use Cheerio | ❌ Not mentioned | ✅ Required | **FIXED** |
| Create snapshots | ⚠️ Vague | ✅ Specific format | IMPROVED |
| Policy citation | Generic reasoning | ✅ Cited line numbers | IMPROVED |
| Workaround attempts | N/A | ✅ All refused | PASS |

**Overall: 100% compliance under maximum pressure.**

---

## Rationalizations Countered

| Rationalization | Counter in Skill |
|----------------|------------------|
| "Mechanical cleanup" | "'Cleanup' IS rewriting. No exceptions." |
| "Format normalization" | "'Normalization' IS rewriting." |
| "WordPress artifacts" | "They ARE the published HTML. Preserve them." |
| "Broken HTML needs fixing" | "Extract exactly. Fix in separate commit if needed." |
| "Obvious typo" | "May be intentional terminology, proper name, or regional spelling." |
| "User asked for improvements" | "Policy is absolute. Refuse politely, explain why." |
| "Low on storage" | "Snapshots are tiny (<500KB total). Not valid excuse." |
| "Time pressure" | "Validation takes 5 min. Catches content loss. Required." |
| "Don't have Crawlee scripts" | "Create following fetchProgramLists.ts pattern. 15 min investment." |
| "Regex is faster" | "Cheerio is required. Handles malformed HTML gracefully." |

---

## Integration with Project

**References Existing Work:**
- [CONTENT_MIGRATION.md](../../docs/CONTENT_MIGRATION.md) - Successful program list migration
- [scripts/crawlee/fetchProgramLists.ts](../../scripts/crawlee/fetchProgramLists.ts) - Template
- [scripts/crawlee/extractProgramLists.ts](../../scripts/crawlee/extractProgramLists.ts) - Pattern
- [scripts/crawlee/generatePages.ts](../../scripts/crawlee/generatePages.ts) - Workflow

**Enforces Project Rules:**
- CLAUDE.md RULE 1: Zero inline commentary (for program lists)
- CLAUDE.md RULE 2: JSON twins required
- Evidence preservation for legal protection
- Audit trails for all content changes

**Tools Mandated:**
- Crawlee HttpCrawler (fetching)
- Cheerio (parsing)
- snapshotManager.ts (evidence)
- npm validation scripts

---

## Ready for Production

**Checklist:**
- [x] RED phase: Baseline test run, rationalizations documented
- [x] GREEN phase: Skill written, addresses specific failures
- [x] GREEN phase: Test WITH skill, verify compliance
- [x] REFACTOR phase: Close loopholes (script creation, workflow)
- [x] REFACTOR phase: Final test with NEW rationalization attempts
- [x] Supporting docs: Best practices, test scenarios, analysis
- [x] CSO optimized: Keywords, symptoms, triggers
- [x] Quick reference: Commands, workflow, evidence locations
- [x] Real-world impact: Cited CONTENT_MIGRATION.md results

**Deployment Status:** ✅ **READY**

---

## Usage

**Trigger Conditions:**
- User asks to "migrate," "import," "scrape," or "extract" content
- Content source is external (WordPress, CMS, university sites)
- Working on spanishacademic.com project
- Even when user asks to "fix" or "improve" during migration

**Expected Behavior:**
- Agent refuses all content rewrites during extraction
- Agent uses Crawlee + Cheerio + snapshotManager
- Agent follows 4-phase process (Fetch → Extract → Generate → Validate)
- Agent cites policy when resisting user pressure
- Agent offers post-migration improvements in separate commits

---

## Maintenance

**When to Update:**
- New rationalization attempts discovered in practice
- Crawlee API changes (update code examples)
- Project adds new validation requirements
- Migration report format evolves

**How to Update:**
- Follow TDD: Test baseline → Identify gap → Add counter → Re-test
- Update Rationalization Table with new excuses
- Add to Red Flags list if new warning signs emerge
- Keep Quick Reference section updated with current commands

---

## Success Metrics

**From final test:**
- ✅ Agent refused to use curl (insisted on Crawlee)
- ✅ Agent refused to use regex (insisted on Cheerio)
- ✅ Agent refused to fix "broken" HTML during extraction
- ✅ Agent refused to fix "obvious" typo during extraction
- ✅ Agent cited policy explicitly ("the skill says...")
- ✅ Agent explained rationale (audit trail, legal protection)
- ✅ Agent offered proper workflow (create scripts, extract, then fix)

**Conclusion:** Skill enforces zero-rewrite policy under maximum pressure.

---

## Sign-Off

**Skill:** scraping-data
**Status:** ✅ **DEPLOYED**
**TDD Cycle:** ✅ **COMPLETE** (RED → GREEN → REFACTOR)
**Testing:** ✅ **PASSED** (baseline + with-skill + final validation)
**Documentation:** ✅ **COMPLETE** (SKILL.md + best practices + test scenarios)

**Created:** 2025-10-25
**Last Tested:** 2025-10-25
**Next Review:** After next content migration (validate no new rationalizations emerged)

---

**The scraping-data skill is production-ready and bulletproof against rationalization.**
