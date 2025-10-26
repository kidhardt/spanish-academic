#!/usr/bin/env node

/**
 * Project Map Schema Validator
 *
 * Validates project-map.json against its JSON Schema.
 * Prevents typos and structural errors from silently disabling protection rules.
 *
 * Usage:
 *   npm run validate-project-map
 *   OR
 *   node scripts/validate-project-map-schema.js
 *
 * Exit codes:
 *   0 = Valid
 *   1 = Invalid (schema violations)
 *   2 = Error (file not found, invalid JSON, etc.)
 */

const fs = require('fs');
const path = require('path');

// Note: We don't use a JSON Schema validation library to avoid adding dependencies.
// Instead, we do manual validation of the critical fields.
// For production, consider adding 'ajv' package for full JSON Schema validation.

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`)
};

/**
 * Validate version format (semver)
 */
function validateVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  if (!semverRegex.test(version)) {
    return `Invalid version format: ${version} (expected MAJOR.MINOR.PATCH, e.g., "1.0.0")`;
  }
  return null;
}

/**
 * Validate date format (ISO 8601)
 */
function validateDate(dateStr, fieldName) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) {
    return `Invalid ${fieldName} format: ${dateStr} (expected YYYY-MM-DD)`;
  }

  // Check if it's a valid date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return `Invalid ${fieldName}: ${dateStr} is not a valid date`;
  }

  return null;
}

/**
 * Validate danger level
 */
function validateDangerLevel(danger, pathPattern) {
  const validLevels = ['low', 'medium', 'high', 'critical'];
  if (!validLevels.includes(danger)) {
    return `Invalid danger level "${danger}" for ${pathPattern} (must be one of: ${validLevels.join(', ')})`;
  }
  return null;
}

/**
 * Validate path rule
 */
function validatePathRule(pathPattern, rule) {
  const errors = [];

  // Required fields
  const requiredFields = ['role', 'danger', 'editAllowedDirect', 'allowDelete', 'allowRename', 'requiresApproval', 'notes'];
  for (const field of requiredFields) {
    if (!(field in rule)) {
      errors.push(`Missing required field "${field}" in rule for ${pathPattern}`);
    }
  }

  // Type validation
  if (typeof rule.editAllowedDirect !== 'boolean') {
    errors.push(`Field "editAllowedDirect" must be boolean for ${pathPattern}`);
  }
  if (typeof rule.allowDelete !== 'boolean') {
    errors.push(`Field "allowDelete" must be boolean for ${pathPattern}`);
  }
  if (typeof rule.allowRename !== 'boolean') {
    errors.push(`Field "allowRename" must be boolean for ${pathPattern}`);
  }
  if (typeof rule.requiresApproval !== 'boolean') {
    errors.push(`Field "requiresApproval" must be boolean for ${pathPattern}`);
  }

  // Validate danger level
  if (rule.danger) {
    const dangerError = validateDangerLevel(rule.danger, pathPattern);
    if (dangerError) errors.push(dangerError);
  }

  // Validate notes (must be meaningful)
  if (typeof rule.notes === 'string' && rule.notes.length < 10) {
    errors.push(`Field "notes" for ${pathPattern} is too short (min 10 characters). Provide meaningful explanation.`);
  }

  // Validate mustRunValidators if present
  if (rule.mustRunValidators) {
    if (!Array.isArray(rule.mustRunValidators)) {
      errors.push(`Field "mustRunValidators" must be array for ${pathPattern}`);
    } else {
      // Check for duplicates
      const unique = [...new Set(rule.mustRunValidators)];
      if (unique.length !== rule.mustRunValidators.length) {
        errors.push(`Field "mustRunValidators" contains duplicates for ${pathPattern}`);
      }
    }
  }

  // Validate role (kebab-case)
  if (rule.role && !/^[a-z0-9-]+$/.test(rule.role)) {
    errors.push(`Field "role" for ${pathPattern} must be kebab-case (lowercase, hyphens only)`);
  }

  return errors;
}

/**
 * Main validation
 */
function main() {
  console.log(`${colors.cyan}${colors.bold}Project Map Schema Validator${colors.reset}\n`);

  const mapPath = path.join(process.cwd(), 'project-map.json');

  // Check file exists
  if (!fs.existsSync(mapPath)) {
    log.error(`project-map.json not found at ${mapPath}`);
    process.exit(2);
  }

  log.info('Reading project-map.json...');

  // Parse JSON
  let projectMap;
  try {
    const content = fs.readFileSync(mapPath, 'utf8');
    projectMap = JSON.parse(content);
    log.success('Valid JSON syntax');
  } catch (error) {
    log.error(`Failed to parse JSON: ${error.message}`);
    process.exit(2);
  }

  // Validate structure
  const errors = [];

  // Required top-level fields
  if (!projectMap.version) {
    errors.push('Missing required field: version');
  } else {
    const versionError = validateVersion(projectMap.version);
    if (versionError) errors.push(versionError);
    else log.success(`Version: ${projectMap.version}`);
  }

  if (!projectMap.lastReviewed) {
    errors.push('Missing required field: lastReviewed');
  } else {
    const dateError = validateDate(projectMap.lastReviewed, 'lastReviewed');
    if (dateError) errors.push(dateError);
    else log.success(`Last reviewed: ${projectMap.lastReviewed}`);
  }

  if (!projectMap.paths) {
    errors.push('Missing required field: paths');
  } else if (typeof projectMap.paths !== 'object') {
    errors.push('Field "paths" must be an object');
  } else {
    log.success(`Paths defined: ${Object.keys(projectMap.paths).length}`);

    // Validate each path rule
    for (const [pathPattern, rule] of Object.entries(projectMap.paths)) {
      const pathErrors = validatePathRule(pathPattern, rule);
      errors.push(...pathErrors);
    }
  }

  // Validate allowedTopLevelDirectories if present
  if (projectMap.allowedTopLevelDirectories) {
    if (!Array.isArray(projectMap.allowedTopLevelDirectories)) {
      errors.push('Field "allowedTopLevelDirectories" must be an array');
    } else {
      // Check for duplicates
      const unique = [...new Set(projectMap.allowedTopLevelDirectories)];
      if (unique.length !== projectMap.allowedTopLevelDirectories.length) {
        errors.push('Field "allowedTopLevelDirectories" contains duplicates');
      }
      log.success(`Allowed top-level directories: ${projectMap.allowedTopLevelDirectories.length}`);
    }
  }

  // Report results
  console.log();

  if (errors.length > 0) {
    log.error(`Schema validation failed with ${errors.length} error(s):\n`);
    errors.forEach((error, i) => {
      console.error(`  ${i + 1}. ${error}`);
    });
    console.error(`\n${colors.red}${colors.bold}VALIDATION FAILED${colors.reset}`);
    console.error(`\nFix these errors before committing. Invalid project-map.json can silently disable protection rules.`);
    process.exit(1);
  }

  console.log(`${colors.green}${colors.bold}✓ All schema validations passed${colors.reset}`);
  console.log(`\nproject-map.json is structurally valid and ready for use.`);
  process.exit(0);
}

// Run
if (require.main === module) {
  main();
}

module.exports = { validateVersion, validateDate, validateDangerLevel, validatePathRule };
