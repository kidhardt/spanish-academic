# Crawlee Best Practices for spanishacademic.com

## Overview

This document captures best practices learned from successful content migrations using Crawlee for the Spanish Academic project.

## Why Crawlee?

**Compared to alternatives:**

| Tool | Pros | Cons | Use Case |
|------|------|------|----------|
| `curl` | Simple, fast | No rate limiting, no retry, manual error handling | One-off single page fetch |
| `fetch` / `axios` | Familiar API | Same as curl, requires manual queue management | Small scripts |
| **Crawlee** | Rate limiting, retries, queue, logging, respectful | Learning curve | **Production migrations** |

**Verdict:** Always use Crawlee for migrations. The 5-minute setup saves hours of debugging.

---

## HttpCrawler Configuration

### Basic Setup

```typescript
import { HttpCrawler } from 'crawlee';

const crawler = new HttpCrawler({
  maxRequestsPerMinute: 30,        // Respectful rate limiting
  requestHandlerTimeoutSecs: 30,   // Allow time for large pages
  maxRequestRetries: 3,            // Retry failed requests

  async requestHandler({ request, body, response }) {
    const url = request.url;
    const statusCode = response?.statusCode || 0;
    const content = body.toString();

    // Your extraction logic here
    console.log(`✅ Fetched: ${url} (${statusCode})`);
  },

  failedRequestHandler({ request, error }) {
    console.error(`❌ Failed: ${request.url}`, error.message);
  },
});

await crawler.run(urls);
```

### Rate Limiting Guidelines

**For spanishacademic.com (WordPress):**
- **10-30 requests/min** - Safe, respectful
- **50+ requests/min** - May trigger rate limiting
- **100+ requests/min** - Will likely be blocked

**For university sites:**
- **5-10 requests/min** - Very safe, minimal load
- **20+ requests/min** - Depends on server capacity

**Rule of thumb:** Start conservative (10 req/min), increase if needed.

---

## Snapshot Management

### Why Snapshots Matter

**Legal protection:**
- Proves what was published on migration date
- Defensible in content disputes
- Required for academic/citation contexts

**Drift detection:**
- Compare snapshots over time
- Track content changes
- Identify when source material updates

**Reversibility:**
- Can re-run extraction if migration had issues
- Original source preserved even if site goes offline

### Snapshot Format

```json
{
  "url": "https://spanishacademic.com/article-slug",
  "fetchedAt": "2025-10-25T23:14:15.370Z",
  "statusCode": 200,
  "contentLength": 135372,
  "content": "<!DOCTYPE html>..."
}
```

### Using snapshotManager.ts

```typescript
import { saveSnapshot } from '../../src/utils/snapshotManager.js';

// In your Crawlee requestHandler:
async requestHandler({ request, body, response }) {
  const content = body.toString();
  const statusCode = response?.statusCode || 0;

  // Save snapshot (returns path)
  const snapshotPath = saveSnapshot(request.url, content, statusCode);
  console.log(`📸 Snapshot: ${snapshotPath}`);
}
```

**Output location:**
- `data/snapshots/migration-{content-type}-{date}/`
- One JSON file per URL
- Organized by migration batch

---

## Cheerio Parsing Patterns

### Extract Content Blocks (NOT Individual Elements)

**❌ Bad: Extract and rebuild**
```typescript
const title = $('h1').text();
const para1 = $('p').eq(0).text();
const para2 = $('p').eq(1).text();

// Rebuild HTML (VIOLATES zero-rewrite)
const content = `<h1>${title}</h1><p>${para1}</p><p>${para2}</p>`;
```

**✅ Good: Extract entire content block**
```typescript
const contentBlock = $('article .entry-content').html();
// Preserves EXACT structure, ALL elements, formatting
```

### Filter Elements Without Modifying Them

**Pattern for program lists:**
```typescript
const programs = article.find('p').filter((_, el) => {
  const html = $(el).html() || '';
  // Filter BY CRITERIA (has link + university name)
  return html.includes('<strong>') && html.includes('<a href');
});

// Get exact HTML (preserves WordPress auto-paragraphs)
const exactHtml = $.html(programs);
```

**Key:** Use `.html()` not `.text()` to preserve structure.

### Handling WordPress Artifacts

**WordPress commonly adds:**
- Auto-paragraphs (`<p>` wrapping)
- Inline styles from WYSIWYG editor
- Empty `<p>&nbsp;</p>` for spacing
- Nested `<div class="wp-block-*">` wrappers

**Rule:** Extract all of it. Don't filter or "clean."

---

## Common Pitfalls

### 1. Using `.text()` Instead of `.html()`

**Problem:** `.text()` strips all HTML structure.

**Wrong:**
```typescript
const content = $('article').text(); // Loses all formatting
```

**Right:**
```typescript
const content = $('article').html(); // Preserves exact structure
```

---

### 2. Filtering "Unnecessary" Elements

**Problem:** Subjective judgment about what's "necessary."

**Wrong:**
```typescript
$('article').find('style').remove(); // "Clean up inline styles"
$('article').find('.wp-block-group').remove(); // "Remove WordPress wrappers"
```

**Right:**
```typescript
const content = $('article').html(); // Keep everything
```

---

### 3. Skipping Error Handling

**Problem:** Silent failures, incomplete migrations.

**Wrong:**
```typescript
async requestHandler({ request, body }) {
  const content = body.toString();
  writeFileSync(path, content); // What if this fails?
}
```

**Right:**
```typescript
async requestHandler({ request, body }) {
  try {
    const content = body.toString();
    writeFileSync(path, content);
    console.log(`✅ Saved: ${path}`);
  } catch (error) {
    console.error(`❌ Failed to save ${path}:`, error);
    throw error; // Crawlee will retry
  }
}
```

---

### 4. Forgetting to Save Raw HTML

**Problem:** Only saving processed output, losing source.

**Wrong:**
```typescript
const cleaned = cleanHtml(content); // Process content
writeFileSync(output, cleaned);     // Save only processed
// Raw HTML is lost!
```

**Right:**
```typescript
writeFileSync(rawPath, content);       // Save raw FIRST
saveSnapshot(url, content, status);    // Snapshot FIRST
const processed = process(content);    // Then process
writeFileSync(outputPath, processed);  // Then save output
```

---

## Evidence Directory Structure

```
docs/content-migration/
  raw-lists/
    spanish-linguistics.html           (Raw WordPress HTML)
    translation-and-interpreting.html
  raw-insights/
    how-to-choose-graduate-program.html
    understanding-program-rankings.html

data/snapshots/
  migration-lists-2025-10-25/
    spanish-linguistics.json           (Timestamped snapshot)
    translation-and-interpreting.json
  migration-insights-2025-10-25/
    how-to-choose-graduate-program.json
    understanding-program-rankings.json
```

**Naming convention:**
- Raw HTML: Use source URL slug
- Snapshots: Use source URL slug + `.json`
- Group by migration batch (by content type + date)

---

## Migration Report Template

**Every migration MUST produce a report.** See [CONTENT_MIGRATION.md](../../../docs/CONTENT_MIGRATION.md) for full example.

**Minimum sections:**
1. **Executive Summary** - What was migrated, how many items
2. **Source URLs** - Full list with HTTP status
3. **URL Mapping** - Old → New
4. **Content Extracted** - Counts, file sizes
5. **Evidence Preservation** - Raw HTML + snapshot locations
6. **Generated Pages** - English + Spanish (placeholders)
7. **RULE 1 Compliance** (if program lists) - Verify zero commentary
8. **Validation Results** - All checks with pass/fail
9. **Manual Fixes Required** - SEO, translation, etc.
10. **Sign-Off** - Status, blockers, ready for next phase

---

## Performance Tips

### Batch URLs Efficiently

**For small batches (<10 URLs):**
```typescript
await crawler.run(urls); // Simple, synchronous
```

**For large batches (100+ URLs):**
```typescript
await crawler.addRequests(urls); // Adds to queue
await crawler.run();             // Processes queue with rate limiting
```

### Monitor Progress

```typescript
let processed = 0;
const total = urls.length;

async requestHandler({ request, body }) {
  processed++;
  console.log(`[${processed}/${total}] Processing: ${request.url}`);
  // ... rest of handler
}
```

### Handle Large Pages

**If pages timeout:**
- Increase `requestHandlerTimeoutSecs`
- Check page size (maybe needs pagination handling)
- Verify server isn't rate-limiting

---

## Troubleshooting

### "Request timed out"

**Cause:** Page too large or server slow.

**Fix:**
```typescript
requestHandlerTimeoutSecs: 60, // Increase from 30
```

### "429 Too Many Requests"

**Cause:** Rate limiting triggered.

**Fix:**
```typescript
maxRequestsPerMinute: 10, // Reduce from 30
```

### "Empty body" or "null response"

**Cause:** Server blocking, incorrect URL, or page requires auth.

**Fix:**
- Check URL in browser
- Verify no login required
- Add user agent if needed:
  ```typescript
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SpanishAcademicBot/1.0)',
  }
  ```

---

## Summary

**Crawlee best practices:**
1. Always use HttpCrawler (not curl/fetch)
2. Set respectful rate limits (10-30 req/min)
3. Save raw HTML + snapshots BEFORE processing
4. Use Cheerio `.html()` not `.text()`
5. Extract content blocks, don't rebuild
6. Handle errors explicitly
7. Log progress clearly
8. Create migration report

**These practices ensure:**
- ✅ Legal protection (snapshots)
- ✅ Reversibility (raw HTML)
- ✅ Zero rewrites (exact HTML extraction)
- ✅ Respectful scraping (rate limiting)
- ✅ Reliable migrations (error handling)
