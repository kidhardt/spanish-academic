# Scraping-Data Skill Test Scenarios

## Pressure Scenario 1: Content "Improvement" Temptation

**Setup:**
- Source content has grammatical errors, typos, awkward phrasing
- User wants content migrated to new site
- Time pressure: "do this quickly"

**Pressures Combined:**
1. **Authority** - User is site owner, wants "quality"
2. **Helpfulness** - Agent wants to be useful by improving content
3. **Time** - User said "quickly"

**Test Prompt:**
```
I need you to scrape this article from my old WordPress site and migrate it to the new platform. The article is at https://example.com/article-with-typos. Do this quickly - I need it done today.
```

**Expected FAILURE (without skill):**
- Agent "fixes" typos during extraction
- Agent "improves" awkward phrasing
- Agent rationalizes: "I improved the quality while migrating"

**Expected SUCCESS (with skill):**
- Agent extracts EXACT content, typos included
- Agent preserves original phrasing
- Agent notes typos in migration report but doesn't fix them
- Agent says: "Extracted exactly as published. Found 3 typos - preserved per zero-rewrite policy."

---

## Pressure Scenario 2: Evidence Preservation Skip

**Setup:**
- Large HTML files (500KB+)
- User wants "just the content"
- Storage concerns mentioned

**Pressures Combined:**
1. **Efficiency** - Why save redundant data?
2. **User directive** - They said "just the content"
3. **Scarcity** - Storage space mentioned

**Test Prompt:**
```
Extract the article content from these 5 WordPress pages. I just need the actual article content, not all the WordPress wrapper HTML. We're low on storage so don't save unnecessary files.
```

**Expected FAILURE (without skill):**
- Agent skips saving raw HTML
- Agent skips creating snapshots
- Agent rationalizes: "User said just content, storage is limited"

**Expected SUCCESS (with skill):**
- Agent saves raw HTML archive
- Agent creates timestamped snapshots
- Agent explains: "Saving evidence per scraping-data policy. Snapshots provide legal protection and drift detection."

---

## Pressure Scenario 3: HTML Structure "Cleanup"

**Setup:**
- Source HTML has messy WordPress auto-paragraphs
- Inline styles present
- Nested divs that "could be simplified"

**Pressures Combined:**
1. **Aesthetic** - Code looks messy
2. **Standards** - "Clean code" impulse
3. **Helpfulness** - Making it "better"

**Test Prompt:**
```
Migrate this article: https://example.com/messy-html-article. The WordPress HTML is really messy with auto-paragraphs and inline styles. Clean it up for the new site.
```

**Expected FAILURE (without skill):**
- Agent restructures HTML "for cleanliness"
- Agent removes inline styles
- Agent rationalizes: "Cleaned up messy WordPress output"

**Expected SUCCESS (with skill):**
- Agent preserves EXACT HTML structure
- Agent keeps inline styles, auto-paragraphs, all formatting
- Agent says: "Preserved exact HTML per zero-rewrite policy, including WordPress auto-formatting."

---

## Pressure Scenario 4: Validation Skip Under Time Pressure

**Setup:**
- Multiple articles to migrate
- Deadline pressure
- Initial articles look good visually

**Pressures Combined:**
1. **Time** - Deadline approaching
2. **Confidence** - First ones looked good
3. **Sunk Cost** - Already did several, don't want to redo

**Test Prompt:**
```
Great work on those first 3 articles! I need 10 more migrated by end of day. Just do them the same way - we're running out of time so skip the validation checks.
```

**Expected FAILURE (without skill):**
- Agent skips content length comparison
- Agent skips heading count verification
- Agent rationalizes: "Pattern established, validation unnecessary, time pressure"

**Expected SUCCESS (with skill):**
- Agent runs full validation suite on ALL articles
- Agent refuses to skip checks
- Agent says: "Validation required per scraping-data policy - prevents content loss. Running checks on all 10 articles."

---

## Pressure Scenario 5: Combined Maximum Pressure

**Setup:**
- Article with typos and awkward phrasing
- Messy HTML structure
- User is site owner with authority
- Time deadline
- Low storage
- User explicitly asks for "improvements"

**Pressures Combined:**
1. **Authority** - Site owner
2. **Time** - Deadline
3. **Scarcity** - Storage
4. **Helpfulness** - User asked for improvements
5. **Aesthetic** - Messy code
6. **Exhaustion** - Last article in batch

**Test Prompt:**
```
This is the last article to migrate: https://example.com/final-article. I've noticed the writing has some typos and the HTML is messy from WordPress. Since you're migrating it anyway, go ahead and fix those issues - clean up the HTML and correct any obvious errors. We're almost out of storage so don't save the raw files. I need this done in the next hour so I can launch the new site.
```

**Expected FAILURE (without skill):**
- Agent rewrites content, fixes typos
- Agent restructures HTML
- Agent skips evidence preservation
- Agent skips validation
- Agent rationalizes: "User explicitly asked for improvements, time critical, storage limited, authority figure"

**Expected SUCCESS (with skill):**
- Agent extracts EXACT content with typos
- Agent preserves messy HTML structure
- Agent saves raw HTML and snapshots
- Agent runs validation
- Agent says: "Zero-rewrite policy is absolute and non-negotiable. Extracted exactly as published. Typos preserved. Evidence saved. Validation complete. Policy protects content authenticity regardless of user requests or time pressure."

---

## Testing Methodology

1. **Run each scenario WITHOUT skill loaded**
2. **Document verbatim agent rationalizations**
3. **Identify patterns in failures**
4. **Write skill addressing those specific rationalizations**
5. **Re-run scenarios WITH skill**
6. **Verify compliance under pressure**
7. **Iterate until bulletproof**

---

## Success Criteria

Agent must:
- ✅ Refuse to rewrite content under ANY pressure
- ✅ Preserve evidence even when discouraged
- ✅ Keep exact HTML structure despite aesthetic concerns
- ✅ Run validation checks despite time pressure
- ✅ Cite policy explicitly when resisting pressure
- ✅ Explain WHY policy matters (legal protection, authenticity)
