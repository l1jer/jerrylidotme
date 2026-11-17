---
name: lab-scene-direction
description: Art-direction rules for the 3D lab scenes - composition with the text, exposure and bloom budgets, palette, motion, and what separates a scene people watch from one they skip. Use when designing or reviewing a world or a chapter's visuals.
---

# Scene direction

Feedback so far: Voyage was acceptable; Flight and Dataflow were not ("couldn't get into
them") and were removed. The likely reasons are below. Check new work against them.

## What made Voyage work and the others not

- **One subject per chapter.** Voyage shows one planet, large, with empty space around it.
  Flight repeats the same helicopter-and-gate eight times; Dataflow fills the frame with a city.
  Each chapter needs a distinct silhouette you could draw from memory.
- **Calm background.** Dataflow's lit windows are high-frequency noise behind the text. Keep the
  area behind and around the text low-contrast and low-detail.
- **Light has a direction.** Voyage's planets have a terminator and a rim. Flat, unlit
  `MeshBasicMaterial` shapes (most of Dataflow) read as placeholders.
- **A reason to keep scrolling.** The route in Voyage leads to a star you can see from chapter
  one. A world needs a visible destination or a change over the journey.

## Rules

1. Subject on the right two-fifths on wide screens, above the text on phones. Text keeps the
   left. Nothing bright behind the text block.
2. Exposure: after tone mapping, only small accents should clip to white. If a subject is a
   white blob, lower its colour multiplier first, then the bloom. Bloom threshold stays at or
   above 0.7; strength at or below 0.5.
3. Two hues plus white per world. Take them from `accent` / `accent2`.
4. Motion: the camera never fully stops (slow drift), and travel between chapters is visible
   through near-field particles. No motion that fights reading while a chapter is on screen.
5. Depth: something near, the subject in the middle, something far. Fog or atmospheric fade ties
   them together.
6. Honour `prefers-reduced-motion` and the phone density setting (`q.density`).

## What the reference site does that the lab does not (yet)

Verified in its bundle, not guessed. These are the gap between "acceptable" and "striking":

| Technique | Evidence in the reference | Lab today |
|---|---|---|
| Depth of field | `uAperture`, `uFocus`, `uBokeh`, tier `dofR` | done: focus follows the chapter's subject; sky kept sharp |
| Volumetric fog | ray-marched "vapour" (`uRayO`, `uRayD`, tier `vapourSteps`) | done: ray-marched nebula, clear around the subject, lit towards the star |
| Physically based materials | `MeshPhysicalMaterial`, transmission, env map, shadows, AO | unlit or simple lit shaders |
| Fluid that follows the cursor | `uLiquid`, `uSplat`, `uVisc`, tier `liquidRes` | pointer parallax only |
| Music-reactive visuals | audio analyser feeding `uBeat`, two music tracks | synthesised pad, not reactive |
| Quality tiers | `low` / `med` / `high` presets plus live resolution scaling by frame time | done: same scheme in `engine/quality.ts` |
| Real media | project videos as textures and in a viewer | none |
| Cinematic framing | `uLetterbox`, `uStreak`, `uGlitch`, custom bloom (`uKnee`, `uPrefilter`) | bloom, fringe, vignette, grain |

Next by impact: physically based materials with an environment map, then real project media.
Keep the nebula patchy: when it covers the frame evenly it reads as haze and flattens contrast.
