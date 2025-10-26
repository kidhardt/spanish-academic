/**
 * Fetch Scholarship Articles from spanishacademic.com
 *
 * This script uses Crawlee to fetch 11 highly-cited Spanish scholarly articles
 * about Hispanic literature. These articles are designated as NON-PARITY
 * (single language - Spanish only) due to citation preservation requirements.
 *
 * Zero-rewrite policy: Content is preserved exactly as published.
 *
 * Usage:
 *   npx tsx scripts/crawlee/fetchScholarshipArticles.ts
 */

import { HttpCrawler } from 'crawlee';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { saveSnapshot } from '../../src/utils/snapshotManager.js';

// Scholarship article URLs from spanishacademic.com
const SCHOLARSHIP_URLS = [
  'https://spanishacademic.com/literatura/1492',
  'https://spanishacademic.com/literatura/lezama-lima-and-su-interpretacion-de-la-americanidad',
  'https://spanishacademic.com/literatura/limpia-fija-y-da-esplendor-la-real-academia-espanola-su-diccionario-y-la-responsabilidad-compartida',
  'https://spanishacademic.com/literatura/utopia-ideologia-y-mito-en-godos-insurgentes-y-visionarios',
  'https://spanishacademic.com/literatura/ruben-dario-en-la-literatura-hispanoamericana',
  'https://spanishacademic.com/literatura/mariano-picon-salas-perspectivismo-historico-en-de-la-conquista-a-la-independencia',
  'https://spanishacademic.com/literatura/leopoldo-alas-clarin-una-aproximacion-a-su-pensamiento-filosofico-juridico',
  'https://spanishacademic.com/literatura/en-torno-al-pensamiento-filosofico-juridico-de-leopoldo-alas-clarin-en-adios-cordera',
  'https://spanishacademic.com/literatura/en-torno-a-la-tradicion-picaresca-lazarillo-de-tormes-y-periquillo-sarniento',
  'https://spanishacademic.com/literatura/domingo-faustino-sarmiento-un-sociologo-romantico',
  'https://spanishacademic.com/literatura/ariel-cien-anos-despues',
];

// Ensure raw HTML directory exists
const RAW_DIR = join(process.cwd(), 'docs', 'content-migration', 'raw-scholarship');
if (!existsSync(RAW_DIR)) {
  mkdirSync(RAW_DIR, { recursive: true });
}

console.log('\n' + '='.repeat(80));
console.log('FETCHING SCHOLARSHIP ARTICLES');
console.log('='.repeat(80) + '\n');
console.log(`Total articles to fetch: ${SCHOLARSHIP_URLS.length}`);
console.log(`Output directory: ${RAW_DIR}`);
console.log(`Zero-rewrite policy: ENFORCED\n`);

let fetchedCount = 0;
let totalBytes = 0;

const crawler = new HttpCrawler({
  maxRequestsPerMinute: 30, // Respectful rate limiting
  async requestHandler({ request, body, response }) {
    const url = request.url;
    const statusCode = response.statusCode || 0;

    console.log(`\n📄 Fetching: ${url}`);
    console.log(`   Status: ${statusCode}`);

    // Extract slug from URL
    const slug = url.split('/').pop() || 'unknown';

    // Get raw HTML content
    const content = body.toString();
    const sizeKB = (content.length / 1024).toFixed(2);

    console.log(`   Size: ${sizeKB} KB`);
    console.log(`   Characters: ${content.length.toLocaleString()}`);

    // Save raw HTML for legal protection and evidence
    const rawHtmlPath = join(RAW_DIR, `${slug}.html`);
    writeFileSync(rawHtmlPath, content, 'utf-8');
    console.log(`   ✅ Saved raw HTML: ${rawHtmlPath}`);

    // Create timestamped snapshot for audit trail
    const snapshotPath = saveSnapshot(url, content, statusCode, 'scholarship');
    console.log(`   ✅ Created snapshot: ${snapshotPath}`);

    fetchedCount++;
    totalBytes += content.length;

    console.log(`   Progress: ${fetchedCount}/${SCHOLARSHIP_URLS.length} articles fetched`);
  },
  failedRequestHandler({ request }, error) {
    console.error(`\n❌ Failed to fetch: ${request.url}`);
    console.error(`   Error: ${error.message}`);
  },
});

// Run crawler
console.log('🚀 Starting Crawlee HttpCrawler...\n');

await crawler.run(SCHOLARSHIP_URLS);

// Summary
console.log('\n' + '='.repeat(80));
console.log('FETCH COMPLETE');
console.log('='.repeat(80) + '\n');
console.log(`✅ Articles fetched: ${fetchedCount}/${SCHOLARSHIP_URLS.length}`);
console.log(`📊 Total size: ${(totalBytes / 1024).toFixed(2)} KB`);
console.log(`📂 Raw HTML location: ${RAW_DIR}`);
console.log(`📸 Snapshots location: data/snapshots/migration-scholarship-[date]/\n`);

if (fetchedCount === SCHOLARSHIP_URLS.length) {
  console.log('🎉 All scholarship articles fetched successfully!');
  console.log('\n📝 Next step: npm run crawlee:generate-scholarship\n');
} else {
  console.log(`⚠️  Warning: ${SCHOLARSHIP_URLS.length - fetchedCount} articles failed to fetch`);
  console.log('   Review errors above and retry failed articles\n');
}
