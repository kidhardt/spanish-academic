#!/usr/bin/env node

/**
 * Accessibility Scan Script
 *
 * Validates WCAG AA compliance for all HTML pages
 * Checks heading hierarchy, alt text, semantic HTML, link text, and more
 *
 * Usage: npm run accessibility-scan
 *
 * Spanish Academic 2026
 */

import { readFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');

// Vague link text patterns to flag
const VAGUE_LINK_PATTERNS = [
  /^click here$/i,
  /^here$/i,
  /^read more$/i,
  /^more$/i,
  /^link$/i,
  /^this$/i,
  /^continue$/i,
  /^download$/i,
  /^view$/i,
  /^see$/i,
  /^http:\/\//i,
  /^https:\/\//i,
  /^www\./i,
];

// Track statistics
let pagesProcessed = 0;
let errorCount = 0;
let warningCount = 0;

/**
 * Validate heading hierarchy
 */
function validateHeadingHierarchy($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  // Get all headings
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const level = parseInt($(el).prop('tagName').substring(1));
    const text = $(el).text().trim();
    headings.push({ level, text, tag: $(el).prop('tagName') });
  });

  // Check for H1
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    errors.push('Missing <h1> tag');
  } else if (h1Count > 1) {
    errors.push(`Multiple <h1> tags found (${h1Count}). Should have exactly one.`);
  }

  // Check hierarchy (no skipping levels)
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const current = headings[i];

    if (current.level > prev.level + 1) {
      errors.push(
        `Heading hierarchy skip: ${prev.tag} → ${current.tag} (should not skip levels)`
      );
    }
  }

  return { errors, warnings };
}

/**
 * Validate images have alt text
 */
function validateImages($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  $('img').each((_, el) => {
    const src = $(el).attr('src') || '[no src]';
    const alt = $(el).attr('alt');

    // Alt attribute must exist (can be empty for decorative images)
    if (alt === undefined) {
      errors.push(`Image missing alt attribute: ${src}`);
    } else if (alt.trim() === '' && !$(el).attr('role') && !$(el).attr('aria-label')) {
      // Empty alt is OK for decorative images, but flag for review
      warnings.push(`Image has empty alt (ensure it's decorative): ${src}`);
    }
  });

  return { errors, warnings };
}

/**
 * Validate link text is descriptive
 */
function validateLinks($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');

    // Skip if aria-label provides context
    if (ariaLabel && ariaLabel.trim().length > 0) {
      return;
    }

    // Check for vague link text
    const isVague = VAGUE_LINK_PATTERNS.some(pattern => pattern.test(text));
    if (isVague) {
      warnings.push(`Vague link text: "${text}" (href: ${href})`);
    }

    // Check for empty links
    if (!text && !ariaLabel) {
      errors.push(`Empty link without aria-label (href: ${href})`);
    }

    // Check for bare URLs as link text
    if (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('www.')) {
      warnings.push(`Link text is a URL: "${text}" (use descriptive text instead)`);
    }
  });

  return { errors, warnings };
}

/**
 * Validate semantic HTML structure
 */
function validateSemanticHtml($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  // Check for main landmark
  if ($('main').length === 0) {
    errors.push('Missing <main> landmark');
  } else if ($('main').length > 1) {
    errors.push('Multiple <main> landmarks (should have exactly one)');
  }

  // Check for header
  if ($('header').length === 0) {
    warnings.push('Missing <header> element');
  }

  // Check for footer
  if ($('footer').length === 0) {
    warnings.push('Missing <footer> element');
  }

  // Check for nav
  if ($('nav').length === 0) {
    warnings.push('Missing <nav> element (recommended for navigation)');
  }

  return { errors, warnings };
}

/**
 * Validate lang attribute
 */
function validateLangAttribute($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  const lang = $('html').attr('lang');
  if (!lang) {
    errors.push('Missing lang attribute on <html> tag');
  } else if (lang !== 'en' && lang !== 'es') {
    warnings.push(`Unexpected lang value: "${lang}" (expected "en" or "es")`);
  }

  return { errors, warnings };
}

/**
 * Validate form inputs have labels
 */
function validateForms($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  $('input, select, textarea').each((_, el) => {
    const type = $(el).attr('type');
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');

    // Skip hidden inputs and buttons
    if (type === 'hidden' || type === 'submit' || type === 'button') {
      return;
    }

    // Check for associated label
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    const hasAriaLabel = ariaLabel || ariaLabelledBy;

    if (!hasLabel && !hasAriaLabel) {
      errors.push(`Form input without label or aria-label (type: ${type || 'text'})`);
    }
  });

  return { errors, warnings };
}

/**
 * Check for skip navigation link
 */
function validateSkipLink($, filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);
  const errors = [];
  const warnings = [];

  // Look for skip link (usually first focusable element)
  const firstLink = $('a').first();
  const skipLinkPatterns = [/skip to content/i, /skip to main/i, /skip navigation/i];

  const hasSkipLink = skipLinkPatterns.some(pattern =>
    pattern.test(firstLink.text())
  );

  if (!hasSkipLink) {
    warnings.push('No "skip to content" link found (recommended for keyboard navigation)');
  }

  return { errors, warnings };
}

/**
 * Validate a single HTML file
 */
function validateHtmlFile(filePath) {
  const relPath = relative(PUBLIC_DIR, filePath);

  try {
    const html = readFileSync(filePath, 'utf-8');
    const $ = load(html);

    const allErrors = [];
    const allWarnings = [];

    // Run all validations
    const validations = [
      validateHeadingHierarchy($, filePath),
      validateImages($, filePath),
      validateLinks($, filePath),
      validateSemanticHtml($, filePath),
      validateLangAttribute($, filePath),
      validateForms($, filePath),
      validateSkipLink($, filePath),
    ];

    // Collect all errors and warnings
    validations.forEach(({ errors, warnings }) => {
      allErrors.push(...errors);
      allWarnings.push(...warnings);
    });

    pagesProcessed++;

    // Report errors
    if (allErrors.length > 0) {
      console.error(`\n❌ ${relPath}`);
      allErrors.forEach(err => console.error(`   • ${err}`));
      errorCount += allErrors.length;
    }

    // Report warnings
    if (allWarnings.length > 0) {
      console.warn(`\n⚠️  ${relPath}`);
      allWarnings.forEach(warn => console.warn(`   • ${warn}`));
      warningCount += allWarnings.length;
    }

    return {
      filePath,
      relPath,
      errors: allErrors,
      warnings: allWarnings,
    };
  } catch (error) {
    console.error(`\n❌ Error parsing ${relPath}: ${error.message}`);
    errorCount++;
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('♿ Accessibility Scan (WCAG AA)\n');
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
  console.log('Validating accessibility...\n');

  // Validate each file
  const results = [];
  for (const filePath of htmlFiles) {
    const result = validateHtmlFile(filePath);
    if (result) {
      results.push(result);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Pages scanned: ${pagesProcessed}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⚠️  Warnings: ${warningCount}`);

  // Categorize pages
  const passedPages = results.filter(r => r.errors.length === 0 && r.warnings.length === 0);
  const warningPages = results.filter(r => r.errors.length === 0 && r.warnings.length > 0);
  const errorPages = results.filter(r => r.errors.length > 0);

  console.log(`\n✅ Passed: ${passedPages.length} page(s)`);
  console.log(`⚠️  Warnings only: ${warningPages.length} page(s)`);
  console.log(`❌ Errors: ${errorPages.length} page(s)`);

  if (errorCount > 0) {
    console.log('\n❌ Accessibility validation failed');
    console.log('💡 Fix errors before deployment to ensure WCAG AA compliance');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n⚠️  Accessibility validation passed with warnings');
    console.log('💡 Address warnings to improve accessibility');
  } else {
    console.log('\n✅ All accessibility checks passed!');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
