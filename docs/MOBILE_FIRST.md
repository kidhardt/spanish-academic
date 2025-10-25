# Mobile-First Design Principles

**Spanish Academic 2026**

This document defines the mobile-first design principles that govern all HTML templates, CSS files, and React components in the Spanish Academic platform.

## Core Philosophy

**Performance = Credibility**

For prospective graduate students making high-stakes decisions about education, funding, and immigration, page speed and accessibility on mobile devices directly impact trust. A slow-loading page signals unprofessionalism. A fast, clean mobile experience signals authority.

## Why Mobile-First?

1. **User behavior:** Graduate students research programs on phones between classes, during commutes, and on campus Wi-Fi
2. **Google ranking:** Mobile-first indexing means our mobile experience determines search visibility
3. **Progressive enhancement:** Starting with mobile constraints forces better architecture
4. **Performance budgets:** Mobile limitations prevent bloat that hurts all users

## Breakpoint Strategy

### Base: 320px (Mobile-First Foundation)

- **Target devices:** iPhone SE, older Android phones
- **Layout:** Single-column, stacked vertically
- **Typography:** 16px base font size (prevents zoom on iOS)
- **Touch targets:** Minimum 44x44px (Apple HIG, WCAG 2.1 AAA)
- **No media query required:** This is the default

### Tablet: 768px+ (`min-width` only)

- **Target devices:** iPad, Android tablets, small laptops
- **Layout:** Can introduce two-column layouts where appropriate
- **Navigation:** May expand from hamburger menu to horizontal nav
- **Media query:**
  ```css
  @media (min-width: 768px) {
    /* Progressive enhancements */
  }
  ```

### Desktop: 1024px+ (`min-width` only)

- **Target devices:** Desktop monitors, large laptops
- **Layout:** Multi-column grids, sidebar navigation
- **Max-width:** Content containers cap at 1200px for readability
- **Media query:**
  ```css
  @media (min-width: 1024px) {
    /* Progressive enhancements */
  }
  ```

## Critical Rules

### RULE 1: Use `min-width` Only (Never `max-width`)

**Mobile-first approach:**
```css
/* ✅ CORRECT - Mobile-first with min-width */
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Desktop-first approach (FORBIDDEN):**
```css
/* ❌ WRONG - Desktop-first with max-width */
.container {
  max-width: 1200px;
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
```

**Why?** Mobile-first with `min-width` ensures that:
- Base styles are optimized for the most constrained devices
- Desktop enhancements are additive, not subtractive
- Performance budgets are respected (no loading large desktop CSS on mobile)

### RULE 2: Touch Targets Minimum 44x44px

All interactive elements (links, buttons, form inputs) must have a minimum tap target of **44x44 pixels**.

**Correct implementation:**
```css
/* ✅ CORRECT - Minimum 44px tap target */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
  display: inline-block;
}

.nav-link {
  padding: 12px 16px; /* Results in ~44px height with font size */
  display: block;
}
```

**Violation:**
```css
/* ❌ WRONG - Too small for reliable tapping */
.btn-small {
  padding: 4px 8px; /* Results in ~24px height */
}
```

**Why?**
- Apple Human Interface Guidelines: 44pt minimum
- WCAG 2.1 Level AAA: 44x44px minimum
- User frustration: Small tap targets cause mis-taps and abandonment

### RULE 3: Single-Column Base Layout

At the base (320px), all layouts must be **single-column, vertically stacked**.

**Correct approach:**
```css
/* ✅ CORRECT - Single-column base */
.article-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .article-grid {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .article-grid > * {
    flex: 0 0 calc(50% - 0.5rem);
  }
}

@media (min-width: 1024px) {
  .article-grid > * {
    flex: 0 0 calc(33.333% - 0.667rem);
  }
}
```

**Violation:**
```css
/* ❌ WRONG - Assumes wider viewport */
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

**Why?**
- Horizontal scrolling is broken on mobile
- Reading narrow columns on small screens is difficult
- Single-column forces priority order (what comes first?)

### RULE 4: Mobile Viewport Meta Tag Required

Every HTML page must include:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Why?**
- Without this, mobile browsers render at ~980px and scale down
- Results in tiny, illegible text
- Breaks responsive layouts

### RULE 5: Typography Scales Proportionally

**Base (320px):**
```css
:root {
  --font-size-base: 16px;
  --font-size-h1: 1.75rem;  /* 28px */
  --font-size-h2: 1.5rem;   /* 24px */
  --font-size-h3: 1.25rem;  /* 20px */
  --line-height-base: 1.5;
}
```

**Tablet (768px+):**
```css
@media (min-width: 768px) {
  :root {
    --font-size-h1: 2rem;     /* 32px */
    --font-size-h2: 1.75rem;  /* 28px */
    --font-size-h3: 1.5rem;   /* 24px */
  }
}
```

**Desktop (1024px+):**
```css
@media (min-width: 1024px) {
  :root {
    --font-size-h1: 2.5rem;   /* 40px */
    --font-size-h2: 2rem;     /* 32px */
    --font-size-h3: 1.75rem;  /* 28px */
  }
}
```

**Why?**
- 16px base prevents iOS zoom on form inputs
- Proportional scaling maintains visual hierarchy
- Larger screens can support larger type for readability

### RULE 6: Images Must Be Responsive

**Correct implementation:**
```css
/* ✅ CORRECT - Responsive images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

**With art direction:**
```html
<picture>
  <source media="(min-width: 1024px)" srcset="hero-desktop.jpg">
  <source media="(min-width: 768px)" srcset="hero-tablet.jpg">
  <img src="hero-mobile.jpg" alt="UC Berkeley Campanile at sunset">
</picture>
```

**Why?**
- Fixed-width images cause horizontal scrolling
- Art direction serves appropriately sized images
- Performance: Don't load 2000px images on 375px screens

### RULE 7: Navigation Patterns

**Mobile (320px base):**
- Hamburger menu or vertical stacked links
- Language switcher visible in header
- Search icon (expands to input on tap)

**Tablet (768px+):**
- Horizontal navigation bar
- Dropdowns for sub-navigation
- Inline search input

**Desktop (1024px+):**
- Full horizontal navigation with mega-menus if needed
- Sidebar navigation for deep content hierarchies

**Example:**
```css
/* Mobile base - vertical stack */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.nav-menu a {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

/* Tablet - horizontal */
@media (min-width: 768px) {
  .nav-menu {
    flex-direction: row;
    gap: 1rem;
  }

  .nav-menu a {
    border-bottom: none;
    border-bottom: 2px solid transparent;
  }

  .nav-menu a:hover,
  .nav-menu a:focus {
    border-bottom-color: #0066cc;
  }
}
```

## Performance = Credibility Principle

**Page load speed directly impacts user trust in high-stakes contexts.**

### Performance Budgets

- **Initial page load:** < 3 seconds on 3G
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Lighthouse Mobile Score:** > 90

### Optimization Strategies

1. **Critical CSS inline:** Inline above-the-fold styles in `<head>`
2. **Lazy-load images:** Use `loading="lazy"` for below-fold images
3. **Defer non-critical JavaScript:** Use `defer` or `async` attributes
4. **Minimize render-blocking resources:** Load fonts asynchronously
5. **Code splitting:** React islands load only where needed

### Mobile-Specific Optimizations

- **Reduce image sizes:** Use WebP format, serve 1x/2x variants
- **Minimize JavaScript:** Mobile CPUs are slower
- **Avoid layout shifts:** Reserve space for async-loaded content
- **Optimize font loading:** Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)

## Testing Requirements

### Device Testing

Test on real devices, not just browser DevTools:
- **iOS:** iPhone SE (small), iPhone 14 (standard), iPhone 14 Pro Max (large)
- **Android:** Samsung Galaxy S21 (standard), Google Pixel 7 (standard)
- **Tablet:** iPad Air, Samsung Galaxy Tab

### Orientation Testing

Test both portrait and landscape:
- Navigation must work in both orientations
- Content must reflow appropriately
- Touch targets remain 44x44px minimum

### Network Testing

Test on throttled connections:
- **3G Fast:** Simulates typical mobile network
- **3G Slow:** Simulates congested network
- **Offline:** Service worker fallback (future enhancement)

### Browser Testing

- **iOS Safari:** Primary mobile browser
- **Chrome Mobile:** Android default
- **Firefox Mobile:** Significant user base
- **Samsung Internet:** Pre-installed on Samsung devices

## Common Pitfalls to Avoid

### Pitfall 1: Hover-Dependent Interactions

```css
/* ❌ WRONG - Hover doesn't exist on touch */
.tooltip {
  display: none;
}

.icon:hover .tooltip {
  display: block;
}
```

**Solution:** Use tap/click interactions or visible labels.

### Pitfall 2: Fixed Positioning Without Scroll Behavior

```css
/* ❌ WRONG - Can obscure content on small screens */
.sticky-header {
  position: fixed;
  top: 0;
  height: 80px;
}

/* Forgot to add top padding to body! */
```

**Solution:** Add offsetting padding/margin to prevent content overlap.

### Pitfall 3: Absolute Units Instead of Relative

```css
/* ❌ WRONG - Doesn't scale with user preferences */
.text {
  font-size: 14px;
  line-height: 20px;
}
```

**Solution:** Use `rem` or `em` for scalability:
```css
/* ✅ CORRECT */
.text {
  font-size: 0.875rem;  /* 14px if base is 16px */
  line-height: 1.5;     /* Proportional */
}
```

### Pitfall 4: Ignoring Text Zoom

```css
/* ❌ WRONG - Breaks layout when user zooms text */
.card {
  height: 200px;
  overflow: hidden;
}
```

**Solution:** Use `min-height` instead of fixed `height`:
```css
/* ✅ CORRECT */
.card {
  min-height: 200px;
  /* Content can grow if user zooms */
}
```

## Examples: Mobile-First vs Desktop-First

### Example 1: Layout Container

**Mobile-First (CORRECT):**
```css
/* Base: 320px - full width */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet: 768px+ - add max-width */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop: 1024px+ - center and cap width */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Desktop-First (FORBIDDEN):**
```css
/* Desktop default */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Undo for mobile */
@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 1rem;
  }
}
```

### Example 2: Grid Layout

**Mobile-First (CORRECT):**
```css
/* Base: 320px - single column */
.program-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet: 768px+ - two columns */
@media (min-width: 768px) {
  .program-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 1024px+ - three columns */
@media (min-width: 1024px) {
  .program-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### Example 3: Typography

**Mobile-First (CORRECT):**
```css
/* Base: 320px - smaller, tighter */
h1 {
  font-size: 1.75rem;  /* 28px */
  line-height: 1.2;
  margin-bottom: 1rem;
}

/* Tablet: 768px+ - slightly larger */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;  /* 32px */
    margin-bottom: 1.5rem;
  }
}

/* Desktop: 1024px+ - largest */
@media (min-width: 1024px) {
  h1 {
    font-size: 2.5rem;  /* 40px */
    margin-bottom: 2rem;
  }
}
```

## Integration with Other Principles

### Mobile-First + Localization

- Language switcher must be visible on mobile (no hidden dropdown)
- Right-to-left (RTL) languages not required, but use logical properties where possible
- Spanish content may be longer than English; ensure layouts accommodate

### Mobile-First + SEO

- Mobile-first indexing means Google sees mobile version first
- Above-the-fold content must load fast
- Interstitials and modals hurt mobile SEO

### Mobile-First + Accessibility

- Touch targets align with WCAG 2.1 Level AAA
- Pinch-to-zoom must not be disabled (`maximum-scale=1.0` is forbidden)
- Mobile screen readers (VoiceOver, TalkBack) must work seamlessly

## Validation Checklist

Before committing any CSS or HTML:

- [ ] No `max-width` media queries used
- [ ] All interactive elements have 44x44px minimum touch targets
- [ ] Mobile viewport meta tag present
- [ ] Base layout is single-column
- [ ] Typography uses `rem`/`em` (not fixed `px`)
- [ ] Images have `max-width: 100%`
- [ ] Tested on real iOS and Android devices
- [ ] Lighthouse Mobile score > 90
- [ ] No horizontal scrolling at any breakpoint
- [ ] Language switcher visible on mobile
- [ ] Form inputs don't trigger zoom (16px minimum font size)

## Future Enhancements

- **Service Worker:** Offline support for core pages
- **App Shell Model:** Instant navigation between pages
- **WebP + AVIF:** Next-gen image formats
- **Adaptive Loading:** Serve lighter experiences on slow networks

---

**Last Reviewed:** 2025-10-24
**Version:** 1.0.0
**Related:** [CLAUDE.md](../CLAUDE.md) (RULE 5: Mobile-First, WCAG AA Minimum)
