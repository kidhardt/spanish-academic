# Spanish Academic 2026

An authoritative, bilingual platform for graduate programs in Spanish Linguistics, Spanish Literature, Translation/Interpreting, and related fields.

## Architecture

**Static-first with interactive React islands**

- Fast, indexable, citable HTML for core content
- Interactive React apps (Explorer, Chat, Contact) embedded as islands
- Every HTML page has a machine-readable `.json` twin for AI/chat integration
- Fully bilingual: `/` (English) ↔ `/es/` (Spanish)
- No heavy CMS required

## Directory Structure

```
spanish-academic/
├── .claude/
│   └── skills/              # Claude Skills for automation & validation
├── public/                  # Static site root (English)
│   ├── es/                  # Spanish mirror
│   │   ├── insights/        # Spanish Insights articles
│   │   ├── ayuda/           # Spanish Help/Q&A
│   │   ├── programas/       # Spanish Program pages
│   │   ├── explorador/      # Spanish Explorer shell
│   │   └── contacto/        # Spanish Contact shell
│   ├── insights/            # English Insights articles
│   ├── help/                # English Help/Q&A
│   ├── programs/            # English Program pages
│   ├── explorer/            # English Explorer shell
│   └── contact/             # English Contact shell
├── src/
│   ├── components/          # React components (Explorer, Chat, Contact)
│   ├── data/
│   │   ├── structured/      # TypeScript: Program & Faculty objects
│   │   └── unstructured/    # JSON: programNotes.en.json, programNotes.es.json
│   └── i18n/                # Language dictionaries (en.ts, es.ts)
└── scripts/                 # Build automation scripts
    ├── generate_page_json.js
    ├── build_categories.js
    ├── generate_sitemap.js
    ├── validate_localization.js
    ├── accessibility-scan.js
    └── data-governance-scan.js
```

## Core Principles

### 1. Credibility & Transparency
- Static, versioned, citable pages
- Clear authorship and publication dates
- JSON twins provide auditable guidance record

### 2. Student Protection
- High-stakes content (visa, AI ethics) requires `lastReviewed` + disclaimers
- No promises or guarantees of outcomes
- Data governance enforced by automated scanning

### 3. Performance & Accessibility
- Mobile-first responsive design
- Lighthouse scores >90
- WCAG AA minimum compliance
- Printer-friendly, citation-friendly

### 4. SEO & Scannability
- Program list pages: **zero inline commentary** (pure link lists)
- Semantic HTML, proper heading hierarchy
- Related content linked at bottom, not mixed inline

### 5. AI Integration
- Machine-readable JSON twins (no HTML scraping)
- Chat layer consumes structured guidance
- No runtime hallucinations (all content versioned in Git)

## Build Scripts

Run before deployment:

- `npm run generate-json` — Create .json twins from HTML (generates both /...json and /es/...json for each page)
- `npm run build-categories` — Generate category index pages
- `npm run generate-sitemap` — Create sitemap.xml
- `npm run validate-localization` — Check / ↔ /es/ parity
- `npm run accessibility-scan` — WCAG AA validation
- `npm run data-governance-scan` — Enforce disclaimers & lastReviewed
- `npm run lighthouse` — Core Web Vitals audit

### Bilingual JSON Twin Generation

The `generate-json` script automatically creates JSON twins for **both languages**:

- **For existing HTML**: Parses the HTML and generates full JSON metadata
- **For missing alternate language HTML**: Creates placeholder JSON with bilingual metadata
- **Result**: Both `/path.json` and `/es/path.json` always exist, enabling AI/chat to navigate between languages

Example: When processing `/insights/funding.html`:
1. Generates `/insights/funding.json` (full metadata)
2. Checks if `/es/insights/financiacion.html` exists
3. If yes: generates `/es/insights/financiacion.json` (full metadata)
4. If no: generates `/es/insights/financiacion.json` (placeholder with `"placeholder": true`)

## Claude Skills

Available in VS Code as slash-commands:

- `/checking-mobile-first` — Check responsive layout & tap targets
- `/checking-localization` — Validate bilingual parity
- `/syncing-page-json` — Generate JSON twins
- `/building-category-pages` — Regenerate category indexes
- `/checking-accessibility` — WCAG AA checks
- `/checking-performance-budget` — Bundle size & Lighthouse
- `/checking-data-governance` — Verify high-sensitivity content
- `/checking-seo-compliance` — Validate SEO metadata structure

## Data Model

### Structured Data (TypeScript)
Program and Faculty objects with:
- Bilingual short fields (`focusAreas_en`, `focusAreas_es`)
- Shared numeric/boolean data (funding, GRE, etc.)
- Geographic coordinates for mapping

### Unstructured Data (JSON)
- `programNotes.en.json` / `programNotes.es.json`
- Longer narrative descriptions
- Admissions expectations, mentorship culture, visa sponsorship notes

## Deployment

- **Development**: Local with Vite dev server for React islands
- **Production**: Deploy `/public/` to SiteGround `public_html/`
- **Build**: Run all validation scripts before deployment
- **Future-ready**: Can migrate to Cloudflare Pages/Netlify without URL changes

## License

[Add your license here]

## Contact

[Add contact information]
