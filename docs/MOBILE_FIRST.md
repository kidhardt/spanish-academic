# Mobile-First Design Principles

**Spanish Academic 2026**

This document defines the mobile-first design principles that govern all HTML templates, CSS files, and React components in the Spanish Academic platform.

## Core Philosophy

**Performance = Credibility**

For prospective graduate students making high-stakes decisions about education, funding, and immigration, page speed and accessibility on mobile devices directly impact trust. A slow-loading page signals unprofessionalism. A fast, clean mobile experience signals authority.

### Rationale / Principles

Start with constraints and design the minimum viable mobile experience; add enhancements for wider viewports. Prefer progressive enhancement (additive styles), prioritize readability and touch interaction, and test in realistic device+network conditions.

## Why Mobile-First?

1. **User behavior:** Graduate students research programs on phones between classes, during commutes, and on campus Wi-Fi
2. **Google ranking:** Mobile-first indexing means our mobile experience determines search visibility
3. **Progressive enhancement:** Starting with mobile constraints forces better architecture
4. **Performance budgets:** Mobile limitations prevent bloat that hurts all users

## Breakpoint Strategy
Below is a concise table you can copy into tickets or README files.

| Viewport | Typical devices | Layout notes | Media query |
|---|---:|---|---|
| Base (min) 320px | Small phones (iPhone SE, older Android) | Single-column, stacked, priority-first | — (base)
| 768px+ | Tablets, small laptops | Two-column option, expanded nav | @media (min-width: 768px)
| 1024px+ | Desktop / large laptop | Multi-column, sidebars, capped max-width | @media (min-width: 1024px)

### Base: 320px (Mobile-First Foundation)

- **Target devices:** iPhone SE, older Android phones
- **Layout:** Single-column, stacked vertically
- **Typography:** 16px base font size (prevents zoom on iOS)
- **Touch targets:** Minimum 44x44px (Apple HIG, WCAG 2.1 AAA)
 - **Touch targets:** Minimum 44x44px (Apple HIG). See RULE 2 for measurement notes.
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

**Rationale & caveats**

`min-width` promotes additive, progressive enhancement and is the recommended default for this project. In legacy-support scenarios (older browsers or systems where desktop-first CSS was historically used), teams may encounter `max-width` media queries. If exceptions are needed, document them in the PR and include a short justification (legacy support, third-party integration, or performance regression risks). Consistency is more important than ideology: prefer `min-width` unless a documented exception exists.

References: UXPin and BrowserStack both note that additive breakpoints are easier to reason about and maintain; use `max-width` only as an explicit, documented exception.

### RULE 2: Touch Targets Minimum 44x44px

All interactive elements (links, buttons, form inputs) must have a minimum tap target of **44x44 pixels**.

Note on WCAG: Apple HIG recommends 44pt as a practical minimum. WCAG 2.1 includes a Target Size success criterion (2.5.5) which maps to AAA; our baseline project target is **WCAG 2.1 AA** unless a particular high-sensitivity page requires AAA-level controls. Cite the exact success criteria when planning audits.

Measurement units: "px" refers to CSS logical pixels unless otherwise stated. On high-DPR (retina) devices the browser maps CSS pixels to device pixels — teams should design using CSS pixels (layout and spacing) and test on real devices. For comfortable thumb reach some teams use ~48×48 CSS pixels as a slightly more generous minimum (~7–8 mm approximate physical size). Use 44px as the hard minimum and 48px where space allows.

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
- WCAG 2.1 Target Size (2.5.5) maps to AAA; our baseline is WCAG 2.1 AA and teams should document when AAA is required
- User frustration: Small tap targets cause mis-taps and abandonment

#### Contrast & Focus (companion guidance)

- Contrast: Aim for at least 4.5:1 for normal text, 3:1 for large text. Design systems should publish token pairs that meet these ratios.
- Focus: Provide visible focus styles for keyboard users. Prefer `:focus-visible` to avoid showing outlines on mouse interactions. Example:

```css
:focus-visible {
  outline: 3px solid #ffbf47; /* ensure contrast against background */
  outline-offset: 2px;
}
```

- Reduced motion: Respect `prefers-reduced-motion` and offer non-animated alternatives where necessary.

Additional mobile accessibility notes:

- Screen readers: test with VoiceOver (iOS) and TalkBack (Android) for key pages and flows.
- Focus order & semantics: ensure interactive elements use appropriate semantics (button vs anchor) and logical DOM order so keyboard and assistive tech users get predictable navigation.
- Zoom & scaling: never disable user zoom; ensure font sizing and layout tolerate text enlargement.

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

Typography details & line-height

- Base: 16px (1rem) is recommended to avoid automatic zoom behavior in mobile browsers. Teams may set `html { font-size: 100%; }` and `body { font-size: 1rem; }` for better user-scaling.
- Line-height: use 1.4–1.6 for body text on mobile. Avoid values below 1.4 for readability. For compact UI labels, ensure legibility at small sizes (no less than 0.875rem / 14px effective size).
- Use relative units (`rem`, `em`) for font sizing so user preferences (browser zoom) are respected.

**Fluid typography (recommended alternative)**

Instead of abrupt jumps at breakpoints, prefer a fluid `clamp()` approach for smoother scaling across viewports:

```css
:root {
  --fs-base: 1rem; /* 16px */
}

h1 {
  /* min 1.75rem, preferred scales with viewport, max 2.5rem */
  font-size: clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem);
}
```

This reduces layout shifts between breakpoints and often improves perceived performance on mobile.

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

Always include `srcset` and `sizes` when providing multiple resolutions. Example:

```html
<img
  src="hero-320.jpg"
  srcset="hero-320.jpg 320w, hero-768.jpg 768w, hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 1200px"
  alt="Campus at sunset"
  loading="lazy"
  decoding="async"
>
```

Serve next-gen formats (AVIF/WebP) via `<picture>` fallbacks and let the browser pick the best format. Use `loading="lazy"` for offscreen images and IntersectionObserver fallbacks where needed.

**Why?**
- Fixed-width images cause horizontal scrolling
- Art direction serves appropriately sized images
- Performance: Don't load 2000px images on 375px screens

### RULE 7: Navigation Patterns

**Mobile (320px base):**
- Hamburger menu or vertical stacked links
- Language switcher visible in header
- Search icon (expands to input on tap)

Thumb-reach & one-handed use

Design with thumb reach in mind: place frequently used actions within comfortable reach (typically lower two-thirds of the screen on tall devices). For long-scroll pages prefer sticky bottom actions for critical CTAs rather than top-of-screen controls. Hamburger menus are acceptable but avoid hiding critical features or burying content behind multi-level navigation.

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

Measurement guidance: these targets are mobile-specific and should be measured under realistic mobile conditions (throttled 3G/4G network, mid-tier mobile CPU emulation or real device). Use Lighthouse CI with mobile emulation and supplement with Real Device testing and RUM (Real User Monitoring) to capture production experience.

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

Real-world testing guidance

- Include throttled-network runs in CI (Lighthouse CI with emulated 3G and mid-tier CPU). 
- Run E2E accessibility checks with axe in Playwright/Cypress on throttled conditions where feasible.
- Collect RUM (e.g., Lighthouse RUM or a lightweight analytics RUM solution) to monitor LCP/CLS/FID for mobile users in production and set alerting for regressions.

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

Before committing any CSS or HTML, confirm the following categories:

### Layout / Structure
- [ ] Base layout is single-column at mobile widths
- [ ] No `max-width` media queries used (or documented exception)
- [ ] No horizontal scrolling at any breakpoint

### Accessibility
- [ ] All interactive elements have >= 44x44px touch targets (48x48 recommended where space allows)
- [ ] Contrast ratios: normal text >= 4.5:1; large text >= 3:1
- [ ] Focus styles present and visible (`:focus-visible`) with sufficient contrast
- [ ] Reduced-motion support (`prefers-reduced-motion`) implemented for non-essential animations
- [ ] Screen-reader smoke-tested (VoiceOver/TalkBack) for critical flows
- [ ] Keyboard operable (logical focus order and semantics)

### Performance
- [ ] Mobile viewport meta tag present
- [ ] Typography uses relative units (`rem`/`em`) and body >= 16px where needed to avoid zoom
- [ ] Images responsive (`srcset`/`sizes` or `<picture>`) and next-gen formats when possible
- [ ] Initial page load and Core Web Vitals meet project budget targets under mobile throttling

### Testing / CI
- [ ] Tested on real iOS and Android devices (or device lab) for critical pages
- [ ] Lighthouse Mobile score > 90 (Lighthouse CI in PRs)
- [ ] Automated accessibility checks present (axe in E2E) and linting rules for CSS anti-patterns
- [ ] RUM instrumentation in production to track LCP/CLS/FID for mobile users (optional but recommended)

### Enforcement & CI checks (recommended)

- Add a Lighthouse CI job in PRs to enforce mobile score thresholds (suggested: Mobile score >= 90). Configure a failing threshold for regressions.
- Run automated accessibility checks (axe) in Playwright/Cypress during CI; fail the build on new critical violations.
- Linting: add stylelint rules or a pre-commit check to flag `@media (max-width` usage and other anti-patterns; consider a lightweight grep if a custom rule is not available.
- Add unit/visual smoke tests for critical pages (Playwright visual snapshots on key breakpoints) to catch layout regressions and horizontal scrolls.

Add an item to the checklist to ensure these automated checks are present in the repository.


## Future Enhancements

- **Service Worker:** Offline support for core pages
- **App Shell Model:** Instant navigation between pages
- **WebP + AVIF:** Next-gen image formats
- **Adaptive Loading:** Serve lighter experiences on slow networks

---

**Last Reviewed:** 2025-10-24
**Version:** 1.0.0
**Maintainer:** @frontend-team
**Baseline accessibility:** WCAG 2.1 AA (document notes specific AAA criteria such as Target Size 2.5.5 when applicable)
**Related:** [CLAUDE.md](../CLAUDE.md) (RULE 5: Mobile-First)
