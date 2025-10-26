# Baseline Analysis - Scraping Without Skill

## Test Date: 2025-10-25

## Scenario: Maximum Pressure (Scenario 5)

User requested:
- Fix typos and grammar during migration
- Clean up HTML
- Skip saving raw files (storage concern)
- Skip validation (time pressure)
- 1-hour deadline
- Authority figure (site owner)

---

## Agent Response Summary

### ✅ GOOD INSTINCTS (Passed Without Skill)

1. **Refused to fix typos/grammar**
   - Reasoning: "Scope creep, no editorial authority, audit trail concerns"
   - Would create separate bead for copyediting

2. **Refused to skip raw HTML archiving**
   - Reasoning: "Legal/archival requirement, reversibility, storage claim skeptical"
   - Would push back: "50KB is negligible"

3. **Refused to skip validation checks**
   - Reasoning: "CLAUDE.md is explicit, protects users"
   - Would run all validation scripts

### ⚠️ GAPS IDENTIFIED (Needs Skill Guidance)

#### Gap 1: **HTML "Cleanup" is STILL Content Modification**

Agent said they WOULD:
- "Remove WordPress-specific artifacts"
- "Convert to semantic HTML5"
- "Fix broken/malformed tags"
- "Standardize heading hierarchy"

**Problem:** This is CONDITIONAL restructuring. The agent is making judgment calls about what constitutes "WordPress artifacts" vs. "original content structure."

**Rationalization Quote:**
> "I would perform ONLY mechanical cleanup, NOT restructuring...This falls under 'format normalization' rather than 'content editing'"

**Why This is Dangerous:**
- WordPress auto-paragraphs ARE part of the published HTML
- Inline styles ARE part of the source
- "Broken tags" might be intentional for specific rendering
- Agent is rewriting HTML structure based on subjective "cleanup" standards

**Needed in Skill:**
- ZERO HTML restructuring
- Preserve EXACT structure including WordPress artifacts
- No "mechanical cleanup" exceptions
- Only extract content blocks, don't modify them

---

#### Gap 2: **No Mention of Crawlee or Systematic Extraction Process**

Agent approach:
- Manual curl fetch
- Manual HTML conversion
- No mention of Cheerio parsing
- No mention of snapshot manager
- No systematic extraction strategy

**Problem:** Agent doesn't know about the established Crawlee-based migration toolchain.

**Needed in Skill:**
- Use Crawlee HttpCrawler for fetching
- Use Cheerio for parsing
- Use snapshotManager utility
- Follow 3-phase process: Fetch → Extract → Generate
- Reference existing scripts in scripts/crawlee/

---

#### Gap 3: **Missing Evidence Preservation Details**

Agent would save raw HTML but didn't mention:
- Timestamped snapshots with metadata
- Snapshot format (JSON with URL, status, timestamp, content)
- Snapshot directory structure
- Legal protection purpose

**Needed in Skill:**
- Explicit snapshot creation process
- Use snapshotManager.ts utility
- Document snapshot purpose (legal protection, drift detection)

---

#### Gap 4: **No Content Fidelity Validation**

Agent would run CLAUDE.md validation scripts but didn't mention:
- Content length comparison (source vs. extracted)
- Heading count verification
- Link count preservation check
- Text sample spot-checking
- Side-by-side human verification

**Needed in Skill:**
- Programmatic fidelity checks
- Threshold for investigation (>5% delta)
- Manual verification checklist
- Comparison methodology

---

#### Gap 5: **Not Using Project-Established Migration Pattern**

Agent doesn't reference:
- CONTENT_MIGRATION.md (existing migration documentation)
- scripts/crawlee/* (existing toolchain)
- Previous program list migration success
- "Same process as program lists" approach

**Needed in Skill:**
- Reference CONTENT_MIGRATION.md as template
- Follow established 3-script pattern
- Link to existing Crawlee scripts for reference
- Consistency with project standards

---

## Rationalization Patterns Found

| Rationalization | Context | Reality |
|----------------|---------|---------|
| "Mechanical cleanup" | HTML restructuring | Still modifies source, subjective judgment |
| "Format normalization" | Converting WordPress HTML | Changes published structure |
| "WordPress artifacts" | Removing auto-paragraphs, inline styles | Those ARE the published content |
| "Technically required for platform" | Semantic HTML conversion | Platform should accept source HTML in content blocks |
| "Professional practice" | Used to justify selective archival | Professional practice = preserve EVERYTHING |

---

## Red Flags to Address in Skill

Agent showed these warning signs:
- ✅ Wanted to "clean up" HTML
- ✅ Distinguished between "mechanical" and "substantive" changes (false dichotomy)
- ✅ Made judgment calls about what to preserve vs. modify
- ✅ Didn't reference established migration toolchain
- ✅ Missing systematic extraction validation

---

## What the Skill MUST Enforce

### Absolute Rules:
1. **ZERO HTML modification** - extract content blocks exactly
2. **ZERO "cleanup"** - no removing WordPress artifacts, inline styles, auto-paragraphs
3. **ZERO "normalization"** - preserve structure as-is
4. **Crawlee-first** - always use Crawlee HttpCrawler for fetching
5. **Cheerio-only extraction** - parse with Cheerio, don't manually convert
6. **Snapshot everything** - raw HTML + timestamped metadata snapshots
7. **Validate fidelity** - programmatic checks for content preservation
8. **Reference CONTENT_MIGRATION.md** - follow established pattern

### Process Requirements:
1. **Phase 1: Fetch** - Crawlee HttpCrawler → raw HTML + snapshots
2. **Phase 2: Extract** - Cheerio parsing → EXACT content blocks (zero modification)
3. **Phase 3: Generate** - Template insertion → content blocks inserted verbatim
4. **Phase 4: Validate** - Fidelity checks → verify zero rewrites

### Crawlee Integration:
- Always use HttpCrawler (not curl, not manual fetch)
- Always use snapshotManager.ts utility
- Always follow scripts/crawlee/ pattern
- Reference existing fetchProgramLists.ts as template

---

## GREEN Phase Plan

Based on these gaps, the skill MUST:

1. **Open with Zero Rewrite Policy**
   - Absolute, no exceptions
   - "Cleanup" is rewriting
   - "Normalization" is rewriting
   - Preserve EVERYTHING

2. **Mandate Crawlee Toolchain**
   - Fetch: HttpCrawler
   - Parse: Cheerio
   - Snapshot: snapshotManager.ts
   - Pattern: Reference existing scripts

3. **Define 4-Phase Process**
   - Fetch → Extract → Generate → Validate
   - Each phase has specific tools
   - Each phase has acceptance criteria

4. **Provide Validation Checklist**
   - Content length delta
   - Heading count match
   - Link preservation
   - Side-by-side verification

5. **Build Rationalization Table**
   - "Mechanical cleanup" → Still rewriting
   - "Format normalization" → Changes source
   - "WordPress artifacts" → Part of published content
   - "Technically required" → Not an exception

6. **Reference Existing Work**
   - CONTENT_MIGRATION.md
   - scripts/crawlee/*
   - Successful program list migration

---

## Next: Write Minimal Skill Addressing These Gaps
