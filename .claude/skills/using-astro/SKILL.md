---
name: using-astro
description: Use when working with Astro framework for static site generation, integrating React islands, configuring routing, or troubleshooting Astro build/dev issues. Consult Astro docs at https://github.com/withastro/astro and https://docs.astro.build/en/getting-started/ for detailed guidance.
---

# Using Astro - Spanish Academic 2026

## Overview

Astro is a modern static site generator with an island architecture that generates optimized HTML with zero JavaScript by default. This skill covers essential Astro operations for the Spanish Academic platform, which uses Astro for static page generation alongside Vite for React island bundling.

**Official Documentation:**

Two urls:
description: Use when working with Astro framework for static site generation, integrating React islands, configuring routing, or troubleshooting Astro build/dev issues. Consult Astro docs at https://github.com/withastro/astro https://docs.astro.build/en/getting-started/ for detailed guidance.
Github Repo: https://docs.astro.build/en/getting-started/

## When to Use This Skill

- Creating or modifying `.astro` component files
- Setting up file-based routing in `src/pages/`
- Integrating React components as islands with client directives
- Configuring Astro build settings in `astro.config.mjs`
- Troubleshooting Astro dev server or build errors
- Working with content collections for structured data
- Setting up bilingual routing for Spanish Academic

## Quick Start

### Dev Server
```bash
npx astro dev              # Start dev server (port 4321)
npx astro dev --host       # Expose to network
```

### Build
```bash
npx astro build            # Production build
npx astro preview          # Preview production build
```

### Type Checking
```bash
npx astro check            # Run Astro type checks
npm run type-check         # Run TypeScript checks
```

---

## Project Structure

### Required Directories

**`src/pages/`** - File-based routing (REQUIRED)
- Each `.astro`, `.md`, `.mdx`, `.html` file becomes a route
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/blog/[slug].astro` → `/blog/:slug` (dynamic)

**`src/layouts/`** - Shared page templates
- Example: `src/layouts/Base.astro` for common structure
- Wraps page content with consistent header/footer

**`src/components/`** - Reusable UI components
- Astro components (`.astro`)
- React components (`.tsx`) for islands

**`public/`** - Static assets (copied as-is)
- No processing or bundling
- Direct URL access: `public/favicon.ico` → `/favicon.ico`

### Spanish Academic Structure
```
src/
├── pages/              # Static page generation
│   ├── index.astro     # Homepage
│   ├── programs/
│   │   └── [slug].astro    # Dynamic program pages
│   └── insights/
│       └── [slug].astro    # Dynamic insight articles
├── layouts/
│   ├── Base.astro          # Base layout (SEO, meta)
│   └── Article.astro       # Article layout
├── components/
│   ├── Header.astro        # Astro components
│   └── islands/            # React islands
│       ├── Explorer.tsx
│       ├── Chat.tsx
│       └── Contact.tsx
└── data/
    └── structured/         # TypeScript data models
```

---

## Basic Astro Component Syntax

### Component Structure
```astro
---
// Frontmatter (runs at build time)
const pageTitle = 'My Page';
const items = ['one', 'two', 'three'];
---

<!-- Template (HTML with dynamic expressions) -->
<html lang="en">
  <head>
    <title>{pageTitle}</title>
  </head>
  <body>
    <h1>{pageTitle}</h1>
    <ul>
      {items.map(item => <li>{item}</li>)}
    </ul>
  </body>
</html>
```

### Importing Components
```astro
---
import Header from '@/components/Header.astro';
import Footer from '@/components/Footer.astro';
---

<Header />
<main>
  <slot />  <!-- Child content goes here -->
</main>
<Footer />
```

---

## Routing

### File-Based Routing

**Static Routes:**
- `src/pages/about.astro` → `/about`
- `src/pages/help/index.astro` → `/help`

**Dynamic Routes (SSG):**
```astro
---
// src/pages/programs/[slug].astro
export async function getStaticPaths() {
  return [
    { params: { slug: 'uc-davis-phd' } },
    { params: { slug: 'penn-ma-spanish' } },
  ];
}

const { slug } = Astro.params;
---

<h1>Program: {slug}</h1>
```

**Rest Parameters:**
```astro
// src/pages/blog/[...path].astro
// Matches: /blog/2024/post, /blog/category/tech/article, etc.
---
export function getStaticPaths() {
  return [
    { params: { path: '2024/my-post' } },
    { params: { path: 'category/tech' } },
  ];
}
---
```

### Route Priority (Highest to Lowest)
1. Static routes (`/about.astro`)
2. Dynamic routes with named params (`/[slug].astro`)
3. Dynamic routes with rest params (`/[...path].astro`)

---

## React Integration

### Setup
```bash
npx astro add react
```

This installs `@astrojs/react` and configures `astro.config.mjs`.

### Using React Components

**Import and render:**
```astro
---
import Explorer from '@/components/islands/Explorer.tsx';
---

<div id="explorer-root">
  <Explorer client:visible />
</div>
```

### Client Directives

**`client:load`** - Hydrate immediately on page load
- Use for: Critical interactive elements (contact forms)
- Example: `<Contact client:load />`

**`client:idle`** - Hydrate when main thread is idle
- Use for: Important but non-critical UI (chat widgets)
- Example: `<Chat client:idle />`

**`client:visible`** - Hydrate when component enters viewport
- Use for: Below-fold content (maps, heavy widgets)
- Example: `<Explorer client:visible />`

**`client:media`** - Hydrate when media query matches
- Use for: Responsive components
- Example: `<MobileMenu client:media="(max-width: 768px)" />`

**`client:only`** - Skip server rendering, client-only
- Use for: Components that require browser APIs
- Example: `<BrowserOnlyWidget client:only="react" />`

### Props Passing
```astro
---
import MyComponent from './MyComponent.tsx';
const data = { title: 'Hello', count: 5 };
---

<MyComponent title={data.title} count={data.count} client:load />
```

---

## Configuration (astro.config.mjs)

### Basic Configuration
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  server: {
    port: 4321,
    host: true  // Expose to network
  },
  build: {
    format: 'directory'  // /about/ instead of /about.html
  }
});
```

### Spanish Academic Configuration
```javascript
export default defineConfig({
  integrations: [react()],
  server: {
    port: 4321,
    host: true
  },
  build: {
    format: 'directory',
    outDir: './dist'  // Output directory
  },
  // Bilingual routing (future)
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
```

---

## Content Collections

### Defining Collections

**Create schema:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const programsCollection = defineCollection({
  type: 'data',  // JSON/YAML
  schema: z.object({
    title: z.string(),
    university: z.string(),
    degree: z.enum(['PhD', 'MA', 'Certificate']),
    stipendUSD: z.number().optional(),
    greRequired: z.boolean(),
  }),
});

export const collections = {
  programs: programsCollection,
};
```

### Querying Collections

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Get all programs
const allPrograms = await getCollection('programs');

// Get single program
const program = await getEntry('programs', 'uc-davis-phd');
---

<ul>
  {allPrograms.map(program => (
    <li>{program.data.title} - {program.data.university}</li>
  ))}
</ul>
```

### Dynamic Routes with Collections
```astro
---
// src/pages/programs/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const programs = await getCollection('programs');
  return programs.map(program => ({
    params: { slug: program.id },
    props: { program },
  }));
}

const { program } = Astro.props;
---

<h1>{program.data.title}</h1>
<p>{program.data.university}</p>
```

---

## Bilingual Routing for Spanish Academic

### URL Structure
- English: `/` (root)
- Spanish: `/es/` (prefixed)

### Approach 1: Separate Pages (Current)
```
src/pages/
├── index.astro              # English homepage
├── programs/[slug].astro    # English program pages
└── es/
    ├── index.astro          # Spanish homepage
    └── programas/[slug].astro  # Spanish program pages
```

### Approach 2: i18n Routing (Future)
```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false  // /about (en), /es/acerca (es)
    }
  }
});
```

**Shared component with translations:**
```astro
---
const { lang } = Astro.props;
const t = {
  en: { title: 'Programs', subtitle: 'Find your program' },
  es: { title: 'Programas', subtitle: 'Encuentra tu programa' }
};
---

<h1>{t[lang].title}</h1>
<p>{t[lang].subtitle}</p>
```

---

## Common Patterns for Spanish Academic

### Base Layout with SEO
```astro
---
// src/layouts/Base.astro
interface Props {
  title: string;
  description: string;
  lang?: 'en' | 'es';
}

const { title, description, lang = 'en' } = Astro.props;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={Astro.url.pathname} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Program Detail Page
```astro
---
// src/pages/programs/[slug].astro
import Base from '@/layouts/Base.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const programs = await getCollection('programs');
  return programs.map(p => ({
    params: { slug: p.id },
    props: { program: p.data }
  }));
}

const { program } = Astro.props;
---

<Base title={program.title} description={program.summary}>
  <h1>{program.title}</h1>
  <p>{program.university}</p>
  {program.stipendUSD && <p>Stipend: ${program.stipendUSD}</p>}
</Base>
```

### React Island Integration
```astro
---
import Base from '@/layouts/Base.astro';
import Explorer from '@/components/islands/Explorer.tsx';
---

<Base title="Program Explorer" description="Interactive program search">
  <h1>Explore Programs</h1>

  <!-- Static content loads fast -->
  <p>Use the explorer below to find programs matching your interests.</p>

  <!-- React island loads when visible -->
  <div id="explorer-root">
    <Explorer client:visible />
  </div>
</Base>
```

---

## Troubleshooting

### Issue: ERR_CONNECTION_REFUSED

**Cause:** Dev server not running or wrong port

**Solution:**
```bash
# Check if server is running
npx astro dev

# Verify config has correct port
# astro.config.mjs
export default defineConfig({
  server: { port: 4321, host: true }
});
```

### Issue: Pages Not Rendering

**Cause:** Missing `src/pages/` directory

**Solution:**
```bash
mkdir -p src/pages
# Create at least one page
echo '---\n---\n<h1>Home</h1>' > src/pages/index.astro
```

### Issue: React Component Not Hydrating

**Cause:** Missing client directive

**Solution:**
```astro
<!-- Wrong: No hydration -->
<MyComponent />

<!-- Correct: With client directive -->
<MyComponent client:load />
```

### Issue: TypeScript Errors in .astro Files

**Cause:** Missing Astro types

**Solution:**
```bash
npx astro add typescript
# Or manually add to tsconfig.json
{
  "extends": "astro/tsconfigs/strict"
}
```

### General Debugging Approach

**When encountering Astro issues:**

1. **Check official docs:** https://docs.astro.build/en/getting-started/
2. **Search specific guide:**
   - Routing: https://docs.astro.build/en/guides/routing/
   - Integrations: https://docs.astro.build/en/guides/integrations-guide/
   - Content Collections: https://docs.astro.build/en/guides/content-collections/
3. **Verify configuration:** `astro.config.mjs` syntax and options
4. **Check build output:** Look for error messages in terminal
5. **Restart dev server:** Sometimes needed after config changes

---

## Integration with Existing Spanish Academic Stack

### Coexistence with Vite

**Astro handles:** Static page generation (`src/pages/`)
**Vite handles:** React island bundling (`src/apps/*/main.tsx`)

**Both can run simultaneously:**
- Astro dev: `npx astro dev` (port 4321)
- Vite dev: `npm run dev` (port 3000)

### Build Process

**Current (Vite only):**
```bash
npm run build  # Builds React islands to /public/assets/
```

**Future (Astro + Vite):**
```bash
npm run build  # Run both:
# 1. Vite builds React islands
# 2. Astro builds static pages with islands embedded
```

### JSON Twin Generation

Astro-generated HTML is compatible with existing scripts:
```bash
npm run generate-json  # Parses Astro output HTML
npm run html-size-check  # Validates Astro page sizes
```

---

## Next Steps for Spanish Academic Migration

### Phase 1: Base Layouts
1. Create `src/layouts/Base.astro` with SEO metadata
2. Create `src/layouts/Article.astro` for insights
3. Move common `<head>` content to layouts

### Phase 2: Static Pages
1. Convert program list pages to `src/pages/[category].astro`
2. Convert program details to `src/pages/programs/[slug].astro`
3. Test JSON twin generation with Astro output

### Phase 3: Content Collections
1. Define schemas for programs, insights, help/Q&A
2. Migrate `/src/data/structured/` to content collections
3. Update dynamic routes to use `getCollection()`

### Phase 4: React Islands
1. Import existing React components
2. Add client directives based on usage:
   - `client:load` for Contact form
   - `client:idle` for Chat
   - `client:visible` for Explorer
3. Test hydration and interactivity

### Phase 5: Bilingual Routing
1. Set up i18n configuration
2. Create language-aware layouts
3. Implement translation dictionaries
4. Test `/` ↔ `/es/` routing

---

## Resources

**Official Astro Documentation:**
- Getting Started: https://docs.astro.build/en/getting-started/
- Project Structure: https://docs.astro.build/en/basics/project-structure/
- Routing: https://docs.astro.build/en/guides/routing/
- React Integration: https://docs.astro.build/en/guides/integrations-guide/react/
- Content Collections: https://docs.astro.build/en/guides/content-collections/
- Configuration Reference: https://docs.astro.build/en/reference/configuration-reference/

**When You Need Help:**
1. Check this skill first for Spanish Academic-specific patterns
2. Consult official Astro docs at the links above
3. Search for specific error messages in Astro docs
4. Update this skill with new learnings

---

## Validation

After creating or modifying Astro files:

```bash
# Type check
npx astro check
npm run type-check

# Build test
npx astro build

# Validate with existing scripts
npm run html-size-check
npm run generate-json
npm run validate-all
```

---

**Last Updated:** 2025-10-25
**Astro Version:** 5.15.1
**Project:** Spanish Academic 2026
