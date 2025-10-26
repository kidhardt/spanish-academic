# File Protection System

**Version:** 1.0.0
**Last Updated:** 2025-10-25
**Status:** Active

## Overview

The File Protection System is a comprehensive safeguard mechanism that prevents accidental or unauthorized modifications to critical files in the Spanish Academic 2026 project. It combines machine-readable protection rules, automated enforcement, and human oversight to ensure system integrity.

## Problem Statement

When working with AI assistants like Claude Code in a complex codebase with:
- Critical governance files (CLAUDE.md, project-map.json)
- Production content (public/, public/es/)
- Build infrastructure (scripts/, templates/)
- Core application logic (src/i18n/, src/utils/localization.ts)

There is significant risk of:
1. **Accidental deletion** of files critical to operation
2. **Silent modification** of governance rules without awareness
3. **Breaking changes** to localization, SEO, or compliance systems
4. **Loss of audit trail** when files are moved or renamed

Traditional solutions (manual review, post-hoc testing) catch errors too late. We need **preventive guardrails** that block dangerous operations before they happen.

## Solution Architecture

### Three-Layer Defense

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: AI Assistant Protocol (CLAUDE.md RULE 0) │
│  - Must check project-map.json before ANY operation │
│  - Must ask user for approval on critical files     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: Pre-Commit Hook (scripts/pre-commit-      │
│  check.js)                                           │
│  - Blocks commits that violate protection rules     │
│  - Enforces danger levels and allowed operations    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: GitHub Branch Protection + CODEOWNERS     │
│  - Requires code owner approval for critical paths  │
│  - Enforces validation checks before merge          │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. project-map.json

**Location:** Repo root
**Purpose:** Machine-readable risk classification for all files and directories

**Structure:**

```json
{
  "paths": {
    "path/pattern/**": {
      "role": "descriptive-identifier",
      "danger": "low|medium|high|critical",
      "editAllowedDirect": true|false,
      "allowDelete": true|false,
      "allowRename": true|false,
      "requiresApproval": true|false,
      "notes": "Human-readable explanation"
    }
  }
}
```

**Pattern Matching:**

- `**` = match any number of directories (e.g., `.claude/**`)
- `*` = match anything except `/` (e.g., `*.json`)
- More specific patterns take precedence over general ones
- Example: `src/utils/localization.ts` matches specifically, not just `src/**`

**Danger Levels:**

| Level    | Description | Allowed Operations | Approval Required |
|----------|-------------|-------------------|-------------------|
| low      | Safe to modify, minimal risk | All | No |
| medium   | Caution advised, affects functionality | Edit, Rename (ask before delete) | No |
| high     | Affects production or data integrity | Edit (ask before delete/rename) | Yes for destructive ops |
| critical | Security, compliance, core architecture | NONE on main branch | Yes, always |

### 2. scripts/pre-commit-check.js

**Location:** `scripts/pre-commit-check.js`
**Purpose:** Automated enforcement at commit time

**How It Works:**

1. Runs automatically via Git pre-commit hook (`.git/hooks/pre-commit`)
2. Parses `git diff --cached --name-status` to get staged files
3. For each file, matches against `project-map.json` rules
4. Checks:
   - Is deletion allowed? (`allowDelete`)
   - Is rename allowed? (`allowRename`)
   - Is direct edit allowed? (`editAllowedDirect`)
   - Current branch (stricter on main/master)
5. Blocks commit if violations found, displays helpful message
6. Logs override attempts (when using `--no-verify`)

**Exit Codes:**

- `0` = All checks passed
- `1` = Blocked by protection rules
- `2` = Configuration error (project-map.json missing or invalid)

**Output Example:**

```
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.0.0)

Checking 3 staged file(s)...

Current branch: main

❌ BLOCKED: Cannot edit src/utils/localization.ts directly on main branch
  Matched rule: src/utils/localization.ts
  Reason: Core URL + language mapping logic. Breaking this breaks all bilingual navigation.
  Danger level: critical
  Solution: Create a feature branch: git checkout -b feature/update-localization

COMMIT BLOCKED

Options:
  1. Create a feature branch and commit there
  2. Use git worktree for isolated changes
  3. Unstage protected files: git restore --staged <file>
  4. Override (NOT RECOMMENDED): git commit --no-verify
```

### 3. CLAUDE.md RULE 0

**Location:** `CLAUDE.md` (lines 38-137)
**Purpose:** Mandatory protocol for AI assistants

**Key Requirements:**

1. **Check before ANY operation**: Load `project-map.json` and match file path
2. **Respect danger levels**: Never edit critical files directly on main branch
3. **Ask for approval**: Display warning and get explicit user permission
4. **Run validation**: After any change to `public/` or `public/es/`, run validation scripts
5. **Never bypass**: Do not use `--no-verify` or circumvent protection

**Example Interaction:**

```
User: "Update src/utils/localization.ts to add support for French"

Claude: (Checks project-map.json)

🛡️ FILE PROTECTION WARNING

File: src/utils/localization.ts
Danger Level: critical
Operation: edit
Rule: editAllowedDirect: false
Notes: Core URL + language mapping logic. Breaking this breaks all bilingual navigation and SEO.

This file is protected. Options:
1. Create feature branch for this change
2. Use git worktree for isolation
3. Cancel operation

Proceed? [yes/no]
```

### 4. .github/CODEOWNERS

**Location:** `.github/CODEOWNERS`
**Purpose:** Require code owner approval for critical files in PRs

**Format:**

```
# File Protection: Critical Paths (Auto-review required)

# AI Governance
/.claude/ @yourusername
/CLAUDE.md @yourusername
/project-map.json @yourusername

# Build Infrastructure
/scripts/ @yourusername
/templates/ @yourusername

# Core Application Logic
/src/i18n/ @yourusername
/src/utils/localization.ts @yourusername
/src/utils/slugTranslations.ts @yourusername
/src/data/structured/ @yourusername

# Configuration
/package.json @yourusername
/tsconfig.json @yourusername
/vite.config.ts @yourusername
/public/.htaccess @yourusername
/public/robots.txt @yourusername
```

**GitHub Settings:**

In repository settings → Branches → Branch protection rules for `main`:

1. ✅ Require a pull request before merging
2. ✅ Require approvals (at least 1)
3. ✅ Require review from Code Owners
4. ✅ Require status checks to pass before merging:
   - `npm run validate-all`
   - `npm run type-check`
   - `Lighthouse CI` (if configured)
5. ✅ Require branches to be up to date before merging
6. ✅ Do not allow bypassing the above settings

## Installation

### Step 1: Install Pre-Commit Hook

Run the installer script:

```bash
npm run install-hooks
```

This creates `.git/hooks/pre-commit` that calls `scripts/pre-commit-check.js`.

**Manual Installation:**

```bash
# Make the check script executable
chmod +x scripts/pre-commit-check.js

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
node scripts/pre-commit-check.js
EOF

# Make hook executable
chmod +x .git/hooks/pre-commit
```

### Step 2: Configure GitHub

1. Create `.github/CODEOWNERS` (see template above)
2. Enable branch protection on `main` branch
3. Require code owner approval
4. Add required status checks

### Step 3: Verify Installation

Test the protection system:

```bash
# Test 1: Try to commit a change to a critical file on main branch
echo "test" >> CLAUDE.md
git add CLAUDE.md
git commit -m "test"
# Expected: BLOCKED by pre-commit hook

# Test 2: Verify project-map.json is valid
node -e "console.log(JSON.parse(require('fs').readFileSync('project-map.json')))"
# Expected: No errors, displays JSON

# Test 3: Run pre-commit check manually
node scripts/pre-commit-check.js
# Expected: "No staged files to check" or protection check results
```

## Usage

### For Developers

**Normal Workflow:**

```bash
# 1. Create feature branch for protected files
git checkout -b feature/update-localization

# 2. Make changes
# Edit src/utils/localization.ts

# 3. Commit (pre-commit hook runs automatically)
git add src/utils/localization.ts
git commit -m "feat(i18n): add French language support"

# 4. Push and create PR
git push -u origin feature/update-localization
# Open PR on GitHub - code owner approval will be required
```

**When Protection Blocks You:**

```
COMMIT BLOCKED

Options:
  1. Create a feature branch ← DO THIS
  2. Use git worktree
  3. Unstage protected files
  4. Override with --no-verify ← AVOID
```

**Best Practice:** Create feature branch, never use `--no-verify` unless absolutely necessary.

### For AI Assistants

**Mandatory Protocol (CLAUDE.md RULE 0):**

```javascript
// Before ANY file operation:
const projectMap = JSON.parse(fs.readFileSync('project-map.json', 'utf8'));
const match = matchFileToRule(filePath, projectMap);

if (match.rule.danger === 'critical' || match.rule.danger === 'high') {
  if (!match.rule.editAllowedDirect) {
    // STOP - Ask user for approval
    askUser(`🛡️ FILE PROTECTION WARNING...`);
  }
}

// After changes to public/ or public/es/:
runValidation(['generate-json', 'validate-localization', 'data-governance-scan']);
```

**Never:**

- Edit files marked `editAllowedDirect: false` without asking
- Delete files marked `allowDelete: false`
- Rename files marked `allowRename: false`
- Use `git commit --no-verify` to bypass protection

**Always:**

- Check `project-map.json` before operating on any file
- Ask for explicit approval on `danger: critical` files
- Create feature branch for protected files
- Run validation scripts after changes

## Maintenance

### Adding New Protection Rules

1. Edit `project-map.json`
2. Add new path pattern with appropriate danger level
3. Document in `notes` field why it's protected
4. Test with `node scripts/pre-commit-check.js`
5. Update this documentation if adding new categories

### Updating Danger Levels

When promoting/demoting file danger levels:

1. **Review impact**: What breaks if this file is corrupted?
2. **Update project-map.json**: Change `danger` level
3. **Update CLAUDE.md**: Add/remove from protected files list if critical
4. **Update CODEOWNERS**: Add/remove code owner if critical
5. **Communicate**: Notify team of protection changes

### Audit Trail

**Pre-Commit Hook Logs:**

Location: `.git/protection-overrides.log`

Records all `--no-verify` override attempts:

```
2025-10-25T14:30:00.000Z | John Doe <john@example.com> | OVERRIDE --no-verify
Files: src/utils/localization.ts

2025-10-25T15:45:00.000Z | Jane Smith <jane@example.com> | OVERRIDE --no-verify
Files: CLAUDE.md
```

**Review overrides periodically** to identify patterns or training needs.

## Example Scenarios

### Scenario 1: Blocked Critical File Edit on Main Branch

```bash
$ git branch
* main

$ echo "// test" >> src/utils/localization.ts

$ git add src/utils/localization.ts

$ git commit -m "test"
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.1.0)

Checking 1 staged file(s)...

Current branch: main

Protection Violations:

❌ BLOCKED: Cannot edit src/utils/localization.ts directly on main branch
  Matched rule: src/utils/localization.ts
  Reason: Core URL + language mapping logic. Breaking this breaks all bilingual navigation.
  Danger level: critical
  Solution: Create a feature branch: git checkout -b feature/update-localization
  Or use git worktree: npm run worktree:create

❌ BLOCKED: Cannot commit critical changes on main branch

  Reason: Changes to danger:critical files must occur in isolated feature branches.

  Solutions:
    1. Create feature branch: git checkout -b feature/<description>
    2. Or safety branch: git checkout -b safety/<description>
    3. Use git worktree for isolation: npm run worktree:create

  Required: Branch name must start with feature/, safety/, fix/, or refactor/

COMMIT BLOCKED

You have 2 violation(s) that must be resolved.

Options:
  1. Create a feature branch and commit there
  2. Use git worktree for isolated changes
  3. Unstage protected files: git restore --staged <file>
  4. Override (NOT RECOMMENDED): git commit --no-verify

Note: Overrides are logged in .git/protection-overrides.log
```

**Correct Workflow:**

```bash
$ git checkout -b feature/update-localization
Switched to a new branch 'feature/update-localization'

$ git add src/utils/localization.ts

$ git commit -m "feat(i18n): add French language support"
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.1.0)

Checking 1 staged file(s)...

Current branch: feature/update-localization

Warnings:

⚠ APPROVAL REQUIRED: src/utils/localization.ts
  Matched rule: src/utils/localization.ts
  Danger level: critical
  Note: Core URL + language mapping logic. MUST go through review.
  This change will require code owner approval in PR.

✓ All protection checks passed

Note: 1 file(s) require code owner approval in PR.

[feature/update-localization abc1234] feat(i18n): add French language support
 1 file changed, 5 insertions(+)
```

### Scenario 2: Blocked New Top-Level Directory

```bash
$ mkdir old
$ touch old/deprecated-code.js
$ git add old/

$ git commit -m "archive old code"
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.1.0)

Checking 1 staged file(s)...

Current branch: feature/cleanup

❌ BLOCKED: New top-level directory detected

  old/ (not in allowedTopLevelDirectories)

  Reason: Creating new top-level directories forks truth and defeats governance.
  Common violations: old/, backup/, deprecated/, v2/, utils2/

  Solutions:
    1. Use existing directory structure (src/, public/, docs/, etc.)
    2. Get approval to add this directory to project-map.json allowedTopLevelDirectories
    3. Cancel operation

  Note: If approved, edit project-map.json first, then commit changes together.

COMMIT BLOCKED
```

### Scenario 3: Required Validators After Public/ Changes

```bash
$ echo "<p>Updated content</p>" >> public/test-page.html

$ git add public/test-page.html

$ git commit -m "update test page"
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.1.0)

Checking 1 staged file(s)...

Current branch: feature/content-update

Warnings:

⚠ APPROVAL REQUIRED: public/test-page.html
  Matched rule: public/**
  Danger level: high
  Note: Live English pages. Run validation after ANY change.
  This change will require code owner approval in PR.

⚠ VALIDATORS REQUIRED: After committing, you MUST run:
  npm run generate-json
  npm run validate-localization
  npm run data-governance-scan
  npm run accessibility-scan
  Reason: Changes to public/ or public/es/ require validation.
  Or run all: npm run validate-all

✓ All protection checks passed

Note: 1 file(s) require code owner approval in PR.

[feature/content-update def5678] update test page
 1 file changed, 1 insertion(+)

$ npm run validate-all
# Runs all validation scripts...
```

### Scenario 4: Blocked File Deletion

```bash
$ git rm CLAUDE.md

$ git commit -m "remove old docs"
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.1.0)

Checking 1 staged file(s)...

Current branch: feature/cleanup

Protection Violations:

❌ BLOCKED: Cannot delete CLAUDE.md
  Matched rule: CLAUDE.md
  Reason: High-sensitivity rules for AI assistants. Any change requires explicit human yes/no and MUST occur on a feature branch. This is the constitution.
  Danger level: critical
  Solution: This file is protected from deletion.

COMMIT BLOCKED

You have 1 violation(s) that must be resolved.
```

### Scenario 5: Clean Commit (All Checks Pass)

```bash
$ git branch
* feature/add-help-page

$ echo "# FAQ" > docs/FAQ.md

$ git add docs/FAQ.md

$ git commit -m "docs: add FAQ page"
🛡️ File Protection Check (project-map.json enforcement)

✓ Loaded project-map.json (version 1.1.0)

Checking 1 staged file(s)...

Current branch: feature/add-help-page

✓ All protection checks passed

[feature/add-help-page ghi9012] docs: add FAQ page
 1 file changed, 1 insertion(+)
 create mode 100644 docs/FAQ.md
```

## Troubleshooting

### Pre-Commit Hook Not Running

**Symptom:** Commits succeed even for protected files

**Solutions:**

1. Check hook exists: `ls -la .git/hooks/pre-commit`
2. Check hook is executable: `chmod +x .git/hooks/pre-commit`
3. Verify hook content calls script: `cat .git/hooks/pre-commit`
4. Test manually: `node scripts/pre-commit-check.js`

### False Positives (Blocks Safe Changes)

**Symptom:** Hook blocks changes that should be allowed

**Solutions:**

1. Check current branch: `git branch` (stricter on main)
2. Review pattern matching in project-map.json
3. Create feature branch if on main
4. If truly safe, use `--no-verify` (logged) and create issue to fix rule

### project-map.json Syntax Errors

**Symptom:** Hook fails with "Failed to parse project-map.json"

**Solutions:**

1. Validate JSON: `node -e "JSON.parse(require('fs').readFileSync('project-map.json'))"`
2. Use JSON validator: [jsonlint.com](https://jsonlint.com)
3. Check for trailing commas, missing quotes, unclosed braces

## Best Practices (2025 Standards)

Based on research from GitHub, GitGuardian, and AI safety standards:

### 1. Least Privilege by Default

- Start with strict protection (`danger: critical`, `editAllowedDirect: false`)
- Relax only when proven safe through testing
- Use teams in CODEOWNERS instead of individuals (avoid bottlenecks)

### 2. Defense in Depth

- Layer 1: AI protocol (preventive)
- Layer 2: Pre-commit hook (automatic)
- Layer 3: GitHub branch protection (human review)
- No single point of failure

### 3. Audit Everything

- Log all overrides (`.git/protection-overrides.log`)
- Review logs monthly
- Track patterns (repeated overrides = rule needs adjustment)

### 4. Make Violations Helpful

- Clear error messages with specific solutions
- Point to documentation
- Suggest concrete next steps (create branch, use worktree)

### 5. Protect the Protections

- `project-map.json` itself is `danger: critical`
- `scripts/pre-commit-check.js` itself is `danger: critical`
- CODEOWNERS file in protected directory (`.github/`)
- Self-referential protection prevents disabling

### 6. Document Rationale

- Every protected path has `notes` explaining why
- Links to relevant documentation
- Helps future developers understand intent

## References

### Internal Documentation

- [CLAUDE.md](../CLAUDE.md) - AI agent governance (includes RULE 0)
- [project-map.json](../project-map.json) - Protection rules
- [scripts/pre-commit-check.js](../scripts/pre-commit-check.js) - Enforcement script
- [.github/CODEOWNERS](../.github/CODEOWNERS) - Code ownership

### External Resources

- [GitHub Branch Protection Best Practices (2025)](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [GitGuardian: Three Mechanisms to Protect Git Repositories](https://blog.gitguardian.com/three-mechanisms-to-protect-your-git-repositories/)
- [Pre-Commit Hooks Guide (2025)](https://pre-commit.com/)
- [AWS Bedrock Guardrails](https://aws.amazon.com/bedrock/guardrails/) - AI safety patterns
- [Australia Voluntary AI Safety Standard](https://www.industry.gov.au/publications/voluntary-ai-safety-standard/10-guardrails)

## Changelog

### Version 1.1.0 (2025-10-25)

**Critical Enhancements** (based on 2025 best practices review):

- **Protect the Protectors**: Added self-protection for system files
  - `project-map.json`, `pre-commit-check.js`, `install-git-hooks.js` now in CODEOWNERS
  - `.github/CODEOWNERS` protects itself
  - `docs/FILE_PROTECTION_SYSTEM.md` requires code owner approval

- **Block New Top-Level Directories**: Prevents truth-forking
  - Added `allowedTopLevelDirectories` whitelist to project-map.json
  - Pre-commit hook blocks creation of `old/`, `backup/`, `v2/`, etc.
  - CLAUDE.md RULE 0 requires checking whitelist before creating top-level dirs

- **Branch Name Policy Enforcement**: Critical changes require proper branches
  - Cannot commit critical files on `main` or `release/*` branches AT ALL
  - Critical changes require branch prefix: `feature/`, `safety/`, `fix/`, `refactor/`, `docs/`
  - Audit trail: branch name describes what's changing

- **Automatic Validator Detection**: Push mental load into JSON
  - Added `mustRunValidators` array to `public/**` and `public/es/**` rules
  - Hook displays required validators after commit (e.g., `generate-json`, `validate-localization`)
  - Removes need to remember which scripts to run

- **Version Tracking**: Added `version` and `lastReviewed` fields
  - Enables diffing policy changes over time
  - Compliance requirement for governance docs

- **Explicit Rename/Delete Handling**: Hook now explicitly checks D and R status
  - Confirmed implementation blocks renames (`allowRename: false`)
  - Confirmed implementation blocks deletions (`allowDelete: false`)

- **CLI Examples**: Added 5 real-world scenarios to documentation
  - Blocked critical file edit on main
  - Blocked new top-level directory
  - Required validators after public/ changes
  - Blocked file deletion
  - Clean commit (all checks pass)

### Version 1.0.0 (2025-10-25)

- Initial implementation
- Created project-map.json with comprehensive path coverage
- Implemented pre-commit-check.js enforcement script
- Added CLAUDE.md RULE 0 (mandatory AI assistant protocol)
- Documented system architecture and usage
- Established 3-layer defense strategy

## License

This protection system is part of Spanish Academic 2026 and follows the same license as the parent project.

---

**Last Reviewed:** 2025-10-25
**Reviewers:** System Architect
**Next Review:** 2025-11-25 (monthly)