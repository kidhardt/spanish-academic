#!/usr/bin/env node

/**
 * Fetch Program Lists - Phase 2a
 *
 * Fetches 5 program list pages from spanishacademic.com using Crawlee
 * Saves raw HTML and creates snapshots with metadata
 *
 * Spanish Academic 2026 - Content Migration
 */

import { HttpCrawler } from 'crawlee';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { saveSnapshot } from '../../src/utils/snapshotManager.js';

// The 5 URLs to migrate
const PROGRAM_LIST_URLS = [
  'https://spanishacademic.com/translation-and-interpreting',
  'https://spanishacademic.com/spanish-literature',
  'https://spanishacademic.com/spanish-linguistics',
  'https://spanishacademic.com/spanish-translation-interpretation',
  'https://spanishacademic.com/online-spanish-linguistics-masters-and-phd',
];

interface FetchResult {
  url: string;
  statusCode: number;
  contentLength: number;
  snapshotPath: string;
  rawHtmlPath: string;
}

const results: FetchResult[] = [];

console.log('🌐 Fetching Program Lists from spanishacademic.com\n');
console.log('='.repeat(80));

const crawler = new HttpCrawler({
  maxRequestsPerMinute: 30, // Respectful rate limiting
  requestHandlerTimeoutSecs: 30,

  async requestHandler({ request, body, response }) {
    const url = request.url;
    const statusCode = response?.statusCode || 0;
    const content = body.toString();

    console.log(`\n📄 Fetching: ${url}`);
    console.log(`   Status: ${statusCode}`);
    console.log(`   Size: ${content.length} characters`);

    // Generate filename from URL path
    const urlObj = new URL(url);
    const filename = urlObj.pathname
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase() || 'homepage';

    // Save raw HTML to docs/content-migration/raw-lists/
    const rawHtmlPath = join(
      process.cwd(),
      'docs',
      'content-migration',
      'raw-lists',
      `${filename}.html`
    );
    writeFileSync(rawHtmlPath, content, 'utf-8');
    console.log(`   ✅ Raw HTML: ${rawHtmlPath}`);

    // Create snapshot with metadata
    const snapshotPath = saveSnapshot(url, content, statusCode);
    console.log(`   ✅ Snapshot: ${snapshotPath}`);

    // Track result
    results.push({
      url,
      statusCode,
      contentLength: content.length,
      snapshotPath,
      rawHtmlPath,
    });
  },

  failedRequestHandler({ request, error }) {
    console.error(`\n❌ Failed to fetch ${request.url}: ${error.message}`);
    results.push({
      url: request.url,
      statusCode: 0,
      contentLength: 0,
      snapshotPath: 'FAILED',
      rawHtmlPath: 'FAILED',
    });
  },
});

// Run the crawler
await crawler.run(PROGRAM_LIST_URLS);

// Summary report
console.log('\n' + '='.repeat(80));
console.log('📊 FETCH SUMMARY');
console.log('='.repeat(80));

results.forEach((result) => {
  const status = result.statusCode === 200 ? '✅' : '❌';
  console.log(`${status} ${result.url}`);
  console.log(`   HTTP ${result.statusCode} | ${result.contentLength} chars`);
});

console.log('\n' + '='.repeat(80));
console.log(`Total fetched: ${results.length}/${PROGRAM_LIST_URLS.length}`);

const successCount = results.filter((r) => r.statusCode === 200).length;
if (successCount === PROGRAM_LIST_URLS.length) {
  console.log('✅ All URLs fetched successfully!');
} else {
  console.log(`⚠️  ${PROGRAM_LIST_URLS.length - successCount} URL(s) failed`);
  process.exit(1);
}
