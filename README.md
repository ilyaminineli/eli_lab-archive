# eli_lab-archive

Personal digital archive for multidisciplinary work by eli_lab.

## Site architecture

- `index.html` — curated landing page / selected works
- `pgs/archive.html` — complete work index with medium filters
- `pgs/cv.html` — CV, practice and contact
- `pgs/art.html` — art archive
- `pgs/animation.html` — animation archive
- `pgs/audio.html` — audio archive
- `pgs/video.html` — video archive
- `pgs/software.html` — software archive
- `pgs/cgi.html` — CGI / 3D archive
- `pgs/interactive.html` — interactive archive
- `pgs/games.html` — games archive
- `pgs/vocal.html` — vocal synthesis / voicebank archive
- `pgs/documentation.html` — documentation, exhibition and field records
- `pgs/collaborations.html` — collaboration index
- `ARCHIVE_MAP.md` — master index into modular research maps
- `research/` — modular medium/theme/source/audit research blocks
- `data/relations.json` — relationship graph
- `data/aliases.json` — duplicate/alias registry
- `data/sources.json` — source registry
- `data/assets.json` — 595-image asset inventory
- `data/repositories.json` — current 47-repository account inventory, including separately marked client/private-order repositories
- `data/video_relations.json` — YouTube-to-work join map
- `DESIGN_DIRECTION.md` — skeuomorphic console / blueprint design specification
- `data/works.json` — curated structured work manifest
- `Ilya-Minin-Eli.csv` — 126-row public YouTube source export
- `VIDEO_CATALOG_MAP.md` — normalized video-title index and project-relationship discovery
- `css/measures.css` — fluid typography, spacing and grid tokens
- `css/style_main.css` — visual system and responsive layout
- `scr/script_main.js` — compatibility loader for shared site core
- `scr/README.md` — modular JavaScript map
- `scr/core/` — shared site behavior
- `scr/catalog/` — work/video/medium/network/record renderers

## Design direction

The site is built as an editorial archive rather than a conventional portfolio. The selected page is the invitation; the archive is the backbone; individual medium pages provide room for context and project records; the CV stays secondary and concise.

The visual language is intentionally minimal and tactile, using a serious analog-terminal chassis: blueprint grids, painted-metal panels, cream paper labels, mono technical metadata, serif/sans typography, fine construction lines, rotary-control motifs, indicator lamps, subtle print textures and restrained vermilion/amber status marks. The goal is an artist archive that feels physically constructed, closer to an old instrument, technical drawing, artist publication or working dossier than a glossy agency portfolio. Placeholder media blocks are structural only and should be replaced by real project imagery as the archive is populated.

## Future data layer

The work metadata layer is now in place: `data/works.json`, `data/relations.json`, `data/aliases.json`, `data/sources.json`, `data/assets.json` and the video/source join maps separate canonical works from documents, people, places and provenance. The next step is deeper asset-level mapping and richer per-work dossiers.

## Current data snapshot

- 148 structured work records (143 public + 5 private)
- 152 relation edges
- 595 indexed visual assets
- 126 YouTube source rows
- 105 normalized YouTube title signatures
- 69 first-pass YouTube-to-work joins / 57 source-only rows awaiting manual normalization
- 47 GitHub repositories in the linked account inventory

