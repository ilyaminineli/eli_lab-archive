# eli_lab image archive inventory

Source: `eli_lab_official/images/`. This is an asset-discovery ledger, not a claim that every file is a finished artwork.

## Major clusters

| Cluster | Approx. files | Interpretation / next action |
|---|---:|---|
| `CG/Teto/` | 52 | Teto character studies / illustrations; split by work, study, promo and privacy status |
| `CG/semi-spatial_apartment/` | 33 | spatial/environment CGI series |
| `Serial Experiments Lens/uncanny bar/` | 33 | photo / collage series |
| `CG For Site/Logo/` | 25 | identity/logo archive; map to client or personal projects |
| `CG For Site/Album Covers/` | 21 | cover-design archive; map each cover to release where possible |
| `Artwork/Single Photos/` | 18 | named photography / single-image studies |
| `EWP Project/presentation/` | 15 | production/presentation stills for EWP |
| `Artwork/Mixed Technique/` | 12 | 2022 mixed-media studies/collages |
| `CG/3D ESSENTIALS (2020-2021)/` | 12 | CGI study series |
| `Photoseries/set 2 unreal/` | 11 | photo series `Unreal` |
| `CG Design Ilya Minin (Eli)/Online Shop/` | 10 | designed product/object imagery |
| `CG/Graph/` | 10 | graphic / abstract study archive |
| `Photoseries/Orthofuture/` | 10 | photo series |
| `kasane_teto/the_last_days_of_kasane_teto/` | 10 | project stills and preview material |
| `Artwork/Painting/` | 8 | paintings / painting studies |
| `CG For Site/3D design/` | 8 | 3D design archive |
| `Collaborations/Romaner/` | 8 | collaborator-specific image set |
| `Photoseries/London Hello/` | 8 | photo series |
| `Photoseries/Pacanbalet/` | 8 | photo series |
| `CG Design Ilya Minin (Eli)/Mockups/` | 6 | visual design mockups |
| `Artwork/Installations/` | 6 | installation assets; includes No Skin material |
| `Performances/Biennale de Meatpacking - 1ère partie 2022/` | 4 | exhibition/performance artwork documentation |
| `Performances/` | 6 total | includes Meatpacking and Agonal Machines documentation |
| `Portrait/Concert/` | 5 | concert portraits / historical event imagery |
| `Portrait/Digital/` | 5 | digital portrait studies |
| `kasane_teto/get_hit_below/` | 7 | Get Hit Below production / promo imagery |
| `kasane_teto/triple_baka/` | 3 | Triple Baka imagery |

## Exact named visual series

### Serial Experiments Lens / Set 1
- henny
- herr / herringbony
- One and Three Places
- Foresst
- Hej
- Analog Web 2.0
- Waterfall
- Dim var
- Mountains
- Swirl
- Purchase / shop
- Splashes / Bursts / Flashes
- Octo 1

### Photoseries
- Portraits — Autoportrait, Branches, Delight, Fish, Korvus, Loner, Writer
- Unreal — Ball, Cannibal Holocaust, Closer, Crossline, Penumbra, Pump, Unreal, Urusewsky, Velorace, Wires
- London Hello
- Orthofuture
- Pacanbalet
- Single Photos — Barks, Ducks, Deep Yellow Day, Emotions, Forrest, Jellytrain, Lamp, Mandarins, Old Man, Sky Is Blue, Synthesizer, To Light, Vogue, plus several date-named photographs

### CGI / design
- 3D Essentials — Towny, Gaika, Drema, Swirl, Neuron Brain and related studies
- Semi-spatial Apartment — 33-file environment cluster
- Bloody / Bloody 2
- Bonza — Advert, Mockup, Packet
- Online Shop — Coffee, Dryer, Fridge, Hoodie, Phone, Poster, Smartwatch, TV, Teapot, Vacuum
- Mockups — Banner/Square/Монтажная область sets
- CG For Site — 3D design, Album Covers, Events, Logo, Others

### Teto / vocal-synthesis image material
- The Last Day of Kasane Teto — project stills
- Triple Baka — project stills
- Get Hit Below — setup / registration / character images
- Inktober cluster
- Collages cluster
- CG/Teto character studies including Young Teto, Adult Teto, Evil Teto and other titled studies

## Asset policy
- Preserve the original path as provenance.
- Store a stable `asset_id` in future structured records.
- Link a finished work to representative assets; keep production-only files in the research layer.
- Never publish a private or ambiguous image merely because it exists in the repository.
- Do not flatten series into a single image record when the source names individual components.

## Next asset pass
1. build an `asset_clusters.json` machine-readable index
2. map each cluster to work IDs
3. identify duplicate JPG/PNG exports
4. add representative thumbnails to canonical work records
5. separate artwork, promo, production still and collaborator imagery