---
name: skill-creation-guide
description: Governance and standards for creating Claude skills in Spanish Academic Network
---

# Skill Creation Guide - Spanish Academic Network

**Purpose:** Define standards, structure, and enforcement for creating Claude skills aligned with Anthropic's skill-creator specification.

**Authority:** This document is part of project governance. All Claude agents and developers MUST follow these standards when creating new skills.

**Last Updated:** 2025-10-25
**Version:** 1.0.0

---

## Anthropic Skill Standards (Required)

### Directory Structure

**EVERY skill MUST follow this structure:**

```
.claude/skills/[skill-name]/
├── SKILL.md (REQUIRED)
│   ├── YAML frontmatter (REQUIRED)
│   │   ├── name: (required, lowercase-letters-hyphens)
│   │   └── description: (required, what + when to use)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/     - Executable code (Python/Bash/etc.)
    ├── references/  - Docs loaded into context on-demand
    └── assets/      - Output templates, icons, fonts, etc.
```

**Key Requirements:**
1. ✅ Skill directory uses **gerund naming** (e.g., `processing-data`, `generating-json`)
2. ✅ Main file MUST be named `SKILL.md` (uppercase)
3. ✅ YAML frontmatter is REQUIRED at top of SKILL.md
4. ✅ Supporting files organized in subdirectories
5. ✅ Progressive disclosure: files loaded on-demand

---

## YAML Frontmatter Requirements

**Every SKILL.md MUST start with YAML frontmatter:**

```yaml
---
name: skill-name-here
description: One-sentence description of what this skill does and when to use it
---
```

### Frontmatter Rules

**name:**
- REQUIRED
- Format: `lowercase-letters-hyphens`
- Use gerunds (processing, generating, validating)
- Match directory name
- Examples: `generating-json-ld`, `validating-accessibility`, `building-templates`

**description:**
- REQUIRED
- One clear sentence
- Format: `[What it does] + [when to use it]`
- Must be actionable
- Examples:
  - ✅ "Generate JSON-LD structured data for HTML pages when creating or updating templates"
  - ✅ "Validate WCAG AA accessibility compliance before committing HTML changes"
  - ❌ "JSON-LD skill" (too vague)
  - ❌ "This skill helps with accessibility" (not actionable)

---

## Skill Naming Conventions

### Use Gerunds (Action-Oriented)

✅ **CORRECT:**
- `generating-json-ld`
- `validating-localization`
- `creating-continuations`
- `building-templates`
- `enforcing-mobile-first`

❌ **WRONG:**
- `json-ld-skill` (not a gerund)
- `localization` (not action-oriented)
- `continuation-director` (not a gerund)
- `template-builder` (noun, not gerund)
- `mobile-first` (not action-oriented)

### Naming Guidelines

1. **Start with action verb** in gerund form (-ing)
2. **Be specific** about what the skill does
3. **Use hyphens** to separate words
4. **Keep concise** (2-4 words max)
5. **Avoid generic terms** like "skill", "helper", "utility"

---

## File Organization

### SKILL.md Structure

```markdown
---
name: skill-name
description: What it does and when to use it
---

# Skill Name - Spanish Academic Network

**Purpose:** Detailed purpose statement

**Invocation triggers:** (if applicable)
- Specific phrases that invoke this skill
- Commands that trigger it

---

## Instructions for AI Agent

[Clear, step-by-step instructions]

### Step 1: [Action]
[Detailed instructions]

### Step 2: [Action]
[Detailed instructions]

---

## Examples

[Code examples, templates, or demonstrations]

---

## Validation & Testing

[How to verify the skill works correctly]

---

## Related Skills

[Links to related skills in this project]
```

### Optional Subdirectories

**scripts/** - Executable code
```
[skill-name]/scripts/
├── generate.py
├── validate.sh
└── README.md
```

**references/** - Documentation loaded on-demand
```
[skill-name]/references/
├── schema-spec.md
├── best-practices.md
└── examples.md
```

**assets/** - Templates and outputs
```
[skill-name]/assets/
├── templates/
│   ├── html-template.html
│   └── json-template.json
└── examples/
    └── output-example.html
```

---

## Enforcement Mechanism

### Pre-Commit Validation

**Create:** `scripts/validate_skills.js`

**Purpose:** Validate all skills comply with standards before committing

**Checks:**
1. ✅ Each skill directory has `SKILL.md`
2. ✅ YAML frontmatter present and valid
3. ✅ `name` field matches directory name
4. ✅ `description` field is present and non-empty
5. ✅ Skill name uses gerund form
6. ✅ No loose `.md` files in `.claude/skills/` root
7. ✅ Optional subdirectories follow naming convention

**Usage:** `npm run validate-skills`

**Exit codes:**
- 0: All skills compliant
- 1: Validation errors found (blocks commit)

### Git Pre-Commit Hook (Optional)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
npm run validate-skills
if [ $? -ne 0 ]; then
  echo "❌ Skill validation failed. Fix errors before committing."
  exit 1
fi
```

---

## Migration Plan for Existing Skills

### Current Non-Compliant Skills

**1. continuation-director** ❌
```
Current: .claude/skills/continuation-director.md
Target:  .claude/skills/generating-continuations/SKILL.md
```

**Migration:**
- Rename directory: `continuation-director` → `generating-continuations`
- Rename file: `continuation-director.md` → `SKILL.md`
- Add YAML frontmatter
- Move `directors/continuations/` → `generating-continuations/references/continuations/`

**2. json-skill** ❌
```
Current: .claude/skills/json-skill/json-skill-master.md
Target:  .claude/skills/generating-json-ld/SKILL.md
```

**Migration:**
- Rename directory: `json-skill` → `generating-json-ld`
- Rename file: `json-skill-master.md` → `SKILL.md`
- Add YAML frontmatter
- Keep structure but ensure compliance

---

## Creating a New Skill: Step-by-Step

### Step 1: Choose Skill Name

Use gerund form:
- What action does it perform? (generate, validate, build, enforce, create)
- What does it act on? (json-ld, templates, accessibility)
- Combine: `generating-json-ld`, `validating-accessibility`

### Step 2: Create Directory Structure

```bash
cd .claude/skills
mkdir [skill-name]
cd [skill-name]
touch SKILL.md
```

### Step 3: Write SKILL.md with Frontmatter

```markdown
---
name: generating-json-ld
description: Generate JSON-LD structured data for HTML pages when creating or updating templates
---

# Generating JSON-LD - Spanish Academic Network

**Purpose:** [Detailed purpose]

---

## Instructions for AI Agent

[Step-by-step instructions]
```

### Step 4: Add Supporting Resources (Optional)

```bash
# If you have scripts
mkdir scripts
echo "# Scripts for generating-json-ld" > scripts/README.md

# If you have reference docs
mkdir references
echo "# References for generating-json-ld" > references/README.md

# If you have templates/assets
mkdir assets
echo "# Assets for generating-json-ld" > assets/README.md
```

### Step 5: Validate Compliance

```bash
npm run validate-skills
```

### Step 6: Test the Skill

Invoke the skill in Claude Code and verify:
- ✅ Claude discovers the skill at startup
- ✅ Skill appears in available skills list
- ✅ Skill executes correctly when invoked
- ✅ Progressive disclosure works (loads files on-demand)

### Step 7: Document in CLAUDE.md

Add skill to the "Claude Skills Rules" section:
```markdown
### Available Skills

- **generating-json-ld** - Generate JSON-LD structured data for HTML pages
- **validating-accessibility** - Validate WCAG AA compliance before commits
```

---

## Skill Best Practices

### 1. Single Responsibility

Each skill should do ONE thing well.

✅ **GOOD:**
- `generating-json-ld` - Only handles JSON-LD generation
- `validating-accessibility` - Only validates accessibility

❌ **BAD:**
- `html-utilities` - Too broad, does multiple unrelated things

### 2. Clear Instructions

Use step-by-step format:

```markdown
## Instructions for AI Agent

### Step 1: Parse HTML File
Extract metadata from HTML `<head>` section:
- Title
- Meta description
- Page type

### Step 2: Select Schema Template
Based on page type, choose appropriate Schema.org type:
- Article pages → Article + FAQPage
- Program pages → Course + FAQPage
```

### 3. Include Examples

Show concrete examples, not just descriptions:

```markdown
## Example Output

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Funding Strategies"
}
</script>
```
```

### 4. Specify Validation

Tell Claude how to verify success:

```markdown
## Validation

After generating JSON-LD:
1. ✅ Valid JSON syntax (no trailing commas)
2. ✅ Includes @context and @type
3. ✅ Matches visible page content
4. ✅ Validates with Google Rich Results Test
```

### 5. Link Related Skills

```markdown
## Related Skills

- **validating-localization** - Validate bilingual parity after template creation
- **building-templates** - Create HTML templates that need JSON-LD
```

### 6. Progressive Disclosure

Put frequently-used info in SKILL.md, rarely-used details in references/:

```markdown
## Core Instructions

[Essential steps here]

## Advanced Configuration

See [references/advanced-config.md](references/advanced-config.md) for:
- Custom schema types
- Complex nested entities
- Multi-language considerations
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Not Using Gerunds

```
❌ json-ld-skill          # Not action-oriented
✅ generating-json-ld     # Clear gerund
```

### ❌ Mistake 2: Missing YAML Frontmatter

```markdown
❌ # My Skill              # No frontmatter

✅ ---                     # Correct
✅ name: my-skill
✅ description: Does X when Y
✅ ---
```

### ❌ Mistake 3: Vague Description

```yaml
❌ description: Helps with JSON-LD      # Vague
✅ description: Generate JSON-LD structured data for HTML pages when creating templates
```

### ❌ Mistake 4: Wrong File Name

```
❌ [skill-name]/skill.md               # Lowercase 's'
❌ [skill-name]/README.md              # Wrong name
✅ [skill-name]/SKILL.md               # Correct (uppercase)
```

### ❌ Mistake 5: Loose Files in Root

```
❌ .claude/skills/json-skill-master.md           # Loose file in root
✅ .claude/skills/generating-json-ld/SKILL.md    # Properly organized
```

---

## Validation Script Specification

### Create: `scripts/validate_skills.js`

**Purpose:** Enforce skill standards automatically

**Pseudo-code:**

```javascript
// 1. Scan .claude/skills/ directory
const skillDirs = glob('.claude/skills/*/', { ignore: 'node_modules' });

for (const dir of skillDirs) {
  const skillName = path.basename(dir);

  // 2. Check SKILL.md exists
  const skillPath = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    errors.push(`${skillName}: Missing SKILL.md`);
    continue;
  }

  // 3. Parse YAML frontmatter
  const content = fs.readFileSync(skillPath, 'utf-8');
  const frontmatter = extractYAML(content);

  // 4. Validate frontmatter
  if (!frontmatter.name) {
    errors.push(`${skillName}: Missing 'name' in frontmatter`);
  }

  if (!frontmatter.description) {
    errors.push(`${skillName}: Missing 'description' in frontmatter`);
  }

  // 5. Validate name matches directory
  if (frontmatter.name !== skillName) {
    errors.push(`${skillName}: Frontmatter 'name' (${frontmatter.name}) doesn't match directory name`);
  }

  // 6. Validate gerund naming
  if (!isGerund(skillName)) {
    warnings.push(`${skillName}: Should use gerund form (e.g., generating-*, validating-*)`);
  }
}

// 7. Check for loose files in root
const looseFiles = glob('.claude/skills/*.md');
if (looseFiles.length > 1) {  // Allow skill-creation-guide.md
  errors.push(`Loose .md files in root: ${looseFiles.join(', ')}`);
}

// 8. Report results
if (errors.length > 0) {
  console.error('❌ Skill validation failed:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}
```

**Add to package.json:**

```json
{
  "scripts": {
    "validate-skills": "node scripts/validate_skills.js"
  }
}
```

---

## Project-Specific Skill Categories

### Skill Types in Spanish Academic Network

**1. Generation Skills**
- `generating-json-ld` - Create Schema.org markup
- `generating-continuations` - Create session continuations
- `generating-templates` - Build HTML templates

**2. Validation Skills**
- `validating-accessibility` - WCAG AA checks
- `validating-localization` - Bilingual parity
- `validating-seo` - SEO metadata checks

**3. Build Skills**
- `building-categories` - Auto-generate category pages
- `building-sitemap` - Create sitemap.xml

**4. Enforcement Skills**
- `enforcing-mobile-first` - CSS compliance
- `enforcing-touch-targets` - 44px minimum checks

---

## Checklist for New Skills

Before committing a new skill:

- [ ] Directory name uses gerund form (`[action]-[object]`)
- [ ] Main file named `SKILL.md` (uppercase)
- [ ] YAML frontmatter present with `name` and `description`
- [ ] `name` matches directory name
- [ ] `description` is clear and actionable
- [ ] Instructions are step-by-step
- [ ] Examples provided
- [ ] Validation criteria specified
- [ ] Supporting files in proper subdirectories (`scripts/`, `references/`, `assets/`)
- [ ] No loose files in `.claude/skills/` root
- [ ] `npm run validate-skills` passes
- [ ] Skill documented in CLAUDE.md
- [ ] Skill tested in Claude Code

---

## Migration Roadmap

### Phase 1: Create Validation Script (Immediate)

**Task:** Build `scripts/validate_skills.js`

**Deliverable:** Working validation script that checks:
- SKILL.md exists
- YAML frontmatter valid
- Name matches directory
- No loose files

**Acceptance:** `npm run validate-skills` runs successfully

### Phase 2: Migrate Existing Skills (High Priority)

**Tasks:**
1. Migrate `continuation-director` → `generating-continuations`
2. Migrate `json-skill` → `generating-json-ld`
3. Add YAML frontmatter to both
4. Move supporting files to proper subdirectories

**Acceptance:** All skills pass validation

### Phase 3: Enforce Pre-Commit (Optional)

**Task:** Add git pre-commit hook

**Deliverable:** Skills validated automatically before commits

**Acceptance:** Cannot commit non-compliant skills

### Phase 4: Create New Skills (Ongoing)

**Tasks:**
- Create skills for remaining build scripts
- Document each script as a skill
- Follow standards from day one

**Examples:**
- `validating-accessibility` (wraps accessibility-scan.js)
- `validating-localization` (wraps validate_localization.js)
- `building-sitemap` (wraps generate_sitemap.js)

---

## Questions & Answers

**Q: Can I have multiple SKILL.md files in one directory?**
A: No. Only one SKILL.md per skill directory.

**Q: What if my skill needs to load large reference documents?**
A: Use `references/` subdirectory. Claude loads them on-demand (progressive disclosure).

**Q: Can I use spaces in skill names?**
A: No. Use hyphens only: `generating-json-ld`, not `generating json ld`.

**Q: What if my skill name doesn't naturally fit gerund form?**
A: Rethink the name to focus on the action. Every skill performs an action.
- ❌ `utilities` → ✅ `processing-utilities`
- ❌ `helper` → ✅ `assisting-with-[task]`

**Q: Can I keep the old skill structure during migration?**
A: No. All skills MUST comply with standards. Migrate or remove non-compliant skills.

**Q: What if I have a skill that's just documentation?**
A: That's a reference document, not a skill. Move to `docs/` or skill's `references/` subdirectory.

---

## Summary

**Key Takeaways:**

1. ✅ Every skill = one directory with `SKILL.md` + optional subdirectories
2. ✅ YAML frontmatter REQUIRED (`name`, `description`)
3. ✅ Use gerund naming (`generating-*`, `validating-*`, `building-*`)
4. ✅ Validate with `npm run validate-skills` before committing
5. ✅ No loose `.md` files in `.claude/skills/` root
6. ✅ Progressive disclosure: frequently-used in SKILL.md, rarely-used in subdirectories

**This is not optional. These standards are project governance.**

---

**Last Updated:** 2025-10-25
**Authority:** Project Governance (CLAUDE.md compliant)
**Enforcement:** `npm run validate-skills` (to be implemented)
