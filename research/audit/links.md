# Audit: internal links

The archive used to route records through hash anchors on category pages. That does not scale once the manifest contains dozens of works.

Current category-page audit: **92** manifest records do not have a corresponding local anchor.

Examples:
- lab-announcement-3 → pgs/audio.html
- pipeline-hub → pgs/software.html
- antokolskyj → pgs/animation.html
- pleiir → pgs/video.html
- live-one-gog → pgs/audio.html
- magic-orgy → pgs/audio.html
- teqcnuilogiogistie → pgs/audio.html
- abnormal-reflective-girl → pgs/audio.html
- frow-telegram-trace → pgs/art.html
- opossum-telegram-trace → pgs/art.html
- birthday-gift-telegram-trace → pgs/art.html
- saint-sin-gift-telegram-trace → pgs/art.html
- mountain-remembers → pgs/video.html
- six-yokai → pgs/video.html
- in-her-20s → pgs/video.html
- childs-sky → pgs/video.html
- someones-voice → pgs/audio.html
- afraid-of-happiness → pgs/audio.html
- fighting-postmodernism → pgs/video.html
- kagome-kagome → pgs/audio.html
- get-hit-below → pgs/video.html
- tetopocalypsis → pgs/video.html
- fukkireta → pgs/video.html
- pjesma-pro-ljubov → pgs/video.html
- taming-the-serpent → pgs/documentation.html
- showreel-2024 → pgs/video.html
- mudak → pgs/video.html
- dymohod → pgs/video.html
- muyskaya-depressiya → pgs/video.html
- greater-than-lesser → pgs/video.html
- vegetables → pgs/video.html
- agonal-machines → pgs/documentation.html
- industrial-sanitation → pgs/video.html
- enlightenment-i → pgs/video.html
- ritual-big-fridge → pgs/video.html
- evocation-turtur → pgs/video.html
- who-is-vova-lilo → pgs/video.html
- w-video-collage → pgs/video.html
- baron → pgs/video.html
- bessonitsa → pgs/video.html
- found-tape → pgs/video.html
- estetish-tape → pgs/audio.html
- balance-2020 → pgs/audio.html
- receiver-2019 → pgs/audio.html
- nature-2019 → pgs/video.html
- rebirth → pgs/video.html
- arctic-2019 → pgs/audio.html
- frr → pgs/video.html
- pticess → pgs/video.html
- insects-2018 → pgs/audio.html
- idiopathic → pgs/audio.html
- aint-no-sunshine → pgs/video.html
- parallel-vienna-2026 → pgs/art.html
- eporgaanisten-rakenteiden-kierratys → pgs/audio.html
- pattern-generator → pgs/software.html
- synthv-custom-scripts → pgs/software.html
- multimedia-framework → pgs/software.html
- assembly-line-challenge → pgs/games.html
- bloody-2 → pgs/cgi.html
- bonza → pgs/cgi.html
- portraits-2020 → pgs/art.html
- unreal-2020 → pgs/art.html
- serial-experiments-lens → pgs/art.html
- serial-experiments-lens-set-one → pgs/art.html
- uncanny-bar → pgs/art.html
- single-photos-2021-22 → pgs/art.html
- mixed-technique-2022 → pgs/art.html
- painting-studies-2022 → pgs/art.html
- refuge-2022 → pgs/art.html
- pereizobretenie-punk → pgs/art.html
- ppp-2018 → pgs/documentation.html
- muse-2019 → pgs/documentation.html
- pattern-2021 → pgs/art.html
- ugol-visual-programming → pgs/documentation.html
- telegraph-kinetic-coding → pgs/documentation.html
- system-s3 → pgs/documentation.html
- memory-of-touch → pgs/documentation.html
- asc-eight-channel → pgs/documentation.html
- holidays-sa-2021 → pgs/documentation.html
- redd-2021 → pgs/documentation.html

## Fix
- Every canonical work should route to `pgs/record.html?id=WORK_ID`.
- Category pages are curated views, not the database.
- Related works should use the same canonical record route.
- Video source rows should link to their canonical parent work where relation confidence is established.

## Current page-level problems
- Old category pages still contain some structural placeholder cards.
- Software page currently has only a Belial record; Pipeline Hub needs a record link.
- Video is a CSV register and therefore needs canonical work joins in a later pass.
- Documentation needs event records rather than generic placeholders.