import type { Quality } from './types'

/** Presets. Heavier effects only switch on where there is headroom for them. */
const TIERS: Record<Quality['tier'], Omit<Quality, 'mobile'>> = {
  low: { tier: 'low', dpr: 1, density: 0.45, msaa: 0, bloom: true, dof: false, fogSteps: 4 },
  med: { tier: 'med', dpr: 1.25, density: 0.8, msaa: 0, bloom: true, dof: true, fogSteps: 5 },
  high: { tier: 'high', dpr: 1.5, density: 1, msaa: 2, bloom: true, dof: true, fogSteps: 6 },
}

/** Picks a starting tier from the device; `?q=low|med|high` overrides it. */
export function pickQuality(params: URLSearchParams): Quality {
  const mobile = Math.min(innerWidth, innerHeight) < 700 || matchMedia('(pointer: coarse)').matches
  const asked = params.get('q') as Quality['tier'] | null
  const cores = navigator.hardwareConcurrency || 4
  const tier = asked && asked in TIERS ? asked : mobile ? 'low' : cores >= 8 ? 'high' : 'med'
  const preset = TIERS[tier]
  return { ...preset, dpr: Math.min(devicePixelRatio || 1, preset.dpr), mobile }
}

/**
 * Keeps the frame rate up by trading resolution: lowers the pixel ratio when frames run long,
 * raises it again when there is room, and asks for effects to be dropped as a last resort.
 */
export function createGovernor(q: Quality, apply: (dpr: number) => void, degrade: () => void) {
  const max = q.dpr
  const floor = Math.min(1, max) * 0.6
  let dpr = max, acc = 0, frames = 0, strikes = 0, degraded = false
  return (dt: number) => {
    acc += dt
    if (++frames < 45) return
    const avg = acc / frames
    acc = frames = 0
    // Below about 50 frames a second, give up resolution first.
    if (avg > 1 / 50) {
      if (dpr > floor + 0.01) apply((dpr = Math.max(floor, dpr - 0.25)))
      else if (!degraded && ++strikes >= 2) {
        degraded = true
        degrade()
      }
    } else if (avg < 1 / 58 && dpr < max && !degraded) {
      apply((dpr = Math.min(max, dpr + 0.15)))
    }
  }
}
