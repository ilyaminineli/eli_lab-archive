# Work dossier template

Each canonical work has a stable record in `data/works.json`, a dossier in `data/dossiers.json`, and a media folder in `media/works/<work-id>/`.

## Textual dossier

Use these fields when enough primary/source evidence exists:

- **summary** — one or two sentences that explain what the work is.
- **process** — how it was made; avoid invented production details.
- **materials** — physical/digital materials, media, software or source material.
- **chronology** — dated production, publication, exhibition or restoration events.
- **exhibitions** — named shows, screenings or performances.
- **publications** — catalogs, releases, articles or albums.
- **technical_notes** — format, software, dimensions, sound/film details.
- **archival_notes** — uncertainty, restoration state, source conflicts, provenance questions.
- **questions_to_resolve** — things that still require direct recovery or user confirmation.
- **source_context** — useful descriptive passages extracted from source descriptions.
- **source_credit_lines** — exact credit language from the source layer.

## Media recovery

Put recovered files in:

`media/works/<work-id>/`

Suggested convention:

`01-cover.*` — primary preview
`02-documentation-*.*` — exhibition / installation / performance evidence
`03-process-*.*` — making-of / working state
`04-still-*.*` — selected frames or details
`05-context-*.*` — contextual material

The record page automatically tries to detect a standard `01-cover.webp/jpg/jpeg/png` even before `data/media.json` is updated.

For additional gallery images, add explicit entries to `data/media.json`:

`{"path":"media/works/example/02-documentation-01.jpg","role":"documentation","caption":"..." }`

The JSON manifest remains the source of truth for the public gallery.

## Naming

Keep the canonical work ID stable. Keep alternate spellings and source-specific names in aliases / `data/csv_entities.json` instead of creating duplicate records.

For people and synthetic characters, distinguish:
- source name
- observed role
- persona / character framing
- verified identity

Never turn a source description into an unsupported biography or personality assessment.
