# YouTube source map

## Source file
`Ilya-Minin-Eli.csv` contains 126 public video rows.

## Normalization
- 105 distinct title signatures are currently represented in `VIDEO_CATALOG_MAP.md`.
- 6 exact repeated-title groups account for 27 source rows.
- Repeated rows are retained because they may represent shorts, teasers, anniversary clips, alternate cuts or reposts.

## Canonical join strategy
CSV row → source video ID → normalized title → canonical work ID → relation graph.

Do not delete a source row merely because its parent work is already known.

## 2026 CSV recheck

The current 126-row export has been re-read as a source-data layer rather than only a title list. **116 rows contain non-empty descriptions**, and those descriptions now feed `data/video_context.json`.

The recheck surfaced explicit naming / credit forms including **DYNAKYRIS / ダイナキリス**, **Marysia Izdebska** (with the older archive spelling retained as an alias), **Yulia/Julia Baranyuk**, **Vasiliy/Vasily Ivanov**, **artbasil**, **Hose**, **Varvara Kuleshova**, **Ivan Netkachev**, **Toshimitsu Kobayashi / 小林 利充**, and **Masagire Miura / 三浦 正重**. These are source-derived names and roles; ambiguous handles or subjects are not automatically merged with existing people.

The same pass promoted clear video-to-work matches for EWP Project, Kasane Teto's 2026 Manifesto, Serval Man, linearna zaležnosť, Эффект Кулешовой, Trurly Fierndship, Bogorodskoye and an additional Get Hit Below upload.

Video descriptions are now available inside canonical record pages as expandable source context, including links embedded in the original description.


The description layer also preserves **16 unique external URLs** found inside video descriptions; these are aggregated in `data/video_external_links.json`. This includes current/recent links as well as historical social/profile destinations such as VK, old Facebook/Google+ pages, Galactikka, Telegram, and a TLE Records Bandcamp track. They are preserved as provenance until their present status can be verified.
