/**
 * Sample Program Data
 *
 * Example programs demonstrating the bilingual data structure.
 * Real program data will be added during content creation phase.
 *
 * Spanish Academic 2026
 */

import { Program } from './types';

export const programs: Program[] = [
  {
    id: 'uc-davis-phd-spanish-ling',
    institution_en: 'University of California, Davis',
    institution_es: 'Universidad de California, Davis',
    degree_en: 'PhD in Spanish Linguistics',
    degree_es: 'Doctorado en Lingüística Española',
    focusAreas_en: ['Phonetics/Phonology', 'Sociolinguistics'],
    focusAreas_es: ['Fonética/Fonología', 'Sociolingüística'],
    methodsCulture_en: 'Quantitative methods emphasis, corpus linguistics.',
    methodsCulture_es: 'Énfasis en métodos cuantitativos, lingüística de corpus.',
    city: 'Davis',
    state: 'CA',
    country: 'USA',
    stipendApproxUSD: 32000,
    yearsGuaranteed: 5,
    additionalSummerFunding: true,
    greRequired: false,
    greSubjectTestRequired: false,
    writingSampleRequired: true,
    languageProficiencyRequired: false,
    cohortSizeApprox: 3,
    acceptanceRateApprox: 15,
    url_en: '/programs/uc-davis-phd-spanish-ling.html',
    url_es: '/es/programas/uc-davis-doctorado-ling-espanola.html',
    officialWebsite: 'https://spanish.ucdavis.edu/graduate',
    applicationPortal: 'https://grad.ucdavis.edu/admissions/apply',
    lastUpdated: '2025-10-24',
  },
];
