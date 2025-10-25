# Astro Quick Reference

Fast lookup for common Astro patterns in Spanish Academic 2026.

## Commands

```bash
# Development
npx astro dev              # Start dev server (port 4321)
npx astro dev --host       # Expose to network

# Build
npx astro build            # Production build
npx astro preview          # Preview build locally

# Utilities
npx astro check            # Type check
npx astro sync             # Generate types
npx astro add <integration>  # Add integration
```

---

## File Structure

```
src/
├── pages/          # Routes (required)
├── layouts/        # Page templates
├── components/     # Reusable UI
├── content/        # Content collections
└── assets/         # Optimized images

public/             # Static files (copied as-is)
```

---

## Component Syntax

### Basic Component
```astro
---
const { title } = Astro.props;
---
<h1>{title}</h1>
```

### With TypeScript
```astro
---
interface Props {
  title: string;
  optional?: number;
}

const { title, optional = 0 } = Astro.props;
---
```

### Importing
```astro
---
import Layout from '@/layouts/Base.astro';
import Header from '@/components/Header.astro';
---

<Layout>
  <Header />
</Layout>
```

---

## Routing

### Static Route
```
src/pages/about.astro  →  /about
```

### Dynamic Route
```astro
---
// src/pages/posts/[slug].astro
export async function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } }
  ];
}
---
```

### With Props
```astro
---
export async function getStaticPaths() {
  const posts = await fetch('/api/posts').then(r => r.json());

  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
---

<h1>{post.title}</h1>
```

### Rest Parameters
```
src/pages/blog/[...path].astro  →  /blog/2024/my-post
```

---

## React Integration

### Import & Render
```astro
---
import MyComponent from './MyComponent.tsx';
---

<MyComponent client:load />
```

### Client Directives

| Directive | When to Use | Use Case |
|-----------|-------------|----------|
| `client:load` | Immediately on page load | Critical UI (forms) |
| `client:idle` | When main thread idle | Important but non-critical |
| `client:visible` | When enters viewport | Below-fold content |
| `client:media="(max-width: 768px)"` | Media query match | Responsive components |
| `client:only="react"` | Client-only (no SSR) | Browser API required |

### Passing Props
```astro
<MyComponent
  title="Hello"
  count={5}
  items={['a', 'b']}
  client:load
/>
```

---

## Content Collections

### Define Collection
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',  // Markdown/MDX
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string())
  })
});

export const collections = { blog };
```

### Query Collection
```astro
---
import { getCollection, getEntry } from 'astro:content';

// All entries
const posts = await getCollection('blog');

// Single entry
const post = await getEntry('blog', 'my-post');

// Filtered
const recentPosts = await getCollection('blog', ({ data }) => {
  return data.pubDate > new Date('2024-01-01');
});
---
```

### Dynamic Routes
```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

---

## Layouts

### Base Layout
```astro
---
// src/layouts/Base.astro
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Using Layout
```astro
---
import Base from '@/layouts/Base.astro';
---

<Base title="My Page" description="Page description">
  <h1>Content goes here</h1>
</Base>
```

### Named Slots
```astro
<!-- Layout -->
<header>
  <slot name="header" />
</header>
<main>
  <slot />  <!-- Default slot -->
</main>

<!-- Usage -->
<Layout>
  <div slot="header">Header content</div>
  Main content
</Layout>
```

---

## Configuration Snippets

### React Integration
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()]
});
```

### Dev Server
```javascript
export default defineConfig({
  server: {
    port: 4321,
    host: true  // Expose to network
  }
});
```

### Build Options
```javascript
export default defineConfig({
  build: {
    format: 'directory',  // /about/ vs /about.html
    outDir: './dist'
  }
});
```

### i18n (Bilingual)
```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false  // /about vs /es/acerca
    }
  }
});
```

---

## Common Patterns

### Conditional Rendering
```astro
---
const isLoggedIn = false;
---

{isLoggedIn && <p>Welcome back!</p>}
{!isLoggedIn && <p>Please log in</p>}
```

### Loops
```astro
---
const items = ['a', 'b', 'c'];
---

<ul>
  {items.map(item => <li>{item}</li>)}
</ul>
```

### Fetch Data
```astro
---
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<ul>
  {data.map(item => <li>{item.name}</li>)}
</ul>
```

### Environment Variables
```astro
---
const apiKey = import.meta.env.API_KEY;
const isDev = import.meta.env.DEV;
---

{isDev && <p>Development mode</p>}
```

### CSS Scoping
```astro
<style>
  /* Scoped to this component */
  h1 {
    color: blue;
  }
</style>

<style is:global>
  /* Global styles */
  body {
    margin: 0;
  }
</style>
```

---

## Spanish Academic Patterns

### Bilingual Page
```astro
---
interface Props {
  lang: 'en' | 'es';
}

const { lang } = Astro.props;

const t = {
  en: { title: 'Programs', desc: 'Find your program' },
  es: { title: 'Programas', desc: 'Encuentra tu programa' }
};
---

<h1>{t[lang].title}</h1>
<p>{t[lang].desc}</p>
```

### SEO Metadata
```astro
---
const seoTitle = 'Programs | Spanish Academic';
const seoDesc = 'Graduate programs in Spanish linguistics';
const canonical = Astro.url.pathname;
---

<head>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDesc} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDesc} />
</head>
```

### React Island with Data
```astro
---
import Explorer from '@/components/islands/Explorer.tsx';
import { getCollection } from 'astro:content';

const programs = await getCollection('programs');
const programData = programs.map(p => p.data);
---

<Explorer
  programs={programData}
  client:visible
/>
```

---

## Debugging

### Enable Verbose Logging
```bash
DEBUG=* npx astro dev
```

### Check Build Output
```bash
npx astro build --verbose
```

### Inspect Generated Types
```bash
npx astro sync
cat .astro/types.d.ts
```

---

**Documentation:** https://docs.astro.build/en/getting-started/
**Last Updated:** 2025-10-25
