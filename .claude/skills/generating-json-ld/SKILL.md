---
name: generating-json-ld
description: Generate JSON-LD structured data for HTML pages when creating or updating templates, aligned with W3C standards and Schema.org types
---

# Generating JSON-LD - Spanish Academic Network

**Purpose:** Generate and validate JSON-LD structured data for search engine optimization and rich results.

**Aligned with:** W3C JSON-LD Best Practices 2025, Schema.org standards, Google Rich Results guidelines.

---

## Page Types and Schema.org Mapping

Spanish Academic has **6 primary page types**, each requiring specific Schema.org markup:

| Page Type | Schema.org Type | Rich Result Eligibility | Priority |
|-----------|-----------------|------------------------|----------|
| **Program List** | `CollectionPage` + `FAQPage` | FAQs, Breadcrumbs | High |
| **Program Detail** | `Course` + `FAQPage` | Course, FAQs | Critical |
| **Insights Article** | `Article` + `FAQPage` | Article, FAQs | High |
| **Help/Q&A** | `FAQPage` | FAQs | Critical |
| **Category Index** | `CollectionPage` | Breadcrumbs | Medium |
| **Homepage** | `WebSite` + `Organization` (or `NewsMediaOrganization`) | Sitelinks search box | High |

---

## Core Principles (2025 Best Practices)

### 1. JSON-LD Only (Never Microdata or RDFa)

✅ **Correct:**
```html
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "Article", ... }
</script>
```

❌ **Wrong:**
```html
<div itemscope itemtype="https://schema.org/Article">...</div>
```

**Why:** JSON-LD is decoupled from HTML structure, easier to maintain, and Google's preferred format.

### 2. Server-Side Rendering in `<head>`

✅ **Correct:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>...</title>
  <script type="application/ld+json">
  { ... }
  </script>
</head>
```

❌ **Wrong:**
```javascript
// Client-side injection
document.head.innerHTML += '<script type="application/ld+json">...'
```

**Why:** Search engines may not execute JavaScript. Ship JSON-LD with initial HTML.

### 3. Reflect Real, Visible Content Only

✅ **Rule:** If a human can't verify it on the page, don't claim it in JSON-LD.

- ✅ Mark actual FAQs that appear on the page
- ✅ Include author name if visible in article byline
- ❌ Don't invent fake questions
- ❌ Don't add imaginary course features

### 4. Use Most Specific Schema.org Type

✅ **Better:**
```json
"@type": "Course"
```

❌ **Worse:**
```json
"@type": "Thing"
```

**Why:** Specific types increase eligibility for rich results and AI understanding.

### 5. Stable IDs and Entity Reuse

✅ **Correct:**
```json
{
  "@type": "Article",
  "@id": "https://spanish-academic.com/insights/funding#article",
  "publisher": {
    "@type": "Organization",
    "@id": "https://spanish-academic.com/#org",
    "name": "Spanish Academic"
  }
}
```

**Why:** Reusing `@id` prevents duplicate entities in knowledge graphs.

### 6. Keep Data Synchronized

✅ **Rule:** Update JSON-LD whenever page content changes.

- `url` must match canonical URL
- `datePublished` / `dateModified` must be accurate
- `offers` must reflect current pricing/availability

---

## Schema Templates by Page Type

### 1. Program List Page

**Example:** `/spanish-linguistics.html`, `/translation-and-interpreting.html`

**Schema Types:** `CollectionPage` + `FAQPage`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://spanish-academic.com/spanish-linguistics.html#collection",
  "name": "PhD and MA Programs in Spanish Linguistics",
  "description": "Comprehensive directory of graduate programs in Spanish linguistics, including phonetics, sociolinguistics, and historical linguistics.",
  "url": "https://spanish-academic.com/spanish-linguistics.html",
  "inLanguage": "en",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://spanish-academic.com/#website"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spanish-academic.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Spanish Linguistics Programs"
      }
    ]
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://spanish-academic.com/spanish-linguistics.html#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What funding is available for Spanish linguistics PhD programs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most PhD programs in Spanish linguistics offer 5 years of guaranteed funding, including tuition waiver and stipend ranging from $25,000-$35,000 per year. Many programs do not require GRE scores as of 2024."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a linguistics background to apply?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Many programs accept students from Spanish literature, education, or related fields. Strong Spanish proficiency and clear research interests are typically more important than prior linguistics coursework."
      }
    }
  ]
}
</script>
```

**Why separate blocks?**
- Google prefers focused, single-purpose JSON-LD
- Easier to validate and maintain
- Better AI parsing

---

### 2. Program Detail Page

**Example:** `/programs/uc-davis-phd-spanish-ling.html`

**Schema Types:** `Course` + `FAQPage`

**Note:** `Course` schema describes the program offered by the university. Spanish Academic is a directory site, not the course provider, so we reference the actual university in the `provider` field.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://spanish-academic.com/programs/uc-davis-phd-spanish-ling.html#course",
  "name": "PhD in Spanish Linguistics",
  "description": "Rigorous doctoral program in Spanish linguistics with emphasis on phonetics, sociolinguistics, and heritage language acquisition. Offers state-of-the-art lab facilities and strong quantitative methods training.",
  "provider": {
    "@type": "CollegeOrUniversity",
    "@id": "https://spanish-academic.com/programs/uc-davis-phd-spanish-ling.html#university",
    "name": "University of California, Davis",
    "url": "https://www.ucdavis.edu/",
    "sameAs": "https://www.wikidata.org/wiki/Q129421"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "full-time",
    "duration": "P5Y",
    "instructor": [
      {
        "@type": "Person",
        "name": "Dr. Example Professor"
      }
    ]
  },
  "offers": {
    "@type": "Offer",
    "category": "Full funding package",
    "price": "0",
    "priceCurrency": "USD",
    "description": "5 years guaranteed funding: full tuition waiver + $32,000/year stipend"
  },
  "educationalLevel": "Graduate",
  "teaches": [
    "Phonetics and Phonology",
    "Sociolinguistics",
    "Heritage Language Acquisition",
    "Quantitative Methods in Linguistics"
  ],
  "url": "https://spanish-academic.com/programs/uc-davis-phd-spanish-ling.html",
  "inLanguage": "en"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://spanish-academic.com/programs/uc-davis-phd-spanish-ling.html#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the GRE required for UC Davis Spanish Linguistics PhD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, the GRE is not required as of 2023. Strong writing sample and clear research interests are essential."
      }
    },
    {
      "@type": "Question",
      "name": "What research facilities are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "UC Davis offers a phonetics lab with ultrasound and electropalatography equipment, and an active sociolinguistics research group."
      }
    }
  ]
}
</script>
```

**Critical fields for `Course` schema:**
- `name` - Program title
- `description` - Clear, factual overview
- `provider` - University with stable `@id`
- `offers` - Funding details (price, currency, description)
- `teaches` - Focus areas (helps AI understand specialization)

---

### 3. Insights Article

**Example:** `/insights/funding-strategies.html`

**Schema Types:** `Article` + `FAQPage`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://spanish-academic.com/insights/funding-strategies.html#article",
  "headline": "Funding Strategies for Graduate Students in Spanish Linguistics",
  "description": "Learn effective strategies for securing funding in Spanish linguistics graduate programs, including fellowships, teaching assistantships, and external grants.",
  "author": {
    "@type": "Person",
    "name": "Paul Kidhardt",
    "url": "https://spanish-academic.com/about/paul-kidhardt.html"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://spanish-academic.com/#org",
    "name": "Spanish Academic",
    "url": "https://spanish-academic.com/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://spanish-academic.com/assets/images/logo.png"
    }
  },
  "datePublished": "2025-10-15",
  "dateModified": "2025-10-20",
  "mainEntityOfPage": "https://spanish-academic.com/insights/funding-strategies.html",
  "image": "https://spanish-academic.com/assets/images/insights/funding-strategies.jpg",
  "articleSection": "Funding and Financial Aid",
  "keywords": ["graduate funding", "Spanish linguistics", "fellowships", "teaching assistantships"],
  "inLanguage": "en",
  "isAccessibleForFree": true
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://spanish-academic.com/insights/funding-strategies.html#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much funding do Spanish linguistics PhD programs typically offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most PhD programs offer 5 years of guaranteed funding with stipends ranging from $25,000-$35,000 per year plus full tuition waiver."
      }
    }
  ]
}
</script>
```

**Critical fields for `Article` schema:**
- `headline` - Article title (exact match with `<h1>`)
- `author` - Visible byline author
- `publisher` - Organization (reuse `@id` from homepage)
- `datePublished` / `dateModified` - Accurate timestamps
- `mainEntityOfPage` - Canonical URL
- `image` - Featured image (if present)

---

### 4. Help/Q&A Page

**Example:** `/help/visa-requirements.html`

**Schema Types:** `FAQPage`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://spanish-academic.com/help/visa-requirements.html#faq",
  "mainEntity": {
    "@type": "Question",
    "name": "What are J-1 and F-1 visa requirements for graduate students?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "J-1 visas are for exchange visitors sponsored by universities. Requirements: Form DS-2019 from university, proof of English proficiency, financial support documentation ($25,000-40,000/year), valid passport. F-1 visas are for academic students. Requirements: Form I-20 from university, SEVIS fee payment, proof of funding, intent to return home after studies. Application timeline: Apply 120 days before program start. This is informational only; consult an immigration attorney for legal advice."
    }
  },
  "about": {
    "@type": "Thing",
    "name": "Student Visa Requirements"
  },
  "inLanguage": "en",
  "url": "https://spanish-academic.com/help/visa-requirements.html"
}
</script>
```

**Critical fields for `FAQPage` schema:**
- `mainEntity` - The primary question (matches `<h1>`)
- `acceptedAnswer.text` - Comprehensive answer (visible on page)
- `about` - Topic classification
- **MUST include disclaimer** if legal/immigration content

**Multi-Question FAQPage:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question 1?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    },
    {
      "@type": "Question",
      "name": "Question 2?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

---

### 5. Category Index Page

**Example:** `/insights/categories/funding-and-financial-aid.html`

**Schema Types:** `CollectionPage`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://spanish-academic.com/insights/categories/funding-and-financial-aid.html#collection",
  "name": "Funding and Financial Aid - Insights",
  "description": "Articles and guides about funding strategies, fellowships, scholarships, and financial aid for graduate students in Spanish linguistics and literature.",
  "url": "https://spanish-academic.com/insights/categories/funding-and-financial-aid.html",
  "inLanguage": "en",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://spanish-academic.com/#website"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://spanish-academic.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Insights",
        "item": "https://spanish-academic.com/insights/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Funding and Financial Aid"
      }
    ]
  }
}
</script>
```

---

### 6. Homepage

**Example:** `/index.html`

**Schema Types:** `WebSite` + `Organization`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://spanish-academic.com/#website",
  "name": "Spanish Academic",
  "url": "https://spanish-academic.com/",
  "description": "Authoritative, bilingual platform for graduate programs in Spanish Linguistics, Literature, Translation/Interpreting, and related fields.",
  "inLanguage": ["en", "es"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://spanish-academic.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://spanish-academic.com/#org",
  "name": "Spanish Academic",
  "url": "https://spanish-academic.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://spanish-academic.com/assets/images/logo.png",
    "width": 600,
    "height": 60
  },
  "sameAs": [
    "https://twitter.com/spanishacademic",
    "https://github.com/spanish-academic"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "contact@spanish-academic.com",
    "availableLanguage": ["English", "Spanish"]
  }
}
</script>
```

**Why `SearchAction`?**
- Enables Google Sitelinks search box
- Improves brand visibility in search results

**Important Note on Organization Type:**

Spanish Academic is an **information platform and journal**, NOT an educational institution. Therefore:

✅ **Use:** `Organization` (generic, always safe)
✅ **Alternative:** `NewsMediaOrganization` (if emphasizing journal/publication role)
❌ **Never use:** `EducationalOrganization` (only for institutions that teach courses)

**For program pages**, use `Course` schema but always set the `provider` to the actual university (e.g., UC Davis), not Spanish Academic.

---

## Bilingual Strategy

### Same Schema, Different Language

Spanish pages use **identical schema structure** with translated content:

**English (`/insights/funding.html`):**
```json
{
  "@type": "Article",
  "headline": "Funding Strategies for Graduate Students",
  "inLanguage": "en",
  "url": "https://spanish-academic.com/insights/funding.html"
}
```

**Spanish (`/es/insights/financiacion.html`):**
```json
{
  "@type": "Article",
  "headline": "Estrategias de Financiación para Estudiantes de Posgrado",
  "inLanguage": "es",
  "url": "https://spanish-academic.com/es/insights/financiacion.html"
}
```

**NO cross-language linking in JSON-LD:**
- Don't use `sameAs` to link English ↔ Spanish versions
- Use `hreflang` links in HTML instead
- Each page's JSON-LD describes only itself

---

## Implementation Checklist

Before deploying any page with JSON-LD:

- [ ] JSON-LD placed in `<head>` section
- [ ] Always includes `"@context": "https://schema.org"`
- [ ] Uses most specific `@type` available
- [ ] All required properties present
- [ ] Canonical absolute URLs for `url` and `@id`
- [ ] No fake or imaginary data
- [ ] Data matches visible page content
- [ ] Validated with Google Rich Results Test
- [ ] Validated with Schema.org Validator
- [ ] `inLanguage` matches page language
- [ ] For bilingual: both EN and ES versions have identical structure
- [ ] High-sensitivity pages (visa, AI ethics) include disclaimers in answer text

---

## Validation Tools

### 1. Google Rich Results Test
**URL:** https://search.google.com/test/rich-results

**Use for:**
- Testing eligibility for rich snippets
- Validating FAQ, Article, Course markup
- Checking Google-specific requirements

### 2. Schema.org Validator
**URL:** https://validator.schema.org/

**Use for:**
- Checking Schema.org compliance
- Validating syntax and structure
- Ensuring property relationships are correct

### 3. Validation Script (Future)

Create `scripts/validate_json_ld.js`:
- Extract JSON-LD from all HTML files
- Parse as JSON (syntax check)
- Validate required properties per type
- Check URL canonicalization
- Verify language consistency

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Client-Side Injection
```javascript
// WRONG - Google may not see this
document.addEventListener('DOMContentLoaded', () => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});
```

✅ **Fix:** Server-side render JSON-LD in HTML.

### ❌ Mistake 2: Fake FAQs
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "name": "Are we the best program?",
      "acceptedAnswer": { "text": "Yes, absolutely!" }
    }
  ]
}
```

✅ **Fix:** Only mark real, visible Q&A pairs.

### ❌ Mistake 3: Wrong Schema Type
```json
{
  "@type": "Product",
  "name": "PhD in Spanish Linguistics"
}
```

✅ **Fix:** Use `Course` for academic programs, not `Product`.

### ❌ Mistake 4: Inconsistent URLs
```json
{
  "url": "https://spanish-academic.com/insights/funding",
  "mainEntityOfPage": "https://spanish-academic.com/insights/funding.html"
}
```

✅ **Fix:** Use canonical URL everywhere.

### ❌ Mistake 5: Missing Required Properties

**Invalid `Article`:**
```json
{
  "@type": "Article",
  "headline": "Funding Strategies"
}
```

✅ **Fix:** Include `author`, `publisher`, `datePublished`.

---

## AI and Generative Search Optimization

JSON-LD now powers AI search (Google SGE, Bing Copilot, voice assistants).

**Key entity info to include:**

| Question | Property | Example |
|----------|----------|---------|
| **Who** | `author`, `provider`, `publisher` | Dr. Jane Smith, UC Davis |
| **What** | `name`, `description`, `teaches` | PhD in Spanish Linguistics, Phonetics, Sociolinguistics |
| **Where** | `address`, `location`, `url` | University of California, Davis |
| **When** | `startDate`, `datePublished`, `duration` | Fall 2025, 5 years |
| **Why** | `description`, `about`, `educationalLevel` | Advanced research training in Spanish linguistics |

**Tip:** Rich `description` fields help AI generate better summaries.

---

## Usage in Templates

### When building HTML templates:

1. **Identify page type** (Program List, Program Detail, Insights, Help, Category, Homepage)
2. **Copy appropriate schema template** from this skill
3. **Replace placeholder values** with real page data
4. **Place in `<head>`** before closing `</head>` tag
5. **Validate** before committing

### Example workflow:

```bash
# After creating a new Insights article HTML page
1. Add JSON-LD schema (Article + FAQPage) to <head>
2. Validate: Google Rich Results Test
3. Run generate_page_json.js to create external .json twin
4. Commit both HTML and JSON files
```

---

## Related Skills

- **generating-continuations** - End session after validating JSON-LD
- **validating-localization** - Ensure bilingual JSON-LD structure matches

---

## Future Enhancements

- **BreadcrumbList** for all pages (improves navigation understanding)
- **Review schema** for program pages (if we add user reviews)
- **Event schema** for conferences/workshops (if added)
- **VideoObject** for Insights articles with video content

---

**Last Updated:** 2025-10-25
**Version:** 2.0.0 (Migrated to Anthropic standards)
**Aligned with:** W3C JSON-LD BP 2025, Schema.org, Google Rich Results Guidelines
