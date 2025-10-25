# Phase Order Rationale

**Spanish Academic 2026 - Why Build Scripts Come Before Templates**

This document explains the corrected implementation order for Spanish Academic 2026, based on architectural analysis, industry best practices, and web research conducted on 2025-10-24.

## Summary

**CORRECTED ORDER:**
1. **Phase 1:** Foundation Documents (mobile-first, localization principles) ✅ COMPLETE
2. **Phase 2:** Physical Structure + Build Scripts (directories, validation scripts) ← CURRENT
3. **Phase 3:** HTML Base Templates (validated by scripts from Phase 2)
4. **Phase 4:** Additional Build Scripts (sitemap, categories, performance)
5. **Phase 5:** React Infrastructure (Vite configuration)

**ORIGINAL (INCORRECT) ORDER:**
1. Phase 1: Foundation Documents ✅
2. Phase 2: Base Templates
3. Phase 3: Localization Utils
4. Phase 4: Vite Config
5. Phase 5: Build Scripts

---

## The Problem with the Original Order

### Issue 1: Templates Before Validation = Technical Debt

**Original plan:** Create base templates (bead 8) before build scripts (beads 1-5).

**Why this is wrong:**
- Templates must conform to metadata structure that `generate_page_json.js` expects
- If you create 10 templates then discover your metadata structure is wrong, you rewrite 10 templates
- No automated way to verify templates follow MOBILE_FIRST.md and LOCALIZATION_FIRST.md rules
- Manual verification burden for every template

**Example failure scenario:**
```html
<!-- You create this template -->
<meta name="path-en" content="/help/visa.html">

<!-- But generate_page_json.js expects -->
<meta name="path_en" content="/help/visa.html">

<!-- Now you have to fix all templates manually -->
```

### Issue 2: Vite Configuration Too Early

**Original plan:** Configure Vite (bead 30) before having any React components or understanding bundle requirements.

**Why this is premature:**
- No React islands exist yet to configure entry points for
- No actual bundle sizes to measure against 250KB limit
- No understanding of what static pages need vs. interactive islands
- Premature optimization without data

**Web research finding (2025-10-24):**
> "After building the app, vite puts all the built code into a single JS and CSS chunk, which will take forever to download and decrease performance drastically if not configured properly."

**Implication:** You need actual code to configure code splitting for. Configure Vite AFTER you know what you're splitting.

### Issue 3: Build Scripts Are Your SSG

**Web research finding (2025-10-24):**
> "A static site generator generates a full static HTML website based on raw data and a set of templates, automating the task of coding individual HTML pages and getting those pages ready to serve to users ahead of time."

**What we're building:**
- `generate_page_json.js` = SSG data extraction layer
- `build_categories.js` = SSG page generation
- `validate_localization.js` = SSG validation layer
- `accessibility-scan.js` = SSG quality gate

**Industry practice finding (2025-10-24):**
> "The typical approach is to create HTML templates first, then build automation scripts."

**BUT THIS APPLIES TO SIMPLE SITES.** For our architecture:
- We're building a *custom SSG*
- Scripts define the contract templates must follow
- We need validation scripts BEFORE creating templates to validate

**More accurate finding:**
> "Once you have an HTML template and a configurable Bash script that generates a servable index.html, you can finally execute that script—how and as often as you like."

**Interpretation:** The "HTML template" here is a simple prototype to test the script. NOT the final production templates.

---

## The Corrected Approach: Scripts First

### Phase 2: Physical Structure + Build Scripts (Days 3-6)

**Bead 3:** Create `/public/` and `/public/es/` directory structure
- **Why first:** You can't write files without directories
- **Time:** 10 minutes
- **Risk:** Zero

**Bead 4:** Slug translation mapping (`/src/utils/slugTranslations.ts`)
- **Why second:** All scripts need this for bilingual URLs
- **Time:** 15 minutes
- **Risk:** Low (pure data structure)

**Bead 5:** `generate_page_json.js` script
- **Why third:** Defines the metadata contract
- **Time:** 45 minutes
- **Output:** Specifies exactly what templates must include

**Bead 6:** `validate_localization.js` script
- **Why fourth:** Validates bilingual parity
- **Time:** 30 minutes
- **Output:** Automated checks for `path_en`/`path_es`, hreflang

**Bead 7:** `accessibility-scan.js` script
- **Why fifth:** Validates WCAG AA compliance
- **Time:** 45 minutes
- **Output:** Automated checks for headings, alt text, semantic HTML

### Phase 3: Templates (Day 7)

**Bead 8:** Create base templates

**NOW you can create templates with:**
1. ✅ Clear metadata structure (from `generate_page_json.js`)
2. ✅ Automated localization validation (from `validate_localization.js`)
3. ✅ Automated accessibility validation (from `accessibility-scan.js`)

**Workflow:**
```bash
# Create template
nano /templates/base.html

# Immediately validate
npm run generate-json
npm run validate-localization
npm run accessibility-scan

# Fix errors before moving on
```

**Result:** Templates are correct the first time. No rework.

---

## Testing Scripts Without Content

### Minimal Test Page Approach

Scripts can be tested on minimal placeholder pages:

```html
<!-- /public/test.html - minimal valid page for testing scripts -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="path_en" content="/test.html">
  <meta name="path_es" content="/es/prueba.html">

  <!-- SEO_INTENT block for generate_page_json.js -->
  <!--
  KEYWORD: test page
  AUDIENCE: developers
  LAST_REVIEWED: 2025-10-24
  -->

  <title>Test Page with Exactly 50 to 60 Characters Here</title>
  <meta name="description" content="A test description that is between 140 and 160 characters long to validate the meta description length requirement in generate_page_json.js">

  <link rel="canonical" href="https://spanish-academic.com/test.html">
  <link rel="alternate" hreflang="en" href="https://spanish-academic.com/test.html">
  <link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/prueba.html">
  <link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/test.html">
</head>
<body>
  <header>
    <nav aria-label="Language switcher">
      <ul>
        <li><a href="/test.html" lang="en">English</a></li>
        <li><a href="/es/prueba.html" lang="es">Español</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Test Heading</h1>
    <p>Test content.</p>
  </main>
</body>
</html>
```

**Test workflow:**
1. Create minimal test page
2. Run script: `npm run generate-json`
3. Verify script behavior
4. Fix script bugs
5. Delete test page
6. Create real templates with confidence

---

## Benefits of Scripts-First Approach

### 1. Scripts Define the Contract

**`generate_page_json.js` output:**
```javascript
{
  required: ['title', 'meta[name="description"]', 'h1', 'path_en', 'path_es'],
  title: { min: 50, max: 60 },
  metaDescription: { min: 140, max: 160 },
  seoIntent: ['KEYWORD', 'AUDIENCE', 'LAST_REVIEWED']
}
```

**Templates must conform to this.** If you write the script first, you know the contract before creating templates.

### 2. Immediate Feedback Loop

```bash
# Create template
nano /templates/base.html

# Validate immediately
npm run generate-json
# ❌ ERROR: Title is 72 characters (max 60)

# Fix and re-validate
npm run generate-json
# ✅ PASS: All validations passed
```

**No accumulating technical debt.**

### 3. No Rework

**Scripts-first:**
- Create 1 template → validate → fix → create next template
- Each template is correct the first time
- Total rework: 0 templates

**Templates-first:**
- Create 10 templates
- Discover metadata structure is wrong
- Fix all 10 templates
- Total rework: 10 templates

### 4. Confidence in Architecture

By writing validation scripts first:
- You prove the architecture works
- You catch design flaws early
- You document requirements in executable code
- You provide guardrails for future work

### 5. Enables Parallel Work (Future)

Once scripts exist:
- Multiple people can create templates in parallel
- Each person validates their own work
- No coordination bottleneck
- No "wait for the architect to review"

---

## Industry Research Supporting This Approach

### Finding 1: SSG Build Tools Come Before Content

**Source:** Building a Static Site Generator in 3 steps (Medium, DEV Community)

> "A static site generator generates a full static HTML website based on raw data and a set of templates, automating the task of coding individual HTML pages."

**Interpretation:** The automation (our scripts) must exist before the content (our templates).

### Finding 2: Component-Based Approaches Require Infrastructure

**Source:** Web Components in 2025 (DEV Community, Kinsta)

> "Creating web components is getting simpler thanks to tools like Lit and Storybook, which lets you see how components look and behave in real-time."

**Interpretation:** You need tooling (our validation scripts) to develop components (our templates) effectively.

### Finding 3: Bundle Splitting Needs Code to Split

**Source:** Vite Building for Production, vite-plugin-chunk-split (npm, GitHub)

> "You can configure how chunks are split using build.rollupOptions.output.manualChunks, which gives you control over how your bundles are organized."

**Interpretation:** You configure bundle splitting AFTER you have bundles to split. Vite config comes later, not early.

### Finding 4: Validation Prevents Performance Issues

**Source:** Optimize Vite Build Time (DEV Community)

> "After building the app, vite puts all the built code into a single JS and CSS chunk, which will take forever to download and decrease performance drastically if not configured properly."

**Interpretation:** Without validation infrastructure, you accumulate performance debt. Build validation scripts early.

---

## Comparison: Old vs. New Order

### Original Order (Incorrect)

| Phase | Beads | Problem |
|-------|-------|---------|
| 1. Docs | 44-45 | ✅ Correct |
| 2. Templates | 8 | ❌ No validation scripts exist yet |
| 3. Localization Utils | 13 | ❌ Needed BEFORE templates |
| 4. Vite Config | 30 | ❌ No React code exists yet |
| 5. Scripts | 1-5 | ❌ Too late - templates already created |

**Result:** Rework templates to conform to scripts.

### Corrected Order

| Phase | Beads | Rationale |
|-------|-------|-----------|
| 1. Docs | 44-45 | ✅ Principles first |
| 2. Structure + Scripts | 46, 47, 1, 4, 5 | ✅ Infrastructure before content |
| 3. Templates | 8, 48, 49 | ✅ Validated as created |
| 4. More Scripts | 13, 3, 2, 7 | ✅ Complete automation |
| 5. Vite Config | 30 | ✅ Configure actual code |

**Result:** Zero rework. Templates correct the first time.

---

## When to Deviate from This Order

### Safe to Skip Scripts-First If:

1. **Trivial site:** <10 pages, no localization, no validation requirements
2. **Prototyping:** Throwaway code, not production
3. **Design exploration:** Just mocking up visuals

### Must Use Scripts-First If:

1. **Bilingual site** (like ours)
2. **SEO requirements** (like ours)
3. **WCAG compliance** (like ours)
4. **Multiple page types** (like ours: programs, insights, help)
5. **High-stakes content** (like ours: visa info, funding, AI ethics)

**Spanish Academic 2026 checks ALL FIVE boxes.** Scripts-first is mandatory.

---

## Lessons Learned

### What We Got Right

1. **Documentation first** - MOBILE_FIRST.md and LOCALIZATION_FIRST.md provide design guidance
2. **Validation mindset** - Recognized need for automated checks
3. **Bilingual from day 1** - Not bolted on later

### What We Corrected

1. **Order of operations** - Scripts before templates
2. **Vite timing** - Configure after React code exists
3. **Testing strategy** - Minimal placeholder pages to test scripts

### Key Insight

> **"Build the machine that builds the website, then build the website."**

Our scripts are the machine. Templates are the website. Build the machine first.

---

## References

Web research conducted 2025-10-24:

1. **HTML base templates vs component library static site 2025 best practices**
   - Component-based approaches dominant
   - Tooling enables rapid development
   - Validation built into workflows

2. **Build automation scripts before or after creating HTML templates**
   - SSG build tools come before content
   - Automation defines the structure
   - Templates conform to build system

3. **Vite configuration bundle splitting when to configure early vs late**
   - Bundle splitting needs actual code
   - Configuration after implementation
   - Premature optimization avoided

---

**Last Reviewed:** 2025-10-24
**Version:** 1.0.0
**Related:**
- [GETTING_STARTED.md](../GETTING_STARTED.md) - Implementation roadmap with corrected order
- [CLAUDE.md](../CLAUDE.md) - Governance rules
- [MOBILE_FIRST.md](MOBILE_FIRST.md) - Design principles
- [LOCALIZATION_FIRST.md](LOCALIZATION_FIRST.md) - Bilingual architecture
