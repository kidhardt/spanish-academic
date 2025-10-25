#!/usr/bin/env node

/**
 * Generate Sitemap Script
 *
 * Scans all HTML pages in /public/ and generates sitemap.xml for search engines
 * Extracts lastmod dates from SEO_INTENT blocks and assigns priorities by page type
 *
 * Usage: npm run generate-sitemap
 *
 * Spanish Academic 2026
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');
const SITEMAP_PATH = join(PUBLIC_DIR, 'sitemap.xml');

// Base URL for the site (configure this for production)
const BASE_URL = 'https://spanish-academic.com';

// Priority configuration by page type
const PRIORITIES = {
  programs: 0.8,
  insights: 0.7,
  help: 0.6,
  categories: 0.5,
  other: 0.5,
};

// Track statistics
let pagesProcessed = 0;
let errorCount = 0;

/**
 * Extract SEO_INTENT block from HTML
 */
function extractSeoIntent(html) {
  const seoIntentRegex = /<!--\s*\n?\s*KEYWORD:\s*([^\n]+)\s*\n\s*AUDIENCE:\s*([^\n]+)\s*\n\s*LAST_REVIEWED:\s*([^\n]+)\s*\n?\s*-->/i;
  const match = html.match(seoIntentRegex);

  if (!match) {
    return null;
  }

  return {
    keyword: match[1].trim(),
    audience: match[2].trim(),
    lastReviewed: match[3].trim(),
  };
}

/**
 * Determine page type from URL path
 */
function getPageType(url) {
  if (url.includes('/programs/') || url.includes('/programas/')) {
    return 'programs';
  }
  if (url.includes('/insights/') && !url.includes('/categories/') && !url.includes('/categorias/')) {
    return 'insights';
  }
  if (url.includes('/help/') || url.includes('/ayuda/')) {
    if (url.includes('/categories/') || url.includes('/categorias/')) {
      return 'categories';
    }
    return 'help';
  }
  if (url.includes('/categories/') || url.includes('/categorias/')) {
    return 'categories';
  }
  return 'other';
}

/**
 * Get priority for page type
 */
function getPriority(pageType) {
  return PRIORITIES[pageType] || PRIORITIES.other;
}

/**
 * Convert file path to URL
 */
function filePathToUrl(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath);
  const urlPath = '/' + relativePath.replace(/\\/g, '/').replace(/index\.html$/, '');
  return BASE_URL + urlPath;
}

/**
 * Parse HTML file and extract sitemap data
 */
function parseHtmlFile(filePath) {
  try {
    const html = readFileSync(filePath, 'utf-8');
    const $ = load(html);

    // Extract SEO_INTENT for lastmod date
    const seoIntent = extractSeoIntent(html);
    const lastmod = seoIntent?.lastReviewed || new Date().toISOString().split('T')[0];

    // Get URL
    const url = filePathToUrl(filePath);

    // Determine page type and priority
    const pageType = getPageType(url);
    const priority = getPriority(pageType);

    pagesProcessed++;

    return {
      url,
      lastmod,
      priority,
      pageType,
    };
  } catch (error) {
    const relPath = relative(PUBLIC_DIR, filePath);
    console.error(`❌ Error parsing ${relPath}: ${error.message}`);
    errorCount++;
    return null;
  }
}

/**
 * Generate sitemap XML
 */
function generateSitemapXml(urlEntries) {
  const urlElements = urlEntries
    .sort((a, b) => {
      // Sort by priority (high to low), then by URL
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.url.localeCompare(b.url);
    })
    .map(entry => {
      return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return xml;
}

/**
 * Main execution
 */
async function main() {
  console.log('🗺️  Generating Sitemap\n');
  console.log('='.repeat(60));

  // Find all HTML files
  const htmlFiles = await glob('**/*.html', {
    cwd: PUBLIC_DIR,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  if (htmlFiles.length === 0) {
    console.log('⚠️  No HTML files found in /public/');
    return;
  }

  console.log(`Found ${htmlFiles.length} HTML file(s)\n`);

  // Parse all files
  const urlEntries = [];
  for (const filePath of htmlFiles) {
    const entry = parseHtmlFile(filePath);
    if (entry) {
      urlEntries.push(entry);
    }
  }

  // Generate sitemap XML
  const sitemapXml = generateSitemapXml(urlEntries);

  // Write sitemap
  writeFileSync(SITEMAP_PATH, sitemapXml, 'utf-8');

  // Summary by page type
  const typeStats = {};
  urlEntries.forEach(entry => {
    typeStats[entry.pageType] = (typeStats[entry.pageType] || 0) + 1;
  });

  console.log('📄 Pages by Type:');
  Object.entries(typeStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const priority = PRIORITIES[type] || PRIORITIES.other;
      console.log(`   ${type.padEnd(12)} ${count} page(s) (priority: ${priority.toFixed(1)})`);
    });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Pages processed: ${pagesProcessed}`);
  console.log(`🗺️  URLs in sitemap: ${urlEntries.length}`);
  console.log(`📁 Sitemap written to: ${relative(PROJECT_ROOT, SITEMAP_PATH)}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    console.log('\n❌ Generation completed with errors');
    process.exit(1);
  } else {
    console.log('\n✅ Sitemap generated successfully!');
    console.log(`\n💡 View sitemap: ${SITEMAP_PATH}`);
    console.log('💡 Update BASE_URL in script for production deployment');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
