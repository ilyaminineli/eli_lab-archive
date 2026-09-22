# Data architecture

## Canonical work data
`works.json` is the machine-readable master index. Each work has one stable `id` and may reference several mediums, contexts, sources and related works.

Private records use `visibility: "private"` and are excluded from public rendering.

## Relations
`relations.json` stores edges between works, people and places. Use it instead of duplicating collaborators or institutional context into every page.

## Themes
`themes/*.json` stores thematic indexes. A theme points to work IDs; it does not create duplicate work records.

## Source rule
Keep source URLs with the record. Search/social traces can be candidates; primary project repositories and institutional records should be preferred for canonical metadata.