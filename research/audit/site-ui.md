# Site UI / navigation / search audit — 2026-09-23

## Navigation
All 18 HTML pages now use the same six primary items:

1. INDEX
2. WORKS
3. MAP
4. DOCS
5. PEOPLE
6. CV

The path is root-relative for index.html and page-relative inside pgs/. The active state changes by page, but the menu structure does not.

## Search
The archive now has four complementary search layers:

- pgs/search.html — global search across public works and network entities.
- pgs/archive.html — full work search, including description, medium, context, sources and related people/groups/places.
- Medium directories — local search using the same public work manifest and network relation names.
- pgs/network.html — relation search plus entity focus with stable ?focus=ENTITY_ID URLs.

The network filtering bug was caused by .is-hidden being scoped only to archive rows. It is now a shared rule used by all dynamic lists.

## Canonical routing
- Work -> record.html?id=WORK_ID
- Non-work relationship -> network.html?focus=ENTITY_ID
- Global entity result -> canonical work record or network focus
- YouTube remains a source register; motion.html is the canonical motion directory.

## Work records
Every public manifest entry already has a description, medium and year.

Record pages now expose:
- preview image when mapped
- short description
- year and verification status
- documentation depth
- classification
- provenance / external links
- explicit relationships
- archive-expansion guidance

The expansion guidance is intentionally data-driven so a sparse entry can be expanded later without changing the page template.

## System status
data/site_status.json is the single current snapshot used by the interface.

Current values:
- 148 total records
- 143 public / 5 private
- 152 relations
- 30 people / 8 groups / 10 places
- 40 art-practice source records
- 47 repositories
- 595 visual assets
- 126 YouTube source rows
- 69 canonical YouTube joins / 57 source-only rows

## Scope boundary
PARAZIT and the Oleg Ustinov website are retained only in data/client_orders.json and repository provenance. They are excluded from:
- public work records
- art-practice source registry
- relationship graph

Oleg Ustinov the collaborator remains where documented through actual shared projects; the private client website itself is not treated as an art-practice source.

## Remaining content work
The current structural/UI layer is coherent enough to support the next archive pass. The main remaining weakness is depth rather than navigation:

- 57 YouTube rows still need manual canonical normalization.
- Only a subset of works currently have mapped preview images.
- Major historical projects still need richer dossier content.
- Asset-level mapping remains separate from the canonical work manifest.