# Second-pass archive audit

> Audit date: 2026-09-22

## Current archive state
- 141 structured work records: 140 public + 1 private.
- 133 validated relationship edges between works, people, places and groups.
- 29 people entities and 7 group entities currently in the relation graph.
- 595 image assets indexed from `eli_lab_official`.
- 126 public YouTube source rows preserved in `Ilya-Minin-Eli.csv`.
- 105 normalized YouTube title signatures in `VIDEO_CATALOG_MAP.md`.
- 69 of 126 YouTube rows receive a first-pass canonical work join; 57 remain source-only for manual provenance.

## Major connections found

### Voice synthesis → music → video
- Eugene / Iirai voicebanks connect directly to songs and audiovisual works.
- `しあわせがこわい` links Eugene to the video/audio branch.
- `だれかの声`, `二十歳`, `子供の空` and `かごめかごめ` connect Akane Iirai / Iirai to the audiovisual archive.
- Hiro and SynthV Custom Scripts are enabling systems around that voice branch rather than separate unrelated coding projects.

### Japan / fieldwork → archive
- SAIKONEON / Lake Saiko context connects JIHANKI, Fuji field recordings, Six Yokai of Mount Fuji and The Mountain Remembers.
- JIHANKI converts field material into a machine-like archive interface.
- This is a distinct conceptual branch rather than simply a travel-project category.

### CGI → animation → production tooling
- EWP Project connects Blender production, asset libraries and a recurring technical/collaborative crew.
- Daly Syndrome continues the long-form animation branch with the same wider production/tooling ecology.
- Pipeline Hub and Multimedia Framework provide the infrastructure layer connecting otherwise separate works.

### Sound art → generative systems
- Belial links Max/MSP, live sample manipulation and semi-algorithmic performance.
- Lab Announcement 3 and Epäorgaanisten Rakenteiden Kierrätys share an electroacoustic / programmed sound lineage.
- Pattern Generator and Hiro show a parallel idea in the visual and vocal domains: rules become generative creative systems.

### Exhibition → collaborative networks
- Refuge connects Ilya to Sergey Bratkov and a larger Rodchenko School student group.
- Meatpacking Biennale connects Untitled works to performance/exhibition history.
- Taming the Serpent connects Ilya and Julia Baranyuk.
- Re-Punk connects exhibition, repeated Kasane Teto drawing, live coding, interactive media and the wider voice/algorithmic branch.
- Aibolit connects Ilya and sasha e b at Gallery Borey / PARAZIT context.

### Digital folklore / liminality
- Found Tape, Barонъ, Бессоница, ritual works, Geztålt, JIHANKI, M7 and WHO IS ELI? occupy a useful cross-medium cluster built around fictional documents, ritualized interfaces, uncanny media and reconstructed histories.

## Duplicates resolved
- MUSE duplicate records merged into `muse-2019`; `MUSE` retained as an alias.
- PATTERN duplicate records merged into `pattern-2021`; `PATTERN` retained as an alias.
- duplicated Geztålt Bandcamp title record removed; preserved in `data/aliases.json`.
- repeated YouTube titles remain in the source CSV because they can represent alternate cuts, shorts or teasers.

## Still not canonicalized
- 57 YouTube rows remain source-only.
- Many individual files in `CG/Teto`, `CG For Site/Logo`, `CG For Site/Album Covers`, `CG/semi-spatial_apartment`, `Serial Experiments Lens/uncanny bar` still need one-to-one project mapping.
- Old game pages require independent project evidence before detailed descriptions are published.
- X and VK are known source URLs, but their current content was not reliably fetchable during the audit.
- The MDF School supplied student URL remains a direct-fetch problem, but the 2021 catalogue provides a verified soundtrack record.

## Link architecture changes
- Canonical works now route through `pgs/record.html?id=WORK_ID`.
- `data/relations.json` is the relationship layer.
- `data/aliases.json` is the deduplication layer.
- `data/sources.json` is the source registry.
- `data/assets.json` is the visual asset index.
- `data/video_relations.json` is the YouTube-to-work join layer.
- `data/themes/*.json` are thematic indexes.
- `scr/core/site.js` is the shared navigation/data loader.
- `scr/catalog/` contains modular catalogue logic.

## Important source corrections
- `eli_lab_official` contains historical duplicated/template-like page content; those page-level copies should not override project-specific repositories.
- The current live repository inventory is broader than the older ELIASADAMS README inventory, so the GitHub account is treated as the discovery layer while project repositories remain authoritative.
- Parallel Vienna is currently a documented event/design record, not evidence that the representative painting image on the homepage belongs to that event.

## Recommended archive model
Keep three layers separate:

1. **Work** — the canonical artistic/technical object.
2. **Document** — video upload, exhibition, screening, interview, post, catalogue entry or process document.
3. **Relation** — person, place, institution, tool, series or theme connection.

This prevents the same artwork from being duplicated every time it appears on YouTube, Bandcamp, Telegram, in an exhibition or in a collaborator archive.