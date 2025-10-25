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

**Dependencies:** Directory structure, slug translation utils, Cheerio, Glob
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

**Dependencies:** Base templates, data models, validation scripts
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

### 6. Bilingual Localization (Localization-First)
**Rationale:** Spanish is a first-class citizen, not an afterthought. Poor Spanish UX damages credibility for a Spanish linguistics platform.

- URL mirroring: `/` ↔ `/es/`
- Slug translation with mapping system
- Hreflang links bidirectional + self-referential + x-default
- Language switcher visible on all pages (44x44px tap target)
- Bilingual data models (`*_en` / `*_es` fields)
- JSON twins for both languages
- React component i18n with language dictionaries

**Validation:** `npm run validate-localization` must pass

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

### Bilingual Mirroring
English (`/`) and Spanish (`/es/`) are **first-class citizens** with:
- Mirrored directory structure
- Translated slugs with mapping system
- Bidirectional hreflang + x-default
- Bilingual data models with `*_en` / `*_es` fields
- JSON twins for both languages (generated automatically)

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

---

**Last Updated:** 2025-10-25
**Version:** 1.0.0
**Maintainer:** Spanish Academic 2026 Team
