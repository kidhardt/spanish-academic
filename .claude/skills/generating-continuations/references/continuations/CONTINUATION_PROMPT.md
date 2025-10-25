# Continuation Prompt for Spanish Academic 2026

Copy and paste this prompt into a new Claude Code chat to continue where you left off:

---

## Context

I'm working on **Spanish Academic 2026**, an authoritative bilingual platform for graduate programs in Spanish Linguistics, Literature, Translation/Interpreting, and related fields.

## Current Status

✅ **92 beads created and tracked** using Steve Yegge's Beads system (https://github.com/steveyegge/beads)
✅ **Project architecture fully defined** with 4 foundational principles:
- Mobile-first (15 beads, 60-74)
- Localization-first (15 beads, 45-59)
- SEO-first (18 beads, 75-92)
- Accessibility-first (integrated throughout)

✅ **10 Priority 1 beads ready** to start immediately
✅ **Complete documentation** in place:
- `README.md` - Architecture overview
- `CLAUDE.md` - AI agent governance rules (CRITICAL - read this first!)
- `AGENTS.md` - Beads workflow guide
- `GETTING_STARTED.md` - 10-week implementation roadmap

## Project Location

```
m:\VS SpAca\spanish-academic\
```

## What I Need Help With

I'm ready to start implementing the beads following the phased approach in `GETTING_STARTED.md`.

**Current phase:** Phase 2 - Physical Structure & Build Scripts (Week 1, Days 3-6)

**Next bead to work on:** `spanish-academic-46` - Implement URL mirroring structure (create `/public/` and `/public/es/` directories)

## Key Commands

```bash
# Check ready beads
bd ready --json

# Start working on a bead
bd update spanish-academic-46 --status in_progress

# Complete a bead
bd close spanish-academic-46 --reason "Task completed"

# Check all beads
bd list --json
```

## Critical Instructions for AI Assistant

1. **READ `CLAUDE.md` FIRST** - This contains all project governance rules that MUST be followed
2. **Follow the phased approach** in `GETTING_STARTED.md` - don't skip ahead
3. **Use beads tracking** - Always update bead status (in_progress → completed)
4. **Enforce all 4 principles** in every implementation:
   - Mobile-first (single-column base, 44px touch targets, min-width only)
   - Localization-first (Spanish as first-class citizen, bilingual from day 1)
   - SEO-first (SEO_INTENT blocks, optimized meta tags, schema.org)
   - Accessibility-first (WCAG AA, semantic HTML, descriptive links)

## Architecture Principles (Quick Reference)

### Static-First with Interactive Islands
- Primary content = static HTML (fast, indexable, citable)
- Interactive tools = React islands (Explorer, Chat, Contact)
- Every HTML page MUST have a .json twin
- Bilingual: `/` (English) ↔ `/es/` (Spanish)

### Inviolable Rules (from CLAUDE.md)
- **RULE 1:** NO COMMENTARY ON PROGRAM LIST PAGES (pure link lists only)
- **RULE 2:** EVERY PAGE MUST HAVE A JSON TWIN (both /...json and /es/...json)
- **RULE 3:** HIGH-SENSITIVITY CONTENT REQUIRES GOVERNANCE (lastReviewed + disclaimers in BOTH languages)
- **RULE 4:** PRESERVE LOCALIZATION PARITY (/ ↔ /es/ must mirror)
- **RULE 5:** MOBILE-FIRST, WCAG AA MINIMUM (Lighthouse >90)
- **RULE 6:** PERFORMANCE BUDGET (initial JS bundle < 250KB)
- **RULE 7:** SEMANTIC HTML, ACADEMIC TONE (no fluff, no marketing language)

## Tech Stack

- **Static HTML** for core content
- **React + TypeScript** for interactive islands
- **Vite** for building React islands (separate entry points)
- **TanStack Form** for Contact Form
- **Node.js scripts** for build automation
- **Steve Yegge's Beads** for task tracking
- **SiteGround** for production hosting (Apache + .htaccess)

## Data Model

### Structured Data (TypeScript)
- Program and Faculty objects in `/src/data/structured/`
- Bilingual fields: `focusAreas_en` / `focusAreas_es`, `methodsCulture_en` / `methodsCulture_es`
- Shared numeric/boolean: `stipendApproxUSD`, `yearsGuaranteed`, `greRequired`

### Unstructured Data (JSON)
- Longer descriptions in `/src/data/unstructured/`
- Separate files per language: `programNotes.en.json` / `programNotes.es.json`
- Loaded lazily by Explorer and Chat components

## My Request

Please help me work through the beads in the order specified in `GETTING_STARTED.md`.

**Start with:** Bead spanish-academic-46 - Create the `/public/` and `/public/es/` directory structure.

**⚠️ IMPORTANT:** Phase order has been corrected based on architectural analysis and industry best practices:
- **Phase 1 (COMPLETE):** Foundation documents ✅
- **Phase 2 (CURRENT):** Physical structure + Build scripts (BEFORE templates)
- **Phase 3:** HTML base templates (AFTER scripts exist to validate them)

**See `GETTING_STARTED.md` for the corrected implementation order and `docs/PHASE_ORDER_RATIONALE.md` for detailed reasoning.**

**Then:** Guide me through implementing beads according to:
1. The corrected phase order in `GETTING_STARTED.md`
2. The acceptance criteria in the bead description
3. The governance rules in `CLAUDE.md`
4. The architectural principles (mobile-first, localization-first, SEO-first, accessibility-first)

After each bead is complete, help me:
- Mark it as completed in beads: `bd close <id> --reason "..."`
- Move to the next bead in the sequence
- Verify dependencies are satisfied before starting the next bead

---

**Ready to continue building Spanish Academic 2026 with rigorous enforcement of mobile-first, localization-first, SEO-first, and accessibility-first principles!**
