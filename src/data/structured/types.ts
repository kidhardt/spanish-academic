/**
 * TypeScript Interfaces for Bilingual Structured Data
 *
 * LOCALIZATION_FIRST principle: All text fields that differ between languages
 * use *_en and *_es suffixes. Numeric/boolean data is shared.
 *
 * Spanish Academic 2026
 */

/**
 * Program - Graduate program information
 *
 * Represents a PhD, MA, or other graduate program in Spanish Linguistics,
 * Literature, Translation/Interpreting, or related fields.
 */
export interface Program {
  // Unique identifier (shared across languages)
  id: string;

  // Institution name (bilingual)
  institution_en: string;
  institution_es: string;

  // Degree/program name (bilingual)
  degree_en: string;
  degree_es: string;

  // Research focus areas (bilingual arrays)
  focusAreas_en: string[];
  focusAreas_es: string[];

  // Methodological approach and departmental culture (bilingual)
  methodsCulture_en: string;
  methodsCulture_es: string;

  // Location (city, state, country)
  city: string;
  state: string | null; // Null for non-US programs
  country: string;

  // Funding information (shared - numeric data)
  stipendApproxUSD: number | null; // Approximate annual stipend in USD
  yearsGuaranteed: number | null; // Years of guaranteed funding
  additionalSummerFunding: boolean; // Additional summer funding available

  // Application requirements (shared - boolean data)
  greRequired: boolean;
  greSubjectTestRequired: boolean;
  writingSampleRequired: boolean;
  languageProficiencyRequired: boolean; // Beyond Spanish (e.g., Latin, Portuguese)

  // Program size and selectivity (shared - numeric data)
  cohortSizeApprox: number | null;
  acceptanceRateApprox: number | null; // Percentage (0-100)

  // Program URLs (bilingual)
  url_en: string; // Path to program detail page (English)
  url_es: string; // Path to program detail page (Spanish)

  // External links (shared - same for both languages)
  officialWebsite: string;
  applicationPortal: string | null;

  // Metadata
  lastUpdated: string; // ISO 8601 date
}

/**
 * Faculty - Faculty member information
 *
 * Represents a faculty member at a program, with research interests
 * and advising information.
 */
export interface Faculty {
  // Unique identifier
  id: string;

  // Program affiliation (references Program.id)
  programId: string;

  // Name (shared - same in both languages)
  firstName: string;
  lastName: string;
  title: string; // Dr., Prof., etc.

  // Research interests (bilingual arrays)
  researchInterests_en: string[];
  researchInterests_es: string[];

  // Notable work or specialization (bilingual)
  specialization_en: string;
  specialization_es: string;

  // Advising status (shared - boolean)
  acceptingStudents: boolean;

  // Contact and links (shared)
  email: string | null;
  personalWebsite: string | null;
  googleScholar: string | null;

  // Metadata
  lastUpdated: string; // ISO 8601 date
}

/**
 * InsightArticle - Metadata for Insights articles
 *
 * Insights articles are research-backed guides on topics like funding,
 * visa requirements, AI ethics, etc.
 */
export interface InsightArticle {
  // Unique identifier
  id: string;

  // Title (bilingual)
  title_en: string;
  title_es: string;

  // Abstract/summary (bilingual)
  abstract_en: string;
  abstract_es: string;

  // Author information
  author: string;
  authorAffiliation_en: string;
  authorAffiliation_es: string;

  // Publication metadata
  publishedDate: string; // ISO 8601 date
  lastReviewed: string; // ISO 8601 date

  // Category and tags (bilingual)
  category_en: string;
  category_es: string;
  tags_en: string[];
  tags_es: string[];

  // URLs (bilingual)
  url_en: string;
  url_es: string;

  // SEO and governance
  legalSensitivity: boolean; // Visa/immigration content
  aiEthicsSensitivity: boolean; // AI ethics/disclosure content
}

/**
 * HelpQuestion - Q&A page metadata
 *
 * Help/Q&A pages provide authoritative answers to common questions.
 */
export interface HelpQuestion {
  // Unique identifier
  id: string;

  // Question (bilingual)
  question_en: string;
  question_es: string;

  // Short answer (bilingual - appears above fold)
  shortAnswer_en: string;
  shortAnswer_es: string;

  // Category (bilingual)
  category_en: string;
  category_es: string;

  // URLs (bilingual)
  url_en: string;
  url_es: string;

  // Governance
  lastReviewed: string; // ISO 8601 date
  legalSensitivity: boolean; // Visa/immigration content
}

/**
 * Category - Category metadata for Insights and Help sections
 *
 * Categories organize articles and Q&A pages.
 */
export interface Category {
  // Unique identifier
  id: string;

  // Category name (bilingual)
  name_en: string;
  name_es: string;

  // Description (bilingual)
  description_en: string;
  description_es: string;

  // Slug for URL (bilingual)
  slug_en: string;
  slug_es: string;

  // Icon or emoji (shared)
  icon: string;

  // Section (insights or help)
  section: 'insights' | 'help';
}
