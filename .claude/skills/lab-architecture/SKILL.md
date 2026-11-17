---
name: lab-architecture
description: How the 3D lab (lab/, served at jerryli.me/lab) is structured, and the steps to add or change a chapter or a world, then rebuild and ship it. Use before editing anything under lab/ or public/lab.
---

# Lab architecture

The lab is a separate Vite + three.js project in `lab/`. It has no framework: one canvas, one DOM
overlay, and scroll position driving a camera. The live site serves a **committed build** from
`ArchiveVersions/ver1.0_dec_2024/public/lab` (Vercel does not build `lab/`).

## Map

| File | Job |
|---|---|
| `lab/src/content.ts` | The chapters (text, stats, tags). One entry = one stop on the journey. |
| `lab/src/main.ts` | Renderer, scroll to chapter position `f`, eased position `u`, loop, capture hook. |
| `lab/src/engine/types.ts` | The `Theme` contract every world implements. |
| `lab/src/engine/hud.ts` | DOM overlay. Opacity is computed from `f`, never from CSS transitions. |
| `lab/src/engine/post.ts` | Scene with depth; nebula and blur at half resolution; depth of field, bloom, lens (warp, flare), output. |
| `lab/src/engine/quality.ts` | `low` / `med` / `high` presets (`?q=` overrides) and the frame-rate governor. |
| `lab/src/engine/audio.ts` | Synthesised pad and whoosh. No audio files. |
| `lab/src/themes/voyage.ts` | The world: `build`, `pose`, `update`, `subject`, `telemetry`. |

`f` is the raw chapter position (0..N-1). `u` is `f` eased so the camera lingers at whole
numbers. Cameras use `u`; HUD visibility uses `f`.

## Add or change a chapter

1. Edit `content.ts`. Keep `label` short (it sits in the chapter bar).
2. The world needs a subject for the new index: a `WORLDS` entry in `voyage.ts`. The array is
   indexed by chapter, so a missing entry breaks the last chapters.
3. Tie the subject to the content where you can (ten satellites for ten stores). That is what
   makes a chapter read as designed rather than decorated.

## Add a world

Only Voyage exists. Flight and Dataflow were built and removed after review (see
`lab-scene-direction` for why). The switcher in the HUD appears once `WORLDS` has two entries.

1. Create `themes/<id>.ts` exporting `create<Name>(): Theme`.
2. Register it in `main.ts` (`worlds`), in `hud.ts` (`WORLDS`), and add `<id>` to `ThemeId`.
3. `pose()` must handle `s.aspect < 0.9` (phones): subject above the text, not beside it.
   `subject()` returns what to keep in focus and clear of fog; `light` is where the nebula glows.
4. Add a link in `ArchiveVersions/ver1.0_dec_2024/src/components/VersionHistory.tsx` (`labs`).

## Ship

```bash
cd lab && npm run build:site
```

This type-checks and writes the build to the site's `public/lab` with base `/lab/`. Commit the
changed `public/lab` files with the source. Forgetting this step ships stale code.

Before shipping, run the `lab-capture-review` skill. The page is `noindex` on purpose.
