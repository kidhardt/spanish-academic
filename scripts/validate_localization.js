#!/usr/bin/env node

/**
 * Validate Localization Script
 *
 * Enforces bilingual parity between / and /es/ directory structures
 * Validates path_en/path_es metadata, hreflang bidirectionality, and structured data
 *
 * Usage: npm run validate-localization
 *
 * Spanish Academic 2026
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');
const STRUCTURED_DATA_DIR = join(PROJECT_ROOT, 'src', 'data', 'structured');

// Track validation results
let pagesProcessed = 0;
let errorCount = 0;
let warningCount = 0;

/**
 * Parse HTML file and extract localization metadata
 */
function parseHtmlFile(filePath) {
  try {
    const html = readFileSync(filePath, 'utf-8');
    const $ = load(html);

    const language = $('html').attr('lang') || null;
    const pathEn = $('meta[name="path_en"]').attr('content')?.trim() || null;
    const pathEs = $('meta[name="path_es"]').attr('content')?.trim() || null;

    // Localization parity metadata
    const parityStr = $('meta[name="localization_parity"]').attr('content')?.trim();
    const parity = parityStr === 'false' ? false : true; // Default to true
    const parityReason = $('meta[name="parity_reason"]').attr('content')?.trim() || null;
    const pageLanguage = $('meta[name="page_language"]').attr('content')?.trim() || null;

    // Extract hreflang links
    const hreflangLinks = [];
    $('link[rel="alternate"][hreflang]').each((_, el) => {
      hreflangLinks.push({
        hreflang: $(el).attr('hreflang'),
        href: $(el).attr('href'),
      });
    });

    // Check for language switcher in nav
    const hasLanguageSwitcher = $('nav a[hreflang]').length > 0;

    pagesProcessed++;

    return {
      language,
      pathEn,
      pathEs,
      parity,
      parityReason,
      pageLanguage,
      hreflangLinks,
      hasLanguageSwitcher,
    };
  } catch (error) {
    console.error(`❌ Error parsing ${relative(PUBLIC_DIR, filePath)}: ${error.message}`);
    errorCount++;
    return null;
  }
}

/**
 * Validate a single HTML file
 */
function validateHtmlFile(filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const metadata = parseHtmlFile(filePath);

  if (!metadata) {
    return;
  }

  const errors = [];
  const warnings = [];

  // Check if page is NON-PARITY (single language only)
  if (metadata.parity === false) {
    // NON-PARITY validation
    console.log(`\nℹ️  ${relPath} - NON-PARITY (${metadata.parityReason || 'reason not specified'})`);

    if (!metadata.parityReason) {
      warnings.push('NON-PARITY page missing parity_reason metadata');
    }

    if (!metadata.pageLanguage) {
      warnings.push('NON-PARITY page missing page_language metadata');
    }

    if (!metadata.language) {
      errors.push('Missing lang attribute on <html> tag');
    }

    // Skip bilingual checks for NON-PARITY pages
    if (warnings.length > 0) {
      console.warn(`⚠️  ${relPath}`);
      warnings.forEach(warn => console.warn(`   • ${warn}`));
      warningCount += warnings.length;
    }

    return {
      filePath,
      relPath,
      metadata,
      errors,
      warnings,
    };
  }

  // PARITY validation (default behavior - bilingual required)

  // Check for lang attribute
  if (!metadata.language) {
    errors.push('Missing lang attribute on <html> tag');
  }

  // Check for path_en and path_es metadata
  if (!metadata.pathEn || !metadata.pathEs) {
    errors.push('Missing path_en or path_es metadata');
  }

  // Check hreflang links
  if (metadata.hreflangLinks.length === 0) {
    warnings.push('No hreflang links found');
  } else {
    // Verify self-referential hreflang
    const selfLang = metadata.language;
    const hasSelfReference = metadata.hreflangLinks.some(
      link => link.hreflang === selfLang
    );
    if (!hasSelfReference) {
      warnings.push(`Missing self-referential hreflang for lang="${selfLang}"`);
    }

    // Verify alternate language link
    const alternateLang = selfLang === 'en' ? 'es' : 'en';
    const hasAlternate = metadata.hreflangLinks.some(
      link => link.hreflang === alternateLang
    );
    if (!hasAlternate) {
      errors.push(`Missing hreflang link for alternate language "${alternateLang}"`);
    }

    // Verify x-default exists
    const hasXDefault = metadata.hreflangLinks.some(
      link => link.hreflang === 'x-default'
    );
    if (!hasXDefault) {
      warnings.push('Missing hreflang x-default link');
    }
  }

  // Check for language switcher
  if (!metadata.hasLanguageSwitcher) {
    warnings.push('No language switcher found in navigation');
  }

  // Check if alternate language file exists
  const alternatePath = metadata.language === 'en' ? metadata.pathEs : metadata.pathEn;
  if (alternatePath) {
    const alternateFilePath = join(PUBLIC_DIR, alternatePath.replace(/^\//, ''));
    if (!existsSync(alternateFilePath)) {
      errors.push(`Alternate language file does not exist: ${alternatePath}`);
    }
  }

  // Report errors and warnings
  if (errors.length > 0) {
    console.error(`\n❌ ${relPath}`);
    errors.forEach(err => console.error(`   • ${err}`));
    errorCount += errors.length;
  }

  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${relPath}`);
    warnings.forEach(warn => console.warn(`   • ${warn}`));
    warningCount += warnings.length;
  }

  return {
    filePath,
    relPath,
    metadata,
    errors,
    warnings,
  };
}

/**
 * Check for orphaned files (English page without Spanish counterpart or vice versa)
 * Skips NON-PARITY pages (single language allowed)
 */
function checkForOrphans(enFiles, esFiles, allResults) {
  const orphans = [];

  // Get set of NON-PARITY paths to skip
  const nonParityPaths = new Set(
    allResults
      .filter(r => r.metadata.parity === false)
      .map(r => r.relPath)
  );

  // Build sets of relative paths (without language prefix)
  const enPaths = new Set(
    enFiles.map(f => relative(join(PUBLIC_DIR), f))
  );

  const esPaths = new Set(
    esFiles
      .map(f => relative(join(PUBLIC_DIR, 'es'), f))
  );

  // Check for English pages without Spanish counterpart
  enPaths.forEach(enPath => {
    if (enPath.startsWith('es/') || enPath.startsWith('es\\')) {
      return; // Skip Spanish files in the English set
    }

    // Skip NON-PARITY pages
    if (nonParityPaths.has(enPath)) {
      return;
    }

    if (!esPaths.has(enPath)) {
      orphans.push({
        type: 'missing_spanish',
        path: enPath,
      });
    }
  });

  // Check for Spanish pages without English counterpart
  esPaths.forEach(esPath => {
    // Skip NON-PARITY pages
    const esRelPath = join('es', esPath);
    if (nonParityPaths.has(esRelPath) || nonParityPaths.has('es/' + esPath) || nonParityPaths.has('es\\' + esPath)) {
      return;
    }

    if (!enPaths.has(esPath)) {
      orphans.push({
        type: 'missing_english',
        path: esPath,
      });
    }
  });

  return orphans;
}

/**
 * Validate structured data files for bilingual fields
 */
function validateStructuredData() {
  if (!existsSync(STRUCTURED_DATA_DIR)) {
    console.log('\n⚠️  Structured data directory does not exist yet. Skipping structured data validation.');
    return;
  }

  console.log('\n📁 Validating Structured Data Files...\n');

  // This is a placeholder - structured data validation will be implemented
  // when we create TypeScript interfaces and data files
  console.log('   ℹ️  Structured data validation will be implemented in Phase 4');
}

/**
 * Main execution
 */
async function main() {
  console.log('🌐 Validating Localization\n');
  console.log('='.repeat(60));

  // Find all HTML files
  const allFiles = await glob('**/*.html', {
    cwd: PUBLIC_DIR,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  if (allFiles.length === 0) {
    console.log('⚠️  No HTML files found in /public/');
    return;
  }

  // Separate English and Spanish files
  const enFiles = allFiles.filter(f => !relative(PUBLIC_DIR, f).startsWith('es/') && !relative(PUBLIC_DIR, f).startsWith('es\\'));
  const esFiles = allFiles.filter(f => relative(PUBLIC_DIR, f).startsWith('es/') || relative(PUBLIC_DIR, f).startsWith('es\\'));

  console.log(`Found ${allFiles.length} HTML file(s)`);
  console.log(`  • English: ${enFiles.length} file(s)`);
  console.log(`  • Spanish: ${esFiles.length} file(s)\n`);

  console.log('Validating pages...\n');

  // Validate each file
  const results = [];
  for (const filePath of allFiles) {
    const result = validateHtmlFile(filePath);
    if (result) {
      results.push(result);
    }
  }

  // Check for orphaned files
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Checking for Orphaned Files\n');

  const orphans = checkForOrphans(enFiles, esFiles, results);

  if (orphans.length > 0) {
    orphans.forEach(orphan => {
      if (orphan.type === 'missing_spanish') {
        console.warn(`⚠️  English page without Spanish counterpart: ${orphan.path}`);
        warningCount++;
      } else {
        console.warn(`⚠️  Spanish page without English counterpart: ${orphan.path}`);
        warningCount++;
      }
    });
  } else {
    console.log('✅ No orphaned files found');
  }

  // Validate structured data
  validateStructuredData();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Pages processed: ${pagesProcessed}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⚠️  Warnings: ${warningCount}`);

  if (errorCount > 0) {
    console.log('\n❌ Validation failed - please fix errors before deployment');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n⚠️  Validation completed with warnings');
    console.log('💡 Address warnings to improve localization quality');
  } else {
    console.log('\n✅ All localization checks passed!');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
