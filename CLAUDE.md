# CLAUDE.md - AI Agent Governance for Spanish Academic 2026

This document defines the constitution and operating rules for AI agents working on the Spanish Academic platform. All AI assistants must follow these rules to maintain quality, credibility, and protect users.

## Core Mission

Spanish Academic is an authoritative, bilingual platform providing transparent information about graduate programs in Spanish Linguistics, Literature, Translation/Interpreting, and related fields. The platform serves prospective and current graduate students, faculty, and administrators with high-stakes guidance on funding, immigration, AI ethics, and research fit.

## Architecture Principles

### 1. Static-First with Interactive Islands

- **Primary content = static HTML** (fast, indexable, citable, accessible, permanent)
- **Interactive tools = React islands** (Explorer, Chat, Contact Form)
- **Every HTML page MUST have a .json twin** for AI/chat consumption
- **No heavy CMS required** - keep it simple, version-controlled, and auditable

### 2. Bilingual Mirroring

- English content lives at `/`
- Spanish content lives at `/es/`
- Directory structure mirrors exactly: `/insights/` ↔ `/es/insights/`
- Slugs are translated: `/help/visa-requirements.html` ↔ `/es/ayuda/requisitos-de-visa.html`
- Every page MUST have `hreflang` links and proper `lang` attributes

### 3. JSON Twin Strategy

Every meaningful page (Program List, Program Detail, Insights Article, Help/Q&A, Category Page) MUST have a `.json` twin:

- Generated automatically by `scripts/generate_page_json.js`
- Never hand-maintained
- Contains structured metadata for AI/chat consumption
- Includes `alternateLanguage` links for bilingual navigation
- For high-sensitivity content (visa, AI ethics), MUST include `lastReviewed` field

## Inviolable Rules

### RULE 1: NO COMMENTARY ON PROGRAM LIST PAGES

**Program list pages are pure link lists. ZERO inline commentary.**

- ❌ NEVER add descriptive text, blurbs, or annotations under program links
- ❌ NEVER inject "why this program is great" or "notable for X" text
- ✅ ONLY program name + link
- ✅ "Related Resources" section at bottom of page is allowed

**Rationale:** SEO protection, scannability, long-standing performance data.

**Example violation:**
```html
<li><a href="/programs/uc-davis-phd-spanish-ling.html">UC Davis - PhD Spanish Linguistics</a>
  <p>Known for strong quantitative methods training.</p> <!-- VIOLATION -->
</li>
```

**Correct format:**
```html
<li><a href="/programs/uc-davis-phd-spanish-ling.html">UC Davis - PhD Spanish Linguistics</a></li>
```

### RULE 2: EVERY PAGE MUST HAVE A JSON TWIN

- Run `npm run generate-json` after creating or editing any HTML page
- JSON twin filename matches HTML: `article.html` → `article.json`
- JSON must be machine-readable (valid JSON, no comments)
- AI/chat layer MUST consume JSON, not scrape HTML

### RULE 3: HIGH-SENSITIVITY CONTENT REQUIRES GOVERNANCE

Content dealing with **immigration/visa**, **AI ethics/disclosure**, **academic integrity**, or **funding guarantees** MUST include:

- `lastReviewed` field in JSON twin (ISO 8601 date)
- Disclaimer in HTML (e.g., "This is informational, not legal advice")
- No promises or guarantees of outcomes
- Conservative, factual language only

**Run `npm run data-governance-scan` to verify compliance before committing.**

### RULE 4: PRESERVE LOCALIZATION PARITY

- `/` and `/es/` must mirror in structure
- If you add `/help/new-question.html`, you MUST add placeholder `/es/ayuda/nueva-pregunta.html`
- `hreflang` links must be bidirectional
- Run `npm run validate-localization` before committing

### RULE 5: MOBILE-FIRST, WCAG AA MINIMUM

- All pages must be responsive (mobile-first CSS)
- Lighthouse mobile score MUST be >90
- WCAG AA compliance: contrast, alt text, heading hierarchy, focus indicators
- Printer-friendly styles (academic citation use case)
- Run `npm run accessibility-scan` before committing

### RULE 6: PERFORMANCE BUDGET

- Initial JavaScript bundle < 250KB
- Lazy-load heavy components (maps, charts) in Explorer
- No render-blocking resources
- Run `npm run lighthouse` to verify

### RULE 7: SEMANTIC HTML, ACADEMIC TONE

- Use semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Proper heading hierarchy: `<h1>` → `<h2>` → `<h3>` (no skipping)
- Academic voice: professional, clear, minimal decoration
- No fluff, no marketing language, no superlatives

## Data Model Rules

### Structured Data (TypeScript)

- Program and Faculty objects stored in `/src/data/structured/`
- Strongly typed interfaces with bilingual fields:
  - `focusAreas_en` / `focusAreas_es`
  - `methodsCulture_en` / `methodsCulture_es`
- Shared numeric/boolean data: `stipendApproxUSD`, `yearsGuaranteed`, `greRequired`
- **Never duplicate shared data** - use single source of truth

### Unstructured Data (JSON)

- Longer narrative descriptions in `/src/data/unstructured/`
- Separate files per language:
  - `programNotes.en.json`
  - `programNotes.es.json`
- Allows gradual translation without blocking deployment
- Loaded lazily by Explorer and Chat components

## Build Script Rules

### Required Scripts

All scripts live in `/scripts/`:

1. **`generate_page_json.js`** - Parse HTML metadata → create `.json` twins
2. **`build_categories.js`** - Auto-generate category index pages (Insights, Help/Q&A)
3. **`generate_sitemap.js`** - Create `sitemap.xml` from all published pages
4. **`validate_localization.js`** - Enforce `/` ↔ `/es/` parity, hreflang
5. **`accessibility-scan.js`** - WCAG AA checks (heading order, alt text, contrast)
6. **`data-governance-scan.js`** - Verify `lastReviewed` + disclaimers on high-sensitivity content
7. **`lighthouse_ci.sh`** - Core Web Vitals audit, mobile performance

### Pre-Commit Workflow

Before committing changes:

```bash
npm run validate-all  # Runs all validation scripts
```

If any script fails, **DO NOT COMMIT**. Fix issues first.

## Claude Skills Rules

Skills live in `/.claude/skills/` and enforce project rules:

- **`mobile-first-audit`** - Check responsive layout, tap targets
- **`localization-check`** - Validate bilingual parity
- **`page-json-sync`** - Run `generate_page_json.js`
- **`build-category-pages`** - Run `build_categories.js`
- **`accessibility-scan`** - Run `accessibility-scan.js`
- **`performance-budget`** - Bundle size + Lighthouse checks
- **`data-governance-scan`** - Verify disclaimers on visa/AI content

**Use Skills proactively.** If you edit HTML, immediately run `/page-json-sync`.

## Content Type Rules

### Program List Pages

- Location: `/spanish-linguistics.html`, `/translation-and-interpreting.html`, etc.
- **Pure link lists only** (see RULE 1)
- Small "Related Resources" section at bottom linking to Insights, Help, Explorer
- JSON twin lists programs with URLs

### Program Detail Pages

- Location: `/programs/[program-slug].html`
- Structured data (funding, location, requirements) from TypeScript
- Narrative content from `programNotes.en.json` / `.es.json`
- JSON twin includes `programSummary` type
- Link to Explorer view

### Insights Articles

- Location: `/insights/[article-slug].html`
- Academic journal style: title, author, affiliation, date, abstract
- Optional video introduction or research figure
- Numbered sections (1. Background, 2. Findings, etc.)
- Clickable references with back-links
- "Related Insights" section at bottom
- JSON twin includes `category`, `publishedDate`, `keyClaims`, `adviceForStudents`

### Help/Q&A Pages

- Location: `/help/[question-slug].html`
- One question per page
- Very small header (maximize above-fold real estate)
- **"Short Answer" block immediately visible** (mobile-first)
- "Click here to Chat →" badge after short answer
- Detailed explanation below with nuance, caveats, context
- Disclaimer where appropriate
- JSON twin includes `qaPage` type, `lastReviewed`, `legalSensitivity`

### Category Index Pages

- Auto-generated by `build_categories.js`
- Location: `/insights/categories/[category-slug].html`, `/help/categories/[category-slug].html`
- Lists all articles/Q&A in category with short abstracts
- JSON twin lists links and metadata

## Deployment Rules

### Pre-Deployment Checklist

1. ✅ Run `npm run validate-all`
2. ✅ Run `npm run build` (compile React islands)
3. ✅ Verify Lighthouse mobile >90
4. ✅ Check beads for open blocking issues: `bd ready --json`
5. ✅ Verify `.htaccess` is present in `/public/`
6. ✅ Verify `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `humans.txt` exist

### Production Hosting

- **SiteGround**: Deploy `/public/` contents to `public_html/`
- **Apache**: `.htaccess` handles compression, caching, canonical redirects
- **Future**: Can migrate to Cloudflare Pages/Netlify without URL structure changes

## Beads Integration

This project uses [beads](https://github.com/steveyegge/beads) for milestone tracking.

### AI Agent Workflow with Beads

1. **Find ready work:** `bd ready --json`
2. **Create issues:** `bd create "Task description" -t feature -p 1 --json`
3. **Update status:** `bd update <issue-id> --status in_progress --json`
4. **Link dependencies:** `bd dep add <new-id> <parent-id> --type discovered-from`
5. **Complete work:** `bd close <issue-id> --reason "Implemented" --json`

### When to Create Beads Issues

- New program list pages
- New Insights articles
- New Help/Q&A pages
- Build script updates
- Claude Skills creation
- Performance regressions
- Accessibility violations
- Localization gaps

**Always link related beads:** If you discover a missing dependency while working, create a new bead and link it: `bd dep add <new-id> <current-id> --type discovered-from`

## Continuation System (Session Management)

This project uses an automated continuation system to resume work across chat sessions.

### Ending a Session

**Two ways to generate a continuation:**

1. **npm command:**
   ```bash
   npm run continue
   ```

2. **Plain language to Claude:**
   - "generate continuation"
   - "create continuation file"
   - "save session progress"
   - "end session"

**What it does:**
- Queries beads system (`bd list`, `bd ready`)
- Reads GETTING_STARTED.md to determine current phase
- Checks git status for recent changes
- Generates timestamped file: `.claude/skills/directors/continuations/YYYY-MM-DD_HH-MM-SS.md`
- Includes: completed beads, next bead, current phase, git status, key commands

### Starting a New Session

**Say to Claude:** "continue from where we left off"

**Claude will:**
- Scan `.claude/skills/directors/continuations/`
- Find the latest timestamped file
- Load it and present a summary
- Ask if you're ready to proceed with the next bead

### Continuation Files

**Location:** `.claude/skills/directors/continuations/`

**Format:** `YYYY-MM-DD_HH-MM-SS.md` (e.g., `2025-10-24_18-56-53.md`)

**Contents:**
- Progress summary (completed beads count)
- Recent completions (last 5 beads)
- In-progress beads
- Ready beads (next 5)
- Current phase from GETTING_STARTED.md
- Next bead details
- Git status and recent file changes
- Key commands reference
- Next steps

**Archived:** `CONTINUATION_PROMPT.md` (original, kept for reference)

### Implementation

**Skill:** `.claude/skills/continuation-director.md`
- Contains instructions for Claude to execute
- Expandable - can add more queries and validations

**Script:** `scripts/execute_continuation.js`
- Implements the skill programmatically for npm command
- Queries beads, parses GETTING_STARTED.md, checks git status
- Generates the continuation markdown file

**Documentation:** `docs/CONTINUATION_SYSTEM_IMPLEMENTATION.md`
- Full implementation details
- Reversion instructions
- Troubleshooting guide

### Best Practices

1. **Generate continuation at end of every session** (run `npm run continue` or ask Claude)
2. **Commit work before generating continuation** so git status is accurate
3. **Start new sessions by saying "continue"** to load latest state
4. **Never manually edit generated continuation files** - they're auto-generated
5. **Keep old continuations** - they provide session history

## Git Workflow

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/formatting (not code style)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(insights): add quantitative methods article
fix(localization): repair broken hreflang links in /es/
docs(claude): update governance rules for JSON twins
perf(explorer): lazy-load map component to reduce bundle
```

### Branch Strategy

- `main` = production-ready code
- `develop` = integration branch for features
- Feature branches: `feature/program-lists`, `feature/explorer-map`, etc.
- Bugfix branches: `fix/hreflang-links`, `fix/accessibility-contrast`, etc.

### Pull Request Requirements

Before merging:

1. ✅ All validation scripts pass
2. ✅ Beads issue linked in PR description
3. ✅ Lighthouse mobile >90
4. ✅ No accessibility violations
5. ✅ Localization parity maintained
6. ✅ JSON twins generated

## Prohibited Actions

**NEVER:**

- Add commentary to program list pages (violates RULE 1)
- Commit without JSON twins (violates RULE 2)
- Promise visa sponsorship, admission, funding (violates RULE 3)
- Break `/` ↔ `/es/` parity (violates RULE 4)
- Ship pages with Lighthouse <90 or WCAG violations (violates RULE 5)
- Exceed 250KB initial bundle (violates RULE 6)
- Use non-semantic HTML or marketing language (violates RULE 7)
- Hand-edit JSON twins (automated generation only)
- Scrape HTML in chat layer (use JSON twins)
- Deploy without running validation scripts
- Skip beads updates for significant work

## Questions or Clarifications

If you encounter ambiguity:

1. Check this document first
2. Run relevant Claude Skill for automated guidance
3. Check `/README.md` for architecture overview
4. Ask the user for clarification if still unclear

## Updates to This Document

When updating CLAUDE.md:

1. Create a bead: `bd create "Update CLAUDE.md governance rules" -t docs`
2. Make changes
3. Run `bd update <issue-id> --status in_progress`
4. Commit with message: `docs(claude): [description of changes]`
5. Close bead: `bd close <issue-id> --reason "Documentation updated"`

---

**Last Reviewed:** 2025-10-24
**Version:** 1.0.0
**AI Agents:** This is your constitution. Follow it rigorously. These rules protect users and maintain credibility.
