# Audit: video rows without canonical work joins

The source CSV contains **126 rows**. Current canonical manifest contains **139 public works**. A rule-based first join maps **69 video rows** to canonical work IDs. The remaining **57 rows** stay source-only until their project identity is established.

## Why rows remain source-only
- some are social/anniversary clips rather than standalone works
- some are equipment reviews or personal posts
- some use titles that are too vague to infer a canonical project
- some belong to external/collaboration projects
- some are alternate titles whose relationship should be verified manually

## Unmapped source titles
### 2026
- Happy birthday, Miku! #hatsunemiku #kasaneteto #ilyaminin — sVuzaGUlmkY
- Miku's Birthday! #ilyaminin #haveitoldyoulatelythatiloveyou #kasaneteto #hatsunemiku — lHztA4uf88E
- EWP Project — Experimental CG Animated Short | 2023 — gL7di-eXDmE
- Is this the real love? — f6sq_xcMmpQ
- ｒｅａｌ　ＴＥＴＳＴＥＲ — _fpZ53gjZJ0
- Fighting Postmodernism (Official Basil Anniversary Video) — AqV7BuZChlg
- Fighting Postmodernism (Official Basil Anniversary Video) — CXhV7nyBTsg
- Fighting Postmodernism (Official Basil Anniversary Video) — pqX2p3AFLTM
- Fighting Postmodernism — A Surreal Journey | Ilya Minin (Eli) — O0JdFj6ZYUQ
- Fighting Postmodernism (Official Basil Anniversary Video) — ShhZOuqWRbs
- Fighting Postmodernism (Official Basil Anniversary Video) — B3rYMMJ79ZM
- 銀河に紡ぐラブレター～ — 73vCFQFnsBs
### 2025
- Kasane Teto's 2026 Manifesto | Ilya Minin (Eli) — Bv-4aHjHbf0
- Kasane Teto – Teto? (Official Video) — DAN_fcyEF2E
- Kasane Teto – Teto? (Official Video) — oEGjDnbaNYk
### 2024
- Serval Man – Ilya Minin (Eli), servaldays (Official Reel) — ypP4UKUWvpw
- Bogorodskoye (2022) — Experimental Short Film | Ilya Minin (Eli), Julia Baranyuk — _KpvIF-fgs8
- VIA "Spravžni Čoloviki" – Velikij Illja Minin (Official Video) — QQ9Saxm5gEw
- DVAR – Ko Ki Ki (Dancing Video) — N0LQomFjYAY
- Ilya Minin (Eli) – linearna zaležnosť (Official Video) — wvOA4AV6ytU
- Иногда, наши cбывшиеся желания могут вызвать разочарование — NpxvC5esJHI
- sergaj #meme #mushorts — xpfjvoySHk8
- Never meme #meme #mushorts — a-ml9PY4dRg
### 2023
- Bored of #contemporaryart — 5Zc2ybLKIzE
- EWP Project (Original Cut) — 997vBAqNjm0
- CAKELINK! — zmMRJ03uvOI
- БЄZTДLT — Ї₴HTAЯ — vT8eT6heVfg
- Depeche Mode cover — wPzSisEuKkY
### 2022
- W — Experimental Video Collage | Ilya Minin (Eli) — 5YdNlRgHuuk
- 4 июля 2022 г. — SzK9wA1_RqU
- 1 — Experimental Video Study | Ilya Minin (Eli) — 4iDHaZ6RXg4
- С днём рождения, Артём! — xM8jVXDDoa8
- Весенняя Сказка — xTysVDBJwpE
- Эффект Кулешовой — XKdVkUc8q80
- Почтальон — iegoR8KeFcc
- Trurly Fierndship (Official Video) — B610CDVHkJY
- Afterparty — 3VlOyJrGz9I
- Баронъ — Experimental Film / Digital Folklore | Ilya Minin (Eli) — JchqmZXJ6vQ
- Бессоница — Experimental Video / Digital Folklore | Ilya Minin (Eli) — C3VIPDPRKlg
### 2021
- Зимняя Сказка — P-SJO5ZmFTo
- Убить Нози — 6I0punPLvZE
### 2020
- elias adams - coryx tetraque — oNOWJwHAuuo
- Восстание Хлопка — yb2z2YfJYy8
- elias adams -- estetish tape (single) — cKYk2ivIVfE
- Доширачный вор 2 — zLqJ2I8nlPg
- ↹➑∑∷ᆰ⇝ tensh1 — '-0PSfYzfCto
### 2019
- REBIRTH — Experimental CGI Film | ELIAS ADAMS — sFDSXxvOOHw
- Jak przygotować grzyby — RRhBiiKcAIE
- DVAR БЫЛ ВПЕРВЫЕ НАРИСОВАН! — LKpVG9MCpA8
### 2018
- АСМР НАГГЕТСЫ — kzXCImPNeTk
- EYES SEQUE HUFEURONEDHU EH VUHEJBRBVL 4234523534 — 3oamvbU_wmE
- Magnetic Demon - cclhxn1 — lq6aIPjuTcw
- Micen - Завтрак — GdSdsJz1VAc
- 35 — ELIAS ADAMS / Experimental Ambient Film (2018) — qn902QYS6ik
- HEHD (High End Hard Dead) — 155inL5YMjI
- elias adams -- m3adows (2018) — m5F8hrWrmro
### 2017
- Творческий поиск для ELIAS ADAMS. — OJjkh9s5bpw

## Next join pass
Use the full description field, old website page labels, GitHub project archives and collaborator pages to convert source-only rows into aliases or canonical records. Do not create a new work merely because a YouTube row has a unique title.