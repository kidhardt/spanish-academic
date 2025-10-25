# React Islands Architecture

This directory contains the React "islands" for Spanish Academic 2026. Each island is a self-contained React application that loads only when its root element is present in the HTML.

## Architecture Principle

**Static-first with interactive islands:**
- Primary content = static HTML (fast, indexable, accessible)
- Interactive components = React islands (loaded only when needed)
- Zero JavaScript on pages without islands

## Available Islands

### 1. Explorer (`/src/apps/explorer/`)
**Purpose:** Interactive program browser with filters and map
**Root element:** `#explorer-root`
**Bundle:** `explorer-[hash].js` + `react-vendor-[hash].js`

**Usage in HTML:**
```html
<div id="explorer-root"></div>
<script type="module" src="/assets/js/explorer-[hash].js"></script>
```

---

### 2. Chat (`/src/apps/chat/`)
**Purpose:** AI-powered Q&A interface consuming JSON twins
**Root element:** `#chat-root`
**Bundle:** `chat-[hash].js` + `react-vendor-[hash].js`

**Usage in HTML:**
```html
<div id="chat-root"></div>
<script type="module" src="/assets/js/chat-[hash].js"></script>
```

---

### 3. Contact Form (`/src/apps/contact/`)
**Purpose:** User contact/feedback form
**Root element:** `#contact-root`
**Bundle:** `contact-[hash].js` + `react-vendor-[hash].js` + `form-vendor-[hash].js`

**Usage in HTML:**
```html
<div id="contact-root"></div>
<script type="module" src="/assets/js/contact-[hash].js"></script>
```

---

## Bundle Size Budget

**RULE 6 from CLAUDE.md:** Initial JavaScript bundle < 250KB

**Current sizes (as of last build):**
- `explorer.js`: 0.56 KB (gzip: 0.38 KB) ✅
- `chat.js`: 0.53 KB (gzip: 0.38 KB) ✅
- `contact.js`: 0.53 KB (gzip: 0.36 KB) ✅
- `react-vendor.js`: 139.23 KB (gzip: 45.04 KB) ✅
- `form-vendor.js`: 0.80 KB (gzip: 0.52 KB) ✅

**Total for Explorer page:** ~140 KB (45.4 KB gzipped) ✅
**Total for Chat page:** ~140 KB (45.4 KB gzipped) ✅
**Total for Contact page:** ~141 KB (46 KB gzipped) ✅

All well under the 250KB limit!

---

## Build Process

### Development
```bash
npm run dev
# Starts Vite dev server on http://localhost:3000
# Hot module replacement enabled
```

### Production Build
```bash
npm run build
# 1. Runs TypeScript type checking
# 2. Builds React islands with code splitting
# 3. Generates bundle-stats.html in lighthouse-reports/
# 4. Outputs to public/assets/
```

### Bundle Analysis
After running `npm run build`, open `lighthouse-reports/bundle-stats.html` to see:
- Interactive treemap of bundle contents
- Gzip and Brotli sizes
- Chunk dependencies

---

## Code Splitting Strategy

### Manual Chunks
- **`react-vendor`**: React + ReactDOM (shared by all islands)
- **`form-vendor`**: @tanstack/react-form (shared by form-heavy islands)

### Entry Points
- Each island has its own entry point (`main.tsx`)
- Entry points are separate, preventing unnecessary code loading
- Static HTML pages without islands load ZERO JavaScript

### Tree Shaking
- Terser minification enabled in production
- Unused code automatically removed
- `drop_console: true` removes console.log statements
- `drop_debugger: true` removes debugger statements

---

## Adding a New Island

1. **Create directory:** `src/apps/[island-name]/`
2. **Create files:**
   - `main.tsx` (entry point)
   - `[IslandName].tsx` (component)
   - `[island-name].css` (styles)
3. **Update vite.config.ts:**
   ```typescript
   input: {
     explorer: resolve(__dirname, 'src/apps/explorer/main.tsx'),
     chat: resolve(__dirname, 'src/apps/chat/main.tsx'),
     contact: resolve(__dirname, 'src/apps/contact/main.tsx'),
     [island-name]: resolve(__dirname, 'src/apps/[island-name]/main.tsx'), // Add this
   }
   ```
4. **Build:** `npm run build`
5. **Use in HTML:**
   ```html
   <div id="[island-name]-root"></div>
   <script type="module" src="/assets/js/[island-name]-[hash].js"></script>
   ```

---

## Mobile-First CSS

All island CSS files follow mobile-first principles (RULE 5 from CLAUDE.md):

```css
/* Mobile-first: default styles for small screens */
.island {
  padding: 1rem;
}

/* Progressive enhancement: only for larger screens */
@media (min-width: 768px) {
  .island {
    padding: 2rem;
  }
}
```

**Never use max-width media queries.** Always use min-width for progressive enhancement.

---

## Performance Monitoring

### Bundle Size
```bash
npm run build
# Check console output for chunk sizes
# Open lighthouse-reports/bundle-stats.html
```

### Lighthouse
```bash
npm run lighthouse
# Mobile performance MUST be >90 (RULE 5)
```

### Type Safety
```bash
npm run type-check
# Verify TypeScript compilation before commit
```

---

## Best Practices

1. **Keep islands small**: Each island should have a single, focused purpose
2. **Lazy-load heavy components**: Use React.lazy() for maps, charts, etc.
3. **Share common code**: Extract shared utilities to `/src/utils/`
4. **CSS scoping**: Use unique class names to avoid conflicts (e.g., `.explorer-filter`, `.chat-message`)
5. **Mobile-first always**: Test on mobile screens first (RULE 5)
6. **Accessibility**: WCAG AA minimum (RULE 5)
   - Semantic HTML
   - Proper ARIA labels
   - Keyboard navigation
   - Focus indicators
7. **Bilingual support**: All user-facing strings MUST support English/Spanish
   - Use i18n utilities from `/src/i18n/`
   - Never hardcode English-only text

---

## Troubleshooting

### "Root element not found" error
- Ensure the HTML page has the correct root element ID
- Check browser console for the exact error message
- Verify the script tag is loading after the root element in DOM order

### Bundle size exceeds 250KB
- Run `npm run build` to see chunk sizes
- Open `lighthouse-reports/bundle-stats.html` to identify large dependencies
- Consider:
  - Lazy-loading heavy components with React.lazy()
  - Splitting large components into separate islands
  - Removing unused dependencies

### TypeScript errors
- Run `npm run type-check` to see all errors
- Fix type errors before committing
- Never use `@ts-ignore` - fix the root cause instead

---

**Last Updated:** 2025-10-24
**Maintained by:** Spanish Academic Team
