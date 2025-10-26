# Pull Request

## Description

<!-- Briefly describe what this PR does and why -->

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI change (CSS, layout, design)
- [ ] ♻️ Refactoring (no functional changes)
- [ ] 🚀 Performance improvement
- [ ] ✅ Test updates
- [ ] 🔧 Configuration change
- [ ] 🌐 Localization/i18n update

## Related Issues

<!-- Link to related issues, beads, or discussion -->

Fixes # (issue)
Related to # (issue)
Closes # (bead)

## Changes Made

<!-- List the key changes in this PR -->

-
-
-

## Testing Checklist

<!-- Mark completed items with an 'x' -->

### Build & Type Safety
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] No new TypeScript errors introduced

### Validation Suite
- [ ] `npm run validate-all` passes
- [ ] `npm run accessibility-scan` passes (no new violations)
- [ ] `npm run validate-localization` passes
- [ ] `npm run data-governance-scan` passes (if applicable)

### File Protection
- [ ] No modifications to `danger: critical` files on main branch
- [ ] If critical files modified, created feature branch first
- [ ] `npm run validate-project-map` passes
- [ ] `npm run verify-protection-integrity` passes

### Performance & Quality
- [ ] Lighthouse mobile score >90 (if UI changes)
- [ ] Bundle size within limits (<250KB per chunk)
- [ ] No new security vulnerabilities (`npm audit`)

### Localization (if applicable)
- [ ] English and Spanish versions created (or NON-PARITY designated)
- [ ] Hreflang links bidirectional
- [ ] Language switcher functional
- [ ] `npm run parity:list` verified

### Sensitive Content (if applicable)
- [ ] High-sensitivity content tracked with `npm run sensitive-content:add`
- [ ] Disclaimers added where required (visa, AI ethics, funding)
- [ ] `lastReviewed` dates updated

## Screenshots / Demo

<!-- If applicable, add screenshots or demo links -->

## Deployment Notes

<!-- Any special considerations for deployment? -->

- [ ] Database migration required
- [ ] Environment variables need updating
- [ ] Cache clearing recommended
- [ ] Third-party service configuration needed

## Checklist Before Requesting Review

- [ ] Self-reviewed my own code
- [ ] Commented code in hard-to-understand areas
- [ ] Updated documentation (if applicable)
- [ ] No console.log or debug code left in
- [ ] Followed project coding standards (ESLint, Prettier)
- [ ] Followed CLAUDE.md governance rules
- [ ] Tested on real mobile device (if UI changes)
- [ ] Checked browser compatibility (Chrome, Safari, Firefox)

## Post-Merge Tasks

<!-- What needs to happen after merge? -->

- [ ] Update beads status: `bd close <issue-id> --reason "Merged PR #X"`
- [ ] Notify team in Slack/Discord
- [ ] Generate continuation file: `npm run continue`
- [ ] Monitor production for regressions

---

**Generated using Claude Code PR Template v1.0**
