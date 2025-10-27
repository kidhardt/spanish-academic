# Localization-First Principles

**Spanish Academic 2026**

This document defines the localization-first architecture that makes Spanish a first-class citizen, not an afterthought. Every template, data model, and build script must support bilingual content from day one.

## Scope / Audience

This document is binding for the following roles and systems. It is an enforceable contract (CI, build, and validation scripts) — not just editorial guidance.

- Frontend / build / React developers
- Content writers / editors / subject matter experts
- Translators / reviewers
- SEO / analytics teams

Failure modes called out in this document (missing Spanish page, bad hreflang, missing translationStatus, expired placeholders, etc.) are treated as bugs and must be remediated according to the Governance & Enforcement rules in this doc.

## Core Philosophy

**Spanish is a first-class citizen, not a translation add-on.**

This platform serves the Spanish linguistics, literature, and translation community. Spanish content is not a secondary concern—it is equal in importance, quality, and maintenance priority to English content.

## Localization Parity Standard

A page is considered publishable only when a minimal, machine-auditable parity bar is met. This standard is enforced by `scripts/validate_localization.js` and CI.

Publishable criteria (machine-auditable):

- `/path.html`, `/es/path.html`, `/path.json`, and `/es/path.json` all exist.
- Both JSON twins include `translationStatus` and the Spanish twin includes `lastSyncedFromEnglish` unless the page is explicitly `exempt: true` (see Exemptions section).
- `translationStatus` may be `"placeholder"`, `"needs-review"`, or `"up-to-date"`.

Temporary allowances and aging:

- `translationStatus: "placeholder"` is allowed for up to 30 days after the first English publish. After 30 days the placeholder becomes localization debt and is flagged by CI as out-of-compliance.
- Out-of-compliance pages block new feature work, marketing promotion, and inclusion in navigation until resolved (see Governance & Enforcement).

Escape hatch:

- Pages that are legally or strategically one-language may be designated `exempt: true` with an `exemptReason` in their English JSON twin. See the Exemptions section for rules and required placeholder behavior.

Why this matters: without machine-enforced expectations, Spanish content drifts. Stale Spanish content for high-risk topics (visa, funding, admissions) creates legal and SEO risk.

## Why Localization-First?

1. **Audience:** Many prospective students are native Spanish speakers researching programs in both languages
2. **Credibility:** A poorly maintained Spanish version signals lack of professionalism in a Spanish linguistics platform
3. **SEO:** Bilingual content doubles search visibility across English and Spanish queries
4. **Maintainability:** Building localization into the architecture prevents decay over time
5. **Equity:** Non-English speakers deserve the same quality of information

## Governance & Enforcement

To make localization operational, each page and change has named owners and clear escalation behavior.

Content Owner (English)
- Writes and updates canonical English content.
- Must trigger a localization review when English content changes that affect facts (funding, visa, admissions, legal-sensitive values).

Localization Owner (Spanish)
- Signs off on tone, glossary compliance, and `translationStatus` transitions (e.g., `needs-review` → `up-to-date`).
- Approves corrections and responds to parity alerts.

Engineering Owner
- Maintains `scripts/validate_localization.js` and build-time injection of localization metadata (hreflang, JSON twin generation).
- Ensures CI gates are configured as required checks.

CI Fail Conditions (must be enforced):
- English file added with no Spanish placeholder → FAIL
- JSON twin missing for either language → FAIL
- `translationStatus` missing in either twin → FAIL

Escalation Rule
- If Spanish remains `translationStatus: "placeholder"` more than 30 days after English publish and the page is not `exempt: true`, the route is marked "out of compliance".
- Out-of-compliance blocks:
  - New feature work on that module
  - Marketing linking to that page
  - Inclusion of the page in primary navigation

Owners must remediate or document an approved exemption. This turns localization from guidance into an enforceable policy.

Legal-sensitive content

Pages marked `legalSensitivity: true` are subject to a review clock (`reviewIntervalDays`, default 30). CI will:

- Flag any legal-sensitive page that is older than `reviewIntervalDays` as `needs-review` in both twins.
- Block marketing/promotions for pages marked `needs-review`.

Owners must complete review tasks and update `lastReviewed`/`lastSyncedFromEnglish` to clear the alert.

## URL Structure: Mirrored Directories

### English Content: `/`

All English content lives at the root:

```
/
├── index.html                          # Homepage
├── spanish-linguistics.html            # Program list
├── translation-and-interpreting.html   # Program list
├── programs/
│   ├── uc-davis-phd-spanish-ling.html
│   └── penn-ma-spanish-lit.html
├── insights/
│   ├── funding-strategies.html
│   └── categories/
│       └── funding.html
└── help/
    ├── visa-requirements.html
    └── categories/
        └── immigration.html
```

### Spanish Content: `/es/`

All Spanish content mirrors the structure under `/es/`:

```
/es/
├── index.html                          # Homepage (Spanish)
├── linguistica-espanola.html           # Program list (translated slug)
├── traduccion-e-interpretacion.html    # Program list (translated slug)
├── programas/
│   ├── uc-davis-doctorado-ling-espanola.html
│   └── penn-maestria-lit-espanola.html
├── insights/
│   ├── estrategias-de-financiacion.html
│   └── categorias/
│       └── financiacion.html
└── ayuda/
    ├── requisitos-de-visa.html
    └── categorias/
        └── inmigracion.html
```

## Slug Translation Strategy

### Directory Names

Common directory name translations:

| English | Spanish | Rationale |
|---------|---------|-----------|
| `/help/` | `/ayuda/` | Standard translation |
| `/programs/` | `/programas/` | Direct translation |
| `/insights/` | `/insights/` | Kept as loanword (common in academic Spanish) |
| `/contact/` | `/contacto/` | Direct translation |
| `/about/` | `/acerca-de/` | Idiomatic translation |

### Page Slugs

Slugs are translated to be:
- **SEO-friendly:** Keywords in target language
- **Human-readable:** Clear, descriptive
- **Consistent:** Follow same naming patterns as English

**Examples:**

| English Slug | Spanish Slug | Notes |
|--------------|--------------|-------|
| `visa-requirements.html` | `requisitos-de-visa.html` | Direct translation |
| `funding-strategies.html` | `estrategias-de-financiacion.html` | Use of Spanish diacritics |
| `phd-spanish-linguistics.html` | `doctorado-linguistica-espanola.html` | Fully translated |
| `ai-ethics-disclosure.html` | `etica-ia-divulgacion.html` | Abbreviations translated |

### Slug Translation Mapping

Maintained in `/src/utils/slugTranslations.ts`:

```typescript
export const slugTranslations: Record<string, string> = {
  // Directory-level translations
  'help': 'ayuda',
  'programs': 'programas',
  'insights': 'insights',
  'contact': 'contacto',
  'about': 'acerca-de',
  'categories': 'categorias',

  // Common page slug terms
  'phd': 'doctorado',
  'ma': 'maestria',
  'linguistics': 'linguistica',
  'literature': 'literatura',
  'translation': 'traduccion',
  'interpreting': 'interpretacion',
  'funding': 'financiacion',
  'visa': 'visa',
  'requirements': 'requisitos',
  'strategies': 'estrategias',
  'ethics': 'etica',
  'disclosure': 'divulgacion',
  // ... more mappings
};
```

### Slug Normalization Policy

To avoid 404s, indexing confusion, and cross-platform filesystem issues all slugs (file names and directory names) MUST be normalized to lowercase ASCII ONLY.

Rules:
- Remove diacritics: `financiacion` not `financiación`
- Replace `ñ` with `n`: `inmigracion` not `inmigración`
- Replace spaces with `-`, strip punctuation
- Use only `a-z`, `0-9`, and `-` in slugs

Visible content (page `<h1>`) SHOULD use correct diacritics and native orthography. The slug normalization is a technical mapping only; human-readable headings must remain linguistically correct.


## Metadata System: `path_en` and `path_es`

### HTML Metadata Block

Every HTML page must include bilingual path metadata in the `<head>`:

```html
<!-- English page: /help/visa-requirements.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Bilingual path metadata -->
  <meta name="path_en" content="/help/visa-requirements.html">
  <meta name="path_es" content="/es/ayuda/requisitos-de-visa.html">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://spanish-academic.com/help/visa-requirements.html">

  <!-- Hreflang links -->
  <link rel="alternate" hreflang="en" href="https://spanish-academic.com/help/visa-requirements.html">
  <link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
  <link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/help/visa-requirements.html">

  <title>J-1 and F-1 Visa Requirements for Graduate Students</title>
  <!-- ... rest of head -->
</head>
```

```html
<!-- Spanish page: /es/ayuda/requisitos-de-visa.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Bilingual path metadata -->
  <meta name="path_en" content="/help/visa-requirements.html">
  <meta name="path_es" content="/es/ayuda/requisitos-de-visa.html">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">

  <!-- Hreflang links -->
  <link rel="alternate" hreflang="en" href="https://spanish-academic.com/help/visa-requirements.html">
  <link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
  <link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/help/visa-requirements.html">

  <title>Requisitos de Visa J-1 y F-1 para Estudiantes de Posgrado</title>
  <!-- ... rest of head -->
</head>
```

### Why `path_en` and `path_es`?

1. **Build script automation:** Scripts can extract alternate language URLs without hardcoding
2. **JSON twin generation:** Automatically populate `alternateLanguage` field
3. **Language switcher:** Dynamically link to counterpart page
4. **Validation:** Verify bidirectional linking

## Hreflang Implementation

### Required Attributes

Every page must include:

1. **`lang` attribute on `<html>`**: Tells browsers and assistive tech the page language
2. **Canonical link**: Specifies the authoritative version of this page
3. **Hreflang links**: Tell search engines about alternate language versions
4. **x-default hreflang**: Specifies the default for unmatched regions

### Hreflang Rules

- **Bidirectional:** If English page links to Spanish, Spanish must link back to English
- **Self-referential:** Each page must include hreflang link to itself
- **x-default:** Points to the "default" version (usually English)

**Automated hreflang generation**

Hreflang tags MUST be injected by the build step via `generateHreflangLinks()` (or equivalent). Authors must not hand-author `<link rel="alternate" hreflang=...>` blocks in source HTML. CI will diff the generated hreflang block against committed HTML and fail the build if they differ.

**Correct implementation:**

```html
<!-- On English page -->
<link rel="alternate" hreflang="en" href="https://spanish-academic.com/help/visa-requirements.html">
<link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
<link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/help/visa-requirements.html">

<!-- On Spanish page -->
<link rel="alternate" hreflang="en" href="https://spanish-academic.com/help/visa-requirements.html">
<link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
<link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/help/visa-requirements.html">
```

**Common mistakes:**

```html
<!-- ❌ WRONG - Missing self-referential link -->
<link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
<!-- Missing hreflang="en" link to self! -->

<!-- ❌ WRONG - Not bidirectional -->
<!-- English page has link to Spanish, but Spanish page doesn't link back -->

<!-- ❌ WRONG - Relative URLs -->
<link rel="alternate" hreflang="es" href="/es/ayuda/requisitos-de-visa.html">
<!-- Must be absolute URLs with domain -->
```

## Language Switcher: Visible and Accessible

### Requirements

The language switcher must be:
- **Visible on every page** (no hidden dropdown)
- **Above the fold** on mobile (within first 600px)
- **Clearly labeled** (e.g., "Español" / "English", not flags)
- **Accessible** (proper ARIA labels, keyboard navigable)

### Recommended Implementation

**In page header:**

```html
<header>
  <nav aria-label="Language switcher">
    <ul class="language-switcher">
      <li><a href="/help/visa-requirements.html" lang="en" aria-label="Switch to English">English</a></li>
      <li><a href="/es/ayuda/requisitos-de-visa.html" lang="es" aria-label="Cambiar a español">Español</a></li>
    </ul>
  </nav>
  <!-- Main navigation -->
</header>

**Required implementation detail**

The language switcher must be provided by a single shared component or include (for example `/partials/lang-switcher.html` for templates or `src/components/LanguageSwitcher.tsx` for React islands). Do not duplicate markup across pages. The shared component guarantees:

- correct `lang` attributes
- proper `aria-label` in the active language
- `aria-current="page"` on the active language
- minimum 44px tap targets

Direct inline clones of the switcher are not allowed and will be flagged by template/CI checks.
```

**CSS (Mobile-first):**

```css
.language-switcher {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.language-switcher a {
  padding: 8px 12px;
  min-height: 44px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #0066cc;
  border: 2px solid transparent;
}

.language-switcher a:hover,
.language-switcher a:focus {
  border-color: #0066cc;
  outline: none;
}

.language-switcher a[aria-current="page"] {
  font-weight: bold;
  color: #333;
  pointer-events: none;
}
```

### Why Text Labels, Not Flags?

**Use "English" / "Español", not country flags:**

1. **Spanish is spoken in 20+ countries** - which flag represents "Spanish"?
2. **Accessibility:** Screen readers can't interpret flag images meaningfully
3. **Clarity:** Text is unambiguous

## Data Model: Bilingual Fields

### Structured Data (TypeScript)

For data that needs to differ between languages, use `_en` and `_es` suffixes:

```typescript
// src/data/structured/programs.ts

export interface Program {
  id: string;  // Shared identifier

  // Bilingual fields
  institution_en: string;
  institution_es: string;

  degree_en: string;
  degree_es: string;

  focusAreas_en: string[];
  focusAreas_es: string[];

  methodsCulture_en: string;
  methodsCulture_es: string;

  // Shared numeric/boolean data (no need to duplicate)
  stipendApproxUSD: number | null;
  yearsGuaranteed: number | null;
  greRequired: boolean;

  // Bilingual URLs
  url_en: string;
  url_es: string;
}

export const programs: Program[] = [
  {
    id: 'uc-davis-phd-spanish-ling',

    institution_en: 'University of California, Davis',
    institution_es: 'Universidad de California, Davis',

    degree_en: 'PhD in Spanish Linguistics',
    degree_es: 'Doctorado en Lingüística Española',

    focusAreas_en: [
      'Phonetics/Phonology',
      'Sociolinguistics',
      'Heritage Speakers',
    ],
    focusAreas_es: [
      'Fonética/Fonología',
      'Sociolingüística',
      'Hablantes de Herencia',
    ],

    methodsCulture_en: 'Quantitative methods, corpus-based research',
    methodsCulture_es: 'Métodos cuantitativos, investigación basada en corpus',

    stipendApproxUSD: 32000,
    yearsGuaranteed: 5,
    greRequired: false,

    url_en: '/programs/uc-davis-phd-spanish-ling.html',
    url_es: '/es/programas/uc-davis-doctorado-ling-espanola.html',
  },
  // ... more programs
];
```

### Unstructured Data (JSON)

For longer narrative content, use separate files:

**English:**
```json
// src/data/unstructured/programNotes.en.json
{
  "uc-davis-phd-spanish-ling": {
    "overview": "UC Davis offers a rigorous PhD in Spanish Linguistics with strong emphasis on phonetics, sociolinguistics, and heritage language acquisition. The program provides excellent quantitative methods training and state-of-the-art lab facilities.",
    "strengths": [
      "Phonetics lab with ultrasound and electropalatography",
      "Active sociolinguistics research group",
      "Strong placement record in academia and industry"
    ],
    "admissionNotes": "GRE not required as of 2023. Strong writing sample and clear research interests are essential."
  }
}
```

**Spanish:**
```json
// src/data/unstructured/programNotes.es.json
{
  "uc-davis-phd-spanish-ling": {
    "overview": "UC Davis ofrece un riguroso Doctorado en Lingüística Española con fuerte énfasis en fonética, sociolingüística y adquisición de lenguas de herencia. El programa proporciona excelente formación en métodos cuantitativos e instalaciones de laboratorio de última generación.",
    "strengths": [
      "Laboratorio de fonética con ultrasonido y electropalatografía",
      "Grupo activo de investigación en sociolingüística",
      "Sólido historial de colocación en academia e industria"
    ],
    "admissionNotes": "GRE no requerido desde 2023. Muestra de escritura sólida e intereses de investigación claros son esenciales."
  }
}
```

### Why Separate Unstructured Files?

1. **Gradual translation:** Can deploy English version while Spanish translation is in progress
2. **File size:** Don't load Spanish text if user is viewing English page
3. **Maintainability:** Easier to update long-form content without touching code
4. **Lazy loading:** Explorer and Chat components load only the needed language

## JSON Twin System

Every HTML page must have a `.json` twin for machine-readable consumption:

### English JSON Twin

```json
// /help/visa-requirements.json
{
  "language": "en",
  "path_en": "/help/visa-requirements.html",
  "path_es": "/es/ayuda/requisitos-de-visa.html",
  "alternateLanguage": {
    "lang": "es",
    "url": "https://spanish-academic.com/es/ayuda/requisitos-de-visa.html",
    "title": "Requisitos de Visa J-1 y F-1 para Estudiantes de Posgrado"
  },
  "pageType": "qaPage",
  "title": "J-1 and F-1 Visa Requirements for Graduate Students",
  "description": "Understand J-1 and F-1 visa requirements for graduate programs in Spanish. Learn about application timelines, sponsorship, and common issues.",
  "lastReviewed": "2025-10-15",
  "legalSensitivity": true,
  "translationStatus": "up-to-date",
  "seoIntent": {
    "keyword": "visa requirements graduate students",
    "audience": "International students applying to US graduate programs",
    "lastReviewed": "2025-10-15"
  }
}
```

### Spanish JSON Twin

```json
// /es/ayuda/requisitos-de-visa.json
{
  "language": "es",
  "path_en": "/help/visa-requirements.html",
  "path_es": "/es/ayuda/requisitos-de-visa.html",
  "alternateLanguage": {
    "lang": "en",
    "url": "https://spanish-academic.com/help/visa-requirements.html",
    "title": "J-1 and F-1 Visa Requirements for Graduate Students"
  },
  "pageType": "qaPage",
  "title": "Requisitos de Visa J-1 y F-1 para Estudiantes de Posgrado",
  "description": "Comprenda los requisitos de visa J-1 y F-1 para programas de posgrado en español. Aprenda sobre plazos de solicitud, patrocinio y problemas comunes.",
  "lastReviewed": "2025-10-15",
  "legalSensitivity": true,
  "translationStatus": "up-to-date",
  "lastSyncedFromEnglish": "2025-10-15",
  "seoIntent": {
    "keyword": "requisitos de visa estudiantes posgrado",
    "audience": "Estudiantes internacionales solicitando programas de posgrado en EE.UU.",
    "lastReviewed": "2025-10-15"
  }
}
```

### JSON Twin Requirements

- **`language`**: Must be "en" or "es"
- **`path_en` / `path_es`**: Both paths must be present in both twins
- **`alternateLanguage`**: Links to counterpart page with title in target language
- **Generated automatically:** By `scripts/generate_page_json.js` (never hand-maintained)

Additional JSON twin contract requirements

- **`translationStatus`** (required on both twins): one of `"placeholder" | "needs-review" | "up-to-date"`.
- **`lastSyncedFromEnglish`** (required on Spanish twin when translationStatus != "placeholder"): ISO date string representing the English revision the Spanish text reflects.
- **`exempt`** (optional, English twin only): boolean; if `true` the page is intentionally single-language and must include `exemptReason`.
- **`exemptReason`** (optional, English twin only): short string explaining the exemption (e.g., `"scholarly-article-original-language"`, `"legal-liability"`).

These fields allow CI to automatically detect parity debt, stale translations, and legally exempt content.

Legal sensitivity and review clock

- **`legalSensitivity`** (boolean): when `true` the page is considered high-risk and must include `reviewIntervalDays` (recommended default: 30).
- **`reviewIntervalDays`** (integer): number of days after which the page must be re-reviewed in all languages. CI will flag pages overdue for review and mark their twins `needs-review`.

## Exemptions & single-language pages

Some content may be legally or strategically one-language. To avoid perpetual CI failures, the system supports a controlled exemption model.

Rules for exemptions:

- `exempt` may only be set on the English JSON twin and must be `true`.
- `exemptReason` (required when `exempt: true`) must be one of the approved reasons (`scholarly-article-original-language`, `legal-liability`, `internal-policy`, `language-specific-content`).
- Even when `exempt: true`, teams must generate a Spanish placeholder HTML page that:
  - includes `<html lang="es">` and the normal hreflang block
  - includes `<meta name="translationStatus" content="placeholder">`
  - links to the English canonical and to a Spanish contact/support path
  - clearly states the exemption and provides a path to request translation

Behavior in CI and navigation:

- Exempt pages are excluded from parity failure counts but are prevented from being linked in the primary Spanish navigation.
- Exemptions must be recorded with `npm run parity:designate` (audit trail) and reviewed annually.


## Localization Utilities (TypeScript)

### Overview

The localization infrastructure is implemented in `src/utils/localization.ts`, providing type-safe utilities for:
- hreflang link generation
- lang attribute enforcement
- path_en/path_es metadata creation
- URL path translation
- Localization validation

### Core Functions

#### `generateHreflangLinks(pathMetadata, baseUrl)`

Generates proper `<link rel="alternate" hreflang="...">` tags for SEO:

```typescript
import { generateHreflangLinks } from '@/utils/localization';

const pathMetadata = {
  path_en: '/insights/funding-strategies.html',
  path_es: '/es/insights/estrategias-de-financiacion.html'
};

const links = generateHreflangLinks(pathMetadata);
// Returns:
// [
//   '<link rel="alternate" hreflang="en" href="https://spanish-academic.com/insights/funding-strategies.html">',
//   '<link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/insights/estrategias-de-financiacion.html">',
//   '<link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/insights/funding-strategies.html">'
// ]
```

#### `getLangAttribute(path)`

Determines the correct `lang` attribute based on path structure:

```typescript
import { getLangAttribute } from '@/utils/localization';

getLangAttribute('/insights/funding.html');  // Returns: 'en'
getLangAttribute('/es/insights/financiacion.html');  // Returns: 'es'
```

#### `translatePath(path, targetLang)`

Translates a full file path from one language to another:

```typescript
import { translatePath } from '@/utils/localization';

translatePath('/insights/funding-strategies.html', 'es');
// Returns: '/es/insights/estrategias-de-financiacion.html'

translatePath('/es/insights/estrategias-de-financiacion.html', 'en');
// Returns: '/insights/funding-strategies.html'
```

#### `createPathMetadata(path)`

Automatically generates PathMetadata object from a single path:

```typescript
import { createPathMetadata } from '@/utils/localization';

createPathMetadata('/insights/funding-strategies.html');
// Returns:
// {
//   path_en: '/insights/funding-strategies.html',
//   path_es: '/es/insights/estrategias-de-financiacion.html'
// }
```

#### `validatePathStructure(path, expectedLang)`

Validates that a path has correct structure for its language:

```typescript
import { validatePathStructure } from '@/utils/localization';

validatePathStructure('/insights/funding.html', 'en');  // true
validatePathStructure('/insights/funding.html', 'es');  // false (missing /es/ prefix)
validatePathStructure('/es/insights/financiacion.html', 'es');  // true
```

#### `getLocalizationStatus(pathMetadata)`

Validates a PathMetadata object and returns detailed errors:

```typescript
import { getLocalizationStatus } from '@/utils/localization';

const status = getLocalizationStatus({
  path_en: '/insights/funding.html',
  path_es: '/es/insights/financiacion.html'
});
// Returns:
// { valid: true, errors: [] }

const badStatus = getLocalizationStatus({
  path_en: '/es/insights/funding.html',  // Wrong! English shouldn't have /es/ prefix
  path_es: '/insights/financiacion.html'  // Wrong! Spanish should have /es/ prefix
});
// Returns:
// {
//   valid: false,
//   errors: [
//     'English path should not start with /es/: /es/insights/funding.html',
//     'Spanish path should start with /es/: /insights/financiacion.html'
//   ]
// }
```

#### `createLocalizedMetadata(pathMetadata, currentLang, titles, descriptions?)`

Creates complete LocalizedMetadata objects for JSON twins:

```typescript
import { createLocalizedMetadata } from '@/utils/localization';

const metadata = createLocalizedMetadata(
  {
    path_en: '/insights/funding.html',
    path_es: '/es/insights/financiacion.html'
  },
  'en',
  {
    title_en: 'Funding Strategies for Graduate Students',
    title_es: 'Estrategias de Financiación para Estudiantes de Posgrado'
  },
  {
    description_en: 'Learn effective funding strategies...',
    description_es: 'Aprenda estrategias efectivas de financiación...'
  }
);
// Returns full LocalizedMetadata object with alternateLanguage info
```

### TypeScript Types

```typescript
export interface PathMetadata {
  path_en: string;  // English path
  path_es: string;  // Spanish path
}

export interface LocalizedMetadata {
  lang: LanguageCode;
  title_en: string;
  title_es: string;
  description_en?: string;
  description_es?: string;
  alternateLanguage: {
    lang: LanguageCode;
    path: string;
  };
}

export type LanguageCode = 'en' | 'es';
```

### Usage in Build Scripts

Build scripts should import and use these utilities:

```javascript
// In scripts/generate_page_json.js
import {
  createPathMetadata,
  getLangAttribute,
  createLocalizedMetadata
} from '../src/utils/localization.js';

// Extract path from file
const path = '/insights/funding.html';
const lang = getLangAttribute(path);
const pathMetadata = createPathMetadata(path);

// Use in JSON twin generation
const jsonData = {
  language: lang,
  ...pathMetadata,
  alternateLanguage: {
    lang: lang === 'en' ? 'es' : 'en',
    path: lang === 'en' ? pathMetadata.path_es : pathMetadata.path_en
  }
};
```

### Testing

Run localization tests with:

```bash
node scripts/test_localization.js
```

This validates:
- Lang attribute detection
- Path structure validation
- Hreflang link generation
- PathMetadata creation

## Build Script Requirements

### Localization Validation Script

`scripts/validate_localization.js` must enforce:

1. **Directory parity:** Every file in `/` has counterpart in `/es/` (or placeholder)
2. **Metadata completeness:** `path_en` and `path_es` present in all HTML pages
3. **Hreflang bidirectionality:** English links to Spanish, Spanish links to English
4. **Structured data completeness:** All `*_en` fields have `*_es` counterparts
5. **JSON twin parity:** Both `/path.json` and `/es/path.json` exist

**Exit with error if:**
- English page exists without Spanish counterpart
- `path_en` or `path_es` metadata is missing
- Hreflang links are not bidirectional
- Structured data has `*_en` but not `*_es`
- JSON twin is missing
 - `translationStatus` is missing from either JSON twin
 - Spanish twin missing `lastSyncedFromEnglish` when `translationStatus` != "placeholder"
 - English page added without a Spanish placeholder HTML page (unless `exempt: true` and `exemptReason` provided)

### Required analytics payload (page metadata)

All pages must emit a lightweight page metadata JSON block in the head to enable parity monitoring and RUM segmentation. This is required for analytics and CI rules.

Example (in `<head>`):

```html
<script type="application/json" id="page-metadata">
{
  "pageLang": "es",
  "translationStatus": "needs-review",
  "legalSensitivity": true,
  "path_en": "/help/visa-requirements.html",
  "path_es": "/es/ayuda/requisitos-de-visa.html"
}
</script>
```

Build scripts must ensure this block is present and correct; CI will validate its presence and schema.

### Category Page Generation

`scripts/build_categories.js` must generate:

- **English:** `/insights/categories/[category-slug].html` + `.json`
- **Spanish:** `/es/insights/categorias/[category-slug].html` + `.json`

Both versions must be generated in a single script run.

## Deletions / Redirects

When an English page is deleted or renamed, localization must mirror the change in the same commit. Failure to do so creates orphaned Spanish pages and broken hreflang pairs.

Rules:
- If English page is deleted or renamed, the Spanish counterpart must be deleted or redirected in the same commit.
- Add 301 redirects for both languages when a page moves. Redirects must be language-preserving (do not 301 `/es/...` → `/...`).
- Never silently redirect `/es/...` to an English page. If Spanish content is retired and no replacement exists, the Spanish URL should resolve to a brief Spanish holding page explaining the retirement and linking to the English canonical.
- Update hreflang links as part of the redirect/rename commit so search engines never see hreflang pointing at 404s.

Example holding page behavior (Spanish):
```
<main>
  <h1>Contenido retirado</h1>
  <p>Este contenido ha sido retirado. Puede ver la versión original en inglés <a href="/help/old-page.html">aquí</a>.</p>
</main>
```


## Translation Workflow

### Phase 1: English First (Current)

During initial development:
1. Write English HTML pages with proper `path_en` and `path_es` metadata
2. Create **placeholder Spanish pages** with minimal content:

```html
<!-- /es/ayuda/requisitos-de-visa.html (placeholder) -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="path_en" content="/help/visa-requirements.html">
  <meta name="path_es" content="/es/ayuda/requisitos-de-visa.html">
  <meta name="translationStatus" content="placeholder">
  <title>Requisitos de Visa J-1 y F-1 para Estudiantes de Posgrado</title>
  <link rel="canonical" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
  <link rel="alternate" hreflang="en" href="https://spanish-academic.com/help/visa-requirements.html">
  <link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/requisitos-de-visa.html">
  <link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/help/visa-requirements.html">
</head>
<body>
  <header>
    <nav aria-label="Language switcher">
      <ul class="language-switcher">
        <li><a href="/help/visa-requirements.html" lang="en">English</a></li>
        <li><a href="/es/ayuda/requisitos-de-visa.html" lang="es" aria-current="page">Español</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Requisitos de Visa J-1 y F-1 para Estudiantes de Posgrado</h1>
    <p><strong>Esta página está en proceso de traducción profesional.</strong></p>
    <p>Puede leer la versión original en inglés aquí:
      <a href="/help/visa-requirements.html" lang="en">J-1 and F-1 Visa Requirements for Graduate Students</a>.
    </p>
    <p>¿Necesita esta información en español ahora mismo? Contáctenos:
      <a href="/es/contacto/index.html">Formulario de contacto</a>.
    </p>
  </main>
</body>
</html>
```

3. Validation script passes because placeholder exists with correct metadata
4. Gradually replace placeholders with full translations

### Phase 2: Professional Translation (Future)

Once English content stabilizes:
1. Export content for professional translation
2. Replace placeholders with translated content
3. Verify translations maintain academic tone
4. Update `lastReviewed` dates in both versions

### Phase 3: Ongoing Maintenance

- **New English content:** Create placeholder Spanish page immediately
- **Updates to existing content:** Flag Spanish version for re-review
- **Quarterly audits:** Run validation script, update stale translations

## React Component Localization

### Separate Entry Points per Language

Each React island has English and Spanish entry points:

```
src/
├── explorer/
│   ├── index.tsx              # English entry point
│   ├── index-es.tsx           # Spanish entry point
│   └── components/
│       └── Map.tsx            # Shared component
├── chat/
│   ├── index.tsx              # English entry point
│   ├── index-es.tsx           # Spanish entry point
│   └── components/
│       └── MessageList.tsx    # Shared component
└── contact/
    ├── index.tsx              # English entry point
    ├── index-es.tsx           # Spanish entry point
    └── components/
        └── ContactForm.tsx    # Shared component
```

### Language Dictionaries

All UI strings stored in language dictionaries:

```typescript
// src/i18n/en.ts
export const en = {
  explorer: {
    title: 'Program Explorer',
    searchPlaceholder: 'Search by university, focus area, or location...',
    filterByDegree: 'Filter by Degree',
    showOnMap: 'Show on Map',
    comparePrograms: 'Compare Programs',
  },
  chat: {
    title: 'Ask a Question',
    inputPlaceholder: 'Type your question about graduate programs...',
    send: 'Send',
    thinking: 'Thinking...',
  },
  contact: {
    title: 'Contact Us',
    nameLabel: 'Your Name',
    emailLabel: 'Your Email',
    messageLabel: 'Message',
    submit: 'Send Message',
    successMessage: 'Thank you! We\'ll respond within 48 hours.',
  },
};
```

```typescript
// src/i18n/es.ts
export const es = {
  explorer: {
    title: 'Explorador de Programas',
    searchPlaceholder: 'Buscar por universidad, área de enfoque o ubicación...',
    filterByDegree: 'Filtrar por Título',
    showOnMap: 'Mostrar en Mapa',
    comparePrograms: 'Comparar Programas',
  },
  chat: {
    title: 'Haz una Pregunta',
    inputPlaceholder: 'Escribe tu pregunta sobre programas de posgrado...',
    send: 'Enviar',
    thinking: 'Pensando...',
  },
  contact: {
    title: 'Contáctanos',
    nameLabel: 'Tu Nombre',
    emailLabel: 'Tu Correo Electrónico',
    messageLabel: 'Mensaje',
    submit: 'Enviar Mensaje',
    successMessage: 'Gracias. Responderemos en 48 horas.',
  },
};
```

### React Component Usage

```tsx
// src/explorer/index.tsx (English entry point)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Explorer } from './components/Explorer';
import { en } from '../i18n/en';

ReactDOM.createRoot(document.getElementById('explorer-root')!).render(
  <React.StrictMode>
    <Explorer lang="en" strings={en} />
  </React.StrictMode>
);
```

```tsx
// src/explorer/index-es.tsx (Spanish entry point)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Explorer } from './components/Explorer';
import { es } from '../i18n/es';

ReactDOM.createRoot(document.getElementById('explorer-root')!).render(
  <React.StrictMode>
    <Explorer lang="es" strings={es} />
  </React.StrictMode>
);
```

```tsx
// src/explorer/components/Explorer.tsx (shared component)
interface ExplorerProps {
  lang: 'en' | 'es';
  strings: typeof en; // or typeof es
}

export function Explorer({ lang, strings }: ExplorerProps) {
  return (
    <div>
      <h2>{strings.explorer.title}</h2>
      <input placeholder={strings.explorer.searchPlaceholder} />
      {/* ... */}
    </div>
  );
}
```

## Integration with Other Principles

### Localization + Mobile-First

- Language switcher visible on mobile (no hidden dropdown)
- Spanish text may be 20-30% longer than English; ensure layouts accommodate
- Touch targets for language switcher: 44x44px minimum

### Localization + SEO

- Separate hreflang for each language tells Google to index both versions
- Translated slugs improve SEO for Spanish-language queries
- `lang` attribute on `<html>` signals language to search engines

### Localization + Accessibility

- `lang` attributes help screen readers pronounce content correctly
- Language switcher must be keyboard navigable
- ARIA labels in the appropriate language (e.g., `aria-label="Switch to English"` vs `aria-label="Cambiar a español"`)

**Inline fragment language enforcement**

Any inline element whose natural language differs from the page `html[lang]` must carry its own `lang` attribute. This is required for accessibility and correct pronunciation by screen readers. Example:

```html
<p>
  Students can specialize in
  <span lang="es">Sociolingüística del Español</span>
  and heritage language acquisition.
</p>
```

This is an accessibility requirement and will be validated by localization checks.

## Best practices (guidelines)

These recommendations help teams produce consistent, high-quality bilingual content and make localization scalable without prescribing translation workflows.

- Translation glossary and terminology governance
  - Maintain a shared glossary of domain terms (e.g., `program`, `degree`, discipline names) in `localization/glossary.json` or a `TRANSLATION_GLOSSARY.md` document.
  - Assign an owner (e.g., `@frontend-team` or `@content-team`) who approves glossary updates. Update cadence: quarterly or when major terminology changes occur.
  - Glossary authority: terms marked `"locked": true` in the glossary cannot be changed without approval from the Localization Owner. The glossary is the single source of truth for canonical translations of degree names, discipline terms, and institution names. Disputes are escalated and logged in Git.

- Message format, pluralization, and interpolation
  - Use ICU MessageFormat (e.g., formatjs / react-intl) or an equivalent to handle pluralization, gender, and variable interpolation correctly for Spanish and English.
  - Avoid concatenating translated fragments in code; prefer full-message keys with placeholders.

- Use relative, locale-aware formatting
  - Format dates, times, numbers, and currencies with Intl APIs (Intl.DateTimeFormat, Intl.NumberFormat) rather than hardcoded strings.
  - Provide examples in code comments for common formats used across the site.

- Pseudolocalization & testing
  - Use pseudolocalization in development to catch UI truncation, layout breaks, and hardcoded strings.
  - Run quick pseudo-loc checks as part of CI smoke tests (no workflow required here; this is a best-practice suggestion).

- String extraction & bundles
  - Keep UI strings in language dictionaries (as the repo already does) and avoid hardcoded strings in components.
  - Export/import formats should be JSON or XLIFF depending on external tool needs; document export format expectations in the glossary file.

- Translation quality & review
  - Require a human reviewer for any machine-assisted translations. Machine translation may be used for drafts but not published pages without review.
  - Provide a lightweight QA checklist for reviewers: tone/academic register, glossary consistency, correct use of diacritics, and SEO keyword preservation.

- Translation status and staleness signals (docs-level)
  - Include a `translationStatus` field in JSON twins (suggested values: `placeholder`, `needs-review`, `up-to-date`) so authors and editors can track translation health.
  - When English content changes, flag the Spanish counterpart `needs-review` until a reviewer confirms updates.

- Regional variants and locale strategy
  - Default to a single `es` variant initially. Introduce regional variants (e.g., `es-MX`, `es-ES`) only when traffic or editorial needs justify the complexity.
  - Document criteria for adding regional variants (traffic thresholds, institutional requests, legal/regulatory requirements).

- Localized assets and media
  - Localize `alt` text, captions, and downloadable assets (PDFs) when content differs by language. Store localized media under mirrored directories (e.g., `/es/assets/...`).

- Accessibility & screen-reader considerations
  - Ensure `lang` attributes on `<html>` and on language-specific fragments are correct. Test key pages with VoiceOver and TalkBack for natural reading and correct pronounciation.

- Analytics & monitoring
  - Segment analytics and RUM by language to detect parity regressions and translation-related UX issues. Track metrics like % pages with `translationStatus: placeholder` and RUM LCP/CLS per-locale.

- Ownership, SLAs, and review cadence
  - Define ownership for localization deliverables (content owner, translator, reviewer). Suggested SLA (example): placeholder Spanish page within 24 hours of English publish; full translation within 30 days unless exempted.
  - Review cadence: quarterly audits of parity and translation quality.

- Security, privacy, and third-party translators
  - When sending content to external translators or CAT tools, ensure appropriate NDAs and data handling agreements are in place. Note licensing of translations and attribution requirements.

- Small engineering tips
  - Prefer `html { font-size: 100%; }` and `body { font-size: 1rem; }` to respect user settings.
  - Keep i18n keys stable; changing keys creates merge noise and translation churn.


## Common Pitfalls to Avoid

### Pitfall 1: Machine Translation Without Review

```html
<!-- ❌ WRONG - Obvious machine translation -->
<p>Los estudiantes de graduate están buscando programs de PhD en Spanish linguistics.</p>
<!-- Mix of English and Spanish, awkward phrasing -->
```

**Solution:** Use professional translation or native speaker review.

### Pitfall 2: Missing Spanish Counterpart

```html
<!-- ❌ WRONG - English page exists, Spanish page missing -->
<!-- /help/visa-requirements.html exists -->
<!-- /es/ayuda/requisitos-de-visa.html does NOT exist -->
```

**Solution:** Always create placeholder Spanish page immediately.

### Pitfall 3: Hardcoded English Strings in React

```tsx
// ❌ WRONG - Hardcoded English string
function SearchBox() {
  return <input placeholder="Search programs..." />;
}
```

**Solution:** Use language dictionaries:
```tsx
// ✅ CORRECT
function SearchBox({ strings }: { strings: typeof en }) {
  return <input placeholder={strings.explorer.searchPlaceholder} />;
}
```

### Pitfall 4: Broken Hreflang Links

```html
<!-- ❌ WRONG - Hreflang points to non-existent page -->
<link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/ayuda/visa.html">
<!-- But Spanish page is actually at /es/ayuda/requisitos-de-visa.html -->
```

**Solution:** Validate hreflang links with `scripts/validate_localization.js`.

### Pitfall 5: Using Country Flags for Languages

```html
<!-- ❌ WRONG - Flag emoji or image -->
<a href="/es/"><img src="spain-flag.png" alt="Spanish"></a>
```

**Solution:** Use text labels:
```html
<!-- ✅ CORRECT -->
<a href="/es/" lang="es">Español</a>
```

## Do Not Ever (developer constraints)

These practices consistently break localization and must be forbidden in code reviews and CI linting rules:

- Do NOT concatenate strings with inline variables in JSX (e.g., `{'GRE required: ' + greRequired}`). Use full-message keys with placeholders so translators control word order.
- Do NOT infer language from browser locale and auto-redirect users to `/es/`. Instead show a dismissible banner offering the Spanish version — never force a redirect.
- Do NOT reuse English alt text on Spanish pages if the alt contains explanatory or legal content. Alt text is part of the content surface and must be localized.

Violations of these constraints should be flagged by code review and, where practical, by automated lint rules.

## Validation Checklist

Before committing any HTML, TypeScript, or React code:

- [ ] Every HTML page has `<html lang="en">` or `<html lang="es">`
- [ ] Every HTML page has `path_en` and `path_es` metadata
- [ ] Hreflang links are present and bidirectional
- [ ] Language switcher is visible and accessible
- [ ] Structured data uses `*_en` and `*_es` fields
- [ ] React components use language dictionaries (no hardcoded strings)
- [ ] JSON twins generated for both `/path.json` and `/es/path.json`
- [ ] Slugs are translated and SEO-friendly
- [ ] Run `npm run validate-localization` (passes without errors)
 - [ ] `translationStatus` present in both JSON twins and valid
 - [ ] Spanish twin has `lastSyncedFromEnglish` when `translationStatus` != "placeholder"
 - [ ] Page metadata JSON (`#page-metadata`) present in `<head>` with required fields
 - [ ] Slugs normalized to ASCII (no diacritics) and H1 preserves diacritics

## Future Enhancements

- **Additional languages:** Portuguese (Brazilian Portuguese for Latin American audience)
- **Regional variants:** es-MX, es-AR, es-ES for regional content
- **Dynamic language detection:** Browser language preferences
- **Translation memory:** Maintain consistency across translated terms

---

**Last Reviewed:** 2025-10-24
**Version:** 1.0.0
**Related:** [CLAUDE.md](../CLAUDE.md) (RULE 4: Preserve Localization Parity)

## Policy versioning

This document follows semantic versioning for policy changes.

- Breaking changes (major version bump): any change that affects required fields in JSON twins, required `<head>` metadata, directory structure, CI pass criteria, or glossary locking. When a major bump occurs, all integrating repos must update within one release cycle.
- Non-breaking changes (minor/patch): clarifications, examples, glossary additions, and editorial fixes.

Maintainers should record the change, rationale, and migration steps in the Git commit and update `Last Reviewed` and `Version` accordingly.
