# Script architecture

## core
- `core/site.js` — year, shared navigation and homepage system count.

## catalog
- `catalog/works.js` — public work manifest + archive filters.
- `catalog/video.js` — CSV-driven video register.
- `catalog/record.js` — canonical work record page.
- `catalog/network.js` — grouped project relationship map.
- `catalog/collaborations.js` — people / collaborator index.

## Compatibility
- `script_main.js` remains the small site loader.
- `video_catalog.js` remains a compatibility loader for the older page reference.

Future medium-specific behaviour should live in `catalog/<medium-or-function>/` rather than growing one monolithic script.