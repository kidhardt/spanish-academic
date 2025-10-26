# Example Usage: Using Sensitive Content Skill

## Real Example: Flagship Insights Articles Migration

This document shows the actual usage of the `using-sensitive-content` skill during the flagship articles migration on 2025-10-25.

---

## Scenario

Migrated 2 flagship Insights articles from WordPress following zero-rewrite policy:
1. "How to Choose a Graduate Program in Spanish"
2. "Graduate Program Rankings for Spanish Literature and Linguistics"

Both articles contain high-sensitivity content that requires governance compliance before deployment.

---

## Step 1: Migration Completed (Zero Rewrites)

```bash
# Fetch articles using Crawlee
npx tsx scripts/crawlee/fetchInsightsArticles.ts

# Extract and generate HTML pages (preserving exact WordPress HTML)
npx tsx scripts/crawlee/generateInsightsPages.ts
```

**Result:**
- ✅ 2 English articles generated
- ✅ 2 Spanish placeholders created
- ✅ WordPress HTML preserved exactly (ZERO rewrites)
- ✅ Evidence archived (241 KB raw HTML + snapshots)

---

## Step 2: Identify Sensitive Content

**Article 1: how-to-choose-a-graduate-program.html**

Content found:
- Specific stipend amounts: "$18,000/year", "$35,000 NYU stipend"
- Salary references: "poverty level", "TA salary"
- Job market predictions: "job market for Spanish professors"
- Career advice: hiring decisions, employment outlook

**Article 2: graduate-program-rankings.html**

Content found:
- NRC rankings discussion
- Methodology critiques
- Ranking comparisons
- Subjectivity warnings needed

---

## Step 3: Create Tracking Items

### Item SC-001: Financial + Career Disclaimers

```bash
npm run sensitive-content:add -- \
  --file "public/insights/how-to-choose-a-graduate-program.html" \
  --type "missing-disclaimer" \
  --severity "high" \
  --warnings "funding-amounts,stipend-amounts,career-advice,job-market" \
  --description "Contains specific funding amounts (\$18k, \$35k NYU stipend) and job market predictions without disclaimers" \
  --blocks-deployment
```

**Output:**
```
✅ Created tracking item: SC-001
   File: public/insights/how-to-choose-a-graduate-program.html
   Type: missing-disclaimer
   Severity: high
   Blocks Deployment: YES
   Required Actions:
     - Add HTML disclaimer: 'This is informational, not financial advice'
     - Add HTML disclaimer: 'General information only. Not professional career counseling.'
     - Add lastReviewed field to JSON twin: 2025-10-26
```

---

### Item SC-002: Rankings Disclaimer

```bash
npm run sensitive-content:add -- \
  --file "public/insights/graduate-program-rankings.html" \
  --type "missing-disclaimer" \
  --severity "high" \
  --warnings "rankings,methodology" \
  --description "Discusses NRC rankings and methodology without ranking disclaimer or subjectivity warning" \
  --blocks-deployment
```

**Output:**
```
✅ Created tracking item: SC-002
   File: public/insights/graduate-program-rankings.html
   Type: missing-disclaimer
   Severity: high
   Blocks Deployment: YES
   Required Actions:
     - Add HTML disclaimer: 'Rankings are subjective. Not a sole decision factor.'
     - Add lastReviewed field to JSON twin: 2025-10-26
```

---

## Step 4: Review Tracking Status

```bash
npm run sensitive-content:list
```

**Output:**
```
================================================================================
SENSITIVE CONTENT TRACKING ITEMS
================================================================================

Total Items: 2
  Pending: 2
  In Progress: 0
  Resolved: 0
  Deferred: 0

⚠️  2 item(s) BLOCK DEPLOYMENT

--------------------------------------------------------------------------------

⏳ SC-001 ⚠️ [high] 🔒
   File: public/insights/how-to-choose-a-graduate-program.html
   Type: missing-disclaimer
   Status: pending
   [... details ...]

⏳ SC-002 ⚠️ [high] 🔒
   File: public/insights/graduate-program-rankings.html
   Type: missing-disclaimer
   Status: pending
   [... details ...]
```

---

## Step 5: Commit Migration Work

```bash
git add .
git commit -m "feat(insights): migrate flagship articles with zero rewrites

- Fetched 2 articles using Crawlee (240 KB source content)
- Extracted exact WordPress HTML with Cheerio (67,786 chars)
- Generated 4 pages (2 EN + 2 ES placeholders)
- Preserved evidence: raw HTML + timestamped snapshots

Zero-rewrite policy enforced: NO content modifications

Tracking items created:
- SC-001: Disclaimers needed for funding/career advice
- SC-002: Disclaimers needed for rankings

Note: Items block deployment. Will resolve in content-polish phase.

🤖 Generated with Claude Code"
```

**Status:** Migration committed ✅, but validation shows blocking items exist

---

## Step 6: Validate Before Deployment

```bash
# Warning mode (allows commit, exit 0)
npm run sensitive-content:validate
```

**Output:**
```
❌ COMPLIANCE CHECK: FAIL
   2 BLOCKING ISSUE(S) FOUND

[... shows SC-001 and SC-002 ...]

ℹ️  Exiting with code 0 (warning mode)
   Deployment validation will fail in strict mode.
```

---

```bash
# Strict mode (blocks deployment, exit 1)
npm run sensitive-content:validate --strict
```

**Output:**
```
❌ COMPLIANCE CHECK: FAIL
   2 BLOCKING ISSUE(S) FOUND

[... shows items ...]

⚠️  Exiting with error code 1 (strict mode)
   Deployment blocked until issues resolved.
```

**Result:** Cannot deploy to production until items resolved ✅

---

## Step 7: Content Polish Phase (Future)

### Fix SC-001: Add Financial + Career Disclaimers

**Edit `public/insights/how-to-choose-a-graduate-program.html`:**

Add before closing `</main>`:

```html
<aside class="disclaimer" role="complementary">
  <h3>Important Disclaimers</h3>

  <p><strong>Financial Information:</strong> Funding amounts, stipend levels, and tuition information mentioned in this article are provided for informational purposes only and may have changed since publication. Always verify current funding details directly with universities. This is not financial advice. Last reviewed: 2025-10-26</p>

  <p><strong>Career Guidance:</strong> Job market information and career advice are based on general trends and do not guarantee employment outcomes. Individual experiences vary significantly based on specialization, location, and market conditions. This is informational content, not professional career counseling. Last reviewed: 2025-10-26</p>
</aside>
```

**Update `public/insights/how-to-choose-a-graduate-program.json`:**

```json
{
  "lastReviewed": "2025-10-26",
  "sensitivityLevel": "high",
  "contentWarnings": ["funding-amounts", "stipend-amounts", "career-advice", "job-market"],
  "disclaimer": "Contains financial and career information. Not professional advice."
}
```

**Commit and resolve:**

```bash
git add public/insights/how-to-choose-a-graduate-program.html
git add public/insights/how-to-choose-a-graduate-program.json
git commit -m "feat(disclaimers): add financial and career disclaimers to choosing program article

- Added dual disclaimer block (financial + career)
- Updated JSON twin with lastReviewed and warnings
- Verified NYU $35k stipend is current (Fall 2025)

Resolves SC-001"

# Get commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)

# Mark as resolved
npm run sensitive-content:resolve SC-001 -- \
  --commit "$COMMIT_HASH" \
  --note "Added financial and career disclaimers. Verified funding amounts current as of Fall 2025."
```

**Output:**
```
✅ Resolved item: SC-001
   File: public/insights/how-to-choose-a-graduate-program.html
   Commit: a1b2c3d
   Note: Added financial and career disclaimers. Verified funding amounts current as of Fall 2025.

⚠️  1 blocking item(s) still pending
   Run: npm run sensitive-content:list --blocking-only
```

---

### Fix SC-002: Add Rankings Disclaimer

**Edit `public/insights/graduate-program-rankings.html`:**

```html
<aside class="disclaimer" role="complementary">
  <h3>Ranking Methodology Disclaimer</h3>

  <p><strong>Rankings Information:</strong> Program rankings discussed in this article (including NRC rankings) are subjective, methodology-dependent, and change over time. No ranking system can account for individual fit, research interests, faculty mentorship, or personal goals. Rankings should be used as one of many factors in your graduate program decision, not as the sole criterion. Methodology limitations are discussed in the article. Last reviewed: 2025-10-26</p>
</aside>
```

**Update JSON twin, commit, and resolve:**

```bash
git add public/insights/graduate-program-rankings.html
git add public/insights/graduate-program-rankings.json
git commit -m "feat(disclaimers): add ranking methodology disclaimer

- Added ranking subjectivity warning
- Updated JSON twin with lastReviewed field
- Documented methodology limitations

Resolves SC-002"

COMMIT_HASH=$(git rev-parse --short HEAD)

npm run sensitive-content:resolve SC-002 -- \
  --commit "$COMMIT_HASH" \
  --note "Added ranking methodology disclaimer with subjectivity warning"
```

**Output:**
```
✅ Resolved item: SC-002
   File: public/insights/graduate-program-rankings.html
   Commit: e4f5g6h
   Note: Added ranking methodology disclaimer with subjectivity warning

✅ No blocking items remain - ready for deployment validation
   Run: npm run sensitive-content:validate --strict
```

---

## Step 8: Final Validation

```bash
npm run sensitive-content:validate --strict
```

**Output:**
```
================================================================================
SENSITIVE CONTENT COMPLIANCE VALIDATION
================================================================================

Total Tracked Items: 2
  ✅ Resolved: 2
  ⏳ Pending: 0
  🔄 In Progress: 0
  ⏸️  Deferred: 0

--------------------------------------------------------------------------------

✅ COMPLIANCE CHECK: PASS
   No blocking items found.
   All high-sensitivity content properly governed.
   Safe to deploy.
```

**Result:** ✅ **Ready for Production Deployment**

---

## Step 9: Deploy

```bash
# Complete pre-deployment validation
npm run pre-deploy

# Output includes:
# - All static validations: PASS
# - Build: SUCCESS
# - Lighthouse mobile >90: PASS
# - Sensitive content compliance: PASS ✅

# Deploy to production
# (deployment steps here)
```

---

## Timeline Summary

| Date | Action | Status |
|------|--------|--------|
| 2025-10-25 | Migration completed (zero rewrites) | ✅ Committed |
| 2025-10-25 | SC-001, SC-002 created | 🔒 Blocking deployment |
| 2025-10-25 | Validated in warning mode | ⚠️ 2 blocking items |
| (Future) | Content polish: Fix SC-001 | ✅ Resolved |
| (Future) | Content polish: Fix SC-002 | ✅ Resolved |
| (Future) | Final validation --strict | ✅ PASS |
| (Future) | Deploy to production | ✅ Live |

---

## Key Benefits Demonstrated

1. **Separation of Concerns**
   - Migration (zero rewrites) separate from compliance (add disclaimers)
   - Can commit migration work without blocking development

2. **Audit Trail**
   - Every item tracked with creation date, resolution date, commit hash
   - Full history in version control (JSONL file)

3. **Pre-Deployment Gate**
   - `--strict` mode prevents accidental deployment
   - Clear actionable guidance on what needs fixing

4. **Transparency**
   - Stakeholders can run `npm run sensitive-content:list` anytime
   - See exactly what's pending, what's resolved, what blocks deployment

5. **Legal Protection**
   - Ensures disclaimers added before content goes live
   - Documents review dates for high-sensitivity topics

---

## Files Created

**Tracking Data:**
```
.claude/skills/using-sensitive-content/data/sensitive-content-tracker.jsonl
```

**Content:**
```jsonl
{"id":"SC-001","createdAt":"2025-10-25T...", "status":"pending",...}
{"id":"SC-002","createdAt":"2025-10-25T...", "status":"pending",...}
```

*After resolution, status becomes "resolved" with commit hash and timestamp.*

---

## Lessons Learned

1. **Create items immediately** during/after migration - don't rely on memory
2. **Be specific in descriptions** - mention actual dollar amounts, specific claims
3. **Use blocking flag wisely** - only for true deployment blockers
4. **Validate in warning mode** during development, strict mode before deployment
5. **Document resolution notes** - helps future audits understand what was fixed

---

**This example demonstrates the complete workflow from migration to deployment readiness.**
