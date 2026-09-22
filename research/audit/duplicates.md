# Audit: YouTube duplicates and variants

Source: Ilya-Minin-Eli.csv (126 data rows). Found **6 repeated title groups** representing **27 rows**.

These rows are not deleted. The CSV is the source register. The normalized archive should attach repeated short clips, teasers, anniversary versions and alternate cuts to a parent work.

## Kasane Teto – Get Hit Below (Official Video)
- 8 rows
- thTfSHRGUMk (2025-11-29T16:45:05Z, 00:08), oo4p0jtRk9c (2025-11-29T16:30:17Z, 00:08), OVThUhsmQIk (2025-11-29T16:15:03Z, 00:08), ciWH5ykUfW8 (2025-11-29T16:01:04Z, 00:10), eiIVpQq32Ss (2025-11-29T15:50:00Z, 00:10), OJduFSbaFiw (2025-11-29T15:45:02Z, 00:10), NfqOfeketFA (2025-11-29T15:30:13Z, 00:08), rXnb3Y-orC8 (2025-09-26T17:30:06Z, 02:31)
## Fighting Postmodernism (Official Basil Anniversary Video)
- 5 rows
- AqV7BuZChlg (2026-03-15T20:00:07Z, 00:05), CXhV7nyBTsg (2026-03-15T19:30:02Z, 00:10), pqX2p3AFLTM (2026-03-15T19:15:02Z, 00:10), ShhZOuqWRbs (2026-03-15T18:45:02Z, 00:05), B3rYMMJ79ZM (2026-03-15T18:35:49Z, 00:10)
## 20-s (二 十 歳) | Akane Iirai | UTAU Original #vocaloid #haveitoldyoulatelythatiloveyou #歌ってみた
- 4 rows
- DoYyGbaN1tE (2026-07-16T18:30:37Z, 00:15), O9Z975ee1Ns (2026-07-16T18:15:32Z, 00:17), qMCYjbl0u7g (2026-07-16T17:45:14Z, 00:21), JpZqWAC6Mv0 (2026-07-16T17:30:17Z, 00:12)
## しあわせがこわい / イリヤ・ミニン（エリ）feat. 友人 [I'm afraid of happiness / Ilya Minin (Eli) feat. Eugene]
- 4 rows
- apbx1EJ1Mtg (2026-06-22T01:27:29Z, 00:27), 4VDlmj1DYJo (2026-06-10T23:27:45Z, 00:29), G9Dd3G2uzV4 (2026-06-10T21:08:05Z, 00:22), t_9eOHFA1SI (2026-06-10T20:57:52Z, 00:27)
## Kagome Kagome / Ilya Minin (Eli) feat. Iirai
- 4 rows
- QrCdYSfzz0o (2025-12-01T16:19:13Z, 00:20), nEZFTuR24Xw (2025-12-01T16:15:25Z, 00:20), Pent-Psrloo (2025-12-01T15:58:12Z, 00:20), KpAnmELow2I (2025-12-01T15:51:50Z, 00:20)
## Kasane Teto – Teto? (Official Video)
- 2 rows
- DAN_fcyEF2E (2025-10-31T16:47:45Z, 00:12), oEGjDnbaNYk (2025-10-31T16:45:58Z, 00:12)

## Normalization rule
- Full work = canonical work record.
- Short/teaser/anniversary/alternate cut = video-variant child record.
- Same work in another medium = relation, not duplicate work.
- Keep the original CSV rows intact for provenance.

## Known duplicate clusters to check manually
- Get Hit Below — 8 rows, including multiple 8–10 second clips and one full 2:31 upload.
- Fighting Postmodernism — 5 short anniversary clips.
- 20-s / 二十歳 — 4 short clips on 2026-07-16.
- しあわせがこわい — 4 short clips.
- Kagome Kagome — 4 short clips.
- Kasane Teto – Teto? — 2 short clips.