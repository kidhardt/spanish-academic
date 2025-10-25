#!/usr/bin/env node

/**
 * Extract Program Lists - Phase 2b Helper
 *
 * Extracts clean program lists from raw HTML files using Cheerio
 * Preserves EXACT HTML structure and wording (RULE 1 compliance)
 *
 * Spanish Academic 2026 - Content Migration
 */

import { load } from 'cheerio';
import { readFileSync } from 'fs';
import { join } from 'path';

const RAW_LISTS_DIR = join(process.cwd(), 'docs', 'content-migration', 'raw-lists');

interface ProgramListData {
  filename: string;
  title: string;
  listHtml: string;
  programCount: number;
}

function extractProgramList(htmlFilename: string): ProgramListData {
  const filePath = join(RAW_LISTS_DIR, htmlFilename);
  const html = readFileSync(filePath, 'utf-8');
  const $ = load(html);

  // Extract page title
  const title = $('h1.entry-title').text().trim() || $('title').text().trim();

  // Find the main content article
  const article = $('article .entry-content');

  // Extract all paragraphs containing program information
  // Programs are structured as: <p><strong>University</strong><br/>Location<br/><a>Program</a></p>
  const programParagraphs = article.find('p').filter((_,  el) => {
    const html = $(el).html() || '';
    // Must contain a link and a university name (strong tag)
    return html.includes('<strong>') && html.includes('<a href');
  });

  let listHtml = '';
  let programCount = 0;

  // Preserve the EXACT HTML structure (RULE 1)
  programParagraphs.each((_, p) => {
    const paragraphHtml = $.html(p);
    listHtml += paragraphHtml + '\n\n';
    programCount += $(p).find('a').length;
  });

  return {
    filename: htmlFilename,
    title,
    listHtml: listHtml.trim(),
    programCount,
  };
}

// Export for use in page generation
export { extractProgramList, type ProgramListData };

// CLI usage - always run for testing
const files = [
  'spanish-linguistics.html',
  'translation-and-interpreting.html',
  'spanish-literature.html',
  'online-spanish-linguistics-masters-and-phd.html',
];

console.log('📋 Extracting Program Lists\n');
console.log('='.repeat(80));

files.forEach((file) => {
  try {
    const data = extractProgramList(file);
    console.log(`\n${file}:`);
    console.log(`  Title: ${data.title}`);
    console.log(`  Programs: ${data.programCount}`);
    console.log(`  HTML length: ${data.listHtml.length} characters`);
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\n' + '='.repeat(80));
