#!/usr/bin/env node

/**
 * Generate Page JSON Script
 *
 * Parses HTML files in /public/ and generates machine-readable .json twins
 * Validates SEO metadata and enforces Spanish Academic governance rules
 *
 * LOCALIZATION ENFORCEMENT (RULE 4):
 * - Every HTML page MUST have both path_en and path_es metadata
 * - path_en must start with "/"
 * - path_es must start with "/es/"
 * - Validates bidirectional hreflang links
 * - Cross-validates paths match file locations
 *
 * Usage: npm run generate-json
 *
 * Spanish Academic 2026
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// Validation thresholds
const TITLE_MIN = 50;
const TITLE_MAX = 60;
const META_DESC_MIN = 140;
const META_DESC_MAX = 160;

// Track validation errors
let errorCount = 0;
let warningCount = 0;
let successCount = 0;

/**
 * Extract SEO_INTENT block from HTML comments
 * Format:
 * <!--
 * KEYWORD: primary keyword
 * AUDIENCE: target audience description
 * LAST_REVIEWED: YYYY-MM-DD
 * -->
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
 * Validate title length
 */
function validateTitle(title, filePath) {
  if (!title) {
    console.error(`❌ ERROR [${filePath}]: Missing <title> tag`);
    errorCount++;
    return false;
  }

  const length = title.length;

  if (length < TITLE_MIN) {
    console.warn(`⚠️  WARNING [${filePath}]: Title too short (${length} chars, min ${TITLE_MIN})`);
    console.warn(`   Title: "${title}"`);
    warningCount++;
    return false;
  }

  if (length > TITLE_MAX) {
    console.warn(`⚠️  WARNING [${filePath}]: Title too long (${length} chars, max ${TITLE_MAX})`);
    console.warn(`   Title: "${title}"`);
    warningCount++;
    return false;
  }

  return true;
}

/**
 * Validate meta description length
 */
function validateMetaDescription(description, filePath) {
  if (!description) {
    console.error(`❌ ERROR [${filePath}]: Missing meta description`);
    errorCount++;
    return false;
  }

  const length = description.length;

  if (length < META_DESC_MIN) {
    console.warn(`⚠️  WARNING [${filePath}]: Meta description too short (${length} chars, min ${META_DESC_MIN})`);
    console.warn(`   Description: "${description}"`);
    warningCount++;
    return false;
  }

  if (length > META_DESC_MAX) {
    console.warn(`⚠️  WARNING [${filePath}]: Meta description too long (${length} chars, max ${META_DESC_MAX})`);
    console.warn(`   Description: "${description.substring(0, 100)}..."`);
    warningCount++;
    return false;
  }

  return true;
}

/**
 * Parse HTML file and generate JSON metadata
 */
function parseHtmlFile(filePath) {
  const html = readFileSync(filePath, 'utf-8');
  const $ = load(html);

  // RULE: Every page MUST have lang attribute on <html> (LOCALIZATION_FIRST.md)
  const language = $('html').attr('lang') || '';

  // Extract basic metadata
  const title = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';

  // BILINGUAL PATH METADATA (LOCALIZATION_FIRST.md)
  // Every HTML page MUST include both path_en and path_es metadata
  // This enables the Chat component and Explorer to navigate between language versions
  const pathEn = $('meta[name="path_en"]').attr('content')?.trim() || '';
  const pathEs = $('meta[name="path_es"]').attr('content')?.trim() || '';

  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';

  // Extract H1
  const h1 = $('h1').first().text().trim();

  // Extract SEO_INTENT block
  const seoIntent = extractSeoIntent(html);

  // Extract hreflang links
  const hreflangLinks = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    hreflangLinks.push({
      hreflang: $(el).attr('hreflang'),
      href: $(el).attr('href'),
    });
  });

  // Find alternate language link
  const alternateLang = language === 'en' ? 'es' : 'en';
  const alternatePath = language === 'en' ? pathEs : pathEn;
  const alternateHreflang = hreflangLinks.find(link => link.hreflang === alternateLang);

  // Get relative file path for display
  const relPath = relative(PUBLIC_DIR, filePath);

  // Validation
  const titleValid = validateTitle(title, relPath);
  const descValid = validateMetaDescription(metaDescription, relPath);

  if (!h1) {
    console.error(`❌ ERROR [${relPath}]: Missing <h1> tag`);
    errorCount++;
  }

  // RULE: Every page MUST have both path_en and path_es metadata (LOCALIZATION_FIRST.md)
  if (!pathEn) {
    console.error(`❌ ERROR [${relPath}]: Missing <meta name="path_en" content="..."> tag`);
    console.error(`   Required: Add bilingual path metadata in <head>`);
    errorCount++;
  }

  if (!pathEs) {
    console.error(`❌ ERROR [${relPath}]: Missing <meta name="path_es" content="..."> tag`);
    console.error(`   Required: Add bilingual path metadata in <head>`);
    errorCount++;
  }

  // Validate path format
  if (pathEn && !pathEn.startsWith('/')) {
    console.error(`❌ ERROR [${relPath}]: path_en must start with "/" (got: "${pathEn}")`);
    errorCount++;
  }

  if (pathEs && !pathEs.startsWith('/es/')) {
    console.error(`❌ ERROR [${relPath}]: path_es must start with "/es/" (got: "${pathEs}")`);
    errorCount++;
  }

  // Cross-validate: EN pages should have path_en matching file, ES pages should have path_es matching
  const expectedPath = '/' + relPath.replace(/\\/g, '/');
  if (language === 'en' && pathEn && pathEn !== expectedPath) {
    console.warn(`⚠️  WARNING [${relPath}]: path_en mismatch`);
    console.warn(`   Expected: "${expectedPath}"`);
    console.warn(`   Got:      "${pathEn}"`);
    warningCount++;
  }

  if (language === 'es') {
    const expectedEsPath = '/' + relPath.replace(/\\/g, '/');
    if (pathEs && pathEs !== expectedEsPath) {
      console.warn(`⚠️  WARNING [${relPath}]: path_es mismatch`);
      console.warn(`   Expected: "${expectedEsPath}"`);
      console.warn(`   Got:      "${pathEs}"`);
      warningCount++;
    }
  }

  // RULE: Every page MUST have lang attribute (LOCALIZATION_FIRST.md)
  if (!language) {
    console.error(`❌ ERROR [${relPath}]: Missing lang attribute on <html> tag`);
    console.error(`   Required: <html lang="en"> or <html lang="es">`);
    errorCount++;
  } else if (language !== 'en' && language !== 'es') {
    console.warn(`⚠️  WARNING [${relPath}]: Unexpected lang value "${language}" (expected "en" or "es")`);
    warningCount++;
  }

  if (!seoIntent) {
    console.warn(`⚠️  WARNING [${relPath}]: Missing SEO_INTENT comment block`);
    warningCount++;
  }

  // RULE: Every page MUST have hreflang links (LOCALIZATION_FIRST.md)
  if (hreflangLinks.length === 0) {
    console.error(`❌ ERROR [${relPath}]: No hreflang links found`);
    console.error(`   Required: Bidirectional hreflang links for en, es, and x-default`);
    errorCount++;
  } else {
    // Validate hreflang links structure
    const hreflangLangs = hreflangLinks.map(link => link.hreflang);
    const hasEn = hreflangLangs.includes('en');
    const hasEs = hreflangLangs.includes('es');
    const hasXDefault = hreflangLangs.includes('x-default');

    // Self-referential: must include link to self
    if (language === 'en' && !hasEn) {
      console.error(`❌ ERROR [${relPath}]: Missing self-referential hreflang="en" link`);
      errorCount++;
    }
    if (language === 'es' && !hasEs) {
      console.error(`❌ ERROR [${relPath}]: Missing self-referential hreflang="es" link`);
      errorCount++;
    }

    // Bidirectional: must have link to alternate language
    if (language === 'en' && !hasEs) {
      console.error(`❌ ERROR [${relPath}]: Missing hreflang="es" link to Spanish version`);
      errorCount++;
    }
    if (language === 'es' && !hasEn) {
      console.error(`❌ ERROR [${relPath}]: Missing hreflang="en" link to English version`);
      errorCount++;
    }

    // x-default: should be present
    if (!hasXDefault) {
      console.warn(`⚠️  WARNING [${relPath}]: Missing hreflang="x-default" link`);
      console.warn(`   Recommended: Add x-default pointing to primary language version`);
      warningCount++;
    }

    // Validate URLs are absolute
    for (const link of hreflangLinks) {
      if (!link.href.startsWith('http://') && !link.href.startsWith('https://')) {
        console.error(`❌ ERROR [${relPath}]: hreflang="${link.hreflang}" has relative URL`);
        console.error(`   Got: "${link.href}"`);
        console.error(`   Required: Absolute URLs (https://...)`);
        errorCount++;
      }
    }
  }

  // Build JSON object
  const jsonData = {
    language,
    path_en: pathEn,
    path_es: pathEs,
    alternateLanguage: alternateHreflang ? {
      lang: alternateLang,
      url: alternateHreflang.href,
      // We'll need to read the alternate file to get its title
      // For now, leave as placeholder
      title: `[${alternateLang.toUpperCase()} version]`,
    } : null,
    title,
    description: metaDescription,
    h1,
    canonical,
    hreflangLinks,
    seoIntent: seoIntent || null,
    generatedAt: new Date().toISOString(),
  };

  return jsonData;
}

/**
 * Write JSON file
 */
function writeJsonFile(filePath, jsonData) {
  const jsonPath = filePath.replace('.html', '.json');
  const jsonContent = JSON.stringify(jsonData, null, 2);

  writeFileSync(jsonPath, jsonContent, 'utf-8');

  const relPath = relative(PUBLIC_DIR, jsonPath);
  console.log(`✅ Generated: ${relPath}`);
  successCount++;
}

/**
 * Process all HTML files in directory
 */
async function processDirectory() {
  console.log('🔍 Scanning for HTML files in /public/...\n');

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

  // Process each file
  for (const filePath of htmlFiles) {
    try {
      const jsonData = parseHtmlFile(filePath);
      writeJsonFile(filePath, jsonData);
    } catch (error) {
      const relPath = relative(PUBLIC_DIR, filePath);
      console.error(`❌ ERROR [${relPath}]: ${error.message}`);
      errorCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount} JSON file(s) generated`);
  console.log(`⚠️  Warnings: ${warningCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    console.log('\n❌ Generation completed with errors');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n⚠️  Generation completed with warnings');
  } else {
    console.log('\n✅ All validations passed!');
  }
}

// Run
processDirectory().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
