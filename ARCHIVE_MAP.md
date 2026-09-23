# eli_lab archive map

> Master index for the research archive. Detailed material is split into maintainable thematic, medium, source and audit files.

## Current state
- `data/works.json` — 156 structured records; 151 public, 5 private.
- `data/relations.json` — 170 explicit work/person/place/group relations.
- `data/aliases.json` — canonical alias and old-label registry used to prevent duplicate work records.
- `Ilya-Minin-Eli.csv` — 126 public YouTube source rows.
- `VIDEO_CATALOG_MAP.md` — normalized YouTube discovery map.
- `data/themes/` — thematic work indexes.
- `data/assets.json` — 595-image visual inventory.
- `data/sources.json` — structured source registry.
- `data/client_orders.json` — private client-site traces excluded from the art-practice graph.
- `data/site_status.json` — canonical UI status snapshot.
- `data/video_relations.json` — first-pass YouTube-to-work joins.

## Start here
- [Visual practice](research/mediums/visual.md)
- [Moving image](research/mediums/moving-image.md)
- [Sound](research/mediums/sound.md)
- [Voice synthesis](research/mediums/voice.md)
- [Systems](research/mediums/systems.md)
- [Games](research/mediums/games.md)
- [Performance](research/mediums/performance.md)
- [Collaboration](research/mediums/collaboration.md)

## Themes
- [Japan / Fuji / folklore](research/themes/japan-fuji-folklore.md)
- [Digital memory / uncanny](research/themes/digital-memory-uncanny.md)
- [Archive / systems](research/themes/archive-systems.md)
- [Materiality / photography](research/themes/materiality-photography.md)
- [Sound / voice / generative](research/themes/sound-voice-generative.md)
- [Liminal / ritual / constructed folklore](research/themes/liminal-ritual-folklore.md)
- [Collective authorship / production networks](research/themes/collective-authorship.md)

## Sources
- [GitHub registry](research/sources/github.md)
- [Web / institutional registry](research/sources/web.md)
- [Social publishing](research/sources/social.md)
- [YouTube source map](research/sources/youtube.md)
- [Old eli_lab_official site](research/sources/old-website.md)

## Audits
- [YouTube duplicates / variants](research/audit/duplicates.md)
- [Missing / ambiguous records](research/audit/gaps.md)
- [Internal links](research/audit/links.md)
- [Site UI / navigation / search](research/audit/site-ui.md)

## Strong relationship clusters
### Voice / synthetic media
UTAU voicebanks → songs → videos → animation → tuning/software.

### Japan / field archive
SAIKONEON → Lake Saiko → JIHANKI → Fuji Sonic Pi → Six Yokai → The Mountain Remembers → Japanese-language UTAU works.

### Generative systems
Pattern Generator → deterministic visual composition; Hiro → procedural lyrics/UST; Belial → semi-algorithmic sound; SynthV Lab → procedural tuning; Pipeline Hub → production automation.

### CGI / moving image
EWP → Blender/pipeline → collaborators; Daly Syndrome → long-form film/pipeline; Antokolskyj → Anna Yuytova/GRIG Film; Pleiir → Spalah.

### Exhibition / collective work
Rodchenko School → Refuge; Meatpacking → Untitled works; Julia Baranyuk → Taming the Serpent / Re-Punk / JIHANKI context; sasha e b → Aibolit.

### Digital-memory / archive logic
Found Tape → digital folklore → JIHANKI → WHO IS ELI? → archive-as-interface.

## Canonical rule
One work = one stable ID. Alternate titles, old website labels, shorts, teasers, screenings, exhibitions, collaborators, tools and themes become aliases or relations.

## Research rule
`source → trace → candidate → verification → relation → public record`