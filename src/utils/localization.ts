/**
 * Localization Infrastructure
 *
 * Core utilities for bilingual (English ↔ Spanish) website architecture
 * - hreflang link generation
 * - lang attribute enforcement
 * - path_en/path_es metadata system
 * - URL path translation
 *
 * Spanish Academic 2026
 */

import { translateSlug, type LanguageCode } from './slugTranslations';

/**
 * Path metadata for bilingual pages
 * Every page should have both English and Spanish paths defined
 */
export interface PathMetadata {
  path_en: string;  // English path (relative to /, e.g., "/insights/funding-strategies.html")
  path_es: string;  // Spanish path (relative to /es/, e.g., "/es/insights/estrategias-de-financiacion.html")
}

/**
 * Localized content metadata
 */
export interface LocalizedMetadata {
  lang: LanguageCode;
  title_en: string;
  title_es: string;
  description_en?: string;
  description_es?: string;
  alternateLanguage: {
    lang: LanguageCode;
    path: string;
  };
}

/**
 * Generate hreflang link tags for bilingual pages
 *
 * Creates proper <link rel="alternate" hreflang="..."> tags for SEO
 * Includes both language versions and x-default
 *
 * @param pathMetadata - Object with path_en and path_es
 * @param baseUrl - Base URL of the site (e.g., "https://spanish-academic.com")
 * @returns Array of link tag HTML strings
 *
 * @example
 * generateHreflangLinks(
 *   { path_en: '/insights/funding.html', path_es: '/es/insights/financiacion.html' },
 *   'https://spanish-academic.com'
 * )
 * // Returns:
 * // [
 * //   '<link rel="alternate" hreflang="en" href="https://spanish-academic.com/insights/funding.html">',
 * //   '<link rel="alternate" hreflang="es" href="https://spanish-academic.com/es/insights/financiacion.html">',
 * //   '<link rel="alternate" hreflang="x-default" href="https://spanish-academic.com/insights/funding.html">'
 * // ]
 */
export function generateHreflangLinks(
  pathMetadata: PathMetadata,
  baseUrl: string = 'https://spanish-academic.com'
): string[] {
  const { path_en, path_es } = pathMetadata;

  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  return [
    `<link rel="alternate" hreflang="en" href="${cleanBaseUrl}${path_en}">`,
    `<link rel="alternate" hreflang="es" href="${cleanBaseUrl}${path_es}">`,
    `<link rel="alternate" hreflang="x-default" href="${cleanBaseUrl}${path_en}">`, // Default to English
  ];
}

/**
 * Generate hreflang links as an HTML string (for template insertion)
 *
 * @param pathMetadata - Object with path_en and path_es
 * @param baseUrl - Base URL of the site
 * @returns Single string with all hreflang links, newline-separated
 */
export function generateHreflangLinksHTML(
  pathMetadata: PathMetadata,
  baseUrl: string = 'https://spanish-academic.com'
): string {
  return generateHreflangLinks(pathMetadata, baseUrl).join('\n    ');
}

/**
 * Get the correct lang attribute for an HTML page
 *
 * Enforces proper lang attributes based on path
 * - Paths starting with /es/ → "es"
 * - All other paths → "en"
 *
 * @param path - The page path
 * @returns Language code ('en' or 'es')
 *
 * @example
 * getLangAttribute('/insights/funding.html') // Returns: 'en'
 * getLangAttribute('/es/insights/financiacion.html') // Returns: 'es'
 */
export function getLangAttribute(path: string): LanguageCode {
  // Normalize path: remove leading slash, convert to lowercase
  const normalizedPath = path.replace(/^\//, '').toLowerCase();

  // Spanish paths start with 'es/'
  if (normalizedPath.startsWith('es/')) {
    return 'es';
  }

  // Default to English
  return 'en';
}

/**
 * Translate a full file path from one language to another
 *
 * Handles directory structure and filename slug translation
 * Preserves file extension
 *
 * @param path - Original path (e.g., "/insights/funding-strategies.html")
 * @param targetLang - Target language
 * @returns Translated path
 *
 * @example
 * translatePath('/insights/funding-strategies.html', 'es')
 * // Returns: '/es/insights/estrategias-de-financiacion.html'
 *
 * @example
 * translatePath('/es/insights/estrategias-de-financiacion.html', 'en')
 * // Returns: '/insights/funding-strategies.html'
 */
export function translatePath(path: string, targetLang: LanguageCode): string {
  // Split path into parts
  let normalizedPath = path.replace(/^\//, ''); // Remove leading slash
  const isSpanishPath = normalizedPath.startsWith('es/');

  // Remove 'es/' prefix if present
  if (isSpanishPath) {
    normalizedPath = normalizedPath.replace(/^es\//, '');
  }

  // Split into directory and filename
  const lastSlashIndex = normalizedPath.lastIndexOf('/');
  const directory = lastSlashIndex >= 0 ? normalizedPath.substring(0, lastSlashIndex) : '';
  const filename = lastSlashIndex >= 0 ? normalizedPath.substring(lastSlashIndex + 1) : normalizedPath;

  // Split filename into name and extension
  const lastDotIndex = filename.lastIndexOf('.');
  const filenamePart = lastDotIndex >= 0 ? filename.substring(0, lastDotIndex) : filename;
  const extension = lastDotIndex >= 0 ? filename.substring(lastDotIndex) : '';

  // Translate directory parts
  const directoryParts = directory ? directory.split('/') : [];
  const translatedDirectoryParts = directoryParts.map(part => translateSlug(part, targetLang));
  const translatedDirectory = translatedDirectoryParts.join('/');

  // Translate filename (without extension)
  const translatedFilename = translateSlug(filenamePart, targetLang);

  // Reconstruct path
  let translatedPath = '';
  if (targetLang === 'es') {
    translatedPath = '/es/';
  } else {
    translatedPath = '/';
  }

  if (translatedDirectory) {
    translatedPath += translatedDirectory + '/';
  }

  translatedPath += translatedFilename + extension;

  return translatedPath;
}

/**
 * Create PathMetadata object from a single path
 *
 * Automatically generates the alternate language path
 *
 * @param path - Original path in either language
 * @returns PathMetadata object with both path_en and path_es
 *
 * @example
 * createPathMetadata('/insights/funding-strategies.html')
 * // Returns:
 * // {
 * //   path_en: '/insights/funding-strategies.html',
 * //   path_es: '/es/insights/estrategias-de-financiacion.html'
 * // }
 */
export function createPathMetadata(path: string): PathMetadata {
  const currentLang = getLangAttribute(path);

  if (currentLang === 'en') {
    return {
      path_en: path,
      path_es: translatePath(path, 'es'),
    };
  } else {
    return {
      path_en: translatePath(path, 'en'),
      path_es: path,
    };
  }
}

/**
 * Get the alternate language version of a path
 *
 * Convenience function to get the "other" language path
 *
 * @param path - Current path
 * @returns Path in the alternate language
 *
 * @example
 * getAlternatePath('/insights/funding.html') // Returns: '/es/insights/financiacion.html'
 * getAlternatePath('/es/insights/financiacion.html') // Returns: '/insights/funding.html'
 */
export function getAlternatePath(path: string): string {
  const currentLang = getLangAttribute(path);
  const targetLang: LanguageCode = currentLang === 'en' ? 'es' : 'en';
  return translatePath(path, targetLang);
}

/**
 * Validate that a path has the correct structure for its language
 *
 * Checks:
 * - Spanish paths must start with /es/
 * - English paths must NOT start with /es/
 *
 * @param path - Path to validate
 * @param expectedLang - Expected language
 * @returns true if path structure is valid
 *
 * @example
 * validatePathStructure('/insights/funding.html', 'en') // Returns: true
 * validatePathStructure('/insights/funding.html', 'es') // Returns: false (missing /es/ prefix)
 * validatePathStructure('/es/insights/financiacion.html', 'es') // Returns: true
 */
export function validatePathStructure(path: string, expectedLang: LanguageCode): boolean {
  const normalizedPath = path.replace(/^\//, '').toLowerCase();

  if (expectedLang === 'es') {
    return normalizedPath.startsWith('es/');
  } else {
    return !normalizedPath.startsWith('es/');
  }
}

/**
 * Extract the content path (without language prefix)
 *
 * Removes the /es/ prefix from Spanish paths, leaving just the content structure
 * Useful for comparing paths across languages
 *
 * @param path - Full path
 * @returns Path without language prefix
 *
 * @example
 * extractContentPath('/insights/funding.html') // Returns: '/insights/funding.html'
 * extractContentPath('/es/insights/financiacion.html') // Returns: '/insights/financiacion.html'
 */
export function extractContentPath(path: string): string {
  const normalizedPath = path.replace(/^\//, '');

  if (normalizedPath.startsWith('es/')) {
    return '/' + normalizedPath.replace(/^es\//, '');
  }

  return '/' + normalizedPath;
}

/**
 * Get localization status for a path pair
 *
 * Checks if both language versions exist and are properly structured
 *
 * @param pathMetadata - PathMetadata to validate
 * @returns Object with validation results
 */
export function getLocalizationStatus(pathMetadata: PathMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate English path structure
  if (!validatePathStructure(pathMetadata.path_en, 'en')) {
    errors.push(`English path should not start with /es/: ${pathMetadata.path_en}`);
  }

  // Validate Spanish path structure
  if (!validatePathStructure(pathMetadata.path_es, 'es')) {
    errors.push(`Spanish path should start with /es/: ${pathMetadata.path_es}`);
  }

  // Check that paths are different
  if (pathMetadata.path_en === pathMetadata.path_es) {
    errors.push('English and Spanish paths must be different');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create LocalizedMetadata from PathMetadata and titles
 *
 * Helper to build complete localized metadata objects
 *
 * @param pathMetadata - Path metadata
 * @param currentLang - Current page language
 * @param titles - Object with title_en and title_es
 * @param descriptions - Optional object with description_en and description_es
 * @returns LocalizedMetadata object
 */
export function createLocalizedMetadata(
  pathMetadata: PathMetadata,
  currentLang: LanguageCode,
  titles: { title_en: string; title_es: string },
  descriptions?: { description_en?: string; description_es?: string }
): LocalizedMetadata {
  const alternateLang: LanguageCode = currentLang === 'en' ? 'es' : 'en';
  const alternatePath = currentLang === 'en' ? pathMetadata.path_es : pathMetadata.path_en;

  return {
    lang: currentLang,
    title_en: titles.title_en,
    title_es: titles.title_es,
    description_en: descriptions?.description_en,
    description_es: descriptions?.description_es,
    alternateLanguage: {
      lang: alternateLang,
      path: alternatePath,
    },
  };
}
