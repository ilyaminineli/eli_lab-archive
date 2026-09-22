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