---
name: lab-capture-review
description: Capture screenshots and video of the 3D lab in headless Chromium and review them before shipping. Use after any visual change under lab/, and whenever the user asks for a preview, screenshots or a video of the lab.
---

# Capture and review

Headless Chromium renders WebGL in software here. A live page is too slow to screenshot, so
the lab has a **capture mode**: `?capture` stops the loop and exposes
`window.__frame(f, time, speed, dt)`, which renders exactly one frame at chapter position `f`.

## Steps

```bash
cd lab && npm run build && npx vite preview --port 4173 --strictPort &
node scripts/capture-stills.cjs voyage 1280x720          # every chapter of one world
node scripts/capture-stills.cjs voyage 390x844 2,7       # phone, chapters 2 and 7
Q=low node scripts/capture-stills.cjs voyage 960x540 2   # a lower quality tier (default: high)
node scripts/smoke.cjs                                   # live mode, exits non-zero on failure
node scripts/bench.cjs high                              # relative cost per frame; compare before and after
node scripts/capture-video.cjs voyage                    # 576 frames, about 6 minutes
ffmpeg -framerate 24 -i .capture/frames-voyage/%04d.jpg -c:v libx264 -crf 28 -pix_fmt yuv420p voyage.mp4
```

Output goes to `lab/.capture/` (ignored by git). Launch flags that make WebGL work headless:
`--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.

## Review checklist

Look at the images; do not ship on a passing build alone.

- [ ] Every chapter at 1280x720 and 390x844: subject visible, not clipped to white, not black.
- [ ] Text readable over the scene; nothing bright behind it; kicker does not hit the top bar.
- [ ] Each chapter looks different from its neighbours.
- [ ] A frame from mid-travel (between chapters) still looks intentional.
- [ ] `node scripts/smoke.cjs` passes (live mode at low and high tiers, email not in the HTML).

## Limits to state in the report

- Frame rate on real GPUs cannot be measured here. Say so; ask the user to check on their devices.
- Sound is not captured in stills or video. To let the user hear the music, call
  `window.__music(bars)` in capture mode (returns PCM samples), write a WAV and send it.
