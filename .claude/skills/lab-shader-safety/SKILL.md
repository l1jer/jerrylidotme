---
name: lab-shader-safety
description: Rules for writing GLSL in the lab so a shader cannot black out or wash out the frame - NaN guards, safe smoothstep, derivative lines, instancing and colour handling. Use when writing or debugging any ShaderMaterial under lab/src.
---

# Shader safety

The post chain blurs the image for bloom. **One NaN pixel becomes a black frame.** This
happened with the Flight terrain and cost an hour. Write shaders so it cannot.

## Rules

1. **Never divide by something that can be zero.** `x / fwidth(c)` is zero on flat areas:
   use `x / max(fwidth(c), 1e-5)`.
2. **Never `normalize()` a vector that can be zero** (`cross(dFdx, dFdy)`, `d.xz` at the
   zenith). Divide by `max(length(v), 1e-6)` or add a tiny offset.
3. **`smoothstep(a, b, x)` needs `a < b`.** Reversed edges are undefined behaviour and differ
   between GPUs. Write `1.0 - smoothstep(lo, hi, x)`.
4. **`pow(x, y)` needs `x >= 0`.** Clamp first.
5. Any shader with derivatives or division ends with
   `if (isnan(col.r) || isnan(col.g) || isnan(col.b)) col = fallback;`.
6. Colours passed as `THREE.Color` are linear; the `OutputPass` does tone mapping and sRGB.
   Do not convert again in the shader.
7. `ShaderMaterial` on an `InstancedMesh` must multiply by `instanceMatrix`. Per-instance data
   goes in an `InstancedBufferAttribute`.
8. Shared noise lives in `engine/glsl.ts` (`NOISE`). Use `fbm3` in vertex shaders (cheaper).
9. Additive, transparent materials set `depthWrite: false`.

## When the frame is black or white

1. Hide objects one at a time and measure mean brightness. `window.__three` is exposed in
   capture mode (`?capture`): `__three.scene.children[i].visible = false; __frame(f, t)`.
2. Black with no console error means NaN. White means exposure: lower the colour multiplier of
   the brightest material before touching bloom.
3. Shader compile errors appear in the console as three.js errors; an empty console does not
   mean the shader is correct.
