#!/usr/bin/env node

/**
 * Generate Program List Pages - Phase 2b
 *
 * Generates 4 English + 4 Spanish program list pages using base.html template
 * Inserts clean extracted program lists (RULE 1 compliance: zero commentary)
 *
 * Spanish Academic 2026 - Content Migration
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { extractProgramList } from './extractProgramLists.js';

const TEMPLATES_DIR = join(process.cwd(), 'templates');
const PUBLIC_DIR = join(process.cwd(), 'public');

interface PageConfig {
  sourceFile: string;
  outputPath: string;
  outputPathEs: string;
  keyword: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  h1: string;
  h1Es: string;
  intro: string;
  introEs: string;
}

const PAGE_CONFIGS: PageConfig[] = [
  {
    sourceFile: 'spanish-linguistics.html',
    outputPath: '/spanish-linguistics.html',
    outputPathEs: '/es/linguistica-espanola.html',
    keyword: 'Spanish Linguistics PhD Programs',
    title: 'Spanish Linguistics PhD & MA Programs - Complete List',
    titleEs: 'Programas de Doctorado y Maestría en Lingüística Española',
    description: 'Complete directory of Spanish linguistics graduate programs. Find PhD and MA programs in Hispanic linguistics, sociolinguistics, and applied linguistics.',
    descriptionEs: 'Directorio completo de programas de posgrado en lingüística española. Encuentre programas de doctorado y maestría en lingüística hispánica.',
    h1: 'Spanish Linguistics Graduate Programs',
    h1Es: 'Programas de Posgrado en Lingüística Española',
    intro: 'This comprehensive directory lists graduate programs in Spanish linguistics across the United States. Programs span theoretical linguistics, sociolinguistics, applied linguistics, second language acquisition, and heritage language studies. Each listing links directly to the official program page where you can find current admission requirements, faculty research areas, and funding information. Use this directory as your starting point for identifying programs that align with your research interests in phonetics, syntax, semantics, pragmatics, language variation, or bilingualism. For detailed program comparisons including funding packages and research methodologies, explore our Program Explorer tool after reviewing this complete list.',
    introEs: 'Este directorio completo enumera programas de posgrado en lingüística española en los Estados Unidos. Los programas abarcan lingüística teórica, sociolingüística, lingüística aplicada, adquisición de segundas lenguas y estudios de lenguas de herencia. Cada listado enlaza directamente a la página oficial del programa donde puede encontrar requisitos de admisión actuales, áreas de investigación del profesorado e información de financiamiento. Utilice este directorio como punto de partida para identificar programas que se alineen con sus intereses de investigación.',
  },
  {
    sourceFile: 'translation-and-interpreting.html',
    outputPath: '/translation-and-interpreting.html',
    outputPathEs: '/es/traduccion-e-interpretacion.html',
    keyword: 'Translation and Interpreting Programs',
    title: 'Translation & Interpreting Graduate Programs - Directory',
    titleEs: 'Programas de Posgrado en Traducción e Interpretación',
    description: 'Directory of graduate programs in translation and interpreting. Find MA and PhD programs in Spanish-English translation, conference interpreting, and literary translation.',
    descriptionEs: 'Directorio de programas de posgrado en traducción e interpretación. Encuentre programas de maestría y doctorado en traducción español-inglés.',
    h1: 'Translation and Interpreting Programs',
    h1Es: 'Programas de Traducción e Interpretación',
    intro: 'This directory features graduate programs in translation and interpreting with Spanish language specializations. Programs include training in literary translation, technical translation, legal interpreting, medical interpreting, and conference interpreting. Many programs offer practical internship opportunities with translation agencies, international organizations, or court systems. Review each program\'s focus areas carefully, as some emphasize literary translation while others concentrate on community interpreting or specialized technical fields. Links connect directly to official program pages with current curriculum details and admission requirements.',
    introEs: 'Este directorio presenta programas de posgrado en traducción e interpretación con especializaciones en idioma español. Los programas incluyen formación en traducción literaria, traducción técnica, interpretación legal, interpretación médica e interpretación de conferencias. Muchos programas ofrecen oportunidades prácticas de pasantías con agencias de traducción, organizaciones internacionales o sistemas judiciales.',
  },
  {
    sourceFile: 'spanish-literature.html',
    outputPath: '/literature-and-culture.html',
    outputPathEs: '/es/literatura-y-cultura.html',
    keyword: 'Spanish Literature PhD Programs',
    title: 'Spanish Literature & Culture Graduate Programs - Directory',
    titleEs: 'Programas de Posgrado en Literatura y Cultura Española',
    description: 'Directory of Spanish literature and culture graduate programs. Find PhD and MA programs in Hispanic literature, Latin American studies, and cultural studies.',
    descriptionEs: 'Directorio de programas de posgrado en literatura y cultura española. Encuentre programas de doctorado y maestría en literatura hispánica.',
    h1: 'Spanish Literature and Culture Programs',
    h1Es: 'Programas de Literatura y Cultura Española',
    intro: 'This directory compiles graduate programs focused on Spanish and Latin American literature and cultural studies. Programs cover periods from medieval Iberian literature through contemporary Latin American narratives, with specializations available in poetry, prose, drama, film studies, and cultural theory. Faculty research areas typically span multiple centuries and geographic regions, allowing students to develop expertise in specific literary movements, authors, or critical approaches. Each program link leads to official pages detailing course requirements, comprehensive exam structures, and dissertation expectations for doctoral candidates.',
    introEs: 'Este directorio compila programas de posgrado enfocados en literatura española y latinoamericana y estudios culturales. Los programas cubren períodos desde la literatura ibérica medieval hasta las narrativas latinoamericanas contemporáneas, con especializaciones disponibles en poesía, prosa, drama, estudios cinematográficos y teoría cultural.',
  },
  {
    sourceFile: 'online-spanish-linguistics-masters-and-phd.html',
    outputPath: '/online-spanish-linguistics.html',
    outputPathEs: '/es/linguistica-espanola-online.html',
    keyword: 'Online Spanish Linguistics Programs',
    title: 'Online Spanish Linguistics Programs - MA & PhD Distance Learning',
    titleEs: 'Programas Online de Lingüística Española - Educación a Distancia',
    description: 'Online and hybrid graduate programs in Spanish linguistics. Find distance learning MA and PhD programs with flexible schedules for working professionals.',
    descriptionEs: 'Programas de posgrado en línea e híbridos en lingüística española. Encuentre programas de maestría y doctorado a distancia con horarios flexibles.',
    h1: 'Online Spanish Linguistics Programs',
    h1Es: 'Programas Online de Lingüística Española',
    intro: 'This directory lists graduate programs offering online or hybrid formats in Spanish linguistics and related fields. These programs provide flexibility for working professionals, international students, or those unable to relocate for traditional campus-based study. Online formats vary widely: some programs are fully asynchronous, others require synchronous virtual meetings, and hybrid programs combine online coursework with occasional campus residencies. Carefully review each program\'s specific format, residency requirements, and technology expectations. Note that funding opportunities may differ between online and traditional formats, so verify financial support options directly with each program.',
    introEs: 'Este directorio enumera programas de posgrado que ofrecen formatos en línea o híbridos en lingüística española y campos relacionados. Estos programas proporcionan flexibilidad para profesionales que trabajan, estudiantes internacionales o aquellos que no pueden reubicarse para estudios tradicionales en campus.',
  },
];

function generateEnglishPage(config: PageConfig): void {
  // Read base template
  const template = readFileSync(join(TEMPLATES_DIR, 'base.html'), 'utf-8');

  // Extract program list
  const { listHtml, programCount } = extractProgramList(config.sourceFile);

  // Replace placeholders
  let page = template
    // SEO_INTENT
    .replace('[PRIMARY_KEYWORD]', config.keyword)
    .replace('[TARGET_AUDIENCE]', 'Graduate students researching Spanish language programs')
    .replace('[YYYY-MM-DD]', '2025-10-25')
    // Meta tags
    .replace(/\[Page Title - 50-60 characters with keyword\]/g, config.title)
    .replace(/\[Meta description 140-160 characters with keyword variant\]/g, config.description)
    .replace(/\[Page Title\]/g, config.title)
    .replace(/\[Meta description\]/g, config.description)
    // Paths - escape special regex characters in outputPath
    .replaceAll('[/path/to/page.html]', config.outputPath)
    .replaceAll('[path/to/page.html]', config.outputPath.slice(1))
    .replaceAll('[/es/ruta/a/pagina.html]', config.outputPathEs)
    .replaceAll('[ruta/a/pagina.html]', config.outputPathEs.slice(4))
    .replaceAll('[es/ruta/a/pagina.html]', config.outputPathEs.slice(1))
    // Content
    .replace('[Page Heading with Primary Keyword]', config.h1)
    .replace(/\[Introduction paragraph.*?\]/s, config.intro);

  // Replace main content with program lists (RULE 1: pure lists, zero commentary)
  const mainContent = `
    <!-- Program List Section -->
    <section class="program-list">
      <h2>Programs by Institution</h2>
      ${listHtml}
    </section>`;

  page = page.replace(/<article>[\s\S]*?<\/article>/, `<article>${mainContent}\n    </article>`);

  // Write file
  const outputPath = join(PUBLIC_DIR, config.outputPath);
  writeFileSync(outputPath, page, 'utf-8');

  console.log(`✅ Generated: ${config.outputPath} (${programCount} programs)`);
}

function generateSpanishPlaceholder(config: PageConfig): void {
  // Read Spanish base template
  const template = readFileSync(join(TEMPLATES_DIR, 'base-es.html'), 'utf-8');

  // Replace placeholders
  let page = template
    // SEO_INTENT
    .replace('[PALABRA_CLAVE_PRINCIPAL]', config.keyword)
    .replace('[AUDIENCIA_OBJETIVO]', 'Estudiantes de posgrado investigando programas en español')
    .replace('[YYYY-MM-DD]', '2025-10-25')
    // Meta tags
    .replace(/\[Título de la Página - 50-60 caracteres con palabra clave\]/g, config.titleEs)
    .replace(/\[Meta descripción 140-160 caracteres con variante de palabra clave\]/g, config.descriptionEs)
    .replace(/\[Título de la Página\]/g, config.titleEs)
    .replace(/\[Meta descripción\]/g, config.descriptionEs)
    // Paths
    .replaceAll('[/path/to/page.html]', config.outputPath)
    .replaceAll('[path/to/page.html]', config.outputPath.slice(1))
    .replaceAll('[/es/ruta/a/pagina.html]', config.outputPathEs)
    .replaceAll('[ruta/a/pagina.html]', config.outputPathEs.slice(4))
    .replaceAll('[es/ruta/a/pagina.html]', config.outputPathEs.slice(1))
    // Content
    .replace('[Encabezado de la Página con Palabra Clave Principal]', config.h1Es)
    .replace(/\[Párrafo introductorio.*?\]/s, config.introEs);

  // Add placeholder notice
  const placeholderContent = `
    <!-- PLACEHOLDER: Awaiting Spanish translation -->
    <section class="program-list">
      <h2>Programas por Institución</h2>
      <p><em>Contenido en español próximamente. Por favor, consulte la <a href="${config.outputPath}">versión en inglés</a> mientras tanto.</em></p>
    </section>`;

  page = page.replace(/<article>[\s\S]*?<\/article>/, `<article>${placeholderContent}\n    </article>`);

  // Write file
  const outputPath = join(PUBLIC_DIR, config.outputPathEs);
  writeFileSync(outputPath, page, 'utf-8');

  console.log(`✅ Generated: ${config.outputPathEs} (Spanish placeholder)`);
}

// Main execution
console.log('📄 Generating Program List Pages\n');
console.log('='.repeat(80));

PAGE_CONFIGS.forEach((config) => {
  console.log(`\nProcessing: ${config.sourceFile}`);
  generateEnglishPage(config);
  generateSpanishPlaceholder(config);
});

console.log('\n' + '='.repeat(80));
console.log('✅ All pages generated successfully!');
