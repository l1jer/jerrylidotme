import * as THREE from 'three'

export interface Quality {
  dpr: number
  /** 0..1 multiplier for particle and instance counts. */
  density: number
  bloom: boolean
  mobile: boolean
}

export interface FrameState {
  /** Seconds since start. */
  time: number
  dt: number
  /** Chapter position from scroll, 0..N-1, smoothed. */
  f: number
  /** Eased chapter position: lingers at each chapter, used for the camera. */
  u: number
  /** Chapters per second, signed and smoothed. */
  speed: number
  /** Pointer in -1..1, smoothed. */
  pointer: THREE.Vector2
  /** Viewport width / height. */
  aspect: number
}

export interface CameraPose {
  pos: THREE.Vector3
  look: THREE.Vector3
  /** Radians of roll around the view axis. */
  roll: number
}

export type ThemeId = 'voyage' | 'flight' | 'flow'

export interface Theme {
  id: ThemeId
  name: string
  /** Word for a chapter in this world, shown in the HUD: "Orbit 02". */
  unit: string
  /** Headline of the last chapter. */
  finale: string
  background: number
  accent: string
  accent2: string
  fov: number
  bloom: { strength: number; radius: number; threshold: number }
  build(scene: THREE.Scene, q: Quality): void
  /** Camera pose for an eased chapter position. */
  pose(s: FrameState, out: CameraPose): void
  update(s: FrameState, camera: THREE.PerspectiveCamera): void
  /** Small live readouts for the HUD. */
  telemetry(s: FrameState): [label: string, value: string][]
  /** Root note in Hz for the ambient pad. */
  tone: number
}
