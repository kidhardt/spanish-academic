# Getting Started with Spanish Academic 2026

This guide walks you through the implementation roadmap, organized by **correct dependency order** based on architectural analysis and industry best practices.

## Current Status

✅ **92 beads created and tracked** in the beads system
✅ **10 Priority 1 beads ready** to start immediately
✅ **Project structure defined** with mobile-first, localization-first, and SEO-first principles
✅ **Architecture documented** in [README.md](README.md) and [CLAUDE.md](CLAUDE.md)
✅ **Phase 1 COMPLETE:** [MOBILE_FIRST.md](docs/MOBILE_FIRST.md) and [LOCALIZATION_FIRST.md](docs/LOCALIZATION_FIRST.md) created

---

## Phase 1: Foundation Documents (Week 1, Days 1-2) ✅ COMPLETE

**Goal:** Document the architectural principles that govern all implementation decisions.

### Bead 1: Document mobile-first design principles ✅ CLOSED
**ID:** spanish-academic-44

**Completed:** [MOBILE_FIRST.md](docs/MOBILE_FIRST.md) created with:
- Breakpoint strategy: 320px (base), 768px+ (tablet), 1024px+ (desktop)
- Touch target minimum: 44x44px
- CSS approach: single-column base, progressive enhancement via `min-width` only
- Performance = credibility principle
- Validation checklist and common pitfalls

---

### Bead 2: Document localization-first principles ✅ CLOSED
**ID:** spanish-academic-45

**Completed:** [LOCALIZATION_FIRST.md](docs/LOCALIZATION_FIRST.md) created with:
- URL mirroring: `/` ↔ `/es/`
- Slug translation approach and mapping system
- `path_en`/`path_es` metadata system
- Hreflang implementation (bidirectional, self-referential, x-default)
- Language switcher requirements
- Bilingual data model patterns
- JSON twin system
- React component localization

---

## Phase 2: Physical Structure & Build Scripts (Week 1, Days 3-6)

**Goal:** Create the directory structure and build automation scripts that define the metadata contract and validation rules for all HTML templates.

### ⚠️ CRITICAL INSIGHT: Build Scripts BEFORE Templates

**Why this order is correct:**

1. **Scripts define the metadata contract** - Templates must conform to what `generate_page_json.js` expects
2. **Immediate validation** - Validate each template as you create it (no rework)
3. **Industry practice** - SSG build tools come before content
4. **Testing without content** - Scripts can be tested on minimal placeholder pages

**See [docs/PHASE_ORDER_RATIONALE.md](docs/PHASE_ORDER_RATIONALE.md) for detailed reasoning and web research supporting this approach.**

---

### Bead 3: Implement URL mirroring structure
**ID:** spanish-academic-46
**Status:** READY TO START
**Why third:** Physical directories must exist before creating files.

**Tasks:**
- Create `/public/` directory structure
- Create `/public/es/` mirror structure
- Create subdirectories:
  - `/public/programs/` ↔ `/public/es/programas/`
  - `/public/insights/` ↔ `/public/es/insights/`
  - `/public/help/` ↔ `/public/es/ayuda/`
  - `/public/explorer/` ↔ `/public/es/explorador/`
  - `/public/contact/` ↔ `/public/es/contacto/`
- Create placeholder `index.html` in both `/public/` and `/public/es/`
- Create `.gitkeep` files in empty directories

**Acceptance criteria:**
- Directory structure mirrors `/` ↔ `/es/`
- All major content directories exist
- Placeholder index pages in place
- Ready to receive templates and static assets

**Estimated time:** 10 minutes

---

### Bead 4: Create slug translation mapping system
**ID:** spanish-academic-47
**Status:** READY TO START
**Why fourth:** All build scripts need this for bilingual URL generation.

**Tasks:**
- Create `/src/utils/slugTranslations.ts`
- Define `slugTranslations` object with common term mappings:
  - Directory level: `help` → `ayuda`, `programs` → `programas`, etc.
  - Degree types: `phd` → `doctorado`, `ma` → `maestria`
  - Subject areas: `linguistics` → `linguistica`, `literature` → `literatura`
  - Common terms: `funding` → `financiacion`, `visa` → `visa`, etc.
- Implement `translateSlug(slug: string, targetLang: 'en' | 'es'): string` function
- Add TypeScript types for language codes
- Export for use in build scripts

**Acceptance criteria:**
- TypeScript file compiles without errors
- Mapping includes 20+ common terms
- `translateSlug()` function works bidirectionally
- Well-commented and documented

**Estimated time:** 15 minutes

---

### Bead 5: Build generate_page_json.js script
**ID:** spanish-academic-1
**Status:** READY TO START
**Why fifth:** Most fundamental script - defines the metadata contract all templates must follow.

**Tasks:**
- Create `/scripts/generate_page_json.js`
- Use `cheerio` (already installed) to parse HTML metadata from all `.html` files in `/public/`
- Extract SEO_INTENT comment block data (keyword, audience, last_reviewed)
- Validate title length (50-60 chars)
- Validate meta description length (140-160 chars)
- Check for H1 presence
- Generate `.json` twin with:
  - `language` (en or es)
  - `alternateLanguage` (link to counterpart)
  - `path_en` / `path_es`
  - `seoIntent` object
  - Page content metadata
- **MUST generate BOTH** `/path.json` AND `/es/path.json`
- Script already configured in `package.json`

**Acceptance criteria:**
- Script generates .json twins for all HTML pages
- Both English and Spanish versions created
- SEO_INTENT data extracted correctly
- Validation errors logged to console with file paths
- npm script runs successfully: `npm run generate-json`

**Estimated time:** 45 minutes

---

### Bead 6: Build validate_localization.js script
**ID:** spanish-academic-4
**Status:** READY TO START
**Why sixth:** Validates bilingual parity - critical for preventing localization decay.

**Tasks:**
- Create `/scripts/validate_localization.js`
- Walk `/public/` and `/public/es/` directory trees
- Verify every page has `path_en`/`path_es` metadata
- Check hreflang bidirectionality (en → es, es → en)
- Audit structured data files in `/src/data/structured/` for `*_es` fields
- Report missing Spanish counterparts
- Flag pages without language switcher
- Script already configured in `package.json`

**Acceptance criteria:**
- Script walks both directory trees
- Validates path_en/path_es metadata
- Checks hreflang links
- Audits bilingual structured data
- Clear error reporting with file paths
- npm script runs successfully: `npm run validate-localization`

**Estimated time:** 30 minutes

---

### Bead 7: Build accessibility-scan.js script
**ID:** spanish-academic-5
**Status:** READY TO START
**Why seventh:** Ensures WCAG AA compliance + SEO accessibility.

**Tasks:**
- Create `/scripts/accessibility-scan.js`
- Use `cheerio` to parse HTML structure
- Validate heading hierarchy (H1 → H2 → H3, no skipping)
- Check alt text for all meaningful images (decorative images should have `alt=""`)
- Flag vague link anchors ("click here", "read more", bare URLs)
- Verify semantic HTML (`<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Check lang attributes on `<html>`
- Validate contrast ratios (WCAG AA minimum 4.5:1 for text)
- Check focus indicators on interactive elements
- Script already configured in `package.json`

**Acceptance criteria:**
- Heading hierarchy validated
- Alt text checked (images without alt flagged)
- Link anchors validated (vague text flagged)
- Semantic HTML verified
- WCAG AA checks pass
- npm script runs successfully: `npm run accessibility-scan`

**Estimated time:** 45 minutes

---

## Phase 3: HTML Base Templates (Week 1, Day 7)

**Goal:** Create validated, reusable base templates that all pages inherit from.

**NOW you can create templates because:**
- Directory structure exists (Phase 2, Bead 3)
- Slug translation system ready (Phase 2, Bead 4)
- Validation scripts ready to check your work (Phase 2, Beads 5-7)

---

### Bead 8: Create HTML base templates
**ID:** spanish-academic-8
**Status:** READY AFTER Phase 2
**Why eighth:** Every page type inherits from this template.

**Tasks:**
- Create `/templates/base.html` (English)
- Create `/templates/base-es.html` (Spanish)
- Implement SEO_INTENT comment block with placeholders
- Add `<title>` (50-60 chars with keyword placeholder)
- Add `<meta name="description">` (140-160 chars placeholder)
- Add canonical URL + hreflang links (using path_en/path_es)
- Add single `<h1>` with keyword placeholder
- Add `<html lang="en|es">`
- Add mobile viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Add visible language switcher (Español/English) in header
- Include `path_en`/`path_es` metadata
- Use semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Ensure WCAG AA compliance (contrast, focus indicators)
- **After creation, run validation scripts to verify**

**Acceptance criteria:**
- Base template includes all required meta tags
- Language switcher visible in header (44x44px tap targets)
- Mobile viewport configured
- Passes `npm run accessibility-scan`
- Passes `npm run validate-localization`
- Both English and Spanish versions created
- Ready to clone for specific page types

**Estimated time:** 60 minutes

---

### Bead 9: Enforce path_en/path_es metadata in templates
**ID:** spanish-academic-48
**Status:** READY AFTER Bead 8
**Why ninth:** Verify templates have proper bilingual metadata.

**Tasks:**
- Review base templates for `path_en`/`path_es` metadata
- Ensure metadata format matches what `generate_page_json.js` expects
- Run `npm run validate-localization` to verify
- Fix any validation errors
- Document metadata requirements in template comments

**Acceptance criteria:**
- Both base templates have path_en/path_es metadata
- Validation script passes
- Template comments explain metadata usage

**Estimated time:** 15 minutes

---

### Bead 10: Implement mandatory lang attribute and hreflang links
**ID:** spanish-academic-49
**Status:** READY AFTER Bead 8
**Why tenth:** Verify all localization requirements are met.

**Tasks:**
- Verify `<html lang="en|es">` in both templates
- Verify hreflang links are bidirectional and self-referential
- Include x-default hreflang pointing to English version
- Run `npm run validate-localization` to verify
- Run `npm run accessibility-scan` to verify lang attribute

**Acceptance criteria:**
- Lang attribute present and correct
- Hreflang links bidirectional
- x-default hreflang included
- All validation scripts pass

**Estimated time:** 15 minutes

---

## Phase 4: Additional Build Scripts & Localization Utils (Week 2, Days 1-3)

**Goal:** Complete remaining build automation scripts and utilities.

---

### Bead 11: Implement localization infrastructure utilities
**ID:** spanish-academic-13
**Status:** READY AFTER Phase 3
**Why eleventh:** Build scripts and templates need these helper functions.

**Tasks:**
- Create `/src/utils/localization.ts`
- Implement `generateHreflangLinks(path_en: string, path_es: string): string` helper
- Implement `getAlternateLanguagePath(currentPath: string, currentLang: 'en' | 'es'): string` helper
- Import slug translation mapping from `slugTranslations.ts`
- Implement `translateSlug(slug: string, targetLang: 'en' | 'es'): string` function (if not already in slugTranslations.ts)
- Create path metadata validator helpers
- Export all utilities for use in templates and scripts

**Acceptance criteria:**
- Utility functions for hreflang generation
- Slug translation mapping accessible
- Path metadata helpers ready for templates
- TypeScript compiles without errors

**Estimated time:** 30 minutes

---

### Bead 12: Build generate_sitemap.js script
**ID:** spanish-academic-3
**Status:** READY AFTER Phase 3
**Why twelfth:** Required for search engine indexing.

**Tasks:**
- Create `/scripts/generate_sitemap.js`
- Scan `/public/` for all published HTML pages
- Include both `/...` and `/es/...` URLs
- Extract `LAST_REVIEWED` from SEO_INTENT block for `<lastmod>`
- Set priority based on page type:
  - Programs: 0.8
  - Insights: 0.7
  - Help/Q&A: 0.6
  - Category pages: 0.5
- Generate `/public/sitemap.xml`
- Validate against sitemap.org schema
- Script already configured in `package.json`

**Acceptance criteria:**
- sitemap.xml includes all published pages
- Both languages included
- lastmod dates correct
- Priority values assigned
- Validates against sitemap.org schema
- npm script runs successfully: `npm run generate-sitemap`

**Estimated time:** 30 minutes

---

### Bead 13: Build build_categories.js script
**ID:** spanish-academic-2
**Status:** READY AFTER Phase 3
**Why thirteenth:** Auto-generates category index pages (most complex build script).

**Tasks:**
- Create `/scripts/build_categories.js`
- Scan `/public/insights/` for articles
- Group by category (from frontmatter/metadata)
- Generate `/public/insights/categories/[category-slug].html` with:
  - SEO_INTENT block (category name as keyword)
  - Optimized title/meta
  - Single H1
  - 150-word category intro
  - List of articles with abstracts
  - Descriptive link anchors
  - CollectionPage schema.org markup
- Repeat for Spanish: `/public/es/insights/categorias/[category-slug].html`
- Generate JSON twins for category pages
- Script already configured in `package.json`

**Acceptance criteria:**
- Category pages auto-generated for both languages
- Articles grouped correctly by category
- SEO structure complete (title, meta, H1, intro)
- JSON twins created
- npm script runs successfully: `npm run build-categories`

**Estimated time:** 60 minutes

---

### Bead 14: Create performance-audit.sh and lighthouse_ci.sh
**ID:** spanish-academic-7
**Status:** READY AFTER Phase 3
**Why fourteenth:** Enforce mobile score >90 as pre-deployment gate.

**Tasks:**
- Create `/scripts/lighthouse_ci.sh`
- Install Lighthouse CLI (already in package.json)
- Configure to test key pages:
  - Homepage (both languages)
  - Sample program list page
  - Sample program detail page
  - Sample Insights article
  - Sample Help/Q&A page
- Enforce mobile score >90 as exit condition
- Output Core Web Vitals (LCP, FID, CLS)
- Performance budget checks
- Script already configured in `package.json`

**Acceptance criteria:**
- Lighthouse CI runs against preview builds
- Mobile score >90 enforced
- Core Web Vitals reported
- Blocks deployment if score <90
- npm script runs successfully: `npm run lighthouse`

**Estimated time:** 45 minutes

---

## Phase 5: React Infrastructure (Week 2, Days 4-5)

**Goal:** Configure Vite for React islands with bundle size limits.

**NOW you can configure Vite because:**
- You know what the static pages need
- You understand the bilingual entry point structure
- You have something to measure bundle size against

---

### Bead 15: Configure Vite build for React islands
**ID:** spanish-academic-30
**Status:** READY AFTER Phase 4
**Why fifteenth:** Defines how React components are bundled and loaded.

**Tasks:**
- Create `vite.config.ts` (if not exists) or update existing
- Define separate entry points:
  - `src/explorer/index.tsx` → `public/explorer/app.js`
  - `src/explorer/index-es.tsx` → `public/es/explorador/app.js`
  - `src/chat/index.tsx` → `public/help/chat.js`
  - `src/chat/index-es.tsx` → `public/es/ayuda/chat.js`
  - `src/contact/index.tsx` → `public/contact/app.js`
  - `src/contact/index-es.tsx` → `public/es/contacto/app.js`
- Configure bundle size limit: 250KB per entry point
- Enable code splitting
- Configure tree shaking
- Set up source maps for production
- Configure to NOT load React code on static pages

**Acceptance criteria:**
- Separate entry points for each React island
- Bundle size < 250KB per island
- Static pages don't load React code
- Production build succeeds: `npm run build`
- Dev server runs: `npm run dev`

**Estimated time:** 45 minutes

---

## Phase 6: Page Templates (Week 3)

**Goal:** Create specific page type templates for programs, insights, help, etc.

After Phase 5, you'll be ready to tackle the Priority 2 beads:

- **spanish-academic-9**: Build Program List pages
- **spanish-academic-10**: Create Program Detail page template
- **spanish-academic-11**: Build Insights article template
- **spanish-academic-12**: Build Help/Q&A page template

These templates inherit from the base template (spanish-academic-8) and use the build scripts created in Phase 2-4.

---

## Phase 7: React Components & Interactive Islands (Week 4-5)

After templates are done:

- **spanish-academic-14**: Create language dictionaries (en.ts, es.ts)
- **spanish-academic-15**: Build Explorer React app
- **spanish-academic-20**: Build Help Chat component
- **spanish-academic-21**: Build Contact Form
- **spanish-academic-16-19**: Implement Explorer tabs (Map, Compare, Match/Chat, lazy loading)

---

## Phase 8: Claude Skills (Week 6)

Automate validation and governance:

- **spanish-academic-23**: checking-mobile-first Claude Skill
- **spanish-academic-24**: checking-localization Claude Skill
- **spanish-academic-25**: syncing-page-json Claude Skill
- **spanish-academic-26**: building-category-pages Claude Skill
- **spanish-academic-27**: checking-accessibility Claude Skill
- **spanish-academic-28**: checking-performance-budget Claude Skill
- **spanish-academic-29**: checking-data-governance Claude Skill
- **spanish-academic-90**: checking-seo-compliance Claude Skill

---

## Phase 9: Content Creation (Week 7-8)

With all infrastructure in place:

- **spanish-academic-34**: Seed initial program data
- **spanish-academic-37**: Write initial Insights articles
- **spanish-academic-38**: Write initial Help/Q&A pages

---

## Phase 10: Validation & Deployment (Week 9-10)

Final checks before launch:

- **spanish-academic-39**: Run full validation suite
- **spanish-academic-40**: Verify Lighthouse scores >90 on mobile
- **spanish-academic-41**: Test bilingual navigation
- **spanish-academic-42**: Deploy to SiteGround production
- **spanish-academic-43**: Verify production deployment

---

## Daily Workflow

### Starting a new bead

```bash
# Check what's ready to work on
bd ready --json

# Start working on the next bead
bd update spanish-academic-46 --status in_progress
```

### While working

- Follow the architecture principles in [CLAUDE.md](CLAUDE.md)
- Refer to [MOBILE_FIRST.md](docs/MOBILE_FIRST.md) for CSS and responsive design
- Refer to [LOCALIZATION_FIRST.md](docs/LOCALIZATION_FIRST.md) for bilingual architecture
- Run relevant scripts to validate your work as you go

### Completing a bead

```bash
# Mark as completed
bd close spanish-academic-46 --reason "Directory structure created and ready"

# Run validation (after scripts are built)
npm run generate-json
npm run validate-localization
npm run accessibility-scan
```

---

## Key Commands Reference

```bash
# Beads management
bd ready              # Show ready beads
bd list               # Show all beads
bd update <id>        # Update bead status
bd close <id>         # Mark bead complete

# Build & validation (after Phase 2-4)
npm run generate-json           # Create JSON twins
npm run build-categories        # Generate category pages
npm run generate-sitemap        # Create sitemap
npm run validate-localization   # Check bilingual parity
npm run accessibility-scan      # WCAG AA validation
npm run lighthouse              # Performance audit
npm run validate-all            # Run all validation scripts

# Development
npm run dev           # Start Vite dev server
npm run build         # Build React islands for production
npm run preview       # Preview production build
```

---

## Need Help?

- **Architecture questions:** See [README.md](README.md)
- **AI agent rules:** See [CLAUDE.md](CLAUDE.md)
- **Beads workflow:** See [AGENTS.md](AGENTS.md)
- **Mobile-first principles:** See [docs/MOBILE_FIRST.md](docs/MOBILE_FIRST.md)
- **Localization principles:** See [docs/LOCALIZATION_FIRST.md](docs/LOCALIZATION_FIRST.md)
- **Phase ordering rationale:** See [docs/PHASE_ORDER_RATIONALE.md](docs/PHASE_ORDER_RATIONALE.md)

---

**You're ready to continue! Next bead: spanish-academic-46 (create directory structure) and follow the corrected phases in order.**
