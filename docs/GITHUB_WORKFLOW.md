# GitHub Workflow - Robust Change Tracking

**Spanish Academic 2026**

This document defines the GitHub workflow and change tracking methodology for maximum code quality, security, and collaboration.

---

## Table of Contents

1. [Overview](#overview)
2. [Branch Strategy](#branch-strategy)
3. [Branch Protection Rules](#branch-protection-rules)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Pull Request Workflow](#pull-request-workflow)
6. [Code Review Standards](#code-review-standards)
7. [Commit Message Convention](#commit-message-convention)
8. [Security & File Protection](#security--file-protection)
9. [Deployment Process](#deployment-process)
10. [Troubleshooting](#troubleshooting)

---

## Overview

**Philosophy:** Every change is tracked, validated, and reviewed before merging to production.

**Key Principles:**
- ✅ All work happens in feature branches
- ✅ Pull requests required for all merges
- ✅ Automated validation in CI/CD
- ✅ Code review required for critical files
- ✅ File protection system prevents accidents
- ✅ Continuous monitoring and audit trail

**Repository:** https://github.com/kidhardt/spanish-academic

---

## Branch Strategy

### Main Branches

**`master`** (production-ready)
- Deployable at all times
- Protected with branch protection rules
- Requires PR + review to merge
- Automatically triggers validation suite in CI
- Direct commits blocked (except emergencies)

**`develop`** (integration branch) - *Future use*
- Integration point for features
- Pre-production testing
- Optional for this project size

### Feature Branches

**Naming Convention:**
```
feature/<description>     # New functionality
fix/<description>         # Bug fixes
hotfix/<description>      # Emergency production fixes
refactor/<description>    # Code refactoring
docs/<description>        # Documentation updates
chore/<description>       # Maintenance tasks
```

**Examples:**
```
feature/astro-integrate
feature/bilingual-routing
fix/hreflang-links
hotfix/broken-mobile-nav
refactor/localization-utils
docs/update-app-stack
chore/dependency-upgrades
```

### Branch Lifecycle

```bash
# 1. Create feature branch from master
git checkout master
git pull origin master
git checkout -b feature/my-feature

# 2. Work on feature (commit frequently)
git add .
git commit -m "feat: add new feature"

# 3. Keep feature branch updated
git fetch origin
git rebase origin/master  # or git merge origin/master

# 4. Push to GitHub
git push -u origin feature/my-feature

# 5. Create Pull Request on GitHub
# (Use PR template)

# 6. After approval + CI passes → Merge via GitHub UI

# 7. Clean up
git checkout master
git pull origin master
git branch -d feature/my-feature  # Delete local branch
```

---

## Branch Protection Rules

**IMPORTANT:** Configure these settings on GitHub after first push.

### Settings for `master` branch

Navigate to: **Settings → Branches → Branch protection rules → Add rule**

**Branch name pattern:** `master`

**Protection Settings:**

✅ **Require a pull request before merging**
- ✅ Require approvals: **1** (minimum)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (for critical files)

✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- **Required status checks:**
  - `Enforce File Protection Rules`
  - `Run Full Validation Suite`
  - `Verify CODEOWNERS Coverage`

✅ **Require conversation resolution before merging**

✅ **Require signed commits** (optional but recommended)

✅ **Require linear history** (optional - enforces rebasing)

✅ **Do not allow bypassing the above settings**
- Ensures admins also follow rules

❌ **Allow force pushes** - DISABLED

❌ **Allow deletions** - DISABLED

### CODEOWNERS File

Already configured in [.github/CODEOWNERS](../.github/CODEOWNERS)

**Protected paths requiring code owner approval:**
```
# AI Governance
/.claude/                      @kidhardt
/CLAUDE.md                     @kidhardt
/project-map.json              @kidhardt

# Build & Config
/scripts/**                    @kidhardt
/package.json                  @kidhardt
/tsconfig.json                 @kidhardt
/vite.config.ts                @kidhardt
/astro.config.mjs              @kidhardt

# Critical Infrastructure
/src/i18n/**                   @kidhardt
/src/utils/localization.ts     @kidhardt
/src/utils/slugTranslations.ts @kidhardt

# Production Config
/public/.htaccess              @kidhardt
/public/robots.txt             @kidhardt

# Protection System (self-protecting)
/.github/CODEOWNERS            @kidhardt
/scripts/pre-commit-check.js   @kidhardt
/scripts/ci-protection-check.cjs @kidhardt
```

**How it works:**
- Changes to these files **require** review from `@kidhardt`
- PRs cannot be merged until code owner approves
- Prevents accidental modifications to critical infrastructure

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** [.github/workflows/file-protection.yml](../.github/workflows/file-protection.yml)

**Triggers:**
- Pull requests to `master`, `main`, or `release/**`
- Direct pushes to these branches (blocked by branch protection, but checked anyway)

### Pipeline Jobs

#### 1. **File Protection Check** (parallel)

**Purpose:** Enforce project-map.json protection rules

**Steps:**
1. Checkout code (full history)
2. Install dependencies
3. Validate `project-map.json` schema
4. Run file protection check on changed files
5. Verify protection system integrity (checksums)
6. Display override log if violations detected

**Exit Code:**
- `0` = All protections enforced
- `1` = Violations detected (blocks merge)

---

#### 2. **Validation Suite** (depends on file protection check)

**Purpose:** Run all quality validation scripts

**Steps:**
1. Checkout code
2. Install dependencies
3. Run `npm run validate-all`:
   - Generate JSON twins
   - Build category pages
   - Generate sitemap
   - Validate localization parity
   - Validate skills
   - Accessibility scan (WCAG AA)
   - HTML size check (<50KB)
   - Data governance scan
   - Sensitive content validation
4. TypeScript type check
5. Build test (Vite + React islands)

**Exit Code:**
- `0` = All validations passed
- `1` = One or more validations failed (blocks merge)

---

#### 3. **CODEOWNERS Check** (parallel)

**Purpose:** Verify critical paths are protected

**Steps:**
1. Check `.github/CODEOWNERS` exists
2. Verify critical paths listed in CODEOWNERS
3. Ensure protection system files protect themselves

**Exit Code:**
- `0` = CODEOWNERS properly configured
- `1` = Critical paths missing (blocks merge)

---

### CI/CD Status Badges

Add to README.md:

```markdown
[![File Protection](https://github.com/kidhardt/spanish-academic/actions/workflows/file-protection.yml/badge.svg)](https://github.com/kidhardt/spanish-academic/actions/workflows/file-protection.yml)
```

---

## Pull Request Workflow

### 1. Before Creating PR

```bash
# Ensure all changes committed
git status

# Update from master
git fetch origin
git rebase origin/master  # or merge

# Run validations locally
npm run validate-all
npm run type-check
npm run build

# Fix any issues before pushing
```

### 2. Push to GitHub

```bash
git push -u origin feature/my-feature
```

### 3. Create Pull Request

**On GitHub:**
1. Navigate to repository
2. Click **"Pull requests"** → **"New pull request"**
3. Select `base: master` ← `compare: feature/my-feature`
4. Click **"Create pull request"**

**Fill out PR template:**
- ✅ Description of changes
- ✅ Type of change (bug fix, feature, etc.)
- ✅ Related issues/beads
- ✅ Complete testing checklist
- ✅ Add screenshots (if UI changes)

### 4. CI/CD Runs Automatically

Watch for green checkmarks:
- ✅ File Protection Check
- ✅ Validation Suite
- ✅ CODEOWNERS Check

**If any fail:**
1. Check logs in GitHub Actions tab
2. Fix issues locally
3. Push fixes to same branch
4. CI re-runs automatically

### 5. Code Review

**For standard changes:**
- Self-review acceptable if CI passes
- Best practice: wait 24 hours before self-merge

**For critical file changes:**
- Code owner review **required** (enforced by GitHub)
- Cannot merge until approved

### 6. Merge Pull Request

**Options:**
- **"Squash and merge"** (recommended) - Clean linear history
- **"Merge commit"** - Preserves all commits
- **"Rebase and merge"** - Linear history without squash

**After merge:**
```bash
# Update local master
git checkout master
git pull origin master

# Delete feature branch
git branch -d feature/my-feature
git push origin --delete feature/my-feature  # Delete remote
```

---

## Code Review Standards

### What to Review

**Functionality:**
- ✅ Code does what PR claims
- ✅ No unintended side effects
- ✅ Edge cases handled

**Code Quality:**
- ✅ Follows project standards (ESLint, Prettier)
- ✅ No unnecessary complexity
- ✅ Proper error handling
- ✅ No console.log or debug code

**Governance:**
- ✅ CLAUDE.md rules followed
- ✅ File protection rules respected
- ✅ Localization parity maintained
- ✅ Mobile-first principles applied

**Documentation:**
- ✅ Code comments where necessary
- ✅ Documentation updated (if applicable)
- ✅ Commit messages clear

**Testing:**
- ✅ CI/CD passes
- ✅ Manual testing completed (if UI changes)
- ✅ No regressions introduced

### Review Checklist

Use this when reviewing PRs:

```markdown
## Code Review Checklist

### Functionality
- [ ] Changes work as described
- [ ] No breaking changes (or documented)
- [ ] Edge cases handled

### Quality
- [ ] Code is readable and maintainable
- [ ] No code smells or anti-patterns
- [ ] Follows project conventions

### Governance
- [ ] CLAUDE.md rules followed
- [ ] File protection respected
- [ ] Localization parity maintained

### Testing
- [ ] CI/CD passes
- [ ] Manually tested (if applicable)
- [ ] No regressions

### Documentation
- [ ] Code commented appropriately
- [ ] Docs updated
- [ ] PR description clear

**Approval:** [Approve / Request Changes / Comment]
```

---

## Commit Message Convention

**Format:** [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** CSS/formatting (not code style)
- **refactor:** Code refactoring
- **perf:** Performance improvement
- **test:** Adding tests
- **build:** Build system changes
- **ci:** CI/CD changes
- **chore:** Maintenance tasks

### Examples

```bash
feat(astro): integrate Astro framework alongside Vite

docs(claude): update governance rules for JSON twins

fix(localization): repair broken hreflang links in /es/

perf(explorer): lazy-load map component to reduce bundle

refactor(i18n): consolidate slug translation logic

chore(deps): upgrade React 18.3.1 → 19.2.0
```

### Footer

Include Co-Authored-By for Claude Code contributions:

```
feat(validation): enforce lightweight HTML payload

Implemented html-size-check.js script to enforce <50KB uncompressed
HTML per page, ensuring mobile-first performance budgets.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Security & File Protection

### Multi-Layer Protection

**Layer 1:** AI Assistant Protocol (CLAUDE.md RULE 0)
- Claude checks project-map.json before file operations
- Asks user approval for critical/high danger files

**Layer 2:** Pre-Commit Hook (local)
```bash
# Installed via
npm run install-hooks
```
- Blocks dangerous commits before they happen
- Fast local validation

**Layer 3:** GitHub Actions CI (server-side)
- Catches `--no-verify` bypasses
- Enforces on all PRs/pushes

**Layer 4:** CODEOWNERS + Branch Protection
- Requires human review for critical files
- Cannot be bypassed

**Layer 5:** Tamper Detection (checksums)
```bash
# Verify integrity
npm run verify-protection-integrity

# Regenerate after legitimate changes
npm run generate-protection-checksums
```

### Protection Workflow

```bash
# 1. Check protection status
npm run check-protection

# 2. Validate project-map.json
npm run validate-project-map

# 3. Verify integrity
npm run verify-protection-integrity
```

**If editing critical files:**
```bash
# ALWAYS create feature branch first
git checkout -b feature/update-localization

# Edit critical file
# (pre-commit hook allows with approval warning)

git add src/utils/localization.ts
git commit -m "feat(i18n): add French support"

# Push and create PR
git push -u origin feature/update-localization

# Code owner review required before merge
```

---

## Deployment Process

### Pre-Deployment Checklist

**IMPORTANT:** Run full pre-deployment validation before deploying.

```bash
# Complete validation + Lighthouse CI
npm run pre-deploy
```

**This runs:**
1. All validation scripts (`validate-all`)
2. Project build (`npm run build`)
3. Lighthouse CI (mobile score >90 enforced)
4. Exits with error if ANY check fails

**Manual checks:**
```bash
# Check beads for blockers
bd ready --json

# Verify critical files
ls public/.htaccess
ls public/robots.txt
ls public/sitemap.xml
```

### Deployment to SiteGround

**Steps:**
1. ✅ Ensure `npm run pre-deploy` passes
2. ✅ Tag release in git: `git tag v1.0.0 && git push origin v1.0.0`
3. ✅ Build production assets: `npm run build`
4. ✅ Deploy `/public/` contents to `public_html/` on SiteGround
5. ✅ Verify deployment: Check key pages load correctly
6. ✅ Monitor: Watch for errors in first 24 hours

**Rollback Plan:**
- Keep previous version backed up
- If critical issues detected, restore previous `public_html/`
- Investigate and fix in feature branch
- Re-deploy after validation

---

## Troubleshooting

### CI/CD Failures

**Problem:** File Protection Check fails

**Solution:**
1. Check GitHub Actions logs for specific violations
2. Review project-map.json rules for affected files
3. If editing critical file, create feature branch first
4. Push to feature branch and create PR

---

**Problem:** Validation Suite fails

**Solution:**
1. Run locally: `npm run validate-all`
2. Fix issues one by one
3. Re-run until all pass
4. Push fixes to branch (CI re-runs automatically)

---

**Problem:** CODEOWNERS Check fails

**Solution:**
1. Verify `.github/CODEOWNERS` exists
2. Check critical paths are listed
3. Add missing paths
4. Commit and push

---

### Branch Protection Issues

**Problem:** Cannot push to master

**Expected behavior:** Branch protection working correctly

**Solution:** Always use feature branches + PRs

---

**Problem:** PR cannot merge (branch protection)

**Possible causes:**
1. CI checks not passing → Fix issues, push fixes
2. Code owner approval missing → Request review from @kidhardt
3. Conversations not resolved → Resolve all comments
4. Branch not up to date → Rebase or merge master

---

### Merge Conflicts

**Problem:** Conflicts when merging master into feature branch

**Solution:**
```bash
git checkout feature/my-feature
git fetch origin
git merge origin/master  # or git rebase origin/master

# Resolve conflicts manually
# Edit conflicted files
git add .
git commit -m "chore: resolve merge conflicts with master"
git push
```

---

## Quick Reference Commands

```bash
# Clone repository
git clone https://github.com/kidhardt/spanish-academic.git

# Create feature branch
git checkout -b feature/my-feature

# Validate locally before push
npm run validate-all
npm run type-check
npm run build

# Push feature branch
git push -u origin feature/my-feature

# Update feature branch from master
git fetch origin
git rebase origin/master

# Pre-deployment validation
npm run pre-deploy

# Check beads status
bd ready
bd list --json

# Generate continuation file
npm run continue
```

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - AI agent governance rules
- [FILE_PROTECTION_SYSTEM.md](FILE_PROTECTION_SYSTEM.md) - Protection system details
- [project-map.json](../project-map.json) - File protection configuration
- [.github/CODEOWNERS](../.github/CODEOWNERS) - Code ownership rules
- [.github/workflows/file-protection.yml](../.github/workflows/file-protection.yml) - CI/CD pipeline

---

**Last Updated:** 2025-10-26
**Version:** 1.0.0
**Maintainer:** Spanish Academic 2026 Team
