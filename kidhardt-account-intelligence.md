# Kidhardt Account Intelligence: Spanish Academic 2026

**Generated:** 2025-10-25
**Account:** kidhardt
**Project:** Spanish Academic 2026
**Location:** `m:\VS SpAca\spanish-academic\`

---

## Executive Summary

Spanish Academic 2026 is a bilingual (English/Spanish), static-first academic platform providing authoritative information about graduate programs in Spanish Linguistics, Literature, Translation/Interpreting, and related fields. The platform targets prospective graduate students, current students, faculty, and administrators with high-stakes guidance on funding, immigration, AI ethics, and research fit.

**Current Status:** Phase 2 (Build Scripts) - 9 of 92 beads completed (9.8%)

**Last Session:** Completed 4 build scripts (beads 2-5) before being interrupted while starting bead 7 (Lighthouse CI)

---

## Project Purpose & Mission

### Core Mission
Provide transparent, credible, bilingual information about graduate programs with special attention to:
- **Student protection**: High-stakes content (visa, funding, AI ethics) requires governance
- **Academic credibility**: Static, versioned, citable pages
- **Accessibility**: WCAG AA compliance, mobile-first design
- **Bilingual parity**: Spanish as first-class citizen, not afterthought

### Target Audience
1. Prospective graduate students researching programs
2. Current graduate students seeking funding/visa information
3. Faculty and administrators benchmarking programs
4. Academic advisors providing guidance

### Unique Value Proposition
- **No CMS bloat**: Static HTML, version-controlled, fast
- **AI-ready**: Every HTML page has JSON twin for chat integration
- **Bilingual by design**: `/` ↔ `/es/` mirroring, not bolted-on translation
- **Student-first**: Governance rules prevent misleading promises

---

## Technical Architecture

### Stack Overview

**Frontend:**
- Static HTML5 (primary content delivery)
- React 18.3.1 (interactive islands only: Explorer, Chat, Contact)
- Vite 6.0.7 (build tool for React islands)
- TypeScript 5.7.2 (type safety)

**Styling:**
- Mobile-first CSS (single-column base, progressive enhancement)
- No framework dependency (vanilla CSS)
- Print-friendly styles (academic citation use case)

**Build Automation:**
- Node.js scripts (ES modules)
- Cheerio 1.0.0 (HTML parsing)
- Glob 11.0.0 (file pattern matching)
- Lighthouse 12.3.1 (performance auditing)

**Validation & Governance:**
- Custom validation scripts (accessibility, localization, SEO)
- Beads CLI (task management)
- Git version control

**Deployment Target:**
- SiteGround (Apache, .htaccess)
- Future-ready: Can migrate to Cloudflare Pages/Netlify without URL changes

### Architecture Pattern: Static-First with React Islands

**Why Static-First:**
- Fast, indexable, citable, accessible
- No server dependency for content
- Git version control provides audit trail
- Works with JavaScript disabled

**React Islands (Lazy-Loaded):**
1. **Explorer** (`/explorer`, `/es/explorador`) - Interactive program comparison tool with maps/charts
2. **Chat** (`/help`, `/es/ayuda`) - AI-powered Q&A consuming JSON twins
3. **Contact Form** (`/contact`, `/es/contacto`) - Validated form with TanStack Form

**Bundle Budget:** <250KB per island (enforced by Vite config)

### JSON Twin Strategy

Every HTML page has a `.json` twin:
- **Auto-generated** by `scripts/generate_page_json.js`
- **Never hand-maintained** (source of truth is HTML)
- Contains structured metadata for AI/chat consumption
- Includes `alternateLanguage` links for bilingual navigation
- High-sensitivity content includes `lastReviewed` field

**Example:**
```
/insights/funding-guide.html  →  /insights/funding-guide.json
/es/insights/guia-financiacion.html  →  /es/insights/guia-financiacion.json
```

### Bilingual Architecture

**URL Mirroring:**
```
/                          ↔  /es/
/insights/                 ↔  /es/insights/
/help/                     ↔  /es/ayuda/
/programs/                 ↔  /es/programas/
/explorer/                 ↔  /es/explorador/
/contact/                  ↔  /es/contacto/
```

**Slug Translation System:**
- `slugTranslations.ts` maps common terms: `help` → `ayuda`, `funding` → `financiacion`
- Bidirectional translation function: `translateSlug(slug, targetLang)`
- 20+ common academic terms pre-mapped

**Metadata Requirements (Every Page):**
- `<html lang="en|es">`
- `<meta name="path_en">` and `<meta name="path_es">`
- Bidirectional hreflang links (en ↔ es)
- Self-referential hreflang link
- x-default hreflang (points to English)

---

## Inviolable Rules (CLAUDE.md)

### RULE 1: NO COMMENTARY ON PROGRAM LIST PAGES
Program list pages are **pure link lists**. ZERO inline commentary.
- ✅ ONLY program name + link
- ❌ NEVER add descriptive text under program links
- **Rationale:** SEO protection, scannability, proven performance

### RULE 2: EVERY PAGE MUST HAVE A JSON TWIN
- Run `npm run generate-json` after creating/editing HTML
- JSON twin filename matches HTML: `article.html` → `article.json`
- AI/chat layer consumes JSON, not HTML

### RULE 3: HIGH-SENSITIVITY CONTENT REQUIRES GOVERNANCE
Content dealing with **immigration/visa**, **AI ethics**, **academic integrity**, or **funding guarantees** MUST include:
- `lastReviewed` field (ISO 8601 date)
- Disclaimer (e.g., "This is informational, not legal advice")
- No promises or guarantees of outcomes
- Conservative, factual language only

### RULE 4: PRESERVE LOCALIZATION PARITY
- `/` and `/es/` must mirror in structure
- If you add `/help/new-question.html`, MUST add placeholder `/es/ayuda/nueva-pregunta.html`
- Run `npm run validate-localization` before committing

### RULE 5: MOBILE-FIRST, WCAG AA MINIMUM
- Lighthouse mobile score MUST be >90
- WCAG AA compliance (contrast, alt text, heading hierarchy, focus indicators)
- Printer-friendly styles (academic citation use case)
- Run `npm run accessibility-scan` before committing

### RULE 6: PERFORMANCE BUDGET
- Initial JavaScript bundle <250KB
- Lazy-load heavy components (maps, charts)
- No render-blocking resources
- Run `npm run lighthouse` to verify

### RULE 7: SEMANTIC HTML, ACADEMIC TONE
- Use semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Proper heading hierarchy: `<h1>` → `<h2>` → `<h3>` (no skipping)
- Academic voice: professional, clear, minimal decoration

---

## Beads System Usage

### What is Beads?
[Beads](https://github.com/steveyegge/beads) is a lightweight, file-based issue tracker. Issues are stored in `.beads/` directory.

### Beads Commands
```bash
bd ready                              # Show ready beads (open, priority 1)
bd list --json                        # List all beads as JSON
bd create "Task" -t feature -p 1      # Create new bead
bd update <id> --status in_progress   # Start working on bead
bd close <id> --reason "Done"         # Complete bead
bd dep add <new-id> <parent-id>       # Link dependencies
```

### Beads Workflow Rules

**ALWAYS:**
1. Check `bd ready` to see next available bead
2. Update status to `in_progress` when starting
3. Close bead with descriptive `--reason` when done
4. Create new beads for discovered work with `--type discovered-from`

**NEVER:**
- Skip beads out of dependency order
- Leave beads in `in_progress` indefinitely
- Close beads without testing/validation

### Current Beads Status

**Total:** 92 beads
**Priority 1:** 27 beads (critical path)
**Priority 2:** 50 beads (enhancements)
**Completed:** 9 beads (9.8%)
**Remaining Priority 1:** 18 beads

---

## Build Scripts (Completed)

### 1. generate_page_json.js ✅
**Bead:** spanish-academic-1
**Purpose:** Parse HTML metadata → create JSON twins

**Features:**
- Extracts SEO_INTENT block (keyword, audience, last_reviewed)
- Validates title length (50-60 chars)
- Validates meta description length (140-160 chars)
- Checks H1 presence
- Generates BOTH `/path.json` AND `/es/path.json`
- Reports validation errors with file paths

**Usage:** `npm run generate-json`

### 2. build_categories.js ✅
**Bead:** spanish-academic-2
**Purpose:** Auto-generate category index pages for Insights and Help sections

**Features:**
- Scans `/insights/` and `/help/` for articles
- Groups by `<meta name="category">` value
- Generates category pages with:
  - SEO_INTENT block
  - 50-60 char titles (smart truncation for long category names)
  - 140-160 char meta descriptions
  - Single H1
  - 150-word intro
  - Article listings with abstracts
  - CollectionPage schema.org markup
- Bilingual: `/insights/categories/` ↔ `/es/insights/categorias/`
- Auto-generates JSON twins

**Usage:** `npm run build-categories`

### 3. generate_sitemap.js ✅
**Bead:** spanish-academic-3
**Purpose:** Generate sitemap.xml for search engines

**Features:**
- Scans all HTML pages in `/public/`
- Extracts `LAST_REVIEWED` from SEO_INTENT for `<lastmod>`
- Assigns priorities by page type:
  - Programs: 0.8
  - Insights: 0.7
  - Help/Q&A: 0.6
  - Categories: 0.5
- Includes both English and Spanish URLs
- Sorts by priority then alphabetically
- Validates against sitemap.org schema

**Usage:** `npm run generate-sitemap`

### 4. validate_localization.js ✅
**Bead:** spanish-academic-4
**Purpose:** Enforce bilingual parity between `/` and `/es/`

**Features:**
- Walks both `/public/` and `/public/es/` directory trees
- Validates `path_en` / `path_es` metadata presence
- Checks hreflang bidirectionality (en ↔ es)
- Verifies self-referential hreflang links
- Validates x-default hreflang exists
- Checks if alternate language files actually exist
- Detects orphaned pages (English without Spanish or vice versa)
- Flags missing language switchers in navigation
- Placeholder for structured data validation (Phase 4)

**Usage:** `npm run validate-localization`

### 5. accessibility-scan.js ✅
**Bead:** spanish-academic-5
**Purpose:** Validate WCAG AA compliance

**Features:**
- **Heading hierarchy:** Validates H1→H2→H3 progression, no level skipping
- **Single H1:** Ensures exactly one H1 per page
- **Alt text:** Checks all images have alt attributes (flags empty for review)
- **Link text:** Flags vague anchors ("click here", "read more", bare URLs)
- **Semantic HTML:** Verifies `<main>`, `<header>`, `<footer>`, `<nav>`
- **Lang attribute:** Validates `<html lang="en|es">`
- **Form labels:** Ensures inputs have labels or aria-labels
- **Skip navigation:** Recommends skip links for keyboard users

**Usage:** `npm run accessibility-scan`

---

## Pending Build Scripts

### 6. lighthouse_ci.sh ⏳
**Bead:** spanish-academic-7 (IN PROGRESS - INTERRUPTED)
**Purpose:** Enforce mobile score >90 as pre-deployment gate

**Planned Features:**
- Test key pages (homepage, program lists, insights, help)
- Report Core Web Vitals (LCP, FID, CLS)
- Performance budget checks
- Block deployment if score <90

**Usage:** `npm run lighthouse`

### 7. data-governance-scan.js ⏳
**Bead:** TBD
**Purpose:** Verify high-sensitivity content compliance

**Planned Features:**
- Scan for visa/immigration/funding/AI ethics content
- Verify `lastReviewed` field presence
- Check for required disclaimers
- Flag promises or guarantees of outcomes

**Usage:** `npm run data-governance-scan`

---

## Project Phases (GETTING_STARTED.md)

### Phase 1: Foundation Documents ✅ COMPLETE
**Beads:** spanish-academic-44, spanish-academic-45, spanish-academic-46, spanish-academic-47

**Completed:**
- MOBILE_FIRST.md (breakpoints, touch targets, CSS strategy)
- LOCALIZATION_FIRST.md (URL mirroring, hreflang, bilingual data)
- URL mirroring structure created
- Slug translation mapping system implemented

### Phase 2: Physical Structure & Build Scripts 🔄 IN PROGRESS
**Goal:** Create directory structure and build automation scripts

**Critical Insight:** Build scripts BEFORE templates
- Scripts define the metadata contract
- Immediate validation as templates are created
- Industry best practice (SSG tools before content)

**Completed Beads:**
- spanish-academic-1: generate_page_json.js ✅
- spanish-academic-2: build_categories.js ✅
- spanish-academic-3: generate_sitemap.js ✅
- spanish-academic-4: validate_localization.js ✅
- spanish-academic-5: accessibility-scan.js ✅

**In Progress:**
- spanish-academic-7: lighthouse_ci.sh (INTERRUPTED)

**Remaining Phase 2 Beads:**
- Performance audit scripts
- Data governance scanning

### Phase 3: HTML Base Templates ⏳ PENDING
**Goal:** Create validated, reusable base templates

**Includes:**
- Base HTML template (English & Spanish)
- SEO_INTENT block implementation
- Semantic HTML structure
- Mobile viewport configuration
- Language switcher implementation

### Phase 4: Content Templates ⏳ PENDING
**Goal:** Create page-type-specific templates

**Includes:**
- Program detail pages
- Insights article templates
- Help/Q&A page templates
- Category index page templates (auto-generated by build_categories.js)

### Phase 5: React Infrastructure ⏳ PENDING
**Goal:** Configure Vite for React islands with bundle limits

**Includes:**
- Vite configuration (separate entry points)
- Bundle size limits (<250KB per island)
- Code splitting & tree shaking
- Language dictionaries (en.ts, es.ts)

### Phase 6: React Components ⏳ PENDING
**Goal:** Build interactive React islands

**Includes:**
- Explorer (program comparison, maps, filters)
- Chat (AI-powered Q&A consuming JSON twins)
- Contact Form (TanStack Form validation)

### Phase 7: Content Population ⏳ PENDING
**Goal:** Populate with real program data

**Includes:**
- Structured program data (TypeScript)
- Unstructured narrative content (JSON)
- Faculty profiles
- Insights articles
- Help/Q&A pages

### Phase 8: Deployment & Testing ⏳ PENDING
**Goal:** Deploy to production and monitor

**Includes:**
- .htaccess configuration (SiteGround)
- robots.txt, sitemap.xml, manifest.webmanifest
- Lighthouse CI integration
- Pre-deployment validation workflow

---

## Session Disruption Analysis

### What Happened
**Session started:** User said "continue from where we left off"
**Continuation file used:** `.claude/skills/directors/continuations/2025-10-24_19-00-29.md`
**Progress at session start:** 5/92 beads completed
**Progress at interruption:** 9/92 beads completed (4 beads completed in this session)

### Beads Completed This Session
1. **spanish-academic-2:** build_categories.js ✅
2. **spanish-academic-3:** generate_sitemap.js ✅
3. **spanish-academic-4:** validate_localization.js ✅
4. **spanish-academic-5:** accessibility-scan.js ✅

### Bead In Progress (Interrupted)
**spanish-academic-7:** Create performance-audit.sh and lighthouse_ci.sh

**Status:** TodoWrite tool showed:
- "Start bead spanish-academic-7" ✅ completed
- "Read GETTING_STARTED.md instructions" ⏳ pending
- "Analyze Lighthouse requirements" ⏳ pending
- "Build lighthouse_ci.sh script" ⏳ pending
- "Create performance-audit.sh wrapper" ⏳ pending
- "Test the scripts" ⏳ pending
- "Close bead spanish-academic-7" ⏳ pending

**Beads status:** `bd update spanish-academic-7 --status in_progress` was NOT executed yet

### Why Disruption Occurred
User requested full project analysis and intelligence file creation instead of proceeding with bead 7.

---

## Completed Beads (Full List)

```
✅ spanish-academic-1: Build generate_page_json.js script to create JSON twins from HTML
✅ spanish-academic-2: Build build_categories.js script for auto-generating category index pages
✅ spanish-academic-3: Build generate_sitemap.js script for sitemap.xml generation
✅ spanish-academic-4: Build validate_localization.js script to enforce / ↔ /es/ parity
✅ spanish-academic-5: Build accessibility-scan.js script for WCAG AA validation
✅ spanish-academic-44: Document mobile-first design principles and breakpoint strategy
✅ spanish-academic-45: Document localization-first principles (Spanish as first-class citizen)
✅ spanish-academic-46: Implement URL mirroring structure (/ and /es/ with translated slugs)
✅ spanish-academic-47: Create slug translation mapping system (en → es URL conversion)
```

**Total Completed:** 9/92 (9.8%)

---

## Pending Beads (Priority 1)

**Next Immediate Bead:**
```
⏳ spanish-academic-7: Create performance-audit.sh and lighthouse_ci.sh for Core Web Vitals
   Status: TodoWrite started but bd update NOT executed yet
   Action needed: Execute bd update spanish-academic-7 --status in_progress
```

**Following Priority 1 Beads (in recommended order):**
```
⏳ spanish-academic-8: Create HTML templates for semantic, WCAG AA accessible base pages
⏳ spanish-academic-13: Implement localization infrastructure (hreflang, lang attributes, path metadata)
⏳ spanish-academic-30: Configure Vite build for React islands with bundle size limits (~250KB)
⏳ spanish-academic-48: Enforce path_en/path_es metadata in all HTML and JSON twins
⏳ spanish-academic-49: Implement mandatory lang attribute and hreflang links in all pages
⏳ spanish-academic-53: Create TypeScript interfaces for bilingual structured data (*_en, *_es fields)
⏳ spanish-academic-55: Create per-language JSON twin generation (both /...json and /es/...json)
⏳ spanish-academic-60: Implement single-column mobile-first CSS with progressive enhancement (min-width only)
⏳ spanish-academic-61: Enforce 44x44px minimum touch targets for all interactive elements
⏳ spanish-academic-64: Configure Vite separate entry points for React islands (zero unnecessary JS)
⏳ spanish-academic-68: Enforce lightweight initial HTML payload (<50KB uncompressed)
⏳ spanish-academic-73: Configure Lighthouse CI to enforce mobile score >90 in pre-deployment
⏳ spanish-academic-75: Implement SEO_INTENT comment block in all page templates (keyword, audience, last_reviewed)
⏳ spanish-academic-76: Enforce 50-60 char titles with primary keyword in all pages
⏳ spanish-academic-77: Enforce 140-160 char meta descriptions with keyword variant in all pages
⏳ spanish-academic-78: Implement canonical URLs with hreflang cross-linking for all bilingual pages
⏳ spanish-academic-79: Enforce single H1 with primary keyword per page
```

**Total Pending Priority 1:** 18 beads

---

## Key Files & Directories

### Governance Documents
- `CLAUDE.md` - AI agent constitution (inviolable rules)
- `GETTING_STARTED.md` - Implementation roadmap (92 beads, phased approach)
- `README.md` - Project overview, architecture, tech stack
- `AGENTS.md` - Agent-specific instructions (if exists)

### Documentation
- `docs/MOBILE_FIRST.md` - Mobile-first design principles
- `docs/LOCALIZATION_FIRST.md` - Bilingual architecture
- `docs/PHASE_ORDER_RATIONALE.md` - Why build scripts before templates
- `docs/CONTINUATION_SYSTEM_IMPLEMENTATION.md` - Continuation system docs

### Build Scripts (Implemented)
- `scripts/generate_page_json.js` ✅
- `scripts/build_categories.js` ✅
- `scripts/generate_sitemap.js` ✅
- `scripts/validate_localization.js` ✅
- `scripts/accessibility-scan.js` ✅
- `scripts/execute_continuation.js` ✅

### Build Scripts (Pending)
- `scripts/lighthouse_ci.sh` (in progress)
- `scripts/performance-audit.sh` (planned)
- `scripts/data-governance-scan.js` (planned)

### Configuration
- `package.json` - Dependencies, npm scripts
- `vite.config.ts` - Vite build configuration (needs implementation)
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules
- `.htaccess` - Apache configuration (planned for deployment)

### Continuation System
- `.claude/skills/directors/continuations/` - Session continuation files
- `2025-10-24_19-00-29.md` - Last continuation file (5 beads completed)

### Beads System
- `.beads/` - Beads issue tracker database

---

## Npm Scripts Reference

```bash
# Development
npm run dev                      # Start Vite dev server
npm run build                    # Build React islands (tsc + vite build)
npm run preview                  # Preview production build

# Build & Validation
npm run generate-json            # Create JSON twins from HTML ✅
npm run build-categories         # Generate category index pages ✅
npm run generate-sitemap         # Create sitemap.xml ✅
npm run validate-localization    # Check bilingual parity ✅
npm run accessibility-scan       # WCAG AA validation ✅
npm run data-governance-scan     # Verify disclaimers (not implemented)
npm run lighthouse               # Core Web Vitals audit (not implemented)
npm run validate-all             # Run all validation scripts

# Code Quality
npm run lint                     # ESLint
npm run format                   # Prettier
npm run type-check               # TypeScript compilation check

# Continuation System
npm run continue                 # Generate continuation file (end session)
```

---

## Recommendations for Next Session

### Immediate Actions
1. **Complete spanish-academic-7** (lighthouse_ci.sh)
   - Execute: `bd update spanish-academic-7 --status in_progress`
   - Read GETTING_STARTED.md bead 7 instructions
   - Create `scripts/lighthouse_ci.sh` (bash script)
   - Create `scripts/performance-audit.sh` (wrapper)
   - Test against current pages
   - Close bead with descriptive reason

2. **Continue with Phase 2 scripts**
   - Move to data-governance-scan.js (bead TBD)
   - Complete all validation infrastructure before moving to Phase 3

3. **Generate new continuation file**
   - Run: `npm run continue`
   - This will capture progress through bead 7

### Medium-Term Priorities
1. **Phase 3: HTML Base Templates** (beads 8-11)
   - Now that validation scripts exist, can create templates with immediate feedback
   - Start with base.html and base-es.html
   - Run all validation scripts after template creation

2. **Phase 4: Content Templates** (beads 10-12)
   - Program detail template
   - Insights article template
   - Help/Q&A template

3. **Phase 5: React Infrastructure** (beads 14-15, 30)
   - Configure Vite with bundle size limits
   - Create language dictionaries (en.ts, es.ts)
   - Set up separate entry points for islands

### Long-Term Strategy
- **Phase 6:** Build React components (Explorer, Chat, Contact)
- **Phase 7:** Populate with real program data
- **Phase 8:** Deployment to SiteGround

---

## User Preferences & Patterns

### Communication Style
- User prefers concise updates
- Appreciates seeing "what's next" after completing beads
- Wants confirmation before proceeding with tasks
- Values understanding the "why" behind technical decisions (e.g., WCAG AA legal requirements)

### Workflow Patterns
- Uses continuation system to resume sessions
- Expects TodoWrite tool for multi-step tasks
- Prefers seeing beads completed/pending summary
- Says "proceed" to authorize work

### Quality Standards
- Expects all inviolable rules to be followed
- Wants validation scripts to catch issues
- Values bilingual parity enforcement
- Prioritizes accessibility and performance

---

## Critical Context for Future Sessions

### DO NOT FORGET
1. **Beads workflow:** Always check `bd ready`, update status, close with reason
2. **Validation before commit:** Run appropriate npm scripts
3. **Bilingual parity:** Every English page needs Spanish counterpart
4. **JSON twins:** Auto-generated, never hand-maintained
5. **No commentary on program lists:** Pure link lists only
6. **Mobile-first:** Performance = credibility for academic sites
7. **WCAG AA:** Legal requirement, not optional

### ALWAYS ASK BEFORE
- Skipping beads out of order
- Making architectural changes
- Adding dependencies to package.json
- Deploying to production
- Committing to git

### NEVER DO
- Hand-edit JSON twins
- Add commentary to program list pages
- Skip validation scripts
- Break bilingual URL parity
- Promise visa sponsorship or admission outcomes
- Use desktop-first CSS (max-width media queries)

---

**End of Intelligence Report**

*This document should be updated after significant project milestones or architectural decisions.*
