# HTML Templates

This directory contains base templates for Spanish Academic 2026 pages.

## Base Templates

### English Template
- **File:** `base.html`
- **Language:** `lang="en"`
- **Use:** Foundation for all English content pages

### Spanish Template
- **File:** `base-es.html`
- **Language:** `lang="es"`
- **Use:** Foundation for all Spanish content pages

## Template Features

Both templates include:

### ✅ SEO Requirements
- SEO_INTENT comment block with placeholders
- Title tag (50-60 characters with keyword)
- Meta description (140-160 characters)
- Canonical URL
- Bidirectional hreflang links (en, es, x-default)
- Open Graph meta tags
- Twitter Card meta tags
- Path metadata (`path_en`, `path_es`)

### ✅ Accessibility (WCAG AA)
- Skip to content link
- Semantic HTML5 (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`, `<aside>`)
- Single `<h1>` per page
- Logical heading hierarchy placeholders
- ARIA labels on navigation
- Screen reader text (`.sr-only` class)
- Lang attributes on language switcher

### ✅ Mobile-First
- Viewport meta tag
- Language switcher sized for 44x44px tap target
- Responsive structure ready for CSS

### ✅ Bilingual Support
- Path metadata for both languages
- Hreflang links (absolute URLs)
- Language switcher in navigation
- Footer navigation mirrored for both languages

### ✅ Content Structure
- 150-word intro paragraph placeholder
- FAQ section template
- Related Resources section
- Descriptive link text (no "click here")

## Using Templates

1. **Copy** the appropriate base template
2. **Replace** all placeholders in `[square brackets]`
3. **Fill** SEO_INTENT block with actual values
4. **Update** title, meta description, paths
5. **Add** page-specific content
6. **Validate** with `npm run validate-all`

## Placeholder Reference

```html
<!-- SEO_INTENT Block -->
[PRIMARY_KEYWORD] - Main keyword for this page
[TARGET_AUDIENCE] - Who this page serves
[YYYY-MM-DD] - Last review date

<!-- Meta Tags -->
[Page Title - 50-60 characters with keyword]
[Meta description 140-160 characters]
[/path/to/page.html] - English path
[/es/ruta/a/pagina.html] - Spanish path

<!-- Content -->
[Page Heading with Primary Keyword] - H1 heading
[Introduction paragraph...] - 150-word intro
[Section Heading] - H2, H3 headings
[Section content...] - Main content
```

## Validation Checklist

Before using any template-based page:

- [ ] SEO_INTENT block filled
- [ ] Title 50-60 characters
- [ ] Meta description 140-160 characters
- [ ] Both path_en and path_es metadata present
- [ ] Hreflang links use absolute URLs
- [ ] Single H1 with keyword
- [ ] 150-word intro paragraph
- [ ] Logical heading hierarchy (H2 → H3 → H4)
- [ ] Descriptive link text (no vague anchors)
- [ ] FAQ section (recommended)
- [ ] Related Resources section
- [ ] Language switcher links to correct Spanish/English page
- [ ] If sensitive content (visa/AI/funding): add disclaimer + lastReviewed

## Validation Scripts

```bash
npm run generate-json              # Create JSON twins
npm run accessibility-scan          # WCAG AA validation
npm run validate-localization       # Bilingual parity
npm run data-governance-scan        # High-sensitivity content
npm run validate-all                # All validations
```

## High-Sensitivity Content

If page contains visa, immigration, AI ethics, funding guarantees, or academic integrity content:

1. **Add disclaimer** in HTML (e.g., "This is informational, not legal advice")
2. **Add lastReviewed** to SEO_INTENT block
3. **Run governance scan:** `npm run data-governance-scan`

See RULE 3 in [CLAUDE.md](../CLAUDE.md) for details.

---

**Created:** 2025-10-25
**Version:** 1.0.0
**Part of:** Spanish Academic 2026 - Bead spanish-academic-8
