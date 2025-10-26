#!/usr/bin/env node

/**
 * Fetch Insights Articles - Flagship Content Migration
 *
 * Fetches 2 flagship articles from spanishacademic.com using Crawlee
 * Saves raw HTML and creates snapshots with metadata
 *
 * Spanish Academic 2026 - Insights Content Migration
 */

import { HttpCrawler } from 'crawlee';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { saveSnapshot } from '../../src/utils/snapshotManager.js';

// The 2 flagship articles to migrate
const INSIGHTS_URLS = [
  'https://spanishacademic.com/how-to-choose-a-graduate-program-in-spanish',
  'https://spanishacademic.com/graduate-program-rankings-for-spanish-hispanic-literature-linguistics',
];

interface FetchResult {
  url: string;
  statusCode: number;
  contentLength: number;
  snapshotPath: string;
  rawHtmlPath: string;
}

const results: FetchResult[] = [];

console.log('🌐 Fetching Insights Articles from spanishacademic.com\n');
console.log('='.repeat(80));

// Ensure raw-insights directory exists
const rawInsightsDir = join(
  process.cwd(),
  'docs',
  'content-migration',
  'raw-insights'
);
mkdirSync(rawInsightsDir, { recursive: true });

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

    // Save raw HTML to docs/content-migration/raw-insights/
    const rawHtmlPath = join(rawInsightsDir, `${filename}.html`);
    writeFileSync(rawHtmlPath, content, 'utf-8');
    console.log(`   ✅ Raw HTML: ${rawHtmlPath}`);

    // Create snapshot with metadata (uses insights-specific snapshot dir)
    const snapshotPath = saveSnapshot(url, content, statusCode, 'insights');
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
await crawler.run(INSIGHTS_URLS);

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
console.log(`Total fetched: ${results.length}/${INSIGHTS_URLS.length}`);

const successCount = results.filter((r) => r.statusCode === 200).length;
if (successCount === INSIGHTS_URLS.length) {
  console.log('✅ All URLs fetched successfully!');
} else {
  console.log(`⚠️  ${INSIGHTS_URLS.length - successCount} URL(s) failed`);
  process.exit(1);
}
