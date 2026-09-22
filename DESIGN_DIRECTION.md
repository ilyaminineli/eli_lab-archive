# eli_lab archive — design direction

## Core visual metaphor

The website is treated as a physical instrument, archive cabinet and working notebook at the same time.

Reference object: the supplied photograph of a modular analogue console.

Translate:
- painted metal faceplates
- cream plastic knobs
- black module dividers
- small technical typography
- tick marks and measurement scales
- red / amber status lamps
- screws and fasteners
- analog meters
- paper labels attached to a machine
- slightly imperfect alignment

## Three visual layers

### 1. Blueprint
- desaturated blue-grey ground
- fine construction grid
- coordinate lines
- registration marks
- section numbers
- technical annotations

### 2. Instrument
- beveled faceplates
- inset panels
- rotary knobs
- LEDs
- meters
- sliders / switches
- hard borders
- mechanical shadows

### 3. Archive
- warm paper
- scanned image edges
- typed metadata
- handwritten-looking annotation
- provenance labels
- dates / editions / locations
- document sleeves and folders

## Material rules

Use texture as material evidence, not decoration.

Good:
- paper fibers
- tactile noise
- subtle scan irregularity
- painted metal
- plastic
- ink
- graphite / red pencil marks
- faint fingerprints or handling marks when an actual asset is available

Avoid:
- generic grunge overlays
- fake dirt
- excessive distress
- glossy glassmorphism
- neon cyberpunk effects
- rounded SaaS cards
- gratuitous animation

## Existing reference systems

### eugene-utau
The Eugene voicebank site already provides the closest existing design precedent:
- warm paper palette
- local texture assets
- paper-button navigation
- hard borders
- inset shadows
- documentary/manual structure
- character and technical information treated as a single archive

### JIHANKI
Use its interface logic as an architectural precedent:
- a machine is the archive interface
- fixed systems and modules
- archive data separated from media
- documents remain first-class objects
- audio and interactive elements can coexist

### PARAZIT
Use its relational archive model as a structural precedent:
- entities are connected
- provenance is explicit
- uncertainty remains visible
- historical snapshots remain part of the archive

## Typography

Primary body: readable humanist sans or serif.
Secondary metadata: monospaced technical face.
Display: restrained editorial serif/sans contrast.

Do not use typography to imitate a fictional vintage machine too literally. The hardware references should come primarily from layout, materials and labels.

## Interaction

Interactions should feel like physical contact:
- buttons depress
- cards shift by a few pixels
- indicators change state
- controls have tiny mechanical feedback
- archive filters behave like a patchbay / selector bank

Motion should remain slow and sparse.

## Current CSS implementation

- body: blueprint grid + tactile noise
- main surfaces: paper plates
- cards: hard borders + physical shadows
- metadata: mono labels
- active nav: red indicator mark
- hero: functional-looking instrument panel with knobs, LED and meter
- reduced-motion support included

## Future components

1. Screw component
2. Rotary knob component
3. LED / signal-light component
4. Analog meter component
5. Paper label component
6. Blueprint callout component
7. Tape / pinned-image component
8. Project dossier component
9. Contact-sheet gallery
10. Timeline with calibration marks
11. Archive filter bank
12. Work record status plate

## Important principle

The archive should not look like a template with a vintage skin.

It should look as though the interface itself was **constructed as an object inside the practice**.