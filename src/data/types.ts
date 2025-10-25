/**
 * Core data types for Spanish Academic platform
 * Bilingual fields use _en and _es suffixes
 * Shared numeric/boolean data has no language suffix
 */

/** Degree type offered by programs */
export type DegreeType = 'MA' | 'PhD' | 'Certificate' | 'Graduate Minor'

/** Program focus areas/subfields */
export type FocusArea =
  | 'Sociolinguistics'
  | 'Sociophonetics'
  | 'Heritage Bilingualism'
  | 'Second Language Acquisition'
  | 'Spanish Literature'
  | 'Translation Studies'
  | 'Interpreting'
  | 'Spanish for the Professions'
  | 'Corpus Linguistics'
  | 'Discourse Analysis'
  | 'Pedagogy'
  | 'Applied Linguistics'

/** Methods culture expectations */
export type MethodsCulture =
  | 'Quantitative (statistical, corpus)'
  | 'Qualitative (ethnographic, discourse)'
  | 'Mixed Methods'
  | 'Theoretical / Literary Analysis'
  | 'Experimental'

/** Program detail interface with bilingual fields */
export interface Program {
  /** Unique identifier (e.g., "uc-davis-phd-spanish-ling") */
  id: string

  /** Institution name (shared across languages) */
  institution: string

  /** Degree type */
  degreeType: DegreeType

  /** Focus areas in English */
  focusAreas_en: string[]

  /** Focus areas in Spanish */
  focusAreas_es: string[]

  /** Funding details */
  funding: {
    /** Full tuition remission provided */
    tuitionRemission: boolean
    /** Approximate annual stipend in USD (null if unfunded) */
    stipendApproxUSD: number | null
    /** Years of guaranteed funding */
    yearsGuaranteed: number | null
    /** Additional funding notes in English */
    notes_en: string
    /** Additional funding notes in Spanish */
    notes_es: string
  }

  /** Admissions requirements and expectations */
  admissions: {
    /** GRE required for application */
    greRequired: boolean
    /** Minimum GPA (null if not specified) */
    minGPA: number | null
    /** Admissions notes in English */
    notes_en: string
    /** Admissions notes in Spanish */
    notes_es: string
  }

  /** Methods culture description in English */
  methodsCulture_en: string

  /** Methods culture description in Spanish */
  methodsCulture_es: string

  /** Geographic location */
  location: {
    city: string
    state: string
    country: string
    /** Latitude for mapping */
    lat: number
    /** Longitude for mapping */
    lng: number
  }

  /** IDs of faculty members associated with this program */
  facultyIds: string[]

  /** External URLs */
  urls: {
    /** Official program website */
    programPage: string
    /** Link to graduate handbook PDF (if available) */
    handbookPDF: string | null
    /** Link to application portal */
    applicationPortal: string | null
  }

  /** Visa/immigration notes in English */
  visaNotes_en: string

  /** Visa/immigration notes in Spanish */
  visaNotes_es: string

  /** Online/hybrid/in-person delivery mode */
  deliveryMode: 'In-Person' | 'Online' | 'Hybrid'

  /** Whether program is currently accepting applications */
  acceptingApplications: boolean

  /** Last verified date for data accuracy (ISO 8601) */
  lastVerified: string
}

/** Faculty member / advisor interface */
export interface FacultyMember {
  /** Unique identifier (e.g., "jane-doe-uc-davis") */
  id: string

  /** Full name */
  name: string

  /** Institution affiliation */
  institution: string

  /** Department/program affiliation */
  department: string

  /** Academic title */
  title: string

  /** Research areas in English */
  researchAreas_en: string[]

  /** Research areas in Spanish */
  researchAreas_es: string[]

  /** Methodological strengths */
  methodologicalStrengths: MethodsCulture[]

  /** Currently accepting new advisees */
  acceptingAdvisees: boolean

  /** Notes on advising capacity in English */
  advisingNotes_en: string

  /** Notes on advising capacity in Spanish */
  advisingNotes_es: string

  /** Personal website URL */
  websiteURL: string | null

  /** Google Scholar profile URL */
  scholarURL: string | null

  /** Notable publications or projects in English */
  notableWork_en: string[]

  /** Notable publications or projects in Spanish */
  notableWork_es: string[]

  /** Last verified date for accuracy (ISO 8601) */
  lastVerified: string
}

/** Insights article metadata */
export interface InsightsArticle {
  type: 'insightsArticle'
  language: 'en' | 'es'
  title: string
  slug: string
  category: InsightsCategory
  author: string
  authorAffiliation: string
  publishedDate: string // ISO 8601
  abstract: string
  keyClaims: string[]
  adviceForStudents: string[]
  relatedLinks: string[]
  alternateLanguage: {
    en?: string
    es?: string
  }
}

/** Insights article categories */
export type InsightsCategory =
  | 'Academic Program Reviews'
  | 'AI in Higher Education'
  | 'Statistical & Research Methods'
  | 'Spanish for the Professions'
  | 'Advice for Students'
  | 'Field Analyses & Policy'
  | 'Tools & Data Infrastructure'

/** Help/Q&A page metadata */
export interface QAPage {
  type: 'qaPage'
  language: 'en' | 'es'
  question: string
  slug: string
  shortAnswer: string
  detailedAnswerSections: {
    heading: string
    text: string
  }[]
  category: QACategory
  lastReviewed: string // ISO 8601
  legalSensitivity: 'low' | 'medium' | 'high'
  relatedLinks: string[]
  alternateLanguage: {
    en?: string
    es?: string
  }
}

/** Q&A page categories */
export type QACategory =
  | 'Immigration & Visa Status'
  | 'Academic Integrity & AI'
  | 'Funding & Financial Aid'
  | 'Program Selection'
  | 'Research Methods'
  | 'Career & Professional Development'
  | 'Student Life'

/** Program summary for JSON twin */
export interface ProgramSummary {
  type: 'programSummary'
  language: 'en' | 'es'
  programId: string
  institution: string
  degreeType: DegreeType
  focusAreas: string[]
  fundingSummary: {
    tuitionRemission: boolean
    stipendApproxUSD: number | null
    yearsGuaranteed: number | null
  }
  methodsCulture: string
  advisorCapacityNote: string
  visaNotes: string
  relatedExplorerRoute: string
  alternateLanguage: {
    en?: string
    es?: string
  }
}

/** Category index page metadata */
export interface CategoryIndex {
  type: 'categoryIndex'
  language: 'en' | 'es'
  category: InsightsCategory | QACategory
  title: string
  slug: string
  items: {
    title: string
    url: string
    abstract: string
    publishedDate?: string
  }[]
  alternateLanguage: {
    en?: string
    es?: string
  }
}

/** Unstructured program notes (narrative descriptions) */
export interface ProgramNotes {
  [programId: string]: {
    programDescription: string
    admissionsExpectations: string
    mentorshipCulture: string
    practicalWarnings: string
    whatApplicantsShouldKnow: string
  }
}

/** Language code */
export type LanguageCode = 'en' | 'es'

/** Page metadata for HTML pages */
export interface PageMetadata {
  path_en: string
  path_es: string
  slug_en: string
  slug_es: string
  title_en: string
  title_es: string
  abstract_en: string
  abstract_es: string
  lastUpdated: string // ISO 8601
}
