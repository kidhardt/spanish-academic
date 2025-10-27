# Localization-First Quick Checklist

This one-page checklist summarizes the machine-auditable, enforceable rules from `docs/LOCALIZATION_FIRST.md`. Use it for quick reviews, PR checks, and CI validations.

## Required artifacts (per page)
- HTML: `/path.html` and `/es/path.html` (or explicit `exempt` on English twin)
- JSON twins: `/path.json` and `/es/path.json` (must be present; CI fail when missing)
- `#page-metadata` JSON block or equivalent generated page metadata included in the build output

## JSON twin fields (required)
- `translationStatus` (one of: `placeholder`, `needs-review`, `up-to-date`) — required on both twins
- Spanish twin: `lastSyncedFromEnglish` (ISO date) — required unless `translationStatus` is `placeholder`
- Optional English twin fields for exceptions: `exempt: true` and `exemptReason` (short string)
- For high-sensitivity content: `legalSensitivity` and `reviewIntervalDays` (CI enforces review clock)

## Placeholder rules
- Placeholders must use the approved service-oriented template.
- Placeholders must set `translationStatus: "placeholder"` and include a link to the English canonical and a Spanish contact/help path.
- CI flags placeholders older than 30 days as localization debt (configurable in CI).

## Slug & canonical policy
- Slugs in file/URL names MUST be ASCII-only, diacritics-stripped (ñ -> n). H1 and visible text MAY keep diacritics.
- Build must generate language-preserving canonical/hreflang links (no manual hreflang tags in source).

## Redirects & deletion
- If removing or redirecting an English page, update the Spanish counterpart in the same commit.
- Language-preserving 301s only. If the Spanish page doesn't exist, create a Spanish holding page or placeholder and mark `exempt` with reason.

## Mixed-language fragments
- Any inline fragment in a different language must include `lang` attribute (e.g., `<span lang="en">`).
- CI should fail pages missing fragment-level `lang` where mixed-language content is present.

## Accessibility & SEO metadata
- Ensure `lang` on the root `<html lang="es">` or `<html lang="en">` is correct on each page.
- Include the `#page-metadata` payload in the build so analytics and parity tooling can operate.

## CI / Validation quick checks (must be automated)
- Both HTML files exist for path (or English twin `exempt` marked).
- Both JSON twins exist and contain `translationStatus`.
- Spanish twin has `lastSyncedFromEnglish` when not a placeholder.
- `page-metadata` present and valid JSON schema.
- Placeholder age < 30 days (or flagged). 
- Slug normalization check (strip diacritics).
- Hreflang/canonical generated and consistent.

## Developer "Do Not Ever" (quick reminders)
- Do NOT concatenate strings in JSX to build translated sentences.
- Do NOT auto-redirect users solely by Accept-Language at page load (client-side language sniffing that hides content is disallowed).
- Do NOT reuse English alt text for localized pages without translation/verification.
- Do NOT manually add hreflang tags in templates; let build/tooling inject and validate them.

## Ownership & escalation (quick)
- Content Owner: responsible for text parity and translation requests.
- Localization Owner: responsible for glossary, placeholders, and translation status tracking.
- Engineering Owner: implements CI checks and build-time metadata generation.

## When to block a merge
- Missing Spanish JSON twin or `translationStatus` on either twin.
- Spanish twin missing `lastSyncedFromEnglish` (when applicable).
- Language-preserving redirect not set when removing pages.
- High-sensitivity page with expired `reviewIntervalDays`.

## Where to look in the repo
- Page JSON generator: `scripts/generate_page_json.js`
- Localization validator: `scripts/validate_localization.js`
- Policy docs: `docs/LOCALIZATION_FIRST.md` and `docs/LOCALIZATION_PARITY_SYSTEM.md`

---
Keep this file short and copyable into PR templates or CI job descriptions. If you want, I can:
- Add a GitHub Actions job that implements the CI quick checks above, or
- Insert this checklist into a PR template under `.github/PULL_REQUEST_TEMPLATE.md`.
