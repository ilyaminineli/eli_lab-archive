# Archive media staging

This folder contains work-specific media directories used by canonical archive records.

## Per-work convention

Each work uses:

`media/works/<work-id>/`

Recommended contents:

- `01-cover.*` — primary archive image
- `02-documentation-*.*` — exhibition / installation / performance documentation
- `03-process-*.*` — sketches, screenshots, working files
- `04-still-*.*` — selected stills / details
- `05-context-*.*` — contextual material

The work ID is the stable link between the media folder and `data/works.json`. Avoid using human-readable titles as folder names because titles can have transliteration, punctuation or language variants.

Some priority work folders already contain a README placeholder. More folders can be created as assets are recovered.
