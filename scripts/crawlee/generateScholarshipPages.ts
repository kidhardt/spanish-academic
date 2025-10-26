/**
 * Generate Scholarship Pages from Raw HTML
 *
 * This script extracts content from raw WordPress HTML and generates
 * clean HTML pages using the scholarship-base.html template.
 *
 * Zero-rewrite policy: Content is extracted exactly as published,
 * preserving typos, formatting, and all original text for citation integrity.
 *
 * Usage:
 *   npx tsx scripts/crawlee/generateScholarshipPages.ts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { load } from 'cheerio';

// Directories
const RAW_DIR = join(process.cwd(), 'docs', 'content-migration', 'raw-scholarship');
const TEMPLATE_PATH = join(process.cwd(), 'templates', 'scholarship-base.html');
const OUTPUT_DIR = join(process.cwd(), 'public', 'scholarship');

console.log('\n' + '='.repeat(80));
console.log('GENERATING SCHOLARSHIP PAGES');
console.log('='.repeat(80) + '\n');
console.log(`Raw HTML directory: ${RAW_DIR}`);
console.log(`Template: ${TEMPLATE_PATH}`);
console.log(`Output directory: ${OUTPUT_DIR}`);
console.log(`Zero-rewrite policy: ENFORCED\n`);

// Load template
const templateHtml = readFileSync(TEMPLATE_PATH, 'utf-8');

// Get all raw HTML files
const rawFiles = readdirSync(RAW_DIR).filter(f => f.endsWith('.html'));

console.log(`Found ${rawFiles.length} raw HTML files to process\n`);

let processedCount = 0;
let totalExtractedChars = 0;

rawFiles.forEach(fileName => {
  const slug = basename(fileName, '.html');
  console.log(`\n📄 Processing: ${slug}`);

  // Read raw HTML
  const rawHtmlPath = join(RAW_DIR, fileName);
  const rawHtml = readFileSync(rawHtmlPath, 'utf-8');
  console.log(`   Raw size: ${(rawHtml.length / 1024).toFixed(2)} KB`);

  // Parse with Cheerio
  const $ = load(rawHtml);

  // Extract metadata
  const title = $('h1.entry-title').first().text().trim() || $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';

  // Extract article content
  // Try multiple selectors for WordPress content
  let mainContent = '';

  const entryContent = $('.entry-content');
  if (entryContent.length > 0) {
    mainContent = entryContent.html() || '';
  } else {
    // Try article tag (GenerateBlocks / custom template)
    const article = $('article.dynamic-content-template');
    if (article.length > 0) {
      mainContent = article.html() || '';
    } else {
      // Fallback: try main content area
      const contentArea = $('.content-area article');
      mainContent = contentArea.html() || '';
    }
  }

  const extractedChars = mainContent.length;
  console.log(`   Extracted: ${extractedChars.toLocaleString()} characters`);
  console.log(`   Title: ${title}`);

  // Extract author if available
  const author = $('.entry-author').text().trim() ||
                 $('meta[name="author"]').attr('content')?.trim() ||
                 '[Autor]';

  // Extract publication date if available
  const pubDate = $('time[datetime]').attr('datetime') ||
                  $('meta[property="article:published_time"]').attr('content') ||
                  '2024-01-01';

  // Build article object
  const article = {
    slug,
    title,
    metaDescription,
    author,
    pubDate,
    mainContent,
  };

  // Generate final HTML by replacing placeholders in template
  let finalHtml = templateHtml;

  // Replace metadata placeholders
  finalHtml = finalHtml
    .replace(/\[Título del Artículo - 50-60 caracteres\]/g, article.title)
    .replace(/\[Meta descripción 140-160 caracteres\]/g, article.metaDescription || article.title)
    .replace(/\[article-slug\]/g, article.slug)
    .replace(/\[Título del Artículo\]/g, article.title)
    .replace(/\[Título del Artículo Académico\]/g, article.title)
    .replace(/\[Nombre del Autor\]/g, article.author)
    .replace(/\[YYYY-MM-DD\]/g, article.pubDate.split('T')[0])
    .replace(/\[DD de Mes de YYYY\]/g, formatSpanishDate(article.pubDate))
    .replace(/\[Universidad o Institución\]/g, 'Spanish Academic')
    .replace(/\[Tema principal del artículo\]/g, article.title)
    .replace(/\[palabra clave 1, palabra clave 2, palabra clave 3\]/g, extractKeywords(article.title))
    .replace(/\[Resumen del artículo académico\]/g, article.metaDescription || article.title);

  // Replace main content area (preserve exact HTML)
  // Find the article body section and replace it
  finalHtml = finalHtml.replace(
    /<div class="article-body"[^>]*>[\s\S]*?<\/div>\s*<!-- References -->/,
    `<div class="article-body" itemprop="articleBody">\n${article.mainContent}\n      </div>\n\n      <!-- References -->`
  );

  // Write to output
  const outputPath = join(OUTPUT_DIR, `${article.slug}.html`);
  writeFileSync(outputPath, finalHtml, 'utf-8');

  console.log(`   ✅ Generated: ${outputPath}`);

  processedCount++;
  totalExtractedChars += extractedChars;
});

// Summary
console.log('\n' + '='.repeat(80));
console.log('GENERATION COMPLETE');
console.log('='.repeat(80) + '\n');
console.log(`✅ Pages generated: ${processedCount}/${rawFiles.length}`);
console.log(`📊 Total extracted: ${totalExtractedChars.toLocaleString()} characters`);
console.log(`📂 Output location: ${OUTPUT_DIR}\n`);

console.log('📝 Next steps:');
console.log('   1. Review generated pages for quality');
console.log('   2. Run: npm run generate-json');
console.log('   3. Run: npm run validate-localization (should PASS with NON-PARITY)');
console.log('   4. Update CONTENT_MIGRATION.md with scholarship migration report\n');

/**
 * Format date in Spanish format
 */
function formatSpanishDate(isoDate: string): string {
  const date = new Date(isoDate);
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}

/**
 * Extract keywords from title (simple implementation)
 */
function extractKeywords(title: string): string {
  // Remove common words and extract meaningful terms
  const stopWords = ['de', 'la', 'el', 'los', 'las', 'en', 'y', 'del', 'a'];
  const words = title.toLowerCase().split(/\s+/);
  const keywords = words.filter(w => w.length > 3 && !stopWords.includes(w));

  return keywords.slice(0, 5).join(', ');
}
