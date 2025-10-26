# Application Stack

**Spanish Academic 2026**

This document provides a comprehensive overview of the technology stack, dependencies, integration strategy, priorities, and Claude Code skills used in the Spanish Academic platform.

---

## Tech Stack

### Core Runtime & Language
- **Node.js** (>=18.0.0) - JavaScript runtime for build scripts and development server
- **npm** (>=9.0.0) - Package manager
- **TypeScript** (5.7.2) - Type-safe language for structured data and React components
  - Target: ES2020
  - Strict mode enabled
  - Path aliases: `@/*`, `@/components/*`, `@/data/*`, `@/i18n/*`

### Frontend Framework & Libraries
- **Astro** (5.15.1) - Modern static site generator with island architecture
  - Documentation: https://docs.astro.build/en/getting-started/
  - Component-based page generation with `.astro` files
  - Built-in optimizations (asset bundling, image optimization)
  - Zero JavaScript by default (progressive enhancement)
  - Supports React components as islands with client directives
- **React** (19.2.0) - UI library for interactive islands (Explorer, Chat, Contact)
- **React DOM** (19.2.0) - React renderer for web
- **@astrojs/react** (4.4.0) - Astro integration for embedding React components
- **@tanstack/react-form** (1.0.0) - Type-safe form handling for Contact component

### Build Tools
- **Vite** (6.0.7) - Ultra-fast development server and production bundler (for React islands)
  - HMR (Hot Module Replacement) for development
  - Tree shaking and code splitting
  - Manual chunk splitting for vendor code
  - Bundle size enforcement (250KB limit)
  - Coexists with Astro (handles React island bundling)
- **@vitejs/plugin-react** (4.3.4) - Official React plugin for Vite
- **Terser** (5.44.0) - JavaScript minifier with console.log removal in production
- **Rollup Plugin Visualizer** (5.12.0) - Bundle size visualization

### Static Site Generation & Automation
- **Astro Build System** - Primary static site generator
  - Generates optimized HTML from `.astro` components
  - Handles content collections for structured data
  - Built-in i18n support for bilingual routing
  - Dev server on port 4321 (`npx astro dev`)
- **Cheerio** (1.0.0) - Server-side HTML parser for build scripts
  - Extract metadata from HTML pages
  - Generate JSON twins
  - Validate SEO structure
  - Check accessibility compliance
- **Glob** (11.0.0) - File pattern matching for build scripts
  - Scan directories for HTML pages
  - Generate sitemaps
  - Build category indexes

### Content Migration & Web Scraping
- **Crawlee** (3.15.2) - Production-grade web scraping and automation framework
  - HttpCrawler for fetching content from legacy WordPress site
  - Respectful rate limiting (30 requests/minute)
  - Automatic retry logic and error handling
  - Request queue management
  - Used for migrating program lists, Insights articles, and scholarship content
  - Zero-rewrite policy: Preserves exact HTML structure from source

### Code Quality & Linting
- **ESLint** (9.18.0) - JavaScript/TypeScript linter
- **@typescript-eslint/eslint-plugin** (8.19.1) - TypeScript-specific linting rules
- **@typescript-eslint/parser** (8.19.1) - TypeScript parser for ESLint
- **eslint-plugin-react-hooks** (5.1.0) - Enforce React Hooks rules
- **eslint-plugin-react-refresh** (0.4.16) - Validate React Refresh usage
- **Prettier** (3.4.2) - Code formatter for consistent style

### Performance & SEO Auditing
- **Lighthouse** (12.3.1) - Automated performance, accessibility, SEO audits
  - Mobile score enforcement (>90 required)
  - Core Web Vitals monitoring (LCP, FID, CLS)
  - Accessibility compliance validation
  - Pre-deployment gate

### TypeScript Type Definitions
- **@types/node** (22.10.5) - Node.js type definitions
- **@types/react** (18.3.18) - React type definitions
- **@types/react-dom** (18.3.5) - React DOM type definitions

### Task & Issue Tracking
- **Beads** - Lightweight issue tracking system
  - 92 beads (milestones) defined
  - Dependency tracking
  - Status management (ready, in_progress, completed)
  - JSON output for programmatic access

### Version Control
- **Git** - Source control
  - Repository: https://github.com/kidhardt/spanish-academic.git
  - Conventional commit format
  - Branch strategy: main (production), develop (integration), feature/* branches

### Hosting & Deployment
- **SiteGround** (current) - Apache hosting with .htaccess configuration
  - Gzip compression
  - Browser caching headers
  - Canonical URL redirects
- **Future-ready:** Cloudflare Pages / Netlify compatibility (no URL structure changes required)

---

## File Structure

```
spanish-academic/
├── .beads/                          # Beads issue tracking system
│   └── issues.jsonl                 # Issue tracking database
│
├── .claude/                         # Claude Code configuration and skills
│   ├── data/                        # Tracking data files
│   │   ├── localization-parity.jsonl  # Parity designations audit trail
│   │   └── protection-checksums.json  # File protection system checksums
│   └── skills/                      # Claude Code skills
│       ├── generating-continuations/  # Session management
│       ├── generating-json-ld/        # Schema.org structured data
│       ├── making-skill-decisions/    # Skill discovery workflow
│       ├── requesting-code-review/    # Code review automation
│       ├── scraping-data/             # Content migration (zero-rewrite)
│       ├── tracing-root-causes/       # Systematic debugging
│       ├── using-astro/               # Astro framework integration
│       ├── using-filetype-pdf/        # PDF manipulation
│       ├── using-filetype-pptx/       # Presentation toolkit
│       ├── using-filetype-xlsx/       # Spreadsheet toolkit
│       ├── using-git-worktrees/       # Isolated development
│       ├── using-sensitive-content/   # YMYL content governance
│       └── writing-skills/            # Skill creation TDD
│
├── data/                            # Runtime data and snapshots
│   └── snapshots/                   # Timestamped content snapshots
│       ├── migration-2025-10-25/          # Program lists migration
│       ├── migration-insights-2025-10-25/ # Insights articles migration
│       └── migration-scholarship-2025-10-26/ # Scholarship migration
│
├── docs/                            # Documentation
│   ├── content-migration/           # Migration artifacts
│   │   ├── raw-lists/              # Raw HTML from program lists
│   │   ├── raw-insights/           # Raw HTML from Insights articles
│   │   └── raw-scholarship/        # Raw HTML from scholarship articles
│   ├── APP_STACK.md                # Technology stack documentation (this file)
│   ├── CONTENT_MIGRATION.md        # Content migration report
│   ├── FILE_PROTECTION_SYSTEM.md   # File protection system documentation
│   ├── GETTING_STARTED.md          # Development setup guide
│   ├── LOCALIZATION_FIRST.md       # Bilingual architecture guide
│   ├── LOCALIZATION_PARITY_SYSTEM.md # Parity system documentation
│   └── project-map.schema.json     # JSON Schema for project-map.json
│
├── lighthouse-reports/              # Lighthouse audit results
│
├── public/                          # Static site output (English)
│   ├── assets/                      # Static assets
│   │   ├── css/                    # Stylesheets
│   │   └── js/                     # JavaScript bundles
│   ├── contact/                     # Contact form pages
│   ├── explorer/                    # Program Explorer app
│   ├── help/                        # Help/Q&A pages
│   ├── insights/                    # Insights articles
│   │   └── categories/             # Category index pages
│   ├── programs/                    # Program detail pages
│   ├── scholarship/                 # Scholarship articles (NON-PARITY)
│   ├── test/                        # Test pages
│   ├── index.html                   # Homepage
│   ├── spanish-linguistics.html     # Program list page
│   ├── translation-and-interpreting.html # Program list page
│   ├── literature-and-culture.html  # Program list page
│   ├── online-spanish-linguistics.html # Program list page
│   ├── .htaccess                    # Apache configuration
│   ├── robots.txt                   # Search engine directives
│   ├── sitemap.xml                  # Generated sitemap
│   └── manifest.webmanifest         # PWA manifest
│
├── public/es/                       # Static site output (Spanish)
│   ├── ayuda/                       # Help/Q&A pages (Spanish)
│   ├── contacto/                    # Contact form (Spanish)
│   ├── explorador/                  # Program Explorer (Spanish)
│   ├── insights/                    # Insights articles (Spanish)
│   │   └── categorias/             # Category index pages
│   ├── programas/                   # Program detail pages (Spanish)
│   ├── test/                        # Test pages (Spanish)
│   ├── index.html                   # Homepage (Spanish)
│   ├── linguistica-espanola.html    # Program list page
│   ├── traduccion-e-interpretacion.html # Program list page
│   ├── literatura-y-cultura.html    # Program list page
│   └── linguistica-espanola-online.html # Program list page
│
├── scripts/                         # Build and validation scripts
│   ├── crawlee/                     # Content migration scripts
│   │   ├── fetchProgramLists.ts    # Fetch program lists from WordPress
│   │   ├── generateProgramLists.ts # Generate program list pages
│   │   ├── fetchInsightsArticles.ts # Fetch Insights articles
│   │   ├── generateInsightsPages.ts # Generate Insights pages
│   │   ├── fetchScholarshipArticles.ts # Fetch scholarship articles
│   │   └── generateScholarshipPages.ts # Generate scholarship pages
│   ├── localization/                # Localization parity scripts
│   │   ├── parity-designate.js     # Record parity designations
│   │   └── parity-list.js          # List parity designations
│   ├── accessibility-scan.js        # WCAG AA compliance checker
│   ├── build_categories.js          # Generate category index pages
│   ├── ci-protection-check.cjs      # Server-side file protection enforcement (CI)
│   ├── data-governance-scan.js      # High-sensitivity content validator
│   ├── execute_continuation.js      # Session continuation generator
│   ├── generate_page_json.js        # Generate JSON twins from HTML
│   ├── generate_sitemap.js          # Generate sitemap.xml
│   ├── html-size-check.js           # Enforce HTML size budget
│   ├── install-git-hooks.js         # Install pre-commit hook for file protection
│   ├── lighthouse_ci.sh             # Lighthouse CI integration
│   ├── pre-commit-check.js          # File protection enforcement (local pre-commit)
│   ├── pre-deploy-validation.sh     # Pre-deployment validation suite
│   ├── validate-project-map-schema.cjs # Validate project-map.json against schema
│   ├── validate_localization.js     # Bilingual parity validator
│   └── verify-protection-integrity.cjs # Checksum verification for protection files
│
├── src/                             # Source code
│   ├── apps/                        # React island applications
│   │   ├── chat/                   # Help Chat component
│   │   ├── contact/                # Contact Form component
│   │   └── explorer/               # Program Explorer component
│   ├── components/                  # Shared React components
│   ├── data/                        # Data models
│   │   ├── structured/             # TypeScript data models (bilingual)
│   │   └── unstructured/           # JSON narrative content
│   ├── i18n/                        # Internationalization
│   │   ├── en.ts                   # English UI strings
│   │   └── es.ts                   # Spanish UI strings
│   └── utils/                       # Utility functions
│       ├── localization.ts          # Hreflang and path helpers
│       ├── slugTranslations.ts      # Bilingual slug mapping
│       └── snapshotManager.ts       # Content snapshot utilities
│
├── storage/                         # Crawlee storage (runtime)
│   ├── key_value_stores/           # Crawler metadata
│   └── request_queues/             # Crawler queue state
│
├── templates/                       # HTML templates
│   ├── base.html                    # Base template (English, PARITY)
│   └── scholarship-base.html        # Scholarship template (NON-PARITY)
│
├── .github/                         # GitHub configuration
│   ├── workflows/                   # GitHub Actions CI/CD
│   │   └── file-protection.yml     # File protection enforcement (CI)
│   └── CODEOWNERS                   # Code ownership and review requirements
│
├── .gitignore                       # Git ignore patterns
├── CLAUDE.md                        # AI agent governance rules
├── package.json                     # npm dependencies and scripts
├── project-map.json                 # File protection system configuration
├── README.md                        # Project overview
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite build configuration
```

### Key Directory Purposes

**Content Directories:**
- `public/` - English static site output (production-ready HTML)
- `public/es/` - Spanish static site output (mirrors English structure)
- `public/scholarship/` - NON-PARITY scholarly articles (Spanish only)

**Data & Migration:**
- `data/snapshots/` - Timestamped content snapshots for legal protection
- `docs/content-migration/raw-*/` - Raw HTML from WordPress (evidence preservation)
- `.claude/data/` - Tracking files (parity designations, sensitive content)

**Scripts & Automation:**
- `scripts/crawlee/` - Content migration with zero-rewrite policy
- `scripts/localization/` - Parity system management
- `scripts/*.js` - Validation and build automation

**Source Code:**
- `src/apps/` - React island applications (Explorer, Chat, Contact)
- `src/data/structured/` - TypeScript data models with bilingual fields
- `src/data/unstructured/` - JSON narrative content (gradual translation)
- `src/i18n/` - UI translation dictionaries
- `src/utils/` - Shared utilities (localization, slug translation, snapshots)

**Configuration & Governance:**
- `.claude/skills/` - Claude Code automation skills
- `templates/` - HTML templates (PARITY and NON-PARITY)
- `CLAUDE.md` - AI agent rules and governance
- `docs/*.md` - Comprehensive documentation

---

## Integration Strategy

The following integration order follows best practices for static-first architecture, ensuring foundation before features, validation before content, and progressive enhancement throughout.

### 1. Foundation: Type System & Path Resolution (Week 1, Day 1)
**Why first:** TypeScript configuration defines module resolution, path aliases, and type safety for all subsequent code.

- Configure `tsconfig.json` with strict mode and path aliases
- Set up ES2020 target with bundler module resolution
- Enable JSX transformation for React components
- Establish `@/*` path aliases for clean imports

**Dependencies:** None
**Validates:** `npm run type-check`

---

### 2. Build System: Vite Configuration (Week 1, Day 1)
**Why second:** Vite orchestrates development server, production builds, and bundle optimization. Must be configured before writing any React code.

- Configure separate entry points for React islands (Explorer, Chat, Contact)
- Set up manual chunk splitting (react-vendor, form-vendor)
- Enforce bundle size limit (250KB per chunk)
- Configure Terser for production minification
- Set up bundle visualization with rollup-plugin-visualizer

**Dependencies:** TypeScript configuration
**Validates:** `npm run build`, `npm run dev`

---

### 3. Directory Structure: Physical Layout (Week 1, Days 2-3)
**Why third:** Build scripts and templates need the directory tree to exist before they can generate or validate content.

- Create `/public/` root for English content
- Create `/public/es/` mirror for Spanish content
- Create bilingual subdirectories:
  - `/programs/` ↔ `/es/programas/`
  - `/insights/` ↔ `/es/insights/`
  - `/help/` ↔ `/es/ayuda/`
  - `/explorer/` ↔ `/es/explorador/`
  - `/contact/` ↔ `/es/contacto/`
- Add `.gitkeep` files to empty directories

**Dependencies:** None
**Validates:** Directory tree inspection

---

### 4. Localization Utils: Slug Translation (Week 1, Day 3)
**Why fourth:** All build scripts need slug translation for bilingual URL generation.

- Create `/src/utils/slugTranslations.ts` with bidirectional term mapping
- Implement `translateSlug(slug: string, targetLang: 'en' | 'es'): string`
- Define TypeScript types for language codes
- Export for use in build scripts and templates

**Dependencies:** TypeScript configuration
**Validates:** `npm run type-check`

---

### 5. Build Scripts: Metadata Contract & Validation (Week 1, Days 3-6)
**Why fifth:** Scripts define the metadata contract that templates must follow. Building scripts first enables immediate validation of each template as it's created.

#### 5a. Generate Page JSON (`generate_page_json.js`)
- Parse HTML with Cheerio
- Extract SEO_INTENT metadata block
- Validate title length (50-60 chars)
- Validate meta description (140-160 chars)
- Generate `.json` twins for both `/path.json` and `/es/path.json`
- Create placeholder JSON for missing alternate language pages

**Validates:** Metadata completeness, SEO structure

#### 5b. Validate Localization (`validate_localization.js`)
- Walk `/public/` and `/public/es/` directory trees
- Verify `path_en` / `path_es` metadata on all pages
- Check hreflang bidirectionality and x-default
- Audit bilingual fields in structured data (`*_en` / `*_es`)
- Report missing Spanish counterparts

**Validates:** Bilingual parity, hreflang compliance

#### 5c. Accessibility Scan (`accessibility-scan.js`)
- Parse HTML structure with Cheerio
- Validate heading hierarchy (no skipped levels)
- Check alt text on images
- Flag vague link anchors ("click here", bare URLs)
- Verify semantic HTML elements (`<main>`, `<article>`, `<section>`)
- Check lang attributes
- Validate WCAG AA contrast ratios (4.5:1 minimum)

**Validates:** WCAG AA compliance, semantic HTML

#### 5d. Build Categories (`build_categories.js`)
- Scan `/public/insights/` and `/public/help/` for articles
- Group by category metadata
- Generate category index pages with SEO_INTENT blocks
- Create both English and Spanish versions
- Auto-generate JSON twins
- Include CollectionPage schema.org markup

**Validates:** Category page structure, bilingual coverage

#### 5e. Generate Sitemap (`generate_sitemap.js`)
- Scan `/public/` for all published HTML pages
- Extract `lastReviewed` from SEO_INTENT for `<lastmod>`
- Set priority by page type (Programs: 0.8, Insights: 0.7, Help: 0.6)
- Include both `/` and `/es/` URLs
- Validate against sitemap.org schema

**Validates:** Sitemap.xml completeness, lastmod accuracy

#### 5f. Data Governance Scan (`data-governance-scan.js`)
- Identify high-sensitivity content (visa, AI ethics, funding guarantees)
- Verify `lastReviewed` field presence in JSON twins
- Check for disclaimer presence in HTML
- Flag missing governance controls

**Validates:** Legal compliance, data freshness

#### 5g. Lighthouse CI (`lighthouse_ci.sh`)
- Audit key pages (homepage, program list, program detail, insights, help)
- Enforce mobile score >90
- Report Core Web Vitals (LCP, FID, CLS)
- Block deployment if scores fail

**Validates:** Performance, accessibility, SEO

#### 5h. Sensitive Content Tracking (`sensitive-content:validate`)
- Track high-sensitivity content requiring disclaimers (YMYL compliance)
- JSONL-based tracking file (`.claude/skills/using-sensitive-content/data/sensitive-content-tracker.jsonl`)
- Warning mode (development): Logs issues, allows commits
- Strict mode (deployment): Blocks if unresolved items exist
- E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines
- Used for visa/immigration, AI ethics, funding, career advice, rankings content

**Validates:** YMYL compliance, disclaimer presence

#### 5i. Localization Parity Management (`parity:designate`, `parity:list`)
- Record and track PARITY vs. NON-PARITY page designations
- JSONL-based tracking file (`.claude/data/localization-parity.jsonl`)
- User approval protocol for NON-PARITY designations
- Four valid reasons: scholarly-article-original-language, language-specific-content, cultural-specific-resource, original-publication
- Validation system respects parity metadata (skips bilingual checks for NON-PARITY)
- Citation preservation protocol for scholarly articles

**Validates:** Localization parity designations, user approval audit trail

#### 5j. Content Migration Scripts (`crawlee:fetch-*`, `crawlee:generate-*`)
- Fetch scripts: Use Crawlee HttpCrawler to fetch raw HTML from legacy WordPress site
- Generate scripts: Extract content with Cheerio, generate clean HTML using templates
- Zero-rewrite policy: Preserve exact HTML structure from source
- Timestamped snapshots for legal protection and audit trail
- Evidence preservation: Raw HTML + snapshots + fetch logs
- Migration scripts: fetchProgramLists.ts, generateProgramLists.ts, fetchInsightsArticles.ts, generateInsightsPages.ts, fetchScholarshipArticles.ts, generateScholarshipPages.ts

**Validates:** Zero-rewrite compliance, evidence preservation

**Dependencies:** Directory structure, slug translation utils, Cheerio, Glob, Crawlee
**Validates:** `npm run validate-all`

---

### 6. HTML Templates: Base & Semantic Structure (Week 1, Day 7)
**Why sixth:** With validation scripts ready, templates can be validated immediately upon creation.

- Create `/templates/base.html` (English) and `/templates/base-es.html` (Spanish)
- Include SEO_INTENT comment block with placeholders
- Add `<title>` (50-60 chars), `<meta name="description">` (140-160 chars)
- Add canonical URL + bidirectional hreflang links
- Add single `<h1>` with keyword placement
- Include `<html lang="en|es">` with proper lang attribute
- Add mobile viewport meta tag
- Include visible language switcher (44x44px tap targets)
- Use semantic HTML5 elements
- Ensure WCAG AA contrast and focus indicators

**Dependencies:** Build scripts (for immediate validation)
**Validates:** `npm run generate-json`, `npm run validate-localization`, `npm run accessibility-scan`

---

### 7. Localization Infrastructure: Helper Functions (Week 2, Days 1-2)
**Why seventh:** Templates and React components need these utilities for hreflang generation and path resolution.

- Create `/src/utils/localization.ts`
- Implement `generateHreflangLinks(path_en: string, path_es: string): string`
- Implement `getAlternateLanguagePath(currentPath: string, currentLang: 'en' | 'es'): string`
- Create path metadata validator helpers
- Export for use in templates and React components

**Dependencies:** Slug translation utils, TypeScript configuration
**Validates:** `npm run type-check`

---

### 8. Data Models: Structured Data (Week 2, Days 2-3)
**Why eighth:** React components and HTML templates need program/faculty data to render.

- Define TypeScript interfaces in `/src/data/structured/`
- Create Program and Faculty types with bilingual fields:
  - Short fields: `focusAreas_en` / `focusAreas_es`
  - Shared numeric/boolean: `stipendApproxUSD`, `yearsGuaranteed`, `greRequired`
- Add geographic coordinates for mapping
- Seed initial program data
- Export for React components

**Dependencies:** TypeScript configuration
**Validates:** `npm run type-check`

---

### 9. Data Models: Unstructured Data (Week 2, Day 3)
**Why ninth:** Longer narrative content is separate from structured data for gradual translation.

- Create `/src/data/unstructured/`
- Define `programNotes.en.json` / `programNotes.es.json`
- Include longer narrative descriptions
- Add admissions expectations, mentorship culture, visa sponsorship notes
- Allow gradual translation without blocking deployment

**Dependencies:** None (pure JSON files)
**Validates:** JSON syntax validation

---

### 10. Page Templates: Specific Page Types (Week 3)
**Why tenth:** With base templates and data models ready, create specific page type templates.

#### 10a. Program List Pages
- Pure link lists (ZERO inline commentary per RULE 1)
- "Related Resources" section at bottom
- JSON twin lists programs with URLs

#### 10b. Program Detail Pages
- Structured data (funding, location, requirements) from TypeScript models
- Narrative content from `programNotes.en.json` / `.es.json`
- Link to Explorer view
- JSON twin includes `programSummary` type

#### 10c. Insights Articles
- Academic journal style (title, author, affiliation, date, abstract)
- Numbered sections with clickable references
- "Related Insights" section at bottom
- JSON twin includes `category`, `publishedDate`, `keyClaims`, `adviceForStudents`

#### 10d. Help/Q&A Pages
- Small header (maximize above-fold real estate)
- "Short Answer" block immediately visible
- "Click here to Chat →" badge after short answer
- Detailed explanation below with nuance, caveats
- Disclaimer where appropriate
- JSON twin includes `qaPage` type, `lastReviewed`, `legalSensitivity`

#### 10e. Scholarship Articles (NON-PARITY)
- Academic essays in original Spanish language (citation preservation)
- Schema.org `ScholarlyArticle` markup
- Self-referential hreflang only (no alternate language)
- Metadata: `localization_parity="false"`, `parity_reason="scholarly-article-original-language"`, `page_language="es"`
- Template: `templates/scholarship-base.html`
- No English translation required (academic integrity, citability)
- Located at `/scholarship/` directory

**Dependencies:** Base templates, parity system, validation scripts
**Validates:** `npm run validate-all`

---

### 11. i18n: Language Dictionaries (Week 4, Day 1)
**Why eleventh:** React components need translation strings for UI elements.

- Create `/src/i18n/en.ts` with English UI strings
- Create `/src/i18n/es.ts` with Spanish UI strings
- Define shared TypeScript interface for type safety
- Export for React components

**Dependencies:** TypeScript configuration
**Validates:** `npm run type-check`

---

### 12. React Components: Interactive Islands (Week 4-5)
**Why twelfth:** Static pages and data models are complete; now add interactive features.

#### 12a. Contact Form
- Use @tanstack/react-form for type-safe validation
- Bilingual form labels and error messages
- Mobile-first responsive layout
- Focus indicators for accessibility

#### 12b. Help Chat Component
- Consumes JSON twins (no HTML scraping)
- Bilingual conversation interface
- Mobile-optimized chat bubbles

#### 12c. Explorer React App
- Program Map tab (lazy-loaded, geocoded data)
- Compare tab (side-by-side program comparison)
- Match/Chat tab (interactive guidance)
- Lazy loading for heavy components (maps, charts)
- Manual chunk splitting for shared dependencies

**Dependencies:** React, React DOM, @tanstack/react-form, Vite configuration, data models, i18n dictionaries
**Validates:** `npm run build`, `npm run type-check`

---

### 13. CSS: Mobile-First Responsive Styles (Week 5)
**Why thirteenth:** React components and HTML templates are complete; now apply mobile-first styling.

- Base: 320px (single-column, 16px font, 44x44px touch targets)
- Tablet: 768px+ (`min-width` only, progressive enhancement)
- Desktop: 1024px+ (`min-width` only, max-width 1200px for readability)
- Printer-friendly styles for academic citation
- WCAG AA contrast ratios (4.5:1 minimum)
- Focus indicators for keyboard navigation

**Dependencies:** HTML templates, React components
**Validates:** `npm run lighthouse`, `npm run accessibility-scan`

---

### 14. Claude Skills: Automation & Governance (Week 6)
**Why fourteenth:** With full application structure in place, automate validation and governance.

#### 14a. Existing Skills (Managed)
- `generating-continuations` - Session resumption with timestamped continuation files
- `generating-json-ld` - Schema.org structured data for HTML pages
- `making-skill-decisions` - Skill discovery and workflow enforcement
- `requesting-code-review` - Dispatch code-reviewer subagent before merging
- `tracing-root-causes` - Systematic bug tracing through call stack
- `using-filetype-pdf` - PDF manipulation (extract, create, merge, split, forms)
- `using-filetype-pptx` - Presentation creation and editing
- `using-filetype-xlsx` - Spreadsheet creation, analysis, formula recalculation
- `using-git-worktrees` - Isolated git worktrees for feature work
- `writing-skills` - TDD approach to creating new skills

#### 14b. Future Skills (Planned)
- `checking-mobile-first` - Check responsive layout, tap targets, viewport configuration
- `checking-localization` - Validate bilingual parity, hreflang, language switcher
- `syncing-page-json` - Auto-run `generate_page_json.js` after HTML edits
- `building-category-pages` - Auto-run `build_categories.js` when articles change
- `checking-accessibility` - Auto-run WCAG AA checks before committing
- `checking-performance-budget` - Enforce bundle size limits and Lighthouse scores
- `checking-data-governance` - Verify disclaimers and lastReviewed on high-sensitivity content
- `checking-seo-compliance` - Validate title length, meta descriptions, keyword placement, H1 presence

**Dependencies:** All build scripts, templates, and validation infrastructure
**Validates:** Skills execute build scripts correctly

---

### 15. Content Seeding: Initial Pages (Week 7-8)
**Why fifteenth:** With all infrastructure validated, seed initial content.

- Seed initial program data (10-20 programs)
- Write initial Insights articles (5-10 articles)
- Write initial Help/Q&A pages (10-15 questions)
- Generate category index pages
- Generate sitemap.xml
- Validate all content with full test suite

**Dependencies:** All templates, data models, build scripts
**Validates:** `npm run validate-all`, `npm run lighthouse`

---

### 16. Deployment: Pre-Production Validation (Week 9)
**Why sixteenth:** Final validation before production launch.

- Run full validation suite (`npm run validate-all`)
- Verify Lighthouse mobile scores >90 on all key pages
- Test bilingual navigation (language switcher, hreflang)
- Verify all JSON twins generated
- Check sitemap.xml completeness
- Test React islands load correctly
- Verify bundle sizes < 250KB
- Test accessibility with screen readers

**Dependencies:** All content, scripts, and infrastructure
**Validates:** `npm run validate-all`, `npm run lighthouse`

---

### 17. Deployment: Production Launch (Week 9-10)
**Why seventeenth (final):** Deploy validated application to production.

- Deploy `/public/` to SiteGround `public_html/`
- Verify .htaccess configuration (gzip, caching, canonical redirects)
- Test production deployment (all URLs resolve correctly)
- Verify React islands load from production CDN
- Monitor Core Web Vitals in production
- Set up error monitoring and analytics

**Dependencies:** Pre-production validation complete
**Validates:** Production smoke tests, Lighthouse on live URLs

---

## Priorities

This priority structure ensures code integrity and stability first, followed by robust functionality, excellent user experience (mobile-first), and comprehensive governance.

### 1. Code Integrity & Type Safety (Highest Priority)
**Rationale:** Type errors and build failures block all subsequent work. TypeScript strict mode catches bugs before they reach users, ensuring reliability for high-stakes academic decisions.

- TypeScript strict mode enabled
- No unused locals or parameters
- No fallthrough cases in switch statements
- Path aliases for clean imports
- Type-safe React components and data models
- Pre-commit type checking (`npm run type-check`)

**Validation:** `npm run type-check` must pass before committing

---

### 2. Build System Stability
**Rationale:** A broken build system blocks development, deployment, and validation. Vite configuration must be stable and reproducible.

- Vite builds succeed without errors
- Bundle size limits enforced (250KB per chunk)
- Source maps generated for debugging
- Manual chunk splitting for optimal caching
- Tree shaking and minification working correctly
- Development server starts reliably

**Validation:** `npm run build`, `npm run dev` must succeed

---

### 3. Data Integrity & Validation
**Rationale:** Incorrect or incomplete data undermines credibility. Automated validation prevents decay.

- All HTML pages have JSON twins
- SEO_INTENT metadata present and valid
- Bilingual parity maintained (`path_en` / `path_es`)
- High-sensitivity content has `lastReviewed` + disclaimers
- Sitemap.xml includes all published pages
- Category pages auto-generated correctly

**Validation:** `npm run validate-all` must pass before deployment

---

### 4. Mobile-First User Experience (High Priority)
**Rationale:** Most users research on mobile devices. Mobile performance = credibility. Google uses mobile-first indexing, making mobile experience critical for SEO.

- Base design starts at 320px (iPhone SE)
- Single-column layout with progressive enhancement
- Touch targets minimum 44x44px (Apple HIG, WCAG 2.1 AAA)
- 16px base font size (prevents iOS zoom)
- Lighthouse mobile score >90 enforced
- Core Web Vitals optimized (LCP, FID, CLS)
- Lazy loading for heavy components (maps, charts)

**Validation:** `npm run lighthouse` must show mobile score >90

---

### 5. Accessibility (WCAG AA Minimum)
**Rationale:** Graduate students with disabilities deserve equal access to program information. WCAG AA compliance is also a legal requirement in many jurisdictions and improves SEO.

- Heading hierarchy validated (no skipped levels)
- Alt text on all meaningful images
- Contrast ratios 4.5:1 minimum
- Focus indicators on interactive elements
- Semantic HTML (`<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Lang attributes on all pages
- Keyboard navigation support
- Screen reader compatibility

**Validation:** `npm run accessibility-scan`, manual screen reader testing

---

### 6. Bilingual Localization (Localization-First with Exceptions)
**Rationale:** Spanish is a first-class citizen, not an afterthought. Poor Spanish UX damages credibility for a Spanish linguistics platform.

**PARITY (Default - Bilingual Required):**
- URL mirroring: `/` ↔ `/es/`
- Slug translation with mapping system
- Hreflang links bidirectional + self-referential + x-default
- Language switcher visible on all pages (44x44px tap target)
- Bilingual data models (`*_en` / `*_es` fields)
- JSON twins for both languages
- React component i18n with language dictionaries

**NON-PARITY (Exception - Single Language Allowed):**
- User approval required before designation
- Valid reasons: scholarly-article-original-language, language-specific-content, cultural-specific-resource, original-publication
- Citation preservation protocol: Scholarly articles remain in original language for academic integrity
- Self-referential hreflang only (no alternate language)
- Explicit metadata: `localization_parity="false"`, `parity_reason`, `page_language`
- Validation skips bilingual checks for NON-PARITY pages
- Tracking: `.claude/data/localization-parity.jsonl` (audit trail)

**Validation:** `npm run validate-localization` must pass (respects parity metadata)

---

### 7. SEO & Discoverability
**Rationale:** Prospective students discover programs through search engines. Strong SEO is essential for platform visibility and student access.

- Title tags 50-60 characters with keyword placement
- Meta descriptions 140-160 characters
- Single H1 per page with keyword
- Canonical URLs to prevent duplicate content
- Hreflang for international SEO
- Sitemap.xml for search engine crawling
- Semantic HTML for better indexing
- Program list pages = pure link lists (RULE 1: no inline commentary for scannability)
- Related resources at bottom (not mixed inline)

**Validation:** `npm run generate-json`, manual SEO audit

---

### 8. Performance Budget
**Rationale:** Page speed affects SEO rankings, mobile experience, and user trust. Budget prevents bloat.

- Initial JavaScript bundle < 250KB (enforced by Vite)
- Lazy-load heavy components (maps, charts)
- No render-blocking resources
- Manual chunk splitting for vendor code
- Tree shaking removes unused code
- Console.log removed in production
- Gzip compression via .htaccess
- Browser caching headers

**Validation:** `npm run lighthouse`, bundle-stats.html analysis

---

### 9. Data Governance & Legal Compliance
**Rationale:** High-stakes content (visa, AI ethics, funding) requires accuracy, freshness, and disclaimers to protect students and platform.

- `lastReviewed` field on all high-sensitivity content
- Disclaimers on visa/immigration content ("informational, not legal advice")
- No promises or guarantees of outcomes
- Conservative, factual language only
- Automated scanning before deployment

**Validation:** `npm run data-governance-scan`

---

### 10. Developer Experience & Maintainability (Lowest Priority, but Important)
**Rationale:** Clean code and good DX enable long-term sustainability, but don't block user-facing features.

- ESLint + Prettier for consistent code style
- Clear directory structure
- Comprehensive documentation (CLAUDE.md, README.md, GETTING_STARTED.md)
- Conventional commit messages
- Claude Skills for automation
- Beads for milestone tracking
- Continuation system for session resumption

**Validation:** `npm run lint`, `npm run format`, code review

---

## File Protection System

**Version:** 1.2.0 (Enterprise-Grade)
**Documentation:** [FILE_PROTECTION_SYSTEM.md](FILE_PROTECTION_SYSTEM.md)

### Overview

The File Protection System is a comprehensive, multi-layer safeguard mechanism that prevents accidental or unauthorized modifications to critical files. It combines machine-readable protection rules, automated enforcement, and human oversight to ensure system integrity.

**Status:** ✅ Production-ready, enterprise-grade with SOC 2-level rigor

### Architecture: 5-Layer Defense

```
┌─────────────────────────────────────────────┐
│  Layer 1: AI Assistant Protocol (RULE 0)   │
│  Preventive - Ask before dangerous actions  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Layer 2: Pre-Commit Hook (local)           │
│  Automatic - Blocks violations before commit│
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Layer 3: GitHub Actions CI (server-side)   │
│  Catches --no-verify bypasses               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Layer 4: CODEOWNERS + Branch Protection    │
│  Human review for critical PRs              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Layer 5: Tamper Detection (checksums)      │
│  Detects modifications to protection files  │
└─────────────────────────────────────────────┘
```

### Core Components

#### 1. project-map.json

**Location:** Repo root
**Purpose:** Machine-readable risk classification for all files

**Structure:**
```json
{
  "version": "1.2.0",
  "lastReviewed": "2025-10-25",
  "allowedTopLevelDirectories": [...],
  "paths": {
    "path/pattern/**": {
      "danger": "low|medium|high|critical",
      "editAllowedDirect": true|false,
      "allowDelete": true|false,
      "allowRename": true|false,
      "requiresApproval": true|false,
      "mustRunValidators": ["script-name", ...],
      "notes": "Why this is protected"
    }
  }
}
```

**Danger Levels:**
- **low**: Safe to modify (docs, tests)
- **medium**: Caution advised (affects functionality)
- **high**: Production or data integrity (public/, templates/)
- **critical**: Security, compliance, core architecture (CLAUDE.md, scripts/, src/i18n/)

**Protected Paths (38 rules):**
- AI governance: `.claude/**`, `CLAUDE.md`, `project-map.json`
- Build infrastructure: `scripts/**`, `templates/**`
- Core logic: `src/i18n/**`, `src/utils/localization.ts`, `src/utils/slugTranslations.ts`
- Configuration: `package.json`, `tsconfig.json`, `vite.config.ts`
- Production: `public/.htaccess`, `public/robots.txt`

#### 2. Pre-Commit Hook

**Script:** `scripts/pre-commit-check.js`
**Installation:** `npm run install-hooks`

**Checks:**
- ✅ Blocks deletion of `allowDelete:false` files
- ✅ Blocks renaming of `allowRename:false` files
- ✅ Blocks edits to `editAllowedDirect:false` files on main branch
- ✅ Blocks new top-level directories not in whitelist
- ✅ Enforces branch naming for critical changes (feature/, safety/, fix/)
- ✅ Displays required validators for changed paths

**Example Output:**
```
❌ BLOCKED: Cannot edit src/utils/localization.ts on main branch
  Danger level: critical
  Solution: Create feature branch: git checkout -b feature/update-localization
```

#### 3. GitHub Actions CI

**Workflow:** `.github/workflows/file-protection.yml`

**Jobs:**
- **protection-check**: Server-side enforcement (mirrors pre-commit hook)
- **validation-suite**: Runs all validators (validate-all, type-check, build)
- **codeowners-check**: Verifies critical paths are protected

**Triggers:** PRs and pushes to main, master, or release/* branches

**Result:** Catches `--no-verify` bypasses, ensures server-side enforcement

#### 4. JSON Schema Validation

**Schema:** `docs/project-map.schema.json`
**Validator:** `scripts/validate-project-map-schema.cjs`

**Checks:**
- ✅ Required fields: version, lastReviewed, paths
- ✅ Version format: semver (MAJOR.MINOR.PATCH)
- ✅ Date format: ISO 8601 (YYYY-MM-DD)
- ✅ Danger levels: enum validation (low|medium|high|critical)
- ✅ Field types: boolean, string, array as expected
- ✅ No duplicates in arrays (mustRunValidators, allowedTopLevelDirectories)

**Usage:** `npm run validate-project-map`

**Result:** Prevents typos from silently disabling protection rules

#### 5. Tamper Detection

**Script:** `scripts/verify-protection-integrity.cjs`
**Checksums:** `.claude/data/protection-checksums.json`

**Protected Files:**
- project-map.json
- scripts/pre-commit-check.js
- scripts/install-git-hooks.js
- scripts/ci-protection-check.cjs
- scripts/validate-project-map-schema.cjs
- scripts/verify-protection-integrity.cjs (self-checking)
- .github/CODEOWNERS

**How It Works:**
1. Generates SHA-256 checksums on installation
2. Verifies checksums on demand or in CI
3. Detects tampering and displays helpful messages
4. Logs all modifications for audit trail

**Usage:**
```bash
npm run verify-protection-integrity     # Verify
npm run generate-protection-checksums   # Regenerate after legitimate changes
```

#### 6. CODEOWNERS

**File:** `.github/CODEOWNERS`

**Protected Paths:**
- All danger:critical files require code owner approval
- Protection system files protect themselves
- GitHub enforces via branch protection rules

**Branch Protection (GitHub Settings):**
- ✅ Require pull request before merging
- ✅ Require approvals (at least 1)
- ✅ Require review from Code Owners
- ✅ Require status checks: validate-all, type-check, Lighthouse CI
- ✅ Do not allow bypassing settings

### Key Features

1. **Fast Lookup**: JSON-based, no manual repo reads
2. **Self-Protecting**: Protection files protect themselves (checksums + CODEOWNERS)
3. **Helpful Errors**: Clear messages with specific solutions
4. **Audit Trail**: Logs all overrides (--no-verify) in .git/protection-overrides.log
5. **Cross-Platform**: Works on Windows, Mac, Linux
6. **Typo-Proof**: Schema validation prevents structural errors
7. **Bypass-Resistant**: CI catches --no-verify attempts
8. **Tamper-Evident**: Checksums detect unauthorized modifications

### NPM Scripts

```json
{
  "install-hooks": "Install pre-commit hook",
  "check-protection": "Run protection check manually",
  "validate-project-map": "Validate schema + structure",
  "verify-protection-integrity": "Check for tampering",
  "generate-protection-checksums": "Regenerate checksums"
}
```

### Installation & Testing

```bash
# 1. Install pre-commit hook
npm run install-hooks

# 2. Verify installation
npm run check-protection
npm run validate-project-map
npm run verify-protection-integrity

# 3. Test protection (should block)
echo "test" >> CLAUDE.md
git add CLAUDE.md
git commit -m "test"
# Expected: ❌ BLOCKED

# 4. Correct workflow
git checkout -b feature/test-protection
git commit -m "test"
# Expected: ✓ Passes with approval warning
```

### Best Practices (2025 Standards)

Based on research from GitHub, GitGuardian, AWS Bedrock, and Australia's AI Safety Standard:

1. **Least Privilege**: Start strict, relax only when proven safe
2. **Defense in Depth**: Multiple layers, no single point of failure
3. **Audit Everything**: Log overrides, track changes, review periodically
4. **Helpful Violations**: Clear errors with solutions, not just blocking
5. **Protect the Protections**: Self-referential protection (checksums + CODEOWNERS)
6. **Document Rationale**: Every rule has notes explaining why

### Enforcement Workflow

**For Developers:**
```bash
# Modify critical file
git checkout -b feature/update-localization
edit src/utils/localization.ts
git add src/utils/localization.ts
git commit -m "feat(i18n): add French support"
# Pre-commit hook runs → Passes with approval warning
git push -u origin feature/update-localization
# Create PR → Requires code owner approval
```

**For AI Assistants (CLAUDE.md RULE 0):**
```
1. Check project-map.json before ANY file operation
2. If danger:critical or high → Ask user for approval
3. Display 🛡️ warning with options (create branch, use worktree, cancel)
4. After public/ or public/es/ changes → Run required validators
5. NEVER create new top-level directories without checking whitelist
6. NEVER bypass protection with --no-verify
```

### Security Posture

**Compliance Level:** SOC 2-style governance
**Bypass Resistance:** 5-layer defense catches all common bypass attempts
**Audit Trail:** Complete logging of overrides + version history
**Self-Healing:** Auto-generation of checksums on installation

This is **bank-grade governance** for a Git repository, exceeding industry standards for open-source projects.

---

## App Skills

### Current Claude Skills (Managed)

These skills are currently available and fully functional:

1. **`generating-continuations`** - Session Management
   - Generates timestamped continuation files for resuming work across sessions
   - Tracks beads progress, git status, and current phase
   - Invocation: `npm run continue` or "generate continuation"
   - Location: `.claude/skills/generating-continuations/`

2. **`generating-json-ld`** - Structured Data
   - Generates JSON-LD structured data for HTML pages
   - Aligned with W3C standards and Schema.org types
   - Used for rich search results and semantic web
   - Location: `.claude/skills/generating-json-ld/`

3. **`making-skill-decisions`** - Skill Discovery
   - Establishes mandatory workflows for finding and using skills
   - Uses Read tool before announcing skill usage
   - Enforces brainstorming before coding
   - Creates TodoWrite todos for skill checklists
   - Location: `.claude/skills/making-skill-decisions/`

4. **`requesting-code-review`** - Quality Assurance
   - Dispatches code-reviewer subagent to verify work meets requirements
   - Used when completing tasks, implementing features, or before merging
   - Reviews implementation against plan/requirements
   - Location: `.claude/skills/requesting-code-review/`

5. **`tracing-root-causes`** - Debugging
   - Systematically traces bugs backward through call stack
   - Adds instrumentation when needed
   - Identifies source of invalid data or incorrect behavior
   - Used for deep execution errors
   - Location: `.claude/skills/tracing-root-causes/`

6. **`using-filetype-pdf`** - PDF Manipulation
   - Extract text and tables from PDFs
   - Create new PDFs programmatically
   - Merge and split documents
   - Handle PDF forms
   - Location: `.claude/skills/using-filetype-pdf/`

7. **`using-filetype-pptx`** - Presentation Toolkit
   - Create new presentations
   - Modify existing content
   - Work with layouts, comments, speaker notes
   - Location: `.claude/skills/using-filetype-pptx/`

8. **`using-filetype-xlsx`** - Spreadsheet Toolkit
   - Create spreadsheets with formulas and formatting
   - Read and analyze data
   - Modify while preserving formulas
   - Data analysis and visualization
   - Recalculate formulas
   - Location: `.claude/skills/using-filetype-xlsx/`

9. **`using-astro`** - Astro Framework
   - Static site generation with island architecture
   - Astro component creation and routing
   - React integration with client directives
   - Content collections and bilingual routing
   - Troubleshooting Astro dev/build issues
   - Reference: https://docs.astro.build/en/getting-started/
   - Location: `.claude/skills/using-astro/`

10. **`using-git-worktrees`** - Isolated Development
    - Creates isolated git worktrees for feature work
    - Smart directory selection
    - Safety verification before creating worktree
    - Used before executing implementation plans
    - Location: `.claude/skills/using-git-worktrees/`

11. **`writing-skills`** - Skill Creation
    - TDD approach to creating new skills
    - Tests with subagents before writing
    - Iterates until bulletproof against rationalization
    - Used when creating/editing/verifying skills
    - Location: `.claude/skills/writing-skills/`

12. **`scraping-data`** - Content Migration with Zero-Rewrite Policy
    - Enforces absolute zero-rewrite policy for content extraction from spanishacademic.com
    - Uses Crawlee HttpCrawler for production-grade scraping
    - Cheerio HTML parsing for exact structure preservation
    - Timestamped snapshots for legal protection and audit trail
    - Evidence preservation: Raw HTML + snapshots + fetch logs
    - Used for migrating program lists, Insights articles, scholarship content
    - Location: `.claude/skills/scraping-data/`

13. **`using-sensitive-content`** - YMYL Content Governance
    - Tracks high-sensitivity content requiring disclaimers (YMYL compliance)
    - JSONL-based tracking system with warning/strict modes
    - E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines
    - Comprehensive implementation guide for disclaimers (financial, legal, career, rankings)
    - Pre-deployment validation gate (blocks if unresolved items exist)
    - Used for visa/immigration, AI ethics, funding, career advice, rankings content
    - Location: `.claude/skills/using-sensitive-content/`

---

### Future Anticipated Skills (Project-Specific)

These skills are planned for Spanish Academic 2026 to automate validation and governance:

1. **`checking-mobile-first`** - Responsive Layout Validation
   - **Purpose:** Check responsive layout, tap targets, viewport configuration
   - **Validation:** Touch targets ≥44x44px, single-column base, progressive enhancement
   - **Trigger:** Before committing HTML/CSS changes
   - **Dependencies:** Cheerio for HTML parsing, custom viewport/touch target validator
   - **Bead:** spanish-academic-23

2. **`checking-localization`** - Bilingual Parity Enforcement
   - **Purpose:** Validate bilingual parity, hreflang, language switcher presence
   - **Validation:** `/` ↔ `/es/` mirroring, path_en/path_es metadata, hreflang bidirectionality
   - **Trigger:** Before committing HTML changes, after creating new pages
   - **Dependencies:** `validate_localization.js` script
   - **Bead:** spanish-academic-24

3. **`syncing-page-json`** - Auto-Generate JSON Twins
   - **Purpose:** Auto-run `generate_page_json.js` after HTML edits
   - **Validation:** JSON twin exists, metadata extracted correctly, bilingual links present
   - **Trigger:** After editing/creating HTML pages
   - **Dependencies:** `generate_page_json.js` script
   - **Bead:** spanish-academic-25

4. **`building-category-pages`** - Auto-Generate Category Indexes
   - **Purpose:** Auto-run `build_categories.js` when Insights/Help articles change
   - **Validation:** Category pages include all articles, bilingual versions created, JSON twins generated
   - **Trigger:** After creating/editing Insights or Help/Q&A pages
   - **Dependencies:** `build_categories.js` script
   - **Bead:** spanish-academic-26

5. **`checking-accessibility`** - WCAG AA Compliance Check
   - **Purpose:** Auto-run WCAG AA checks before committing HTML/CSS
   - **Validation:** Heading hierarchy, alt text, contrast ratios, semantic HTML, focus indicators
   - **Trigger:** Before committing HTML/CSS changes
   - **Dependencies:** `accessibility-scan.js` script
   - **Bead:** spanish-academic-27

6. **`checking-performance-budget`** - Bundle Size & Lighthouse Enforcement
   - **Purpose:** Enforce bundle size limits and Lighthouse scores before deployment
   - **Validation:** Bundle < 250KB, Lighthouse mobile >90, Core Web Vitals pass
   - **Trigger:** Before deployment, after modifying React components
   - **Dependencies:** `lighthouse_ci.sh` script, bundle-stats.html visualization
   - **Bead:** spanish-academic-28

7. **`checking-data-governance`** - High-Sensitivity Content Verification
   - **Purpose:** Verify disclaimers and lastReviewed on visa/AI ethics/funding content
   - **Validation:** `lastReviewed` field present, disclaimer text included, conservative language
   - **Trigger:** Before committing high-sensitivity content (visa, AI, funding)
   - **Dependencies:** `data-governance-scan.js` script
   - **Bead:** spanish-academic-29

8. **`checking-seo-compliance`** - SEO Structure Validation
   - **Purpose:** Validate title length, meta descriptions, keyword placement, H1 presence
   - **Validation:** Title 50-60 chars, meta 140-160 chars, single H1 with keyword, canonical URL
   - **Trigger:** Before committing HTML changes
   - **Dependencies:** `generate_page_json.js` script (already validates SEO structure)
   - **Bead:** spanish-academic-90

---

## Notes

### Static-First Architecture
This platform uses a **static-first with interactive React islands** architecture:
- **Static HTML** = fast, indexable, citable, accessible, permanent
- **React islands** = Explorer, Chat, Contact Form (loaded only when needed)
- **JSON twins** = machine-readable metadata for AI/chat (no HTML scraping)
- **Zero JavaScript on static pages** unless island root element present

### Bilingual Mirroring (with Parity Exceptions)
English (`/`) and Spanish (`/es/`) are **first-class citizens** with:

**PARITY (Default - Bilingual Required):**
- Mirrored directory structure
- Translated slugs with mapping system
- Bidirectional hreflang + x-default
- Bilingual data models with `*_en` / `*_es` fields
- JSON twins for both languages (generated automatically)

**NON-PARITY (Exception - Single Language Allowed):**
- User approval required before designation
- Citation preservation: Scholarly articles in original Spanish
- Self-referential hreflang only
- Tracked in `.claude/data/localization-parity.jsonl`
- Documentation: `docs/LOCALIZATION_PARITY_SYSTEM.md`

### Validation Before Deployment
**Pre-deployment checklist:**
```bash
npm run validate-all    # Runs all validation scripts
npm run lighthouse      # Enforce mobile score >90
npm run type-check      # TypeScript compilation
npm run build           # Production build
```

If any script fails, **DO NOT DEPLOY**. Fix issues first.

### Beads Integration
This project uses [beads](https://github.com/steveyegge/beads) for milestone tracking:
- 92 beads defined for Spanish Academic 2026
- Check ready work: `bd ready --json`
- Create issues: `bd create "Task" -t feature -p 1 --json`
- Update status: `bd update <id> --status in_progress --json`
- Complete work: `bd close <id> --reason "Done" --json`

### Continuation System
Session resumption via timestamped continuation files:
- End session: `npm run continue` or say "generate continuation"
- Resume session: Say "continue from where we left off"
- Files stored in `.claude/skills/generating-continuations/references/continuations/`
- Format: `YYYY-MM-DD_HH-MM-SS.md`

### Content Migration Status

**Phase 1-2a: Program Lists Migration** (Completed 2025-10-25)
- Migrated 5 program list pages (195 programs total)
- Categories: Spanish Linguistics, Translation & Interpreting, Literature & Culture, Online Programs
- Total content: 512 KB raw HTML
- Zero-rewrite compliance: ✅ Verified
- Evidence preserved: Raw HTML + timestamped snapshots

**Phase 2b: Flagship Insights Articles Migration** (Completed 2025-10-25)
- Migrated 2 flagship articles (English + Spanish placeholders)
- Articles: "How to Choose a Graduate Program", "Graduate Program Rankings"
- Total content: 241 KB raw HTML, 68 KB extracted content
- Zero-rewrite compliance: ✅ Verified
- Sensitive content tracking: 2 items (SC-001, SC-002) pending disclaimer addition

**Phase 3: Scholarship Articles Migration** (Completed 2025-10-26)
- Migrated 11 Spanish scholarly literature articles (NON-PARITY)
- Total content: 1.09 MB raw HTML, 111 KB extracted content
- Citation preservation: ✅ All articles remain in original Spanish
- Parity designations: 11 NON-PARITY designations recorded
- Evidence preserved: Raw HTML + timestamped snapshots + audit trail
- Validation: ✅ All pages validated with parity system

**Documentation:**
- [CONTENT_MIGRATION.md](CONTENT_MIGRATION.md) - Detailed migration report
- [LOCALIZATION_PARITY_SYSTEM.md](LOCALIZATION_PARITY_SYSTEM.md) - Parity system documentation

---

**Last Updated:** 2025-10-26
**Version:** 1.1.0
**Maintainer:** Spanish Academic 2026 Team
