---
name: scraping-data
description: Use when migrating content from external websites (WordPress, CMS) to preserve authenticity and legal protection - enforces zero-rewrite extraction using Crawlee, with evidence preservation and fidelity validation
---

# Scraping Data for spanishacademic.com

## Overview

**Core Principle:** Content extraction MUST preserve source material exactly as published. Zero rewrites. Zero "improvements." Zero "cleanup."

**Why:** Legal protection, content authenticity, audit trails, drift detection.

**Tools:** Crawlee HttpCrawler (fetch), Cheerio (parse), snapshotManager (evidence).

## The Zero-Rewrite Policy

**ABSOLUTE AND NON-NEGOTIABLE:**

- ❌ NO typo fixes
- ❌ NO grammar corrections
- ❌ NO "cleaning up" HTML
- ❌ NO removing "WordPress artifacts"
- ❌ NO converting to "semantic HTML"
- ❌ NO "format normalization"
- ❌ NO "mechanical cleanup"

**"Cleanup" IS rewriting. "Normalization" IS rewriting.**

### Why This Policy Exists

1. **Legal protection** - Snapshots prove what was published at migration date
2. **Content authenticity** - Preserve author's voice and choices
3. **Audit trail** - Know what's original vs. what's changed
4. **Drift detection** - Compare future snapshots to track content changes
5. **Reversibility** - Can re-migrate from source if needed

### What "Zero Rewrite" Means

**Extract exactly as published:**
- ✅ WordPress auto-paragraphs → KEEP
- ✅ Inline styles → KEEP
- ✅ Messy nested divs → KEEP
- ✅ Typos and grammar errors → KEEP
- ✅ Awkward phrasing → KEEP
- ✅ "Broken" or malformed HTML → KEEP (unless truly corrupted)
- ✅ Link structure → KEEP (even if links point to old site)
- ✅ Image references → KEEP (even if initially broken)

**Only modify in template wrapper, NOT in extracted content.**

## When to Use This Skill

**Use when:**
- Migrating articles from spanishacademic.com (WordPress)
- Scraping program lists from university websites
- Extracting content from any external CMS
- User asks to "migrate," "import," or "scrape" content
- Building content archives from live sites

**Use even when:**
- User asks you to "fix" or "improve" during migration
- Time pressure or deadline stress
- Storage concerns mentioned
- HTML looks "messy" or "needs cleanup"
- You notice typos or errors in source content

**Workflow template:**
- Always follow the process documented in [CONTENT_MIGRATION.md](../../docs/CONTENT_MIGRATION.md)
- Use existing [scripts/crawlee/](../../scripts/crawlee/) scripts as templates
- Create new scripts following the same 3-phase pattern if needed

## The 4-Phase Extraction Process

### Phase 1: Fetch (Crawlee)

**Tools:** Crawlee HttpCrawler, snapshotManager.ts

**Process:**
```typescript
import { HttpCrawler } from 'crawlee';
import { saveSnapshot } from '../../src/utils/snapshotManager.js';

const crawler = new HttpCrawler({
  maxRequestsPerMinute: 30, // Respectful rate limiting

  async requestHandler({ request, body, response }) {
    const content = body.toString();

    // 1. Save raw HTML
    writeFileSync(rawHtmlPath, content, 'utf-8');

    // 2. Create snapshot (legal protection)
    saveSnapshot(url, content, statusCode);
  },
});
```

**Acceptance Criteria:**
- ✅ Raw HTML archived
- ✅ Timestamped snapshot created (JSON with URL, status, timestamp, content)
- ✅ No modifications during fetch

**If scripts don't exist yet:**
- Create following the pattern in existing `fetchProgramLists.ts`
- Use same 3-phase structure: Fetch → Extract → Generate
- Follow [CONTENT_MIGRATION.md](../../docs/CONTENT_MIGRATION.md) workflow

**References:**
- [scripts/crawlee/fetchProgramLists.ts](../../scripts/crawlee/fetchProgramLists.ts) (template)
- [CONTENT_MIGRATION.md](../../docs/CONTENT_MIGRATION.md) (successful migration example)

---

### Phase 2: Extract (Cheerio)

**Tools:** Cheerio (HTML parsing)

**Process:**
```typescript
import { load } from 'cheerio';

const $ = load(rawHtml);

// Extract EXACT content blocks - ZERO modification
const extracted = {
  title: $('h1.entry-title').text().trim(),
  mainContent: $('article .entry-content').html(), // ← EXACT HTML
  publishDate: $('time.entry-date').attr('datetime'),
};

// DO NOT:
// - Remove WordPress auto-paragraphs
// - Strip inline styles
// - Restructure HTML
// - Fix typos
// - "Clean up" anything
```

**What to Extract:**
- Metadata (title, date, author) → For template variables ONLY
- Content blocks → EXACT HTML, zero filtering

**What NOT to Do:**
- ❌ Filter or clean HTML
- ❌ Remove elements you think are "WordPress artifacts"
- ❌ Fix "broken" tags
- ❌ Normalize structure

**Acceptance Criteria:**
- ✅ Content blocks extracted with EXACT HTML preserved
- ✅ No filtering, cleaning, or normalization
- ✅ WordPress formatting intact (auto-paragraphs, inline styles, etc.)

**References:**
- [scripts/crawlee/extractProgramLists.ts](../../scripts/crawlee/extractProgramLists.ts)

---

### Phase 3: Generate (Template Insertion)

**Tools:** Template files, string replacement

**Process:**
```typescript
const template = readFileSync('templates/insights-base.html', 'utf-8');

const rendered = template
  .replace('{{TITLE}}', extractedData.title)           // Metadata
  .replace('{{MAIN_CONTENT}}', extractedData.mainContent) // ← Exact HTML inserted
  .replace('{{PUBLISH_DATE}}', extractedData.publishDate); // Metadata
```

**Key Points:**
- Content goes into template wrapper
- NO modification of content during insertion
- Template provides structure, content stays exact

**Acceptance Criteria:**
- ✅ Extracted content inserted verbatim
- ✅ Only template variables replaced ({{TITLE}}, etc.)
- ✅ No content modification during generation

**References:**
- [scripts/crawlee/generatePages.ts](../../scripts/crawlee/generatePages.ts)
- [public/insights/funding-strategies.html](../../public/insights/funding-strategies.html) (example template)

---

### Phase 4: Validate (Fidelity Checks)

**Tools:** Automated checks + human verification

**Programmatic Checks:**
```typescript
// 1. Content length comparison
const delta = Math.abs(sourceLength - extractedLength);
if (delta > sourceLength * 0.05) { // >5% change
  console.warn('⚠️ Large content delta - investigate');
}

// 2. Heading count preservation
assert(sourceH2Count === extractedH2Count, 'Headings must match');

// 3. Link count preservation
assert(extractedLinkCount >= sourceLinkCount * 0.8, 'Most links preserved');

// 4. Text sample spot-check
assert(sourceFirstPara === extractedFirstPara, 'First paragraph exact match');
```

**Human Verification Checklist:**
- [ ] Side-by-side comparison (source vs. generated)
- [ ] No grammar "corrections"
- [ ] No editorial "improvements"
- [ ] Author voice unchanged
- [ ] Section order preserved
- [ ] HTML structure matches source

**Acceptance Criteria:**
- ✅ Content length delta <5%
- ✅ All heading counts match
- ✅ Link counts preserved (allowing for nav/admin link exclusion)
- ✅ Spot-checks pass (first paragraph, random samples)
- ✅ Human verification confirms zero rewrites

---

## Crawlee Sub-Skills

### Using HttpCrawler for Respectful Fetching

**Why Crawlee, not curl or fetch:**
- Built-in rate limiting
- Automatic retry logic
- Request queuing
- Error handling
- Respects robots.txt (configurable)
- Production-grade scraping framework

**Crawlee docs:** https://crawlee.dev/docs/quick-start

**Project-specific best practices:** See [references/crawlee-best-practices.md](references/crawlee-best-practices.md) for detailed guidance on rate limiting, snapshot management, Cheerio patterns, and troubleshooting.

**Configuration:**
```typescript
const crawler = new HttpCrawler({
  maxRequestsPerMinute: 30,        // Don't overwhelm server
  requestHandlerTimeoutSecs: 30,   // Allow time for large pages

  async requestHandler({ request, body, response }) {
    // Your extraction logic
  },

  failedRequestHandler({ request, error }) {
    console.error(`Failed: ${request.url}`, error.message);
  },
});

await crawler.run(urls); // Handles queue, rate limiting, retries
```

**Best Practices:**
- Set reasonable `maxRequestsPerMinute` (10-30)
- Handle `failedRequestHandler` for debugging
- Log progress (URL, status code, content length)
- Save failures to investigate later

---

### Using Cheerio for Parsing (NOT Manual String Operations)

**Why Cheerio:**
- jQuery-like syntax (familiar, readable)
- Handles malformed HTML gracefully
- Preserves exact HTML structure
- Efficient for large documents

**Pattern:**
```typescript
const $ = load(html);

// Target WordPress content structure
const article = $('article .entry-content');

// Extract specific elements
const programs = article.find('p').filter((_, el) => {
  const html = $(el).html() || '';
  return html.includes('<strong>') && html.includes('<a href');
});

// Get EXACT HTML (preserves structure)
const exactHtml = $.html(programs);
```

**Don'ts:**
- ❌ Use regex for HTML parsing
- ❌ Manual string splitting/replacement
- ❌ Modify HTML during extraction (`.text()` then rebuild)

**Do:**
- ✅ Use `.html()` to get exact HTML
- ✅ Use selectors to find content blocks
- ✅ Preserve structure with `$.html(element)`

---

### Snapshot Manager for Evidence Preservation

**Purpose:** Legal protection and drift detection

**What snapshots include:**
```json
{
  "url": "https://spanishacademic.com/article",
  "fetchedAt": "2025-10-25T23:14:15Z",
  "statusCode": 200,
  "contentLength": 135372,
  "content": "<!DOCTYPE html>..." // Full HTML
}
```

**Usage:**
```typescript
import { saveSnapshot } from '../../src/utils/snapshotManager.js';

const snapshotPath = saveSnapshot(url, htmlContent, statusCode);
// → data/snapshots/migration-insights-2025-10-25/article-slug.json
```

**Why this matters:**
- **Legal proof** of what was published on migration date
- **Drift detection** - Compare future snapshots to see content changes
- **Reversibility** - Can re-extract if migration had issues
- **Compliance** - Audit trail for content source

---

### Following the scripts/crawlee/ Pattern

**Established pattern** (from program list migration):

1. **fetchX.ts** - Crawlee HttpCrawler fetch → raw HTML + snapshots
2. **extractX.ts** - Cheerio parsing → EXACT content blocks
3. **generateX.ts** - Template rendering → HTML pages

**Reference implementations:**
- [scripts/crawlee/fetchProgramLists.ts](../../scripts/crawlee/fetchProgramLists.ts)
- [scripts/crawlee/extractProgramLists.ts](../../scripts/crawlee/extractProgramLists.ts)
- [scripts/crawlee/generatePages.ts](../../scripts/crawlee/generatePages.ts)

**Consistency matters:**
- Same directory structure
- Same file naming pattern
- Same phase separation
- Same evidence preservation

**Migration documentation:**
- [docs/CONTENT_MIGRATION.md](../../docs/CONTENT_MIGRATION.md) - Complete migration report
- Shows successful zero-rewrite extraction (195 programs, RULE 1 compliance)

---

## Common Rationalizations (And Why They're Wrong)

| Rationalization | Reality |
|----------------|---------|
| "It's just mechanical cleanup" | Cleanup IS rewriting. No exceptions. |
| "WordPress artifacts aren't real content" | They ARE the published HTML. Preserve them. |
| "Format normalization is harmless" | Changes structure = changes content. Don't do it. |
| "Inline styles should be removed" | They're part of source. Keep them. |
| "Broken HTML needs fixing" | Extract exactly. Fix in separate commit if needed. |
| "User asked me to improve it" | Policy is absolute. Refuse politely, explain why. |
| "We're low on storage" | Snapshots are tiny (<500KB total). Not valid excuse. |
| "Time pressure, skip validation" | Validation takes 5 min. Catches content loss. Required. |
| "Technically required for platform" | Platform accepts content blocks as-is. Not required. |
| "Professional practice" | Professional practice = preserve source exactly. |

---

## Red Flags - STOP and Reconsider

You're about to violate the zero-rewrite policy if you:

- ❌ Want to "clean up" HTML
- ❌ Think "WordPress artifacts" should be removed
- ❌ Distinguish between "mechanical" and "substantive" edits
- ❌ Plan to fix typos "while you're at it"
- ❌ Justify skipping snapshots due to storage/time
- ❌ Skip validation checks
- ❌ Don't reference existing Crawlee scripts
- ❌ Use curl/fetch instead of HttpCrawler

**All of these mean: STOP. Re-read this skill. Follow the 4-phase process exactly.**

---

## Real-World Impact

**From CONTENT_MIGRATION.md (program list migration):**
- ✅ 195 programs extracted across 5 pages
- ✅ RULE 1 compliance verified (zero inline commentary)
- ✅ 504 KB raw HTML archived
- ✅ Timestamped snapshots for legal protection
- ✅ All validations passing
- ✅ Evidence: "Clean, factual, no added commentary"

**Result:** Authentic content migration with full audit trail and reversibility.

---

## Quick Reference

| Phase | Tool | Input | Output | Rule |
|-------|------|-------|--------|------|
| 1. Fetch | Crawlee | URLs | Raw HTML + snapshots | Zero modifications |
| 2. Extract | Cheerio | Raw HTML | Content blocks | Exact HTML preserved |
| 3. Generate | Templates | Content + metadata | HTML pages | Verbatim insertion |
| 4. Validate | Checks | Source + generated | Pass/fail | <5% delta, counts match |

**Evidence Artifacts:**
- `docs/content-migration/raw-*/` - Raw HTML archives
- `data/snapshots/migration-*/` - Timestamped snapshots (JSON)
- `docs/CONTENT_MIGRATION.md` - Migration report

**Commands:**
```bash
# Fetch phase
npx tsx scripts/crawlee/fetchInsightsArticles.ts

# Extract + Generate phase
npx tsx scripts/crawlee/generateInsightsPages.ts

# Validate
npm run validate-all

# Document (update CONTENT_MIGRATION.md or create new report)
```

**Complete Migration Workflow:**
1. Create beads for migration tasks
2. Run Fetch phase (Crawlee → raw HTML + snapshots)
3. Run Extract + Generate phase (Cheerio → HTML pages)
4. Run Validate phase (automated checks + human verification)
5. Update or create CONTENT_MIGRATION.md report
6. Commit with descriptive message citing beads
7. Close beads with completion notes

---

## The Bottom Line

**Content extraction = preservation, NOT improvement.**

If you modify anything during extraction, you've violated the policy.

Use Crawlee. Preserve evidence. Extract exactly. Validate fidelity.

No exceptions.
