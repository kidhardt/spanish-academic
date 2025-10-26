/**
 * Snapshot Manager - Basic utility for saving content snapshots
 *
 * Simple function to preserve fetched content with metadata for legal protection
 * and future drift detection.
 *
 * Spanish Academic 2026 - Phase 1 Foundation
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Save a content snapshot with metadata header
 *
 * @param url - Source URL of the content
 * @param content - The fetched HTML/text content
 * @param statusCode - HTTP status code from the fetch
 * @param category - Optional category for organizing snapshots (e.g., 'insights', 'programs')
 * @returns Path to the saved snapshot file
 */
export function saveSnapshot(
  url: string,
  content: string,
  statusCode: number,
  category?: string
): string {
  // Generate timestamp in ISO format
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0]; // YYYY-MM-DD

  // Create snapshot directory for this date (with optional category)
  const dirName = category ? `migration-${category}-${date}` : `migration-${date}`;
  const snapshotDir = join(process.cwd(), 'data', 'snapshots', dirName);
  mkdirSync(snapshotDir, { recursive: true });

  // Generate filename from URL (sanitize for filesystem)
  const urlObj = new URL(url);
  const filename = urlObj.pathname
    .replace(/^\//, '')
    .replace(/\//g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase() || 'homepage';

  const snapshotPath = join(snapshotDir, `${filename}.txt`);

  // Create metadata header
  const metadata = [
    '='.repeat(80),
    'SNAPSHOT METADATA',
    '='.repeat(80),
    `Source URL: ${url}`,
    `Fetched At: ${timestamp}`,
    `HTTP Status: ${statusCode}`,
    `Content Length: ${content.length} characters`,
    '='.repeat(80),
    '',
    ''
  ].join('\n');

  // Write snapshot with metadata
  const fullContent = metadata + content;
  writeFileSync(snapshotPath, fullContent, 'utf-8');

  return snapshotPath;
}
