# Localization Parity System

**Spanish Academic 2026**
**Version:** 1.0.0
**Last Updated:** 2025-10-26

---

## Overview

The Localization Parity System manages bilingual content requirements for Spanish Academic. By default, all pages require **PARITY** (bilingual versions in both `/` and `/es/`). Certain content types may be designated as **NON-PARITY** (single language only) after user approval.

### Critical Principle

**Citation Preservation**: Scholarly work MUST stay in original language to maintain academic integrity and citability.

---

## Parity Categories

### PARITY (Default)

**Bilingual required** - Page must exist in both English and Spanish

**Applies to:**
- Program list pages
- Program detail pages
- Insights articles (guidance content)
- Help/Q&A pages
- Navigation pages
- Contact forms
- About pages

**Requirements:**
- Counterpart page at `/es/` with translated slug
- `path_en` and `path_es` metadata
- Bidirectional `hreflang` links
- Language switcher in navigation
- Validation enforces bilingual checks

**Example:**
```
/insights/how-to-choose-a-graduate-program.html
/es/articulos/como-elegir-un-programa-de-posgrado.html
```

### NON-PARITY (Exception)

**Single language allowed** - Page exists in one language only

**Requires:**
- User approval BEFORE designation
- Valid reason (see below)
- Explicit metadata in HTML

**Valid Reasons:**

1. **`scholarly-article-original-language`**
   - Academic essays/articles in original language
   - Citation preservation required
   - Academic integrity demands original text
   - Example: Spanish literatura analysis published originally in Spanish

2. **`language-specific-content`**
   - Content relevant to only one language community
   - Example: English-only resources for teaching Spanish in US universities

3. **`cultural-specific-resource`**
   - Resources specific to one cultural context
   - Example: Immigration resources specific to US graduate students

4. **`original-publication`**
   - First-party research published in original language
   - Example: Faculty scholarship republished with permission

---

## User Approval Protocol

**CRITICAL:** AI agents MUST ask user before designating any page as NON-PARITY.

### Approval Template

```
📋 PARITY DESIGNATION REQUIRED

I'm creating: [page-name]

Should this page have:
1. PARITY (bilingual) - Requires counterpart in both / and /es/
2. NON-PARITY (single language) - Exists in one language only

Reason for NON-PARITY (if applicable):
  - scholarly-article-original-language
  - language-specific-content
  - cultural-specific-resource
  - original-publication

If NON-PARITY, what language: [en | es]
```

### Example User Interaction

**AI Agent:**
> 📋 PARITY DESIGNATION REQUIRED
>
> I'm creating: "/scholarship/1492.html" (Artículo académico sobre la literatura del descubrimiento)
>
> Should this page have:
> 1. PARITY (bilingual)
> 2. NON-PARITY (single language)
>
> Reason: scholarly-article-original-language (published originally in Spanish)
> Language: es

**User:**
> NON-PARITY, scholarly article in original Spanish

**AI Agent:**
> ✅ Confirmed. Designating as NON-PARITY.
> Recording: npm run parity:designate -- --path "/scholarship/1492.html" --parity false --reason "scholarly-article-original-language" --language "es"

---

## Technical Implementation

### 1. HTML Metadata

#### PARITY Pages (Default)

```html
<!-- Localization parity default: true -->
<meta name="path_en" content="/insights/article.html">
<meta name="path_es" content="/es/articulos/articulo.html">

<link rel="alternate" hreflang="en" href="https://spanishacademic.com/insights/article.html">
<link rel="alternate" hreflang="es" href="https://spanishacademic.com/es/articulos/articulo.html">
<link rel="alternate" hreflang="x-default" href="https://spanishacademic.com/insights/article.html">
```

#### NON-PARITY Pages (Explicit)

```html
<!-- Localization Parity: NON-PARITY -->
<meta name="localization_parity" content="false">
<meta name="parity_reason" content="scholarly-article-original-language">
<meta name="page_language" content="es">

<!-- Self-referential hreflang only (no alternate language) -->
<link rel="alternate" hreflang="es" href="https://spanishacademic.com/scholarship/article.html">
<link rel="alternate" hreflang="x-default" href="https://spanishacademic.com/scholarship/article.html">
```

### 2. Tracking File

**Location:** `.claude/data/localization-parity.jsonl`

**Format:** Line-delimited JSON (one entry per line)

**Schema:**
```json
{
  "path": "/scholarship/article.html",
  "parity": false,
  "reason": "scholarly-article-original-language",
  "language": "es",
  "decidedBy": "user",
  "decidedAt": "2025-10-26T14:35:22.000Z"
}
```

**Properties:**
- `path` (string): Page path relative to `/public/`
- `parity` (boolean): `true` = PARITY, `false` = NON-PARITY
- `reason` (string | null): Required for NON-PARITY, one of 4 valid reasons
- `language` (string | null): Required for NON-PARITY, `"en"` or `"es"`
- `decidedBy` (string): Always `"user"` (human approval)
- `decidedAt` (string): ISO 8601 timestamp

**Audit Trail:** File is append-only. Never delete entries. Maintains full history.

### 3. NPM Scripts

#### Designate Parity

```bash
# NON-PARITY (after user approval)
npm run parity:designate -- \
  --path "/scholarship/article.html" \
  --parity false \
  --reason "scholarly-article-original-language" \
  --language "es"

# PARITY (explicit, optional - default behavior)
npm run parity:designate -- \
  --path "/insights/article.html" \
  --parity true
```

#### List Designations

```bash
# All designations
npm run parity:list

# NON-PARITY only
npm run parity:list -- --parity false

# PARITY only
npm run parity:list -- --parity true
```

**Output Example:**
```
================================================================================
LOCALIZATION PARITY DESIGNATIONS
================================================================================

Total Designations: 11
  ✅ PARITY (bilingual): 0
  🔀 NON-PARITY (single language): 11

--------------------------------------------------------------------------------

🔀 NON-PARITY: /scholarship/1492.html
   Reason: scholarly-article-original-language
   Language: es
   Decided: 2025-10-26 2:35 PM
   Decided By: user

🔀 NON-PARITY: /scholarship/tirso-de-molina.html
   Reason: scholarly-article-original-language
   Language: es
   Decided: 2025-10-26 2:36 PM
   Decided By: user

[...]

NON-PARITY Reasons:
  - scholarly-article-original-language: 11
```

### 4. Validation Behavior

**Script:** `scripts/validate_localization.js`

#### PARITY Pages (Default)

**Enforces:**
- ✅ `lang` attribute on `<html>`
- ✅ `path_en` and `path_es` metadata present
- ✅ Hreflang links for `en`, `es`, `x-default`
- ✅ Self-referential hreflang
- ✅ Alternate language link
- ✅ Bilingual counterpart file exists
- ✅ Language switcher in navigation
- ⚠️ Warns about missing hreflang `x-default`

**Orphan Checking:**
- English page → Spanish counterpart REQUIRED
- Spanish page → English counterpart REQUIRED

#### NON-PARITY Pages (Explicit)

**Enforces:**
- ✅ `lang` attribute on `<html>`
- ⚠️ Warns if `parity_reason` missing
- ⚠️ Warns if `page_language` missing

**Skips:**
- ❌ `path_en` / `path_es` validation
- ❌ Hreflang alternate language link
- ❌ Bilingual counterpart existence check
- ❌ Orphan detection

**Output:**
```
ℹ️  scholarship/1492.html - NON-PARITY (scholarly-article-original-language)
```

### 5. Template Usage

#### For PARITY Pages

Use: `templates/base.html`

Uncomment parity metadata section if you want to make it explicit (optional):
```html
<!-- Localization Parity (default: true - bilingual required) -->
<!-- Uncomment for explicit PARITY designation:
<meta name="localization_parity" content="true">
-->
```

#### For NON-PARITY Pages

Use: `templates/scholarship-base.html`

Pre-configured with:
- `localization_parity: false`
- `parity_reason: scholarly-article-original-language`
- `page_language: es`
- Self-referential hreflang only
- Spanish navigation
- Schema.org `ScholarlyArticle` markup

---

## Workflow Examples

### Example 1: Creating a Bilingual Insights Article (PARITY)

**Step 1: Create English page**

`public/insights/funding-strategies.html`

```html
<meta name="path_en" content="/insights/funding-strategies.html">
<meta name="path_es" content="/es/articulos/estrategias-de-financiacion.html">
```

**Step 2: Create Spanish counterpart**

`public/es/articulos/estrategias-de-financiacion.html`

```html
<meta name="path_en" content="/insights/funding-strategies.html">
<meta name="path_es" content="/es/articulos/estrategias-de-financiacion.html">
```

**Step 3: Validate**

```bash
npm run validate-localization
```

**Result:** ✅ PASS (default PARITY behavior, no designation needed)

---

### Example 2: Creating a Spanish Scholarly Article (NON-PARITY)

**Step 1: User approval**

AI Agent asks:
> 📋 PARITY DESIGNATION REQUIRED
>
> I'm creating: "/scholarship/la-celestina-analisis.html"
> (Análisis literario de La Celestina por Dr. García)
>
> Should this page have:
> 1. PARITY (bilingual)
> 2. NON-PARITY (single language)
>
> Reason: scholarly-article-original-language
> Language: es

User responds: **NON-PARITY, original Spanish**

**Step 2: Record designation**

```bash
npm run parity:designate -- \
  --path "/scholarship/la-celestina-analisis.html" \
  --parity false \
  --reason "scholarly-article-original-language" \
  --language "es"
```

**Output:**
```
✅ Parity designation recorded

   Path: /scholarship/la-celestina-analisis.html
   Parity: NO (single language)
   Reason: scholarly-article-original-language
   Language: es
   Decided: 2025-10-26T14:35:22.000Z
   Decided By: user

📝 Next Steps:

1. Add metadata to /scholarship/la-celestina-analisis.html:
   <meta name="localization_parity" content="false">
   <meta name="parity_reason" content="scholarly-article-original-language">
   <meta name="page_language" content="es">

2. Validation will skip bilingual checks for this page

3. Run: npm run validate-localization
```

**Step 3: Create page using template**

Use `templates/scholarship-base.html` as starting point.

`public/scholarship/la-celestina-analisis.html`

```html
<html lang="es">
<head>
  <meta name="localization_parity" content="false">
  <meta name="parity_reason" content="scholarly-article-original-language">
  <meta name="page_language" content="es">

  <link rel="alternate" hreflang="es" href="https://spanishacademic.com/scholarship/la-celestina-analisis.html">
  <link rel="alternate" hreflang="x-default" href="https://spanishacademic.com/scholarship/la-celestina-analisis.html">

  <!-- Schema.org ScholarlyArticle -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": "Análisis literario de La Celestina",
    "author": {
      "@type": "Person",
      "name": "Dr. García"
    },
    "inLanguage": "es"
  }
  </script>
</head>
```

**Step 4: Validate**

```bash
npm run validate-localization
```

**Output:**
```
ℹ️  scholarship/la-celestina-analisis.html - NON-PARITY (scholarly-article-original-language)

✅ All localization checks passed!
```

**Result:** ✅ PASS (NON-PARITY, no bilingual counterpart required)

---

## Best Practices

### 1. Default to PARITY

Unless there's a compelling reason, all pages should be bilingual. NON-PARITY is the exception, not the rule.

### 2. Always Ask User

Never designate NON-PARITY without explicit user approval. Use the approval template.

### 3. Document Reason

Always provide a clear, specific reason for NON-PARITY designation in tracking file and metadata.

### 4. Preserve Citations

For scholarly articles, ALWAYS use original language. Translating academic work changes citations, impacts Google Scholar indexing, and reduces academic credibility.

### 5. Use Correct Template

- PARITY → `templates/base.html`
- NON-PARITY scholarly → `templates/scholarship-base.html`

### 6. Validate Early

Run `npm run validate-localization` after creating pages to catch issues immediately.

### 7. Check Tracking

Before creating NON-PARITY pages, verify designation exists:
```bash
npm run parity:list -- --parity false
```

---

## Troubleshooting

### Issue: Orphan detected for NON-PARITY page

**Cause:** Page is NON-PARITY but metadata is missing.

**Fix:**
```html
<meta name="localization_parity" content="false">
<meta name="parity_reason" content="scholarly-article-original-language">
<meta name="page_language" content="es">
```

### Issue: Validation requires path_en/path_es for NON-PARITY page

**Cause:** Metadata not detected. Check spelling and placement.

**Fix:** Ensure metadata is in `<head>` section before any hreflang links.

### Issue: Parity designation not showing in list

**Cause:** Tracking file not updated.

**Fix:** Re-run designation command:
```bash
npm run parity:designate -- --path "..." --parity false --reason "..." --language "es"
```

### Issue: User approval not recorded

**Cause:** No audit trail in tracking file.

**Solution:** Always run `parity:designate` script after user approval. Never manually edit HTML without recording designation.

---

## Integration with Other Systems

### JSON Twin Generation

`scripts/generate_page_json.js` respects parity metadata:

```json
{
  "localizationParity": false,
  "parityReason": "scholarly-article-original-language",
  "pageLanguage": "es",
  "alternateLanguage": null
}
```

### Sitemap Generation

`scripts/generate_sitemap.js` includes NON-PARITY pages with language annotation:

```xml
<url>
  <loc>https://spanishacademic.com/scholarship/article.html</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://spanishacademic.com/scholarship/article.html"/>
  <priority>0.8</priority>
</url>
```

### Pre-Deployment Validation

`npm run validate-all` runs localization validation. NON-PARITY pages won't fail if properly designated.

---

## Migration Notes

### Existing Pages (Pre-System)

All existing pages default to PARITY behavior. No action required unless you want to designate as NON-PARITY.

### Scholarship Section (New)

When creating `/scholarship/` directory for 11 Spanish literatura articles:

1. Get user approval for each article
2. Record all designations: `npm run parity:designate -- --path "..." --parity false --reason "scholarly-article-original-language" --language "es"`
3. Use `templates/scholarship-base.html` for all
4. Validate: `npm run validate-localization`
5. List to verify: `npm run parity:list -- --parity false`

---

## FAQ

**Q: Can a page change from PARITY to NON-PARITY?**

A: Yes, with user approval. Record the new designation, update metadata, and validate.

**Q: Can a NON-PARITY page be translated later?**

A: Yes. Change designation to PARITY, add bilingual metadata, create counterpart, validate.

**Q: What if user is unsure about parity?**

A: Default to PARITY. It's safer and ensures bilingual accessibility. NON-PARITY is for special cases only.

**Q: Do all scholarly articles need to be NON-PARITY?**

A: No. Only scholarly articles in original language. If you write a new Insights article about research, it should be PARITY (bilingual).

**Q: Can English scholarly articles be NON-PARITY?**

A: Yes, if they're original publications. Use `--language "en"` in designation.

---

## Related Documentation

- [CLAUDE.md - RULE 4](../CLAUDE.md#rule-4-preserve-localization-parity-with-exceptions)
- [LOCALIZATION_FIRST.md](./LOCALIZATION_FIRST.md)
- [CONTENT_MIGRATION.md](./CONTENT_MIGRATION.md)

---

**Last Reviewed:** 2025-10-26
**Version:** 1.0.0
**Status:** Active
