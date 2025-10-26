# Sensitive Content Tracking Schema

## JSON Schema for Tracking Items

Each tracking item is a JSON object stored as one line in `sensitive-content-tracker.jsonl`.

### Full Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "createdAt", "status", "filePath", "issueType", "severity", "description", "blocksDeployment"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^SC-\\d{3}$",
      "description": "Unique identifier (SC-001, SC-002, etc.)"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when item was created"
    },
    "status": {
      "type": "string",
      "enum": ["pending", "in-progress", "resolved", "deferred"],
      "description": "Current status of the tracking item"
    },
    "filePath": {
      "type": "string",
      "description": "Relative path to the file with sensitive content"
    },
    "issueType": {
      "type": "string",
      "enum": [
        "missing-disclaimer",
        "missing-lastReviewed",
        "outdated-amounts",
        "unverified-claims",
        "immigration-advice",
        "financial-advice",
        "legal-advice",
        "career-advice",
        "ranking-methodology"
      ],
      "description": "Type of governance issue"
    },
    "severity": {
      "type": "string",
      "enum": ["blocker", "high", "medium", "low"],
      "description": "Priority level for resolution"
    },
    "description": {
      "type": "string",
      "minLength": 10,
      "description": "Brief description of the issue"
    },
    "requiredActions": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of actions needed to resolve this item"
    },
    "contentWarnings": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "funding-amounts",
          "stipend-amounts",
          "tuition-costs",
          "salary-ranges",
          "career-advice",
          "job-market",
          "immigration",
          "visa",
          "work-authorization",
          "rankings",
          "comparisons",
          "methodology",
          "ai-ethics",
          "academic-integrity"
        ]
      },
      "description": "Categories of sensitive content present"
    },
    "blocksDeployment": {
      "type": "boolean",
      "description": "Whether this item prevents production deployment"
    },
    "assignedCommit": {
      "type": ["string", "null"],
      "pattern": "^[a-f0-9]{7,40}$",
      "description": "Git commit hash where this was resolved (null if pending)"
    },
    "resolvedAt": {
      "type": ["string", "null"],
      "format": "date-time",
      "description": "ISO 8601 timestamp when resolved (null if pending)"
    },
    "resolvedBy": {
      "type": ["string", "null"],
      "description": "Person/agent who resolved (e.g., 'Claude Code', 'user@example.com')"
    },
    "notes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "author": {
            "type": "string"
          },
          "content": {
            "type": "string"
          }
        },
        "required": ["timestamp", "author", "content"]
      },
      "description": "Additional notes, updates, or discussion"
    },
    "deferredReason": {
      "type": ["string", "null"],
      "description": "Justification if status is 'deferred'"
    },
    "relatedIssues": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^SC-\\d{3}$"
      },
      "description": "IDs of related tracking items"
    }
  }
}
```

### Example Item (Pending)

```json
{
  "id": "SC-001",
  "createdAt": "2025-10-25T23:45:00Z",
  "status": "pending",
  "filePath": "public/insights/how-to-choose-a-graduate-program.html",
  "issueType": "missing-disclaimer",
  "severity": "high",
  "description": "Article contains specific funding amounts ($18k, $35k stipends) without financial disclaimer",
  "requiredActions": [
    "Add HTML disclaimer: 'This is informational, not financial advice'",
    "Add lastReviewed: '2025-10-25' to JSON twin",
    "Verify NYU $35k stipend amount is current",
    "Verify Duke funding policy is current"
  ],
  "contentWarnings": ["funding-amounts", "stipend-amounts", "career-advice", "job-market"],
  "blocksDeployment": true,
  "assignedCommit": null,
  "resolvedAt": null,
  "resolvedBy": null,
  "notes": [],
  "deferredReason": null,
  "relatedIssues": []
}
```

### Example Item (Resolved)

```json
{
  "id": "SC-001",
  "createdAt": "2025-10-25T23:45:00Z",
  "status": "resolved",
  "filePath": "public/insights/how-to-choose-a-graduate-program.html",
  "issueType": "missing-disclaimer",
  "severity": "high",
  "description": "Article contains specific funding amounts ($18k, $35k stipends) without financial disclaimer",
  "requiredActions": [
    "Add HTML disclaimer: 'This is informational, not financial advice'",
    "Add lastReviewed: '2025-10-25' to JSON twin",
    "Verify NYU $35k stipend amount is current",
    "Verify Duke funding policy is current"
  ],
  "contentWarnings": ["funding-amounts", "stipend-amounts", "career-advice", "job-market"],
  "blocksDeployment": true,
  "assignedCommit": "a1b2c3d4",
  "resolvedAt": "2025-10-27T15:30:00Z",
  "resolvedBy": "user@example.com",
  "notes": [
    {
      "timestamp": "2025-10-27T15:30:00Z",
      "author": "user@example.com",
      "content": "Added financial disclaimer. Verified NYU stipend is current as of Fall 2025. Updated JSON twin with lastReviewed field."
    }
  ],
  "deferredReason": null,
  "relatedIssues": []
}
```

### Example Item (Deferred)

```json
{
  "id": "SC-015",
  "createdAt": "2025-10-26T10:00:00Z",
  "status": "deferred",
  "filePath": "public/help/phd-timeline.html",
  "issueType": "missing-disclaimer",
  "severity": "medium",
  "description": "Contains general timeline advice without disclaimer",
  "requiredActions": [
    "Add disclaimer about timeline variability"
  ],
  "contentWarnings": ["career-advice"],
  "blocksDeployment": false,
  "assignedCommit": null,
  "resolvedAt": null,
  "resolvedBy": null,
  "notes": [
    {
      "timestamp": "2025-10-26T14:00:00Z",
      "author": "user@example.com",
      "content": "Deferring to Phase 3. Content is general enough that disclaimer can wait. Not blocking deployment."
    }
  ],
  "deferredReason": "General timeline advice without specific claims. Adding disclaimer in Phase 3 polish sprint. Not blocking deployment per team decision.",
  "relatedIssues": []
}
```

## Field Descriptions

### id
- Format: `SC-###` (e.g., SC-001, SC-002)
- Auto-incremented
- Never reused, even if item deleted

### createdAt
- ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- UTC timezone
- Set when item created, never modified

### status
- **pending**: Needs action, not yet started
- **in-progress**: Someone is actively working on it
- **resolved**: Fixed, verified, and committed
- **deferred**: Acknowledged but intentionally postponed (requires `deferredReason`)

### filePath
- Relative to project root
- Use forward slashes even on Windows: `public/insights/article.html`
- Must exist in git (tracked file)

### issueType
- **missing-disclaimer**: HTML needs disclaimer block
- **missing-lastReviewed**: JSON twin needs lastReviewed field
- **outdated-amounts**: Funding/stipend amounts may be stale, need verification
- **unverified-claims**: Statements about programs/policies need fact-checking
- **immigration-advice**: Visa/work content without legal disclaimer
- **financial-advice**: Money/funding content without financial disclaimer
- **legal-advice**: Legal matters without lawyer disclaimer
- **career-advice**: Job market predictions without career counseling disclaimer
- **ranking-methodology**: Rankings without methodology/subjectivity warning

### severity
- **blocker**: MUST fix before deployment (prevents production launch)
- **high**: SHOULD fix before deployment (allows dev commits, blocks production)
- **medium**: Fix in next sprint
- **low**: Track for future improvement

### description
- Minimum 10 characters
- Brief, clear description of what's wrong
- Mention specific examples (e.g., "$35k stipend")

### requiredActions
- Array of specific steps to resolve
- Actionable, not vague
- Good: "Add financial disclaimer to HTML"
- Bad: "Fix compliance issue"

### contentWarnings
- Standardized tags for categorization
- Used for reporting and filtering
- Multiple warnings allowed per item

### blocksDeployment
- `true`: Cannot deploy to production with this unresolved
- `false`: Can deploy, but should fix soon
- Typically `true` for `blocker` and `high` severity

### assignedCommit
- Git commit hash (7-40 hex chars)
- Set when status becomes `resolved`
- Allows tracing fix back to code changes

### resolvedAt
- ISO 8601 timestamp when status became `resolved`
- Null until resolved

### resolvedBy
- Email, username, or "Claude Code"
- Who performed the resolution

### notes
- Array of timestamped updates
- Can add notes without changing status
- Useful for documenting progress, decisions, questions

### deferredReason
- Required if status is `deferred`
- Must justify why postponing
- Include timeline (e.g., "Deferring to Phase 3")

### relatedIssues
- Array of other SC-### IDs
- For linking related items
- Example: Same file with multiple issues

## Status Transitions

```
pending → in-progress → resolved
   ↓
deferred
```

**Allowed transitions:**
- `pending` → `in-progress`: Someone starts working
- `pending` → `deferred`: Explicitly postponed
- `in-progress` → `resolved`: Work completed
- `in-progress` → `pending`: Work abandoned/paused
- `deferred` → `pending`: Decided to tackle it now
- `deferred` → `resolved`: Fixed during another task

**NOT allowed:**
- `resolved` → anything else (resolved is final)

## File Format (JSONL)

**One JSON object per line, no commas between lines:**

```jsonl
{"id":"SC-001","createdAt":"2025-10-25T23:45:00Z","status":"pending",...}
{"id":"SC-002","createdAt":"2025-10-25T23:46:00Z","status":"pending",...}
{"id":"SC-003","createdAt":"2025-10-26T10:00:00Z","status":"resolved",...}
```

**Benefits:**
- Easy to append new items
- Git-friendly (line-based diffs)
- Can parse line-by-line (low memory)
- Standard JSONL format

**NOT JSON array:**
```json
// ❌ DON'T DO THIS
[
  {"id":"SC-001",...},
  {"id":"SC-002",...}
]
```

## Auto-Generated IDs

Scripts auto-generate sequential IDs:

1. Read tracker file
2. Find highest existing ID (e.g., SC-015)
3. Increment (SC-016)
4. Append new line to file

Never manually assign IDs. Always use `npm run sensitive-content:add`.
