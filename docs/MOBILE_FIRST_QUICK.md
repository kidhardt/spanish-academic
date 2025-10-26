````markdown
# Mobile-First Quick Checklist

Purpose: a one-page, copyable checklist for developers and reviewers to verify mobile-first, accessible, and performant pages before merging.

---

## Quick rules (must follow)
- Add viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Base layout: single-column at mobile widths (base = 320px)
- Use `min-width` media queries for progressive enhancement; document any `max-width` exceptions
- Typography: use relative units (`rem`/`em`), base ≈ 16px; line-height 1.4–1.6
- Touch targets: >= 44×44 CSS px (48×48 recommended where space allows)
- Images: responsive (`srcset` + `sizes` or `<picture>`), `loading="lazy"` for offscreen, serve next‑gen formats when possible
- Do not disable pinch/zoom; support user text scaling

## Accessibility (quick checks)
- Contrast: normal text >= 4.5:1; large text >= 3:1
- Focus: visible focus for keyboard users (use `:focus-visible`), outline must meet contrast requirements
- Reduced motion: respect `prefers-reduced-motion` for non-essential animations
- Screen-reader smoke test: spot-check critical flows on VoiceOver (iOS) and TalkBack (Android)
- Semantics: use native controls (button vs link), logical DOM order, labels for form controls

## Performance (quick checks)
- Core Web Vitals (mobile throttled): LCP < 2.5s, FID < 100ms, CLS < 0.1
- Initial page load: < 3s on emulated mobile 3G where practical
- Defer non-critical JS (`defer` / `async`), inline only small critical CSS
- Preload critical fonts/images if they are required above the fold (use `font-display: swap`)

## Navigation & UX
- Language switcher visible and reachable on mobile; critical items not hidden
- Primary CTAs reachable for thumb (consider sticky bottom actions for long pages)
- Avoid deep hidden navigation for critical flows

## Images & Media
- Provide `srcset` and `sizes` for all hero/inline images
- Use `<picture>` for art-directed images and next-gen fallbacks (AVIF/WebP)
- Reserve space for images (width/height or `aspect-ratio`) to avoid CLS

## Testing & CI (pre-merge)
- Lighthouse CI configured for mobile emulation in PRs (fail on regressions)
- Axe accessibility checks in E2E (fail on new critical violations)
- Stylelint / lint check to flag `@media (max-width` usage if adopted
- Add smoke tests: visual snapshots at key breakpoints (mobile/tablet/desktop)

## Quick snippets
- Viewport meta:
```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- Responsive image example:
```
<img src="hero-320.jpg" srcset="hero-320.jpg 320w, hero-768.jpg 768w" sizes="(max-width:768px) 100vw, 768px" alt="..." loading="lazy">
```
- Fluid h1 using clamp():
```
h1 { font-size: clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem); }
```

## When to escalate
- If Core Web Vitals fail on real devices or RUM shows regressions, open a performance task and block the release.
- If automated accessibility checks report repeated critical violations, require remediation before merge.

---

Last reviewed: 2025-10-26
Maintainer: @frontend-team
````
