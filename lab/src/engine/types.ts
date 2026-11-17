import * as THREE from 'three'

export interface Quality {
  tier: 'low' | 'med' | 'high'
  /** Highest pixel ratio this tier renders at. */
  dpr: number
  /** 0..1 multiplier for particle and instance counts. */
  density: number
  /** Anti-aliasing samples for the scene. */
  msaa: number
  bloom: boolean
  /** Depth of field: distant things go soft. */
  dof: boolean
  /** Ray-march steps for the volumetric nebula. */
  fogSteps: number
  mobile: boolean
}

/** What the camera is looking at: kept in focus and clear of fog. */
export interface Subject {
  center: THREE.Vector3
  radius: number
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
  /** 0..1, peaking on the music's strong beats; 0 while the music is off. */
  beat: number
}

export interface CameraPose {
  pos: THREE.Vector3
  look: THREE.Vector3
  /** Radians of roll around the view axis. */
  roll: number
}

export type ThemeId = 'voyage'

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
  /** One-off work that needs the renderer, such as baking the sky to a texture. */
  prepare?(renderer: THREE.WebGLRenderer, q: Quality): void
  /** Camera pose for an eased chapter position. */
  pose(s: FrameState, out: CameraPose): void
  update(s: FrameState, camera: THREE.PerspectiveCamera): void
  /** The current chapter's subject, blended between chapters. */
  subject(s: FrameState, out: Subject): void
  /** World position of the main light, for the glow inside the nebula. */
  light: THREE.Vector3
  /** Small live readouts for the HUD. */
  telemetry(s: FrameState): [label: string, value: string][]
  /** Root note in Hz for the ambient pad. */
  tone: number
}
