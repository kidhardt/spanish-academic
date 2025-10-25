#!/usr/bin/env node

/**
 * Skill Validation Script
 *
 * Enforces Anthropic skill-creator standards for Spanish Academic Network.
 *
 * CHECKS:
 * 1. Each skill directory has SKILL.md (uppercase)
 * 2. YAML frontmatter present and valid
 * 3. 'name' field matches directory name
 * 4. 'description' field is present and non-empty
 * 5. Skill name uses gerund form (warning only)
 * 6. No loose .md files in .claude/skills/ root (except skill-creation-guide.md)
 * 7. Optional subdirectories follow naming convention
 *
 * EXIT CODES:
 * 0 = All skills compliant
 * 1 = Validation errors found (blocks commit)
 *
 * Usage: npm run validate-skills
 *
 * Spanish Academic 2026
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');
const SKILLS_DIR = join(PROJECT_ROOT, '.claude', 'skills');

// Track issues
const errors = [];
const warnings = [];

/**
 * Extract YAML frontmatter from markdown content
 * Format:
 * ---
 * name: skill-name
 * description: Description here
 * ---
 */
function extractYAML(content) {
  const yamlRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(yamlRegex);

  if (!match) {
    return null;
  }

  const yamlBlock = match[1];
  const frontmatter = {};

  // Parse simple YAML (name: value pairs)
  const lines = yamlBlock.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (key && value) {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Check if a skill name uses gerund form
 *
 * CRITICAL RULE: ALL skills MUST use gerund naming (action verbs ending in -ing)
 *
 * Common gerunds: generating, validating, building, creating, processing, enforcing, working, using, analyzing
 *
 * Examples:
 * ✅ working-with-pdf, using-git-worktrees, analyzing-spreadsheets
 * ❌ pdf, git, xlsx, api
 */
function isGerund(skillName) {
  const gerundPrefixes = [
    'generating',
    'validating',
    'building',
    'creating',
    'processing',
    'enforcing',
    'testing',
    'scanning',
    'checking',
    'auditing',
    'parsing',
    'compiling',
    'working',
    'using',
    'analyzing',
    'managing',
    'requesting',
    'writing',
    'making',
    'tracing',
  ];

  const firstWord = skillName.split('-')[0];
  return gerundPrefixes.some(prefix => firstWord.startsWith(prefix));
}

/**
 * Validate a single skill directory
 */
function validateSkill(skillDir, skillName) {
  const skillPath = join(skillDir, 'SKILL.md');

  // Check 1: SKILL.md exists
  if (!existsSync(skillPath)) {
    errors.push(`${skillName}: Missing SKILL.md (must be uppercase)`);
    return;
  }

  // Read SKILL.md
  let content;
  try {
    content = readFileSync(skillPath, 'utf-8');
  } catch (error) {
    errors.push(`${skillName}: Cannot read SKILL.md - ${error.message}`);
    return;
  }

  // Check 2: Parse YAML frontmatter
  const frontmatter = extractYAML(content);

  if (!frontmatter) {
    errors.push(`${skillName}: Missing YAML frontmatter in SKILL.md`);
    errors.push(`${skillName}: Required format:\n---\nname: ${skillName}\ndescription: What it does and when to use it\n---`);
    return;
  }

  // Check 3: Validate 'name' field
  if (!frontmatter.name) {
    errors.push(`${skillName}: Missing 'name' field in YAML frontmatter`);
  } else if (frontmatter.name !== skillName) {
    errors.push(`${skillName}: Frontmatter 'name' (${frontmatter.name}) doesn't match directory name`);
  }

  // Check 4: Validate 'description' field
  if (!frontmatter.description) {
    errors.push(`${skillName}: Missing 'description' field in YAML frontmatter`);
  } else if (frontmatter.description.trim().length < 10) {
    errors.push(`${skillName}: Description too short (min 10 characters)`);
  }

  // Check 5: Validate gerund naming (warning only)
  if (!isGerund(skillName)) {
    warnings.push(`${skillName}: ⚠️ MUST use gerund form - this is NOT optional!`);
    warnings.push(`${skillName}: Examples: working-with-${skillName}, using-${skillName}, processing-${skillName}`);
    warnings.push(`${skillName}: See .claude/skills/skill-creation-guide.md - "Non-Negotiable Rule #1"`);
  }

  // Check 6: Validate optional subdirectories
  const allowedSubdirs = ['scripts', 'references', 'assets'];
  const entries = readdirSync(skillDir);

  for (const entry of entries) {
    const entryPath = join(skillDir, entry);
    const stat = statSync(entryPath);

    if (stat.isDirectory() && !allowedSubdirs.includes(entry)) {
      warnings.push(`${skillName}: Unexpected subdirectory '${entry}' (allowed: scripts, references, assets)`);
    }
  }
}

/**
 * Main validation function
 */
function validateAllSkills() {
  console.log('🔍 Validating Claude skills against Anthropic standards...\n');

  // Check that skills directory exists
  if (!existsSync(SKILLS_DIR)) {
    console.error(`❌ ERROR: Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  // Get all entries in skills directory
  const entries = readdirSync(SKILLS_DIR);

  // Separate directories from files
  const skillDirs = [];
  const looseFiles = [];

  for (const entry of entries) {
    const entryPath = join(SKILLS_DIR, entry);
    const stat = statSync(entryPath);

    if (stat.isDirectory()) {
      skillDirs.push(entry);
    } else if (entry.endsWith('.md')) {
      looseFiles.push(entry);
    }
  }

  // Check 7: No loose .md files in root (except skill-creation-guide.md)
  const allowedLooseFiles = ['skill-creation-guide.md'];
  const disallowedFiles = looseFiles.filter(file => !allowedLooseFiles.includes(file));

  if (disallowedFiles.length > 0) {
    errors.push(`Loose .md files in .claude/skills/ root: ${disallowedFiles.join(', ')}`);
    errors.push(`Move these files to proper skill directories with SKILL.md structure`);
  }

  // Validate each skill directory
  console.log(`Found ${skillDirs.length} skill director(ies):\n`);

  for (const skillName of skillDirs) {
    const skillDir = join(SKILLS_DIR, skillName);
    console.log(`  Validating: ${skillName}/`);
    validateSkill(skillDir, skillName);
  }

  // Report results
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(60));

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All skills compliant with Anthropic standards!');
    console.log(`   ${skillDirs.length} skill(s) validated successfully.`);
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:\n');
    errors.forEach(error => console.error(`   ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    warnings.forEach(warning => console.warn(`   ${warning}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Summary: ${errors.length} error(s), ${warnings.length} warning(s)`);

  if (errors.length > 0) {
    console.log('\n❌ Skill validation FAILED');
    console.log('   Fix errors before committing. See skill-creation-guide.md for standards.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Skill validation passed with warnings');
    console.log('   Consider addressing warnings to improve compliance.');
    process.exit(0);
  }
}

// Run validation
validateAllSkills();
