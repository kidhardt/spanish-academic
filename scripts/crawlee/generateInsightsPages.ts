#!/usr/bin/env node

/**
 * Generate Insights Pages - Extract + Generate Phases
 *
 * Extracts content from raw HTML and generates Insights article pages
 * ZERO REWRITES - Preserves exact WordPress HTML structure
 *
 * Spanish Academic 2026 - Insights Content Migration
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { load } from 'cheerio';

interface ArticleData {
  sourceFile: string;
  slug: string;
  title: string;
  mainContent: string; // EXACT HTML from WordPress
  metaDescription: string;
  spanishSlug: string;
}

const articles: ArticleData[] = [
  {
    sourceFile: 'how-to-choose-a-graduate-program-in-spanish.html',
    slug: 'how-to-choose-a-graduate-program',
    spanishSlug: 'como-elegir-un-programa-de-posgrado',
    title: 'How to Choose a Graduate Program in Spanish - Master\'s and PhD',
    metaDescription: 'Essential guide to selecting the right Spanish linguistics, literature, or translation graduate program. Learn about funding, faculty fit, and program evaluation.',
    mainContent: '', // Will be extracted
  },
  {
    sourceFile: 'graduate-program-rankings-for-spanish-hispanic-literature-linguistics.html',
    slug: 'graduate-program-rankings',
    spanishSlug: 'rankings-de-programas-de-posgrado',
    title: 'Graduate Program Rankings for Spanish Literature and Linguistics',
    metaDescription: 'Comprehensive analysis of graduate program rankings in Spanish and Hispanic literature, linguistics, and translation studies. Understanding methodology and limitations.',
    mainContent: '', // Will be extracted
  },
];

console.log('📝 Extracting and Generating Insights Articles\n');
console.log('='.repeat(80));

// Phase 2: Extract Content (ZERO REWRITES)
console.log('\n🔍 PHASE 2: EXTRACT (Cheerio parsing - EXACT HTML preservation)\n');

for (const article of articles) {
  console.log(`\n📄 Processing: ${article.sourceFile}`);

  const rawHtmlPath = join(
    process.cwd(),
    'docs',
    'content-migration',
    'raw-insights',
    article.sourceFile
  );

  const rawHtml = readFileSync(rawHtmlPath, 'utf-8');
  const $ = load(rawHtml);

  // Extract EXACT content from WordPress entry-content div
  // ZERO modifications - preserve ALL HTML exactly as published
  const entryContent = $('.entry-content');

  if (entryContent.length === 0) {
    console.error(`   ❌ No .entry-content found in ${article.sourceFile}`);
    process.exit(1);
  }

  // Get EXACT HTML - NO filtering, NO cleaning, NO modifications
  article.mainContent = entryContent.html() || '';

  console.log(`   ✅ Extracted ${article.mainContent.length} characters of EXACT HTML`);
  console.log(`   ✅ Zero rewrites - WordPress HTML preserved exactly`);
}

// Phase 3: Generate Pages (Template insertion with EXACT content)
console.log('\n🏗️  PHASE 3: GENERATE (Template-based page creation)\n');

// Ensure output directory exists
const insightsDir = join(process.cwd(), 'public', 'insights');
mkdirSync(insightsDir, { recursive: true });

const esInsightsDir = join(process.cwd(), 'public', 'es', 'insights');
mkdirSync(esInsightsDir, { recursive: true });

// Load base template
const baseTemplatePath = join(process.cwd(), 'templates', 'base.html');
const baseTemplate = readFileSync(baseTemplatePath, 'utf-8');

const baseEsTemplatePath = join(process.cwd(), 'templates', 'base-es.html');
const baseEsTemplate = readFileSync(baseEsTemplatePath, 'utf-8');

for (const article of articles) {
  console.log(`\n📝 Generating: ${article.slug}.html`);

  // Determine paths
  const enPath = `/insights/${article.slug}.html`;
  const esPath = `/es/insights/${article.spanishSlug}.html`;

  // Generate English page
  let enPage = baseTemplate
    // SEO_INTENT block
    .replace('[PRIMARY_KEYWORD]', article.slug.replace(/-/g, ' '))
    .replace('[TARGET_AUDIENCE]', 'Prospective graduate students in Spanish studies')
    .replace('[YYYY-MM-DD]', new Date().toISOString().split('T')[0])

    // Meta tags
    .replace(/\[Page Title - 50-60 characters with keyword\]/g, article.title)
    .replace(/\[Meta description 140-160 characters with keyword variant\]/g, article.metaDescription)

    // Path metadata
    .replace('[/path/to/page.html]', enPath)
    .replace('[/es/ruta/a/pagina.html]', esPath)

    // Canonical and hreflang
    .replace(/https:\/\/spanishacademic\.com\/\[path\/to\/page\.html\]/g, `https://spanishacademic.com${enPath}`)
    .replace(/https:\/\/spanishacademic\.com\/es\/\[ruta\/a\/pagina\.html\]/g, `https://spanishacademic.com${esPath}`)
    .replace('/es/[ruta/a/pagina.html]', esPath)

    // Open Graph
    .replace(/\[Page Title\]/g, article.title)
    .replace(/\[Meta description\]/g, article.metaDescription)

    // Main content heading
    .replace('[Page Heading with Primary Keyword]', article.title)

    // Remove template intro paragraph placeholder
    .replace(
      /<p class="intro">[\s\S]*?\[Introduction paragraph approximately[\s\S]*?here\.\][\s\S]*?<\/p>/,
      ''
    )

    // CRITICAL: Insert EXACT WordPress HTML content (ZERO modifications)
    .replace(
      /<article>[\s\S]*?<\/article>/,
      `<article>\n${article.mainContent}\n    </article>`
    )

    // Remove FAQ section (not applicable to migrated content)
    .replace(/<section class="faq-section">[\s\S]*?<\/section>/, '')

    // Remove Related Resources (will be added manually later if needed)
    .replace(/<aside class="related-resources">[\s\S]*?<\/aside>/, '');

  // Write English page
  const enFilePath = join(insightsDir, `${article.slug}.html`);
  writeFileSync(enFilePath, enPage, 'utf-8');
  console.log(`   ✅ English: ${enFilePath}`);

  // Generate Spanish placeholder page
  let esPage = baseEsTemplate
    .replace('[TITULO_PAGINA]', `${article.title} (Contenido en español próximamente)`)
    .replace('[META_DESCRIPCION]', `${article.metaDescription} (Versión en español en preparación)`)
    .replace('[/es/ruta/a/pagina.html]', esPath)
    .replace('[/path/to/page.html]', enPath)
    .replace('https://spanishacademic.com/es/[ruta/a/pagina.html]', `https://spanishacademic.com${esPath}`)
    .replace('https://spanishacademic.com/[path/to/page.html]', `https://spanishacademic.com${enPath}`)
    .replace('[/path/to/page.html]', enPath);

  const esFilePath = join(esInsightsDir, `${article.spanishSlug}.html`);
  writeFileSync(esFilePath, esPage, 'utf-8');
  console.log(`   ✅ Spanish placeholder: ${esFilePath}`);
}

// Summary report
console.log('\n' + '='.repeat(80));
console.log('📊 GENERATION SUMMARY');
console.log('='.repeat(80));

console.log(`\n✅ ${articles.length} English articles generated`);
console.log(`✅ ${articles.length} Spanish placeholders generated`);
console.log(`✅ Total pages: ${articles.length * 2}`);

console.log('\n📋 Generated Files:');
articles.forEach((article) => {
  console.log(`   - /insights/${article.slug}.html`);
  console.log(`   - /es/insights/${article.spanishSlug}.html`);
});

console.log('\n✅ Zero-rewrite policy enforced: WordPress HTML preserved exactly');
console.log('✅ All content extracted from .entry-content with NO modifications');

console.log('\n' + '='.repeat(80));
console.log('🎉 Insights migration complete!');
console.log('='.repeat(80));

console.log('\nNext steps:');
console.log('1. Run validation suite: npm run validate-all');
console.log('2. Check RULE 1 compliance (no commentary added)');
console.log('3. Update CONTENT_MIGRATION.md with results');
