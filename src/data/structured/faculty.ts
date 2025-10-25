import type { FacultyMember, MethodsCulture } from '../types'

/**
 * Structured faculty data
 * This is the single source of truth for faculty information
 * Add new faculty here and they will be available in Explorer and program pages
 */

export const faculty: FacultyMember[] = [
  {
    id: 'jane-doe-uc-davis',
    name: 'Jane Doe',
    institution: 'University of California, Davis',
    department: 'Spanish & Portuguese',
    title: 'Associate Professor',
    researchAreas_en: [
      'Sociophonetics',
      'Heritage Speaker Bilingualism',
      'Language Contact',
    ],
    researchAreas_es: [
      'Sociofonética',
      'Bilingüismo de hablantes de herencia',
      'Contacto lingüístico',
    ],
    methodologicalStrengths: ['Quantitative (statistical, corpus)', 'Experimental'],
    acceptingAdvisees: true,
    advisingNotes_en:
      'Accepting 1-2 new PhD advisees for Fall 2026. Strong quantitative background preferred.',
    advisingNotes_es:
      'Aceptando 1-2 nuevos estudiantes de doctorado para otoño 2026. Se prefiere sólida formación cuantitativa.',
    websiteURL: 'https://spanish.ucdavis.edu/people/jane-doe',
    scholarURL: 'https://scholar.google.com/citations?user=EXAMPLE',
    notableWork_en: [
      'Vowel Variation in California Heritage Spanish (2023)',
      'Mixed-effects Models for Sociolinguistic Research (2021)',
    ],
    notableWork_es: [
      'Variación vocálica en el español de herencia de California (2023)',
      'Modelos de efectos mixtos para la investigación sociolingüística (2021)',
    ],
    lastVerified: '2025-10-24',
  },

  {
    id: 'john-smith-uc-davis',
    name: 'John Smith',
    institution: 'University of California, Davis',
    department: 'Spanish & Portuguese',
    title: 'Professor',
    researchAreas_en: [
      'Second Language Acquisition',
      'Pedagogical Grammar',
      'Corpus Linguistics',
    ],
    researchAreas_es: [
      'Adquisición de segundas lenguas',
      'Gramática pedagógica',
      'Lingüística de corpus',
    ],
    methodologicalStrengths: [
      'Quantitative (statistical, corpus)',
      'Mixed Methods',
    ] as MethodsCulture[],
    acceptingAdvisees: false,
    advisingNotes_en:
      'At capacity. Not accepting new advisees until 2027.',
    advisingNotes_es:
      'A capacidad máxima. No aceptando nuevos estudiantes hasta 2027.',
    websiteURL: 'https://spanish.ucdavis.edu/people/john-smith',
    scholarURL: null,
    notableWork_en: [
      'Corpus-Based Approaches to SLA Research (2022)',
      'Teaching Spanish Grammar with Data-Driven Learning (2020)',
    ],
    notableWork_es: [
      'Enfoques basados en corpus para la investigación de ASL (2022)',
      'Enseñanza de gramática española con aprendizaje basado en datos (2020)',
    ],
    lastVerified: '2025-10-24',
  },

  // Add more faculty as data becomes available
  // Example structure:
  /*
  {
    id: 'maria-garcia-ucla',
    name: 'María García',
    institution: 'University of California, Los Angeles',
    department: 'Spanish & Portuguese',
    title: 'Assistant Professor',
    researchAreas_en: ['Discourse Analysis', 'Sociolinguistics', 'Language and Identity'],
    researchAreas_es: ['Análisis del discurso', 'Sociolingüística', 'Lenguaje e identidad'],
    methodologicalStrengths: ['Qualitative (ethnographic, discourse)'],
    acceptingAdvisees: true,
    advisingNotes_en: 'Accepting new PhD advisees. Qualitative focus.',
    advisingNotes_es: 'Aceptando nuevos estudiantes de doctorado. Enfoque cualitativo.',
    websiteURL: 'https://spanish.ucla.edu/maria-garcia',
    scholarURL: 'https://scholar.google.com/citations?user=EXAMPLE2',
    notableWork_en: [
      'Narrative Identity in Latinx Communities (2024)',
      'Discourse Markers in Bilingual Conversation (2022)',
    ],
    notableWork_es: [
      'Identidad narrativa en comunidades latinx (2024)',
      'Marcadores discursivos en conversación bilingüe (2022)',
    ],
    lastVerified: '2025-10-24',
  },
  */
]

/**
 * Get faculty by ID
 */
export function getFacultyById(id: string): FacultyMember | undefined {
  return faculty.find((f) => f.id === id)
}

/**
 * Get faculty by institution
 */
export function getFacultyByInstitution(institution: string): FacultyMember[] {
  return faculty.filter((f) => f.institution === institution)
}

/**
 * Get faculty accepting advisees
 */
export function getFacultyAcceptingAdvisees(): FacultyMember[] {
  return faculty.filter((f) => f.acceptingAdvisees)
}

/**
 * Get faculty by research area (English or Spanish)
 */
export function getFacultyByResearchArea(researchArea: string): FacultyMember[] {
  return faculty.filter(
    (f) =>
      f.researchAreas_en.some((ra) =>
        ra.toLowerCase().includes(researchArea.toLowerCase())
      ) ||
      f.researchAreas_es.some((ra) =>
        ra.toLowerCase().includes(researchArea.toLowerCase())
      )
  )
}

/**
 * Get faculty by methodological strength
 */
export function getFacultyByMethodology(methodology: MethodsCulture): FacultyMember[] {
  return faculty.filter((f) => f.methodologicalStrengths.includes(methodology))
}

/**
 * Get faculty for a specific program (by program's facultyIds)
 */
export function getFacultyForProgram(facultyIds: string[]): FacultyMember[] {
  return faculty.filter((f) => facultyIds.includes(f.id))
}
