# Agent Instructions for Spanish Academic

## Onboarding

When you first start working on this project, run:

```bash
bd onboard
```

This will configure beads integration and familiarize you with the project's task tracking system.

## Core Governance

**Read [CLAUDE.md](./CLAUDE.md) immediately.** It contains all project rules, architecture principles, and prohibited actions.

## Task Management with Beads

This project uses [beads](https://github.com/steveyegge/beads) for milestone and task tracking.

### Essential Commands

- **Find work:** `bd ready --json`
- **Create task:** `bd create "Description" -t feature -p 1 --json`
- **Start task:** `bd update <id> --status in_progress --json`
- **Link dependencies:** `bd dep add <new-id> <parent-id> --type discovered-from`
- **Complete task:** `bd close <id> --reason "Completed" --json`

### When to Use Beads

Create beads for:
- New pages (Program Lists, Insights, Help/Q&A)
- Build script changes
- Claude Skills creation
- Bug fixes
- Performance issues
- Accessibility violations
- Localization gaps

## Pre-Work Checklist

Before starting any task:

1. ✅ Read [CLAUDE.md](./CLAUDE.md)
2. ✅ Run `bd ready --json` to find available work
3. ✅ Understand the bilingual architecture (`/` ↔ `/es/`)
4. ✅ Know the JSON twin requirement (every HTML → `.json`)

## Pre-Commit Checklist

Before committing:

1. ✅ Run `npm run validate-all`
2. ✅ Update bead status
3. ✅ Verify JSON twins exist
4. ✅ Check localization parity
5. ✅ Confirm Lighthouse >90

## Architecture Quick Reference

- **Static HTML** = core content (fast, indexable, citable)
- **React islands** = Explorer, Chat, Contact Form
- **JSON twins** = every page has `.json` for AI/chat
- **Bilingual** = `/` (English) ↔ `/es/` (Spanish)
- **No CMS** = version-controlled, Git-based

## Inviolable Rules

1. **NO commentary on program list pages** (pure links only)
2. **EVERY page needs JSON twin** (run `npm run generate-json`)
3. **High-sensitivity content needs disclaimers** (visa, AI ethics)
4. **Preserve localization parity** (`/` ↔ `/es/`)
5. **Mobile-first, WCAG AA** (Lighthouse >90)
6. **Performance budget** (initial JS <250KB)

## Questions?

Check [CLAUDE.md](./CLAUDE.md) for detailed governance rules and architecture principles.

---

**Project:** Spanish Academic 2026
**Repository:** https://github.com/kidhardt/spanish-academic
**Last Updated:** 2025-10-24
