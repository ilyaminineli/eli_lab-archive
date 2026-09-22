# Second-pass archive audit / 2026-09-22

## Snapshot

- **149 structured work records** — 144 public, 5 private.
- **153 relation edges** across works, people, groups and places.
- **23 title/label aliases** tracked for deduplication.
- **41 registered sources**.
- **47 GitHub repositories** in the linked `ilyaminineli` account — 31 public, 16 private.
- **595 visual assets** indexed from `eli_lab_official`.
- **126 YouTube source rows** preserved; 69 have first-pass canonical work joins and 57 remain source-only.

## What changed

### Database architecture
`works.json` is now the canonical work layer. `relations.json` stores collaboration/institution/tool/work connections. `aliases.json` prevents old titles and duplicate catalogue labels from creating duplicate work IDs. `sources.json` records source provenance. `assets.json` indexes the visual repository. `video_relations.json` keeps YouTube as a source layer rather than a second artwork catalogue.

### Site architecture
Added canonical `record.html?id=WORK_ID` pages and a searchable `network.html`. Medium and contextual directories now read the work manifest instead of carrying independent hand-written lists. Shared JavaScript is split into `core/` and `catalog/` modules.

### New / previously missing records
- Daly Syndrome production archive.
- Assembly Line Challenge.
- No Skin.
- London Hello / Orthofuture / Pacanbalet photographic series.
- EWP presentation archive.
- CG / 3D design, album-cover, logo and online-shop clusters.
- Re-Punk / Переизобретая панк.
- Aibolit / Айболит collaboration with sasha e b.
- Current private WHO IS ELI? project.
- Current private Song Creator system.
- Current private Vocaloid Jazz Album project.
- PARALLEL VIENNA 2026 event-side records for Alexander Zaloopin and Oleg Ustinov.
- ELI LAB MV private editor and public MV TITLER tool.

## Major cross-project connections

### Synthetic voice
UTAU / OpenUtau voicebanks → Japanese songs → Kasane Teto videos → animation → SynthV tuning → procedural lyric generation.

### Japan / fieldwork
SAIKONEON → Lake Saiko → JIHANKI → Fuji Sonic Pi → Six Yokai → The Mountain Remembers → Japanese-language voicebank works.

### Archive as artwork
JIHANKI, PARAZIT, Multimedia Framework, WHO IS ELI? and the current archive all treat classification, documentation or reconstruction as part of the artistic mechanism.

### Production systems
Pattern Generator, Hiro, SynthV scripts, Belial, Sonic Pi, Pipeline Hub, Multimedia Framework and the private MV editor form a continuous toolchain rather than unrelated utilities.

### Collective authorship
EWP / Daly / Antokolskyj / Pleiir / Gonki i Tochka / Refuge / Aibolit / Re-Punk / JIHANKI are now connected by explicit collaboration relations instead of collaborator-name repetition.

### Current 2026 branch
Blue Neon + NO ONE IS LISTENING → Vocaloid Jazz Album → Kasane Teto / Chis-A → Song Creator; this branch is kept private while in development.

## Duplication findings
- 6 exact repeated-title groups in the YouTube export account for 27 source rows.
- Old site pages reuse generic collaborator/crew boilerplate across unrelated projects.
- Tanerlach duplicates the Eli audio index.
- Desolation Odyssey / Elysium / Metaliminal share a liminality essay and need project-specific verification.
- Old category pages are no longer treated as the database; the canonical record route removes the previous 92-anchor problem.

## External-source findings
- Bandcamp currently exposes the music discography, including current 2026 releases and the geztålt catalogue. Source: https://eliasadams.bandcamp.com/
- X and VK are stored as first-class identity/publishing URLs, but their current page contents were not reliably retrievable in this pass; no work metadata was inferred from them.
- The current ELIASADAMS profile provides a repository inventory and directly describes the practice as spanning experimental music, voice synthesis, generative systems, interactive archives, animation, games and digital folklore.

## Remaining research

1. Convert the 57 source-only YouTube rows into aliases / child variants / canonical works where evidence allows.
2. Map the 595 visual assets to work IDs at asset level.
3. Recover project-specific facts for the ambiguous game branch and old collaborator pages.
4. Finish dedicated dossiers for major works instead of relying on generic record cards.
5. Rebuild biography/history from the old site as a separate documentary timeline.

## Maintainer principle
Never duplicate a fact merely because a page needs it. Add it once to the appropriate data layer and connect it through IDs.