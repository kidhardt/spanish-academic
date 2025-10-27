# Geoverity — Beads Memory Tracking Implementation

Purpose
-------
This document describes the exact, step-by-step plan to implement Beads-based memory tracking for the GeoVerity project. It is intended to be consumed by a human or an AI coding agent working inside VS Code. Follow the steps in order and finish each verification checklist before moving to the next chunk.

Constraints
-----------
- This file only lives in `.geoverity/`. Do not change any other files in the current repo.
- Changes made while following these steps should be committed to the GeoVerity repository (not this Spanish-Academic repo). This document is a blueprint for the separate `geoverity` repo.
- All steps are broken into small, verifiable chunks. Each chunk ends with a short verification checklist and the commands to run locally.

Overview of approach
--------------------
1. Install and configure Beads repository tooling.
2. Define data format and storage location for memory items.
3. Integrate lightweight CLI helpers for creating, reading, and migrating beads items.
4. Add CI checks to ensure beads presence and schema validity for tracked tasks and memory.
5. Provide backup, export/import, and migration guidance.
6. Add AI agent instructions (chunked) so an agent can implement each step and verify outcomes.

Glossary
--------
- Beads: a lightweight file-based task/memory tracker by Steve Yegge. URL: https://github.com/steveyegge/beads
- Memory item: a persisted record representing an observation, task, or artifact for agent continuity.
- Memory store / `.beads/`: directory holding bead files; name may be customized but we'll use `.beads/`.

Chunk 1 — Initialize beads baseline
-----------------------------------
Goal
: Establish the `.beads/` directory and a minimal configuration so other steps have a stable foundation.

Steps
1. Create `.beads/` at the repo root in the GeoVerity repo.
2. Add a README.md inside `.beads/` describing its purpose and expected contents.
3. Add `.beads/.gitkeep` so the directory is tracked if empty.
4. Create a `beads-config.json` (or `.beads/config.json`) with minimal metadata (owner, repo, createdAt, version).

Files to create (examples)
- `.beads/README.md` — one-line purpose
- `.beads/.gitkeep` — empty file so git tracks the folder
- `.beads/config.json`:
  {
    "owner": "<team-or-person>",
    "repo": "geoverity",
    "createdAt": "2025-10-26T00:00:00Z",
    "version": "1"
  }

Verification checklist
- `.beads/` exists and is tracked by git
- `beads-config.json` is valid JSON

Commands
```powershell
# run in geoverity repo root
git status --porcelain
ls -Force .beads
cat .beads\config.json
```

Chunk 2 — Define memory item schema
-----------------------------------
Goal
: Define and document the canonical schema for bead/memory items so CI and tools can validate them.

Schema (JSON example)
- File-per-item approach; filenames use numeric prefix + slug: `0001-initial-idea.json`
- Required fields:
  - id: string (uuid or numeric string)
  - title: string
  - type: one of ["task","note","decision","artifact","action"]
  - createdAt: ISO timestamp
  - createdBy: string (agent or user id)
  - content: free-form string or object
  - tags: array of strings
  - status: one of ["open","in-progress","done","archived"]
- Optional fields:
  - relatedTo: array of IDs
  - metadata: object for extensibility (e.g., `source`, `sensitivity`, `expiresAt`)

Example file contents
`.beads/0001-onboard-agent.json`
```json
{
  "id":"0001",
  "title":"Onboard Geoverity agent",
  "type":"task",
  "createdAt":"2025-10-26T12:00:00Z",
  "createdBy":"agent:bootstrap",
  "content":"Initial agent onboarding checklist and permissions.",
  "tags":["onboard","agent"],
  "status":"open"
}
```

Where to document
- Add `BEADS_SCHEMA.md` inside `.geoverity/` (this file will live in the GeoVerity repo too) — include the schema above and a JSON Schema for programmatic validation.

Verification checklist
- A sample bead file exists and validates against the JSON Schema (simple node/python script can be used).

Commands
```powershell
# Validate JSON file with node (quick example using 'node -e' with try/catch) or use `jq` for structure checks
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('.beads/0001-onboard-agent.json')) && console.log('ok')"
```

Chunk 3 — CLI helpers (local dev ergonomics)
-------------------------------------------
Goal
: Provide a tiny set of scripts to create, list, read, and validate beads. Keep dependencies minimal (Node builtins or a single small dependency).

Files to add (stubs)
- `scripts/beads/create.js` — creates a new bead file from flags or interactive prompt
- `scripts/beads/list.js` — lists beads with optional filters (status,tags)
- `scripts/beads/read.js` — pretty-prints a bead file
- `scripts/beads/validate.js` — validates all bead files against the JSON Schema

Implementation notes
- Use Node 18+ `fs/promises` and `crypto.randomUUID()` for ids.
- Filenames should be `NNNN-<slug>.json` (NNNN incremented by newest existing number + 1)
- `create.js` must refuse to create if required fields missing

Verification checklist
- `node scripts/beads/create.js --title "Test" --type task` creates `.beads/0002-test.json`
- `node scripts/beads/list.js` prints created bead
- `node scripts/beads/validate.js` exits 0 when valid and non-zero with helpful error for invalid items

Chunk 4 — CI validation job
---------------------------
Goal
: Add a CI job (placeholder implementation) that runs beads validation and fails the pipeline if any bead is invalid or missing required fields when changes touch `.beads/` or related files.

Approach
- Add a step to existing `repo-protection.yml` for GeoVerity (in its repo) or create `.github/workflows/beads-validate.yml` that runs on push and pull_request.
- Job steps:
  - Checkout
  - Node install
  - Run `node scripts/beads/validate.js`
- The job should be marked required in branch protection (this will be done in the GeoVerity repo settings).

Verification checklist
- The workflow file exists and is parsable by GitHub Actions
- Running the validation script locally returns non-zero on intentionally broken bead file

Chunk 5 — Backups, export/import, and migration
-----------------------------------------------
Goal
: Provide robust tooling & guidance to export and import beads (e.g., for migrations or backups). Keep export format deterministic JSONL or a single export.json

Steps
- Add `scripts/beads/export.js` — exports all beads to `.geoverity/backups/beads-export-YYYYMMDD.json` and creates a checksum file
- Add `scripts/beads/import.js` — imports from export file, validates each item before writing
- Add `scripts/beads/migrate-v1-to-v2.js` — sample migration script for future schema changes
- Automate periodic backups via CI or cron in the host environment; store off-site (S3/GCS) with encryption if sensitive

Verification checklist
- Running `node scripts/beads/export.js` creates a backup file with a checksum
- `node scripts/beads/import.js <file>` restores items to `.beads/` (dry-run supported)

Chunk 6 — Security, privacy, and sensitive content
--------------------------------------------------
Goal
: Ensure beads store does not leak sensitive data and has mechanisms to mark sensitive items and remove them promptly.

Guidelines
- Add a `sensitivity` field in metadata (none|low|high).
- High-sensitivity items must not be pushed to public remotes; CI must block if high-sensitivity items exist in a public repo.
- Provide an encrypted backup option; document how to enable encryption (GPG or KMS)

Verification checklist
- Add a bead with `metadata.sensitivity: "high"` and verify `scripts/beads/validate.js` warns or fails when repository is public (or when configured to fail)

Chunk 7 — Agent instructions (how an AI coding agent should operate)
-----------------------------------------------------------------
Purpose
: Break the entire implementation into small, independently verifiable tasks so an AI agent can work step-by-step and stop on failures.

Agent operating rules (global)
- Run tasks only in the GeoVerity repository.
- Make one logical change per commit (e.g., create `.beads/config.json` in one commit, add schema file in another). Group related tiny files together but avoid large unrelated changes in a single commit.
- After each chunk, run the specified verification commands and report success/failure.
- Do not modify existing application logic or non-Geoverity files in other repos.
- When creating scripts, include a short README header explaining usage and expected exit codes.

Agent chunked task list (execute in order)
1. Chunk 1 — Create `.beads/` baseline
   - Create files specified
   - Run verification
   - Commit with message: `beads: baseline directory and config`
2. Chunk 2 — Schema
   - Add `BEADS_SCHEMA.md` and `schema/beads.schema.json`
   - Add sample bead file `.beads/0001-onboard-agent.json`
   - Run local JSON validation (node or ajv)
   - Commit with message: `beads: schema and sample item`
3. Chunk 3 — CLI helpers
   - Add `scripts/beads/*.js` (create/list/read/validate)
   - Include tests (small smoke tests) or usage examples in comments
   - Run commands to create and validate a sample item
   - Commit with message: `beads: CLI helpers (create/list/read/validate)`
4. Chunk 4 — CI & workflow (placeholder)
   - Add `.github/workflows/beads-validate.yml` (or update existing CI) with validation step
   - Do not enable complex secrets here; keep job simple
   - Commit with message: `ci: add beads validation workflow (placeholder)`
5. Chunk 5 — Backups & migration
   - Add export/import scripts and a README describing backup frequency and storage recommendations
   - Commit with message: `beads: backup/export/import scripts`
6. Chunk 6 — Security config
   - Add guidance in `BEADS_SECURITY.md` and implement sensitivity field checks in `validate.js`
   - Commit with message: `beads: security & sensitivity checks`

Agent verification protocol
- After each commit, run `node scripts/beads/validate.js` and show output.
- Run `git status --porcelain` to ensure the repo is clean.
- Provide the commit hash and file list changed in the commit message summary.

Chunk 8 — Documentation & onboarding
------------------------------------
Goal
: Ensure future contributors and agents can use the beads store.

Files to add
- `.geoverity/README.md` — explains purpose of the folder and points to key scripts
- `.geoverity/OPERATIONAL_GUIDE.md` — how to run backups, encryption, rotate keys
- `.geoverity/AGENT_PROMPT.md` — contains a packaged prompt the AI agent can use to implement the above (include task-by-task commands and verification checks)

Verification checklist
- All files exist and `README.md` references scripts and CI

Chunk 9 — Recovery & incident playbook
--------------------------------------
Goal
: Provide steps to recover from accidental leaks or corruption.

Contents
- How to remove a sensitive bead from git history (BFG or git filter-repo) and re-encrypt backups
- How to revoke keys and rotate secrets
- How to notify stakeholders and mark incidents in beads with a specific `type: incident`

Verification checklist
- Playbook doc present and validated by a human reviewer

Final acceptance criteria
-------------------------
- `.beads/` exists with config and at least one sample bead file.
- `scripts/beads/validate.js` exits 0 on valid data and non-zero on invalid data.
- CI workflow exists to call validation (placeholder ok).
- Backup/export scripts exist and create deterministic outputs.
- Security guidance and sensitivity checks are documented.

Commit guidelines
-----------------
- Use atomic commits per chunk, descriptive commit messages shown above.
- Keep changes limited to files required by each chunk.
- Provide one consolidated PR for review once all chunks are implemented, or open per-chunk PRs if desired by the team.

Appendix: Example minimal `validate.js` behavior
------------------------------------------------
- Read all `.beads/*.json` files.
- Parse JSON; if any parse error -> exit 2 and print file and reason.
- Validate required fields and types; if any missing -> exit 3 and print errors.
- If `--fail-on-sensitive` flag provided and any item has `metadata.sensitivity=="high"`, exit 4.
- Otherwise exit 0.

---

Notes
-----
- This implementation blueprint intentionally avoids prescribing a single language or framework for scripts; Node is suggested for portability and consistency with the existing repo tools. If your team prefers Python, the same chunks and verification steps apply.
- When running in CI, ensure node version matches Node 18+ (or use `actions/setup-node` with `node-version: '18'`).

If you want, I can now:
- (A) create these files (`BEADS_SCHEMA.md`, basic `scripts/beads/validate.js` stub) inside `.geoverity/` in this repo (only .geoverity will be changed), or
- (B) just leave this blueprint as-is and provide an AI agent-ready prompt that will implement chunks in the target `geoverity` repo.

Tell me which follow-up you want (A or B) and I will proceed. 