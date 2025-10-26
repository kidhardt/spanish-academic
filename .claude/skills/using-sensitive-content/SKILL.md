# Using Sensitive Content Skill

## Overview

**Purpose:** Track and manage high-sensitivity content that requires governance compliance before deployment (RULE 3 enforcement).

**When to Use:** When content contains funding amounts, immigration/visa advice, job market predictions, academic integrity issues, or AI ethics discussions that require disclaimers and `lastReviewed` fields.

**Core Principle:** Separate content migration (zero-rewrite) from governance compliance (add disclaimers later) while ensuring nothing ships without proper safeguards.

---

## The Problem This Skill Solves

### Without This Skill:
- ❌ Sensitive content issues discovered during migration get lost
- ❌ No systematic tracking of what needs disclaimers
- ❌ Risk of deploying content with funding amounts, visa advice, or career predictions without warnings
- ❌ Manual memory-based tracking ("I think we need to add disclaimers somewhere...")
- ❌ No pre-deployment validation gate

### With This Skill:
- ✅ All sensitive content issues tracked in version-controlled JSONL file
- ✅ Automated validation prevents deployment with unresolved blocking items
- ✅ Clear audit trail: when created, who resolved, which commit
- ✅ Integration with data-governance-scan for automatic detection
- ✅ Transparent reporting for stakeholders

---

## When to Activate This Skill

**Mandatory:**
1. After migrating content from external sources (WordPress, other CMSs)
2. When creating Insights articles about funding, visas, jobs, rankings
3. When data-governance-scan reports violations
4. Before deployment (validation check)

**Recommended:**
5. When user asks: "what disclaimers are needed?"
6. When writing Help/Q&A pages about high-stakes topics
7. During content review/audit phases

**Proactive:**
8. After any content creation that mentions specific dollar amounts
9. After any content giving immigration, legal, or career advice
10. When AI detects sensitive patterns during generation

---

## Core Workflow

### 1. **Detection Phase** (During Migration/Creation)

When sensitive content is detected:

```bash
# Add tracking item
npm run sensitive-content:add -- \
  --file "public/insights/article-slug.html" \
  --type "missing-disclaimer" \
  --severity "high" \
  --warnings "funding-amounts,career-advice" \
  --description "Contains NYU $35k stipend without financial disclaimer" \
  --blocks-deployment
```

**Common Issue Types:**
- `missing-disclaimer` - Content needs HTML disclaimer
- `missing-lastReviewed` - JSON twin needs lastReviewed field
- `outdated-amounts` - Funding/stipend amounts may be stale
- `unverified-claims` - Statements need fact-checking
- `immigration-advice` - Visa/work authorization content without legal disclaimer

**Severity Levels:**
- `blocker` - MUST fix before deployment (prevents launch)
- `high` - SHOULD fix before deployment (allows dev commits)
- `medium` - Fix in next sprint
- `low` - Track for future improvement

---

### 2. **Tracking Phase** (Version Control)

All items stored in: `.claude/skills/using-sensitive-content/data/sensitive-content-tracker.jsonl`

**Format (one JSON object per line):**
```json
{
  "id": "SC-001",
  "createdAt": "2025-10-25T23:45:00Z",
  "status": "pending",
  "filePath": "public/insights/how-to-choose-a-graduate-program.html",
  "issueType": "missing-disclaimer",
  "severity": "high",
  "description": "Contains funding amounts ($18k, $35k) without financial disclaimer",
  "requiredActions": [
    "Add disclaimer: 'This is informational, not financial advice'",
    "Add lastReviewed: '2025-10-25' to JSON twin",
    "Verify funding amounts are current"
  ],
  "contentWarnings": ["funding-amounts", "career-advice"],
  "blocksDeployment": true,
  "assignedCommit": null,
  "resolvedAt": null,
  "resolvedBy": null,
  "notes": []
}
```

**Status Values:**
- `pending` - Needs action
- `in-progress` - Being worked on
- `resolved` - Fixed and verified
- `deferred` - Acknowledged but postponed (requires justification)

---

### 3. **Validation Phase** (Pre-commit / Pre-deployment)

```bash
# Check for blocking items (exits with code 1 if found)
npm run sensitive-content:validate

# Example output:
# ❌ BLOCKING ISSUES FOUND (2)
#
# SC-001 [high] public/insights/how-to-choose-a-graduate-program.html
#   Issue: missing-disclaimer
#   Required: Add financial disclaimer, verify funding amounts
#
# SC-002 [high] public/insights/graduate-program-rankings.html
#   Issue: missing-disclaimer
#   Required: Add methodology disclaimer
#
# ⚠️  Cannot deploy until these issues are resolved.
# Run: npm run sensitive-content:list for full details
```

**Integration Points:**
- `npm run validate-all` - Includes sensitive content check
- `npm run pre-deploy` - Blocks deployment if issues exist (strict mode)
- Git pre-commit hook (optional) - Warn but allow commit during dev

---

### 4. **Resolution Phase** (Content Polish)

```bash
# List all pending items
npm run sensitive-content:list

# Shows:
# ID      File                                Type                Severity  Status    Blocks
# SC-001  .../how-to-choose-a-graduate-pr...  missing-disclaimer  high      pending   YES
# SC-002  .../graduate-program-rankings.html  missing-disclaimer  high      pending   YES

# After fixing the issue:
npm run sensitive-content:resolve SC-001 \
  --commit "abc123def" \
  --note "Added financial disclaimer and lastReviewed field"

# Verify all resolved:
npm run sensitive-content:validate
# ✅ No blocking issues. Safe to deploy.
```

---

## Automatic Detection Patterns

The skill automatically detects sensitive content using regex patterns:

### Funding/Financial Content:
```javascript
/\$\d+[,\d]*\s*(stipend|salary|funding|grant)/i
/(\d+k|\d+,\d+)\s*(per year|annually|\/year)/i
/(tuition\s+)?(waiver|remission|covered|free)/i
```

### Immigration/Visa Content:
```javascript
/(visa|immigration|work authorization|H-1B|F-1|J-1)/i
/(sponsor|sponsorship)\s+(visa|immigration)/i
/international\s+student.*(work|employment)/i
```

### Job Market/Career Advice:
```javascript
/(job market|hiring|employment)\s+(prospects|outlook|guarantee)/i
/(salary|compensation)\s+(range|expectation)/i
/guarantee.*(job|employment|position)/i
```

### Rankings/Comparisons:
```javascript
/(best|top|ranked|elite)\s+(program|university|department)/i
/rank(ing|ed)\s+#?\d+/i
/(NRC|US News)\s+rank/i
```

**When patterns match:** Automatically create tracking item with severity based on context.

---

## Integration with Existing Scripts

### 1. **Data Governance Scan Integration**

Modify `scripts/data-governance-scan.js`:

```javascript
import { addSensitiveContentItem } from '../.claude/skills/using-sensitive-content/scripts/add-item.js';

// After detecting missing disclaimer:
if (missingDisclaimer && hasFinancialContent) {
  await addSensitiveContentItem({
    file: htmlPath,
    type: 'missing-disclaimer',
    severity: 'high',
    warnings: ['funding-amounts'],
    description: 'Contains financial information without disclaimer',
    blocksDeployment: true
  });

  console.warn(`⚠️  Tracking item created for ${htmlPath}`);
}
```

### 2. **Migration Script Integration**

Add to `scripts/crawlee/generateInsightsPages.ts`:

```typescript
import { scanForSensitiveContent } from '../../.claude/skills/using-sensitive-content/scripts/scan.js';

// After generating page:
const sensitiveIssues = scanForSensitiveContent(article.mainContent, article.slug);

if (sensitiveIssues.length > 0) {
  console.warn(`⚠️  ${sensitiveIssues.length} sensitive content issue(s) detected`);
  console.warn(`   Run: npm run sensitive-content:list for details`);
}
```

### 3. **Validation Suite Integration**

Add to `package.json`:

```json
{
  "scripts": {
    "validate-all": "npm run generate-json && npm run validate-localization && npm run accessibility-scan && npm run data-governance-scan && npm run sensitive-content:validate",
    "pre-deploy": "npm run validate-all && npm run sensitive-content:validate --strict",
    "sensitive-content:add": "node .claude/skills/using-sensitive-content/scripts/add-item.js",
    "sensitive-content:list": "node .claude/skills/using-sensitive-content/scripts/list-items.js",
    "sensitive-content:resolve": "node .claude/skills/using-sensitive-content/scripts/resolve-item.js",
    "sensitive-content:validate": "node .claude/skills/using-sensitive-content/scripts/validate-compliance.js"
  }
}
```

---

## Required Disclaimers by Content Type

### Financial/Funding Content

**HTML Disclaimer:**
```html
<aside class="disclaimer" role="complementary">
  <p><strong>Financial Disclaimer:</strong> Funding amounts, stipend levels, and tuition information are provided for informational purposes only and may change. Always verify current funding details directly with universities. This is not financial advice. Last reviewed: YYYY-MM-DD</p>
</aside>
```

**JSON Twin:**
```json
{
  "lastReviewed": "2025-10-25",
  "contentWarnings": ["funding-amounts"],
  "disclaimer": "Informational purposes only. Not financial advice."
}
```

---

### Immigration/Visa Content

**HTML Disclaimer:**
```html
<aside class="disclaimer disclaimer--legal" role="complementary">
  <p><strong>Legal Disclaimer:</strong> This content is for informational purposes only and does not constitute legal or immigration advice. Visa policies and work authorization rules change frequently. Consult a qualified immigration attorney for personalized guidance. Last reviewed: YYYY-MM-DD</p>
</aside>
```

**JSON Twin:**
```json
{
  "lastReviewed": "2025-10-25",
  "sensitivityLevel": "high",
  "contentWarnings": ["immigration", "visa"],
  "disclaimer": "Not legal or immigration advice. Consult qualified attorney."
}
```

---

### Job Market/Career Advice

**HTML Disclaimer:**
```html
<aside class="disclaimer" role="complementary">
  <p><strong>Career Disclaimer:</strong> Job market information and career advice are based on general trends and do not guarantee employment outcomes. Individual experiences vary. This is informational content, not professional career counseling. Last reviewed: YYYY-MM-DD</p>
</aside>
```

**JSON Twin:**
```json
{
  "lastReviewed": "2025-10-25",
  "contentWarnings": ["career-advice", "job-market"],
  "disclaimer": "General information only. Not professional career counseling."
}
```

---

### Rankings/Comparisons

**HTML Disclaimer:**
```html
<aside class="disclaimer" role="complementary">
  <p><strong>Ranking Disclaimer:</strong> Program rankings are subjective, methodology-dependent, and change over time. No ranking system can account for individual fit, research interests, or personal goals. Use rankings as one of many factors in your decision. Last reviewed: YYYY-MM-DD</p>
</aside>
```

**JSON Twin:**
```json
{
  "lastReviewed": "2025-10-25",
  "contentWarnings": ["rankings", "comparisons"],
  "disclaimer": "Rankings are subjective. Not a sole decision factor."
}
```

---

## CLI Commands Reference

### Add Item
```bash
npm run sensitive-content:add -- \
  --file "public/insights/article.html" \
  --type "missing-disclaimer" \
  --severity "high" \
  --warnings "funding-amounts,career-advice" \
  --description "Brief description" \
  --blocks-deployment
```

### List Items
```bash
# All items
npm run sensitive-content:list

# Only blocking items
npm run sensitive-content:list --blocking-only

# By severity
npm run sensitive-content:list --severity high

# By status
npm run sensitive-content:list --status pending
```

### Resolve Item
```bash
npm run sensitive-content:resolve SC-001 \
  --commit "abc123" \
  --note "Added disclaimer and verified amounts"
```

### Validate
```bash
# Warn about blocking items (exit 0)
npm run sensitive-content:validate

# Fail if blocking items exist (exit 1)
npm run sensitive-content:validate --strict
```

### Generate Report
```bash
# Markdown report for stakeholders
npm run sensitive-content:report > sensitive-content-status.md
```

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] `npm run sensitive-content:validate --strict` passes (exit 0)
- [ ] All `blocker` severity items resolved
- [ ] All `high` severity items resolved or explicitly deferred with justification
- [ ] Each resolved item has `assignedCommit` documenting the fix
- [ ] All HTML disclaimers match required format for content type
- [ ] All JSON twins have `lastReviewed` field with current date
- [ ] Funding amounts and claims verified as current/accurate

---

## Example: Flagship Articles Migration

### Current Status (2025-10-25)

**SC-001: how-to-choose-a-graduate-program.html**
- Type: missing-disclaimer
- Severity: high
- Warnings: funding-amounts, career-advice, job-market
- Actions Required:
  1. Add financial disclaimer (mentions $18k, $35k stipends)
  2. Add career disclaimer (job market predictions)
  3. Add lastReviewed field to JSON twin
  4. Verify funding amounts current
- Blocks Deployment: Yes

**SC-002: graduate-program-rankings.html**
- Type: missing-disclaimer
- Severity: high
- Warnings: rankings, methodology
- Actions Required:
  1. Add ranking disclaimer (discusses NRC rankings)
  2. Add methodology warning
  3. Add lastReviewed field to JSON twin
- Blocks Deployment: Yes

### Resolution Plan

**Phase: Content Polish (before deployment)**

1. Add disclaimers to both articles
2. Verify funding amounts (NYU $35k, etc.) are current
3. Update JSON twins with lastReviewed and warnings
4. Resolve tracking items with commit hash
5. Re-run validation: `npm run sensitive-content:validate --strict`
6. Deploy ✅

---

## Benefits

1. **Never Lose Track** - All governance issues version-controlled
2. **Pre-Deployment Safety** - Automated gate prevents shipping sensitive content without disclaimers
3. **Audit Trail** - Know when created, resolved, by whom, in which commit
4. **Separation of Concerns** - Migrate content (zero-rewrite) separately from adding disclaimers
5. **Transparency** - Clear visibility into compliance status
6. **Regulatory Protection** - Legal/financial disclaimers protect organization and users
7. **User Trust** - Shows responsibility about information limitations

---

## Files and Locations

**Tracking Data:**
- `.claude/skills/using-sensitive-content/data/sensitive-content-tracker.jsonl` - Main tracking file (version-controlled)

**Scripts:**
- `.claude/skills/using-sensitive-content/scripts/add-item.js` - Add new item
- `.claude/skills/using-sensitive-content/scripts/list-items.js` - List items
- `.claude/skills/using-sensitive-content/scripts/resolve-item.js` - Mark resolved
- `.claude/skills/using-sensitive-content/scripts/validate-compliance.js` - Pre-deploy check

**Documentation:**
- `.claude/skills/using-sensitive-content/SKILL.md` - This file
- `.claude/skills/using-sensitive-content/references/tracking-schema.md` - JSON schema reference
- `.claude/skills/using-sensitive-content/references/ymyl-eeat-guidelines.md` - **COMPREHENSIVE YMYL/E-E-A-T IMPLEMENTATION GUIDE**
- `.claude/skills/using-sensitive-content/references/example-usage.md` - Real-world usage example

---

## Comprehensive YMYL/E-E-A-T Implementation Guidelines

**CRITICAL REFERENCE:** For complete implementation details on handling YMYL (Your Money or Your Life) content that meets Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) standards, see:

**[references/ymyl-eeat-guidelines.md](references/ymyl-eeat-guidelines.md)**

This comprehensive guide covers:

### I. Core Principles
- Accuracy, Transparency, Accountability, Experience, Trust

### II. Detailed Implementation (15 sections)
- **A. Purpose and Scope Statement** - Clear content purpose and audience
- **B. Demonstrate First-Hand Experience** - Author credentials, case studies, original research
- **C. Accuracy, Sources, and Attribution** - Primary sources, temporal scope, verification
- **D. Disclaimers and Risk Mitigation** - Content-type specific disclaimers (financial, legal, career, rankings)
- **E. Freshness, Review Date, and Content Lifecycle** - lastReviewed, review schedules
- **F. Public Changelog and Feedback Loop** - Transparent updates, user feedback
- **G. Structured Data and Schema Usage** - Article, EducationalOccupationalProgram, FAQ, Review schemas
- **H. Expertise, Authoritativeness, and Trust** - Author bios, reviewer credentials, accountability
- **I. Avoid Misleading or Incomplete Content** - Context for claims, data coverage statements
- **J. Accessibility and UX Integrity** - Semantic HTML, ARIA, legible disclaimers
- **K. Version Control and Governance** - Audit trails, content stewards, archived versions
- **L. Localization and Jurisdiction** - Geographic scope, currency, jurisdictional clarity
- **M. Ethical and Legal Boundaries** - No individualized advice, professional referrals
- **N. AI-Generated and Assisted Content** - Disclosure, mandatory human review
- **O. Ethical Presentation and Monetization** - Ads separation, no paywalls for critical info

### III. Implementation Examples
Every section includes:
- ❌ BAD examples (what not to do)
- ✅ GOOD examples (correct implementation)
- Complete HTML/JSON code samples
- Specific guidance for each content type

### IV. Summary Table: Good, Better, Best
Progression from current standards to gold standard across all dimensions.

### V. Final Checklist Before Publishing
12-point pre-publication checklist covering all critical elements.

### VI. Implementation Priority
- High Priority (must implement before publication)
- Medium Priority (within 30 days)
- Lower Priority (within 90 days)

### VII. Monitoring and Maintenance
Monthly, quarterly, semi-annual, and annual review cycles.

---

## When Resolving Sensitive Content Items

**Before marking SC-XXX as resolved, ensure you've implemented appropriate guidance from ymyl-eeat-guidelines.md:**

1. **For Financial/Funding Content (SC-001 example):**
   - Add financial disclaimer (see Section D)
   - Include author credentials (see Section B, H)
   - Add lastReviewed date (see Section E)
   - Verify amounts with sources (see Section C)
   - Add structured data (see Section G)
   - Reference professional advisors (see Section M)

2. **For Rankings Content (SC-002 example):**
   - Add ranking disclaimer (see Section D)
   - Document methodology limitations (see Section I)
   - Add reviewer credentials (see Section H)
   - Include lastReviewed date (see Section E)
   - Frame as "one factor among many" (see Section D)

3. **For Career/Job Market Content:**
   - Add career disclaimer (see Section D)
   - Use conditional phrasing (see Section M)
   - Cite data sources (see Section C)
   - Add professional referrals (see Section M)

4. **For Immigration/Visa Content:**
   - Add legal disclaimer (see Section D)
   - Specify jurisdiction (see Section L)
   - Link to USCIS/official sources (see Section M)
   - Attorney referral information (see Section M)

**Complete implementation checklist in Section V of ymyl-eeat-guidelines.md**

---

## The Bottom Line

**High-sensitivity content requires governance.** This skill ensures nothing slips through the cracks.

Use it during migration. Use it during creation. Use it before deployment.

**For complete implementation guidance, always reference ymyl-eeat-guidelines.md before resolving tracking items.**

No exceptions.
