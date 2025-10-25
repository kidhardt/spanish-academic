# Structured Data - Bilingual Data Model

This directory contains TypeScript interfaces and data for Spanish Academic's bilingual content system.

## Principles

**LOCALIZATION_FIRST:** All text fields that differ between languages use `*_en` and `*_es` suffixes.

**Shared Data:** Numeric and boolean data is NOT duplicated - it's the same in both languages.

## Files

- **`types.ts`** - TypeScript interfaces for all structured data types
- **`programs.ts`** - Graduate program data (PhD, MA, etc.)
- **`faculty.ts`** - Faculty member data (coming soon)
- **`categories.ts`** - Category data for Insights and Help sections (coming soon)

## Usage

```typescript
import { programs } from '@/data/structured/programs';
import { Program } from '@/data/structured/types';

// Get English program name
const programEn = programs[0].degree_en;

// Get Spanish program name  
const programEs = programs[0].degree_es;

// Get shared numeric data (same for both languages)
const stipend = programs[0].stipendApproxUSD;
```

## Data Model Rules

### Bilingual Fields (*_en, *_es)

Use separate fields for:
- Institution names
- Degree/program names  
- Focus areas (arrays)
- Methodological descriptions
- Research interests
- Titles and abstracts
- URLs (path_en, path_es)

### Shared Fields (no suffix)

Do NOT duplicate:
- Numeric data (stipendApproxUSD, yearsGuaranteed, cohortSizeApprox)
- Boolean data (greRequired, acceptingStudents)
- Dates (lastUpdated, publishedDate)
- External URLs (officialWebsite, applicationPortal)
- Geographic data (city, state, country)

## Validation

The `validate_localization.js` script checks that:
1. Every `*_en` field has a corresponding `*_es` field
2. No text is duplicated in shared fields
3. Bilingual arrays have the same length

## Adding New Data

1. Define interface in `types.ts` with proper `*_en` and `*_es` fields
2. Create data file (e.g., `programs.ts`) importing the interface
3. Export array of objects conforming to interface
4. Run `npm run type-check` to verify TypeScript compliance
5. Run `npm run validate-localization` to verify bilingual parity

## Common Mistakes

### ❌ WRONG - Duplicating shared data

```typescript
{
  stipendApproxUSD_en: 32000,
  stipendApproxUSD_es: 32000,  // DON'T DO THIS
}
```

### ✅ CORRECT - Shared numeric data

```typescript
{
  stipendApproxUSD: 32000,  // Same for both languages
}
```

### ❌ WRONG - Missing bilingual field

```typescript
{
  degree_en: 'PhD in Spanish Linguistics',
  // Missing degree_es!
}
```

### ✅ CORRECT - Both bilingual fields present

```typescript
{
  degree_en: 'PhD in Spanish Linguistics',
  degree_es: 'Doctorado en Lingüística Española',
}
```

---

**Last Updated:** 2025-10-24
**See also:** [LOCALIZATION_FIRST.md](../../../docs/LOCALIZATION_FIRST.md)
