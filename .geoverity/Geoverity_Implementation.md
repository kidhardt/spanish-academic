# GeoVerity 2026 — Implementation Plan (AI-agent ready)

This file is an actionable, stage-by-stage implementation plan you can copy-paste into an AI coding agent (or run manually) to scaffold and configure the GeoVerity 2026 project. It assumes a fresh repository (or an empty folder) and Node 18+/npm 9+ on Windows PowerShell.

Scope and constraints
- This file lives in `.geoverity/` as a blueprint and checklist. Do not change other repositories using this document.
- The goal: Phase 1 scaffold only — no marketing pages, no sample content, no translations.
- Deliverables: strict TypeScript + Astro + React-islands setup, path aliasing, Vite config with island/vendor splitting and budget notes, governance docs, CI placeholders, beads integration baseline and scripts stubs, and repo protection scaffolding.

Final tech stack (summary)
- Runtime & toolchain
  - Node.js >= 18
  - npm >= 9
  - Git (repo VCS)
- Frameworks & UI
  - Astro (static-first site generator)
  - React (islands only via @astrojs/react)
- Build tools
  - Vite (bundler/dev server)
  - Rollup manualChunks config (via Vite rollupOptions)
  - Terser for minification
  - rollup-plugin-visualizer for bundle analysis
- Languages & types
  - TypeScript (strict mode enabled)
  - TS target ES2020
  - Path aliases: `@/*` -> `./src/*`
- Testing / validation / CI (placeholders)
  - Lighthouse (mobile audits), Playwright + axe (accessibility), ESLint, Prettier
  - CI pipelines (GitHub Actions) with placeholder jobs: type-check, localization-validate, accessibility-scan, lighthouse-mobile, parity-check
- Data & crawl
  - Crawlee (for scheduled article fetchers / scrapers) — optional to add later
- Beads memory tracking
  - Use a local, file-per-item beads store under `.beads/` with JSON items and a small validation CLI under `scripts/beads`.
  - Refer: https://github.com/steveyegge/beads for conceptual patterns (do not vendor code wholesale without license review).

Architecture overview
- Static HTML is authoritative. Astro will produce language-specific outputs under `/public/` and `/public/es/`.
- Any interactive widgets are React islands living under `src/apps/*` and compiled as separate entrypoints by Vite.
- JSON twins: every public page must have a machine-readable JSON twin exposing `translationStatus` and `lastReviewed` (stubs enforced by scripts/generate_page_json.js later).
- CI will validate the existence and schema of JSON twins, beads validity, and basic accessibility thresholds (placeholders in Phase 1).

Directory layout (exact)
- public/                      (English production output)
- public/es/                   (Spanish production output)
- src/                         (Astro pages, shared components)
- src/apps/                    (React islands)
- src/data/structured/         (typed structured bilingual data)
- src/data/unstructured/       (narrative/policy copy EN/ES pairs)
- src/i18n/                    (localization helpers and string maps)
- scripts/                     (validation scripts, sitemap builder, governance scanners)
- docs/                        (governance policies such as MOBILE_FIRST.md and LOCALIZATION_FIRST.md)
- .claude/                     (agent governance rules, task templates, compliance instructions)
- .beads/                      (beads memory store created by Stage 7)

Staged AI-agent-ready prompts

General agent rules (copy near top of prompt before each stage):
- Run only in the target `geoverity` repo/folder.
- Do one stage at a time. After creating files for a stage, run the verification steps. Stop on any non-zero exit or error and report full stdout/stderr.
- Keep TypeScript strict = true. Do not relax settings.
- Do not add content pages or translations. If a step asks to create stubs, keep content minimal and marked TODO.
- Use PowerShell commands shown below. Copy them precisely.

Stage 0 — Preflight (why/what/outcome)
Why: Verify environment and create the empty repo folder used by later stages.
Agent prompt (copy-paste):
```powershell
# Check Node and npm
node --version
npm --version

# Create workspace
mkdir geoverity
cd geoverity
git init
npm init -y

# Verify
git status --porcelain
ls package.json
```
Verification
- Node >=18 and npm >=9. If not, stop and report.
- `package.json` exists.

Stage 1 — Install baseline dependencies
Why: Install Astro, React integration, TypeScript and basic dev tools; create lockfile.
Agent prompt:
```powershell
# Install runtime deps
npm install --save astro@latest @astrojs/react react react-dom

# Install dev deps
npm install --save-dev typescript tsx vite @types/node @types/react @types/react-dom eslint prettier @vitejs/plugin-react rollup-plugin-visualizer

# Show lockfile
ls package-lock.json
```
Verification
- `package-lock.json` exists.
- `npm ls astro` shows installed version.

Suggested package.json scripts to add (agent should programmatically insert these):
- "dev": "vite"
- "astro:dev": "astro dev"
- "build": "tsc && vite build"
- "astro:build": "astro build"
- "preview": "vite preview"
- "type-check": "tsc --noEmit"
- "lint": "eslint . --ext ts,tsx --max-warnings 0"

Stage 2 — Create exact directory layout
Why: Ensure canonical repo structure and track empty folders with README.md
Agent prompt:
```powershell
$dirs = @(
  'public','public/es','src','src/apps','src/data/structured','src/data/unstructured','src/i18n','scripts','docs','.claude'
)
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Force -Path $d | Out-Null
  Set-Content -Path (Join-Path $d 'README.md') -Value ("Purpose: $d")
}

# Stage files
git add -A
git status --porcelain
```
Verification
- README.md in each directory with one-line purpose.

Stage 3 — Configure TypeScript (strict, paths)
Why: Strong typing and path alias.
Agent prompt (create `tsconfig.json`):
```powershell
@'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
'@ | Set-Content -Path tsconfig.json

# Verify tsc available and type-check (no source files yet; success means config valid)
npx tsc --noEmit
```
Verification
- `npx tsc --noEmit` exits 0 (or only warns about no files; ensure no config errors).

Stage 4 — Configure Astro + Vite + React islands
Why: Prepare the build pipeline for islands and vendor splitting and document bundle budget enforcement.
Agent prompt (create two files):
1) `astro.config.mjs`
```powershell
@'
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: './vite.config.ts'
});
'@ | Set-Content -Path astro.config.mjs
```
2) `vite.config.ts` — include comments and manualChunks example:
```powershell
@'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

/**
 * Vite config: ensure islands are code-split and vendor is extracted.
 * BUDGET: <= 250KB compressed per island. CI will enforce this by analyzing visualizer output.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') }
  },
  build: {
    rollupOptions: {
      input: {},
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 250,
    sourcemap: true,
    minify: 'terser'
  }
})
'@ | Set-Content -Path vite.config.ts
```
Verification
- Files parse (npx tsc --noEmit) and no syntax errors.

Stage 5 — Add governance docs & .claude templates
Why: Establish MOBILE_FIRST and LOCALIZATION_FIRST policies and AI agent templates.
Agent prompt (create files with required content):
```powershell
# MOBILE_FIRST.md
@'
# MOBILE_FIRST
- Mobile is primary. Desktop is progressive enhancement.
- Layout must be usable at 320px width single column.
- Touch targets >= 44px.
- Lighthouse mobile performance >= 90.
- Use min-width breakpoints only; language switcher and critical nav must be mobile-usable.
'@ | Set-Content -Path docs/MOBILE_FIRST.md

# LOCALIZATION_FIRST.md
@'
# LOCALIZATION_FIRST
- Public pages must have EN route (/) and ES route (/es/).
- hreflang and canonical must reference each other.
- Pages must expose metadata: translationStatus, lastReviewed.
- Spanish placeholders must be flagged and remediated per policy.
- JSON twins for pages are mandatory.
'@ | Set-Content -Path docs/LOCALIZATION_FIRST.md

# .claude templates
@'Project rules content'@ | Set-Content -Path .claude/PROJECT_RULES.md
@'Task template content'@ | Set-Content -Path .claude/TASK_TEMPLATE.md

# Verify
Get-Content docs/MOBILE_FIRST.md
Get-Content docs/LOCALIZATION_FIRST.md
Get-Content .claude/PROJECT_RULES.md
Get-Content .claude/TASK_TEMPLATE.md
```
Verification
- Files present and contain required points.

Stage 6 — Repo protection scaffolding
Why: Create project-map.json, CODEOWNERS, precommit stub, and CI placeholders.
Agent prompt:
```powershell
@'{"protectedAreas":["docs/",".claude/","scripts/","src/i18n/","src/layouts/"]}'@ | Set-Content -Path project-map.json

@'
/docs/ @geoverity-team
/.claude/ @geoverity-team
/scripts/ @geoverity-team
/src/i18n/ @geoverity-team
/src/layouts/ @geoverity-team
'@ | Set-Content -Path CODEOWNERS

# precommit stub
@'#!/usr/bin/env bash
# TODO: block commits that touch protected areas without review notes
# TODO: block commits that add EN page without ES mirror
# TODO: block commits that remove mobile/accessibility markers
exit 0
'@ | Set-Content -Path scripts/precommit-verify.sh

# Create workflow placeholder
New-Item -ItemType Directory -Force -Path .github/workflows | Out-Null
@'name: Repo protection placeholder
on: [push, pull_request]
jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: placeholder
        run: echo "TODO: run type-check"
'@ | Set-Content -Path .github/workflows/repo-protection.yml

# Verify
Get-Content project-map.json
Get-Content CODEOWNERS
Get-Content scripts/precommit-verify.sh
Get-Content .github/workflows/repo-protection.yml
```
Verification
- Files present and precommit script contains TODOs.

Stage 7 — Beads baseline & validation (why/what/outcome)
Why: Implement beads memory baseline and a lightweight validation script used by CI.
Agent prompt (subtasks to run sequentially):
1) Create `.beads` baseline
```powershell
New-Item -ItemType Directory -Force -Path .beads | Out-Null
Set-Content -Path .beads/README.md -Value "Beads memory store for GeoVerity; file-per-item JSON records."
New-Item -Path .beads/.gitkeep -ItemType File -Force | Out-Null
@'{
  "owner":"geoverity-team",
  "repo":"geoverity",
  "createdAt":"' + (Get-Date -Format o) + '",
  "version":"1"
}'@ | Set-Content -Path .beads/config.json
Get-Content .beads/config.json
```
2) Add sample bead and schema under `.beads/`
```powershell
New-Item -ItemType Directory -Force -Path .beads/schema | Out-Null
@'{
  "$schema":"http://json-schema.org/draft-07/schema#",
  "type":"object",
  "required":["id","title","type","createdAt","createdBy","status"],
  "properties":{ "id":{"type":"string"}, "title":{"type":"string"}, "type":{"type":"string"}, "createdAt":{"type":"string"}, "createdBy":{"type":"string"}, "status":{"type":"string"} }
}'@ | Set-Content -Path .beads/schema/beads.schema.json

@'{
  "id":"0001",
  "title":"Onboard Geoverity agent",
  "type":"task",
  "createdAt":"' + (Get-Date -Format o) + '",
  "createdBy":"agent:bootstrap",
  "content":"Initial agent onboarding checklist.",
  "tags":["onboard","agent"],
  "status":"open"
}'@ | Set-Content -Path .beads/0001-onboard-agent.json

# Quick parse check
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('.beads/0001-onboard-agent.json')); console.log('ok')"
```
3) Add `scripts/beads/validate.js` minimal validator
```powershell
New-Item -ItemType Directory -Force -Path scripts/beads | Out-Null
@'
#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const files=fs.readdirSync('.beads').filter(f=>f.endsWith('.json'));
let ok=true;
for(const f of files){
  try{
    const data=JSON.parse(fs.readFileSync(path.join('.beads',f),'utf8'));
    const required=['id','title','type','createdAt','createdBy','status'];
    for(const r of required){ if(!(r in data)){ console.error(`${f} missing ${r}`); ok=false } }
  }catch(e){ console.error(`parse error ${f}: ${e.message}`); ok=false }
}
process.exit(ok?0:1);
'@ | Set-Content -Path scripts/beads/validate.js

# Make executable (git index chmod may be required on Windows differently)
Get-ChildItem scripts/beads

# Run validation
node scripts/beads/validate.js
```
Verification
- validator exits 0 for sample bead.

Stage 8 — Add localization & page-json stubs (why/what/outcome)
Why: Provide placeholder scripts referenced by governance docs so CI can call them.
Agent prompt:
```powershell
@'#!/usr/bin/env node
console.log("TODO: validate localization - ensure JSON twins and metadata exist");process.exit(0);
'@ | Set-Content -Path scripts/validate-localization.js

@'#!/usr/bin/env node
console.log("TODO: generate page JSON twins");process.exit(0);
'@ | Set-Content -Path scripts/generate_page_json.js

# Make executable
Get-ChildItem scripts

# Run
node scripts/validate-localization.js
node scripts/generate_page_json.js
```
Verification
- Both scripts run and exit 0.

Stage 9 — CI wiring & smoke tests (why/what/outcome)
Why: Ensure the scaffold runs type-check and the basic scripts without errors.
Agent prompt:
```powershell
# Type-check
npx tsc --noEmit

# Run beads validator
node scripts/beads/validate.js

# Run stub scripts
node scripts/validate-localization.js
node scripts/generate_page_json.js
```
Verification
- All commands exit 0.

Stage 10 — Final commit
Why: Consolidate work into a single commit (or per-stage commits if you prefer).
Agent prompt (single commit):
```powershell
git add -A
git commit -m "GeoVerity 2026: Phase 1 scaffold + governance baseline"
git show --name-only --pretty=format:'%h %s'
```
Verification
- Commit exists and lists staged files.

Recommended commit strategy
- Prefer atomic per-stage commits. Provide commit message suggested at the end of each stage. If you must deliver a single commit, stage everything and use the final commit message above.

Post-implementation checklist
- No content or marketing pages were added.
- `tsconfig.json` has `strict: true`.
- `.beads/` exists and contains config + at least one sample item.
- `scripts/beads/validate.js` returns success on valid beads and non-zero when an invalid item is introduced.
- `docs/MOBILE_FIRST.md` and `docs/LOCALIZATION_FIRST.md` exist and conform to the rules.
- `.github/workflows/repo-protection.yml` exists with placeholder jobs.

Appendix A — Example final tech-stack manifest (copy into repo root if desired)
```json
{
  "engines": { "node": ">=18.0.0", "npm": ">=9.0.0" },
  "dependencies": {
    "astro": "latest",
    "@astrojs/react": "latest",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "rollup-plugin-visualizer": "^5.0.0"
  }
}
```

Appendix B — Beads reference and caution
- Official beads repo: https://github.com/steveyegge/beads
- Do NOT copy proprietary code from beads; instead, implement file-per-item JSON pattern and small validators.

If you want, I can now:
- (A) produce literal file patches for a fresh `geoverity` repo (all files listed above), or
- (B) produce a single large agent prompt that will automatically run each stage (less safe), or
- (C) stop here and let you run each stage manually or with another agent.

Choose (A), (B), or (C). If (A), state whether you want per-stage commits or a single commit.
