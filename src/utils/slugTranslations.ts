/**
 * Slug Translation Mapping System
 *
 * Provides bidirectional English ↔ Spanish slug translation for URLs
 * Used by build scripts and templates to maintain bilingual URL structure
 *
 * Spanish Academic 2026
 */

// Language code type
export type LanguageCode = 'en' | 'es';

/**
 * Slug translation dictionary
 *
 * Maps English terms to Spanish equivalents for URL construction
 * All keys are lowercase, hyphenated English terms
 * All values are lowercase, hyphenated Spanish terms
 */
export const slugTranslations: Record<string, string> = {
  // Directory-level translations
  'help': 'ayuda',
  'programs': 'programas',
  'insights': 'insights', // Kept as loanword (common in academic Spanish)
  'contact': 'contacto',
  'about': 'acerca-de',
  'categories': 'categorias',
  'explorer': 'explorador',

  // Degree types
  'phd': 'doctorado',
  'doctorate': 'doctorado',
  'ma': 'maestria',
  'masters': 'maestria',
  'master': 'maestria',
  'certificate': 'certificado',
  'minor': 'especializacion',

  // Subject areas
  'linguistics': 'linguistica',
  'spanish-linguistics': 'linguistica-espanola',
  'literature': 'literatura',
  'spanish-literature': 'literatura-espanola',
  'translation': 'traduccion',
  'interpreting': 'interpretacion',
  'translation-and-interpreting': 'traduccion-e-interpretacion',
  'hispanic-studies': 'estudios-hispanicos',
  'latin-american-studies': 'estudios-latinoamericanos',
  'iberian-studies': 'estudios-ibericos',

  // Linguistic subfields
  'phonetics': 'fonetica',
  'phonology': 'fonologia',
  'syntax': 'sintaxis',
  'semantics': 'semantica',
  'pragmatics': 'pragmatica',
  'sociolinguistics': 'sociolinguistica',
  'psycholinguistics': 'psicolinguistica',
  'historical-linguistics': 'linguistica-historica',
  'corpus-linguistics': 'linguistica-de-corpus',
  'applied-linguistics': 'linguistica-aplicada',

  // Literature subfields
  'poetry': 'poesia',
  'narrative': 'narrativa',
  'theater': 'teatro',
  'drama': 'drama',
  'colonial': 'colonial',
  'medieval': 'medieval',
  'golden-age': 'siglo-de-oro',
  'contemporary': 'contemporaneo',
  'modern': 'moderno',

  // Common page topics
  'funding': 'financiacion',
  'financial-aid': 'ayuda-financiera',
  'scholarships': 'becas',
  'fellowships': 'becas',
  'stipend': 'estipendio',
  'visa': 'visa',
  'requirements': 'requisitos',
  'admission': 'admision',
  'application': 'solicitud',
  'deadline': 'plazo',
  'deadlines': 'plazos',
  'strategies': 'estrategias',
  'tips': 'consejos',
  'advice': 'consejos',

  // Immigration & visa terms
  'immigration': 'inmigracion',
  'sponsorship': 'patrocinio',
  'work-authorization': 'autorizacion-de-trabajo',
  'student-visa': 'visa-de-estudiante',
  'f1-visa': 'visa-f1',
  'j1-visa': 'visa-j1',

  // AI & ethics terms
  'ai': 'ia',
  'artificial-intelligence': 'inteligencia-artificial',
  'ethics': 'etica',
  'disclosure': 'divulgacion',
  'transparency': 'transparencia',
  'academic-integrity': 'integridad-academica',

  // University & location terms
  'university': 'universidad',
  'college': 'universidad',
  'institute': 'instituto',
  'program': 'programa',
  'department': 'departamento',
  'faculty': 'profesorado',
  'research': 'investigacion',

  // Geographic terms (when used in slugs)
  'california': 'california',
  'new-york': 'nueva-york',
  'texas': 'texas',
  'florida': 'florida',
  'spain': 'espana',
  'mexico': 'mexico',
  'argentina': 'argentina',
  'chile': 'chile',

  // Misc common terms
  'and': 'y',
  'or': 'o',
  'the': 'el', // Rarely used in slugs, but included for completeness
  'of': 'de',
  'for': 'para',
  'with': 'con',
  'in': 'en',
  'at': 'en',
  'guide': 'guia',
  'overview': 'resumen',
  'comparison': 'comparacion',
  'list': 'lista',
  'index': 'indice',
  'search': 'buscar',
  'faq': 'preguntas-frecuentes',
  'frequently-asked-questions': 'preguntas-frecuentes',
};

/**
 * Reverse mapping: Spanish → English
 * Generated automatically from slugTranslations
 */
export const reverseSlugTranslations: Record<string, string> = Object.fromEntries(
  Object.entries(slugTranslations).map(([en, es]) => [es, en])
);

/**
 * Translate a slug from one language to another
 *
 * Handles full slugs with hyphens by splitting and translating each part
 *
 * @param slug - The slug to translate (e.g., "phd-spanish-linguistics")
 * @param targetLang - The target language ('en' or 'es')
 * @returns Translated slug
 *
 * @example
 * translateSlug('phd-spanish-linguistics', 'es')
 * // Returns: 'doctorado-linguistica-espanola'
 *
 * @example
 * translateSlug('doctorado-linguistica-espanola', 'en')
 * // Returns: 'phd-spanish-linguistics'
 */
export function translateSlug(slug: string, targetLang: LanguageCode): string {
  // Normalize slug to lowercase
  const normalizedSlug = slug.toLowerCase();

  // Check if entire slug has a direct translation
  if (targetLang === 'es' && slugTranslations[normalizedSlug]) {
    return slugTranslations[normalizedSlug];
  }

  if (targetLang === 'en' && reverseSlugTranslations[normalizedSlug]) {
    return reverseSlugTranslations[normalizedSlug];
  }

  // Split slug into parts and translate each part
  const parts = normalizedSlug.split('-');
  const translatedParts: string[] = [];

  let i = 0;
  while (i < parts.length) {
    // Try matching progressively longer phrases (greedy matching)
    // e.g., "spanish-linguistics" before "spanish" + "linguistics"
    let matched = false;

    for (let len = Math.min(parts.length - i, 5); len > 0; len--) {
      const phrase = parts.slice(i, i + len).join('-');

      if (targetLang === 'es' && slugTranslations[phrase]) {
        translatedParts.push(slugTranslations[phrase]);
        i += len;
        matched = true;
        break;
      }

      if (targetLang === 'en' && reverseSlugTranslations[phrase]) {
        translatedParts.push(reverseSlugTranslations[phrase]);
        i += len;
        matched = true;
        break;
      }
    }

    // If no translation found, keep original part (e.g., university names)
    if (!matched) {
      translatedParts.push(parts[i]);
      i++;
    }
  }

  return translatedParts.join('-');
}

/**
 * Get the alternate language version of a slug
 *
 * Convenience wrapper around translateSlug that determines the current language
 * and translates to the opposite language
 *
 * @param slug - The slug to translate
 * @param currentLang - The current language of the slug
 * @returns Slug in the alternate language
 *
 * @example
 * getAlternateSlug('phd-spanish-linguistics', 'en')
 * // Returns: 'doctorado-linguistica-espanola'
 */
export function getAlternateSlug(slug: string, currentLang: LanguageCode): string {
  const targetLang: LanguageCode = currentLang === 'en' ? 'es' : 'en';
  return translateSlug(slug, targetLang);
}

/**
 * Check if a slug is likely in English
 *
 * Heuristic: checks if any part of the slug exists in slugTranslations keys
 *
 * @param slug - The slug to check
 * @returns true if slug appears to be in English
 */
export function isEnglishSlug(slug: string): boolean {
  const parts = slug.toLowerCase().split('-');

  // Check if any part exists in English translations
  for (const part of parts) {
    if (slugTranslations[part]) {
      return true;
    }
  }

  // Check if entire slug exists in English translations
  return !!slugTranslations[slug.toLowerCase()];
}

/**
 * Check if a slug is likely in Spanish
 *
 * Heuristic: checks if any part of the slug exists in reverseSlugTranslations keys
 *
 * @param slug - The slug to check
 * @returns true if slug appears to be in Spanish
 */
export function isSpanishSlug(slug: string): boolean {
  const parts = slug.toLowerCase().split('-');

  // Check if any part exists in Spanish translations
  for (const part of parts) {
    if (reverseSlugTranslations[part]) {
      return true;
    }
  }

  // Check if entire slug exists in Spanish translations
  return !!reverseSlugTranslations[slug.toLowerCase()];
}
