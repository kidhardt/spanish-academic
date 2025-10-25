#!/usr/bin/env node

/**
 * Build Categories Script
 *
 * Auto-generates category index pages for Insights and Help/Q&A sections
 * Scans articles/Q&A, groups by category, generates bilingual category pages
 * with SEO optimization and JSON twins
 *
 * Usage: npm run build-categories
 *
 * Spanish Academic 2026
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// Category configuration
const CATEGORY_CONFIG = {
  insights: {
    en: {
      sourceDir: join(PUBLIC_DIR, 'insights'),
      outputDir: join(PUBLIC_DIR, 'insights', 'categories'),
      baseUrl: '/insights/categories/',
      esUrl: '/es/insights/categorias/',
    },
    es: {
      sourceDir: join(PUBLIC_DIR, 'es', 'insights'),
      outputDir: join(PUBLIC_DIR, 'es', 'insights', 'categorias'),
      baseUrl: '/es/insights/categorias/',
      enUrl: '/insights/categories/',
    },
  },
  help: {
    en: {
      sourceDir: join(PUBLIC_DIR, 'help'),
      outputDir: join(PUBLIC_DIR, 'help', 'categories'),
      baseUrl: '/help/categories/',
      esUrl: '/es/ayuda/categorias/',
    },
    es: {
      sourceDir: join(PUBLIC_DIR, 'es', 'ayuda'),
      outputDir: join(PUBLIC_DIR, 'es', 'ayuda', 'categorias'),
      baseUrl: '/es/ayuda/categorias/',
      enUrl: '/help/categories/',
    },
  },
};

// Track statistics
let categoriesGenerated = 0;
let articlesProcessed = 0;
let errorCount = 0;

/**
 * Extract category from article metadata
 * Looks for <meta name="category" content="...">
 */
function extractCategory(filePath) {
  try {
    const html = readFileSync(filePath, 'utf-8');
    const $ = load(html);

    const category = $('meta[name="category"]').attr('content')?.trim();

    if (!category) {
      return null;
    }

    return category;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}: ${error.message}`);
    errorCount++;
    return null;
  }
}

/**
 * Extract article metadata for category listings
 */
function extractArticleMetadata(filePath) {
  try {
    const html = readFileSync(filePath, 'utf-8');
    const $ = load(html);

    const title = $('title').text().trim();
    const h1 = $('h1').first().text().trim();
    const description = $('meta[name="description"]').attr('content')?.trim() || '';
    const category = $('meta[name="category"]').attr('content')?.trim() || 'uncategorized';
    const publishedDate = $('meta[name="published_date"]').attr('content')?.trim() || '';

    // Extract first paragraph as abstract if no description
    let abstract = description;
    if (!abstract) {
      const firstP = $('main p').first().text().trim();
      abstract = firstP.substring(0, 200) + (firstP.length > 200 ? '...' : '');
    }

    return {
      title: title || h1,
      h1,
      description,
      abstract,
      category,
      publishedDate,
      filePath,
    };
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}: ${error.message}`);
    errorCount++;
    return null;
  }
}

/**
 * Get relative URL from file path
 */
function getUrlFromPath(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath);
  return '/' + relativePath.replace(/\\/g, '/');
}

/**
 * Generate category intro text
 * This would ideally come from a data file, but we'll generate a placeholder
 */
function generateCategoryIntro(categoryName, language) {
  if (language === 'es') {
    return `Esta sección contiene artículos y recursos relacionados con ${categoryName}. Explore nuestra colección curada de contenido académico y guías prácticas diseñadas para estudiantes y profesionales en el campo de la lingüística española, la literatura y la traducción.`;
  }

  return `This section contains articles and resources related to ${categoryName}. Browse our curated collection of academic content and practical guides designed for students and professionals in Spanish linguistics, literature, and translation.`;
}

/**
 * Slugify category name for URL
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate category page HTML
 */
function generateCategoryPageHtml(categoryName, articles, config, language) {
  const categorySlug = slugify(categoryName);

  // Truncate category name if needed to fit within 50-60 char title limit
  // Title format: "{categoryName} - Academic Resources | Spanish Academic"
  // Max length calculation: 60 (max) - 40 (suffix) - 3 (ellipsis) = 17 chars max
  const maxCategoryLength = 17;
  const displayName = categoryName.length > maxCategoryLength
    ? categoryName.substring(0, maxCategoryLength).trim() + '...'
    : categoryName;

  const title = language === 'es'
    ? `${displayName} - Recursos Académicos | Spanish Academic`
    : `${displayName} - Academic Resources | Spanish Academic`;

  const description = language === 'es'
    ? `Explore artículos académicos y guías prácticas sobre ${categoryName} para estudiantes de posgrado en lingüística española, literatura y traducción.`
    : `Explore academic articles and practical guides about ${categoryName} for graduate students in Spanish linguistics, literature, and translation.`;

  const h1 = language === 'es' ? `Categoría: ${categoryName}` : `Category: ${categoryName}`;
  const intro = generateCategoryIntro(categoryName, language);

  const currentDate = new Date().toISOString().split('T')[0];

  // Build article list HTML
  const articleListHtml = articles
    .sort((a, b) => {
      // Sort by published date, newest first
      if (a.publishedDate && b.publishedDate) {
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      }
      return 0;
    })
    .map(article => {
      const url = getUrlFromPath(article.filePath);
      return `    <article>
      <h2><a href="${url}">${article.h1 || article.title}</a></h2>
      <p>${article.abstract}</p>
      ${article.publishedDate ? `<time datetime="${article.publishedDate}">${article.publishedDate}</time>` : ''}
    </article>`;
    }).join('\n\n');

  // Determine alternate language URL
  const alternateLang = language === 'es' ? 'en' : 'es';
  const alternateUrl = language === 'es'
    ? `${config.enUrl}${categorySlug}.html`
    : `${config.esUrl}${categorySlug}.html`;
  const selfUrl = `${config.baseUrl}${categorySlug}.html`;

  const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!--
  KEYWORD: ${categoryName}
  AUDIENCE: Graduate students and professionals interested in ${categoryName}
  LAST_REVIEWED: ${currentDate}
  -->

  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- Localization metadata -->
  <meta name="path_en" content="${language === 'en' ? selfUrl : alternateUrl}">
  <meta name="path_es" content="${language === 'es' ? selfUrl : alternateUrl}">

  <!-- Canonical and hreflang -->
  <link rel="canonical" href="${selfUrl}">
  <link rel="alternate" hreflang="${language}" href="${selfUrl}">
  <link rel="alternate" hreflang="${alternateLang}" href="${alternateUrl}">
  <link rel="alternate" hreflang="x-default" href="${language === 'en' ? selfUrl : alternateUrl}">

  <!-- Schema.org CollectionPage markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${h1}",
    "description": "${description}",
    "inLanguage": "${language}",
    "url": "${selfUrl}",
    "numberOfItems": ${articles.length}
  }
  </script>
</head>
<body>
  <header>
    <nav>
      <a href="${language === 'es' ? '/es/' : '/'}">Home</a>
      <a href="${alternateUrl}" hreflang="${alternateLang}">${alternateLang === 'es' ? 'Español' : 'English'}</a>
    </nav>
  </header>

  <main>
    <h1>${h1}</h1>

    <section class="category-intro">
      <p>${intro}</p>
      <p><strong>${articles.length}</strong> ${language === 'es' ? 'artículos en esta categoría' : 'articles in this category'}</p>
    </section>

    <section class="article-list">
${articleListHtml}
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Spanish Academic. ${language === 'es' ? 'Todos los derechos reservados' : 'All rights reserved'}.</p>
  </footer>
</body>
</html>`;

  return html;
}

/**
 * Process content type (insights or help)
 */
async function processContentType(contentType, lang) {
  const config = CATEGORY_CONFIG[contentType][lang];

  if (!existsSync(config.sourceDir)) {
    console.log(`⚠️  Skipping ${contentType}/${lang}: Source directory does not exist yet`);
    return;
  }

  console.log(`\n🔍 Scanning ${contentType}/${lang}...`);

  // Find all HTML files (excluding category pages themselves)
  const htmlFiles = await glob('*.html', {
    cwd: config.sourceDir,
    absolute: true,
    ignore: ['**/categories/**'],
  });

  if (htmlFiles.length === 0) {
    console.log(`   No articles found in ${contentType}/${lang}`);
    return;
  }

  // Group articles by category
  const categoriesMap = new Map();

  for (const filePath of htmlFiles) {
    const metadata = extractArticleMetadata(filePath);

    if (!metadata) {
      continue;
    }

    articlesProcessed++;

    const category = metadata.category || 'uncategorized';

    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }

    categoriesMap.get(category).push(metadata);
  }

  // Ensure output directory exists
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  // Generate category pages
  for (const [categoryName, articles] of categoriesMap) {
    const categorySlug = slugify(categoryName);
    const categoryPagePath = join(config.outputDir, `${categorySlug}.html`);

    const html = generateCategoryPageHtml(categoryName, articles, config, lang);

    writeFileSync(categoryPagePath, html, 'utf-8');

    console.log(`   ✅ Generated: ${relative(PUBLIC_DIR, categoryPagePath)} (${articles.length} articles)`);
    categoriesGenerated++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('📚 Building Category Index Pages\n');
  console.log('='.repeat(60));

  // Process all content types and languages
  for (const contentType of Object.keys(CATEGORY_CONFIG)) {
    for (const lang of ['en', 'es']) {
      await processContentType(contentType, lang);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Categories generated: ${categoriesGenerated}`);
  console.log(`📄 Articles processed: ${articlesProcessed}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    console.log('\n❌ Build completed with errors');
    process.exit(1);
  } else if (categoriesGenerated === 0) {
    console.log('\n⚠️  No categories generated (no articles found yet)');
  } else {
    console.log('\n✅ Category pages built successfully!');
    console.log('\n💡 Next step: Run `npm run generate-json` to create JSON twins');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
