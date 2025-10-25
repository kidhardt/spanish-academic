# Localization-First Principles

**Spanish Academic 2026**

This document defines the localization-first architecture that makes Spanish a first-class citizen, not an afterthought. Every template, data model, and build script must support bilingual content from day one.

## Core Philosophy

**Spanish is a first-class citizen, not a translation add-on.**

This platform serves the Spanish linguistics, literature, and translation community. Spanish content is not a secondary concern—it is equal in importance, quality, and maintenance priority to English content.

## Why Localization-First?

1. **Audience:** Many prospective students are native Spanish speakers researching programs in both languages
2. **Credibility:** A poorly maintained Spanish version signals lack of professionalism in a Spanish linguistics platform
3. **SEO:** Bilingual content doubles search visibility across English and Spanish queries
4. **Maintainability:** Building localization into the architecture prevents decay over time
5. **Equity:** Non-English speakers deserve the same quality of information

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

### Category Page Generation

`scripts/build_categories.js` must generate:

- **English:** `/insights/categories/[category-slug].html` + `.json`
- **Spanish:** `/es/insights/categorias/[category-slug].html` + `.json`

Both versions must be generated in a single script run.

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
    <p><em>Traducción en progreso. Por favor, vea la <a href="/help/visa-requirements.html">versión en inglés</a>.</em></p>
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

## Future Enhancements

- **Additional languages:** Portuguese (Brazilian Portuguese for Latin American audience)
- **Regional variants:** es-MX, es-AR, es-ES for regional content
- **Dynamic language detection:** Browser language preferences
- **Translation memory:** Maintain consistency across translated terms

---

**Last Reviewed:** 2025-10-24
**Version:** 1.0.0
**Related:** [CLAUDE.md](../CLAUDE.md) (RULE 4: Preserve Localization Parity)
