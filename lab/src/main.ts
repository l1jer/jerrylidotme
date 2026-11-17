import * as THREE from 'three'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import { chapters } from './content'
import { createAudio } from './engine/audio'
import { smoother } from './engine/glsl'
import { createHud } from './engine/hud'
import { createPost } from './engine/post'
import { createGovernor, pickQuality } from './engine/quality'
import type { CameraPose, FrameState, Subject, Theme, ThemeId } from './engine/types'
import { createVoyage } from './themes/voyage'

const params = new URLSearchParams(location.search)
const worlds: Record<ThemeId, () => Theme> = { voyage: createVoyage }
const worldId = (params.get('world') as ThemeId) in worlds ? (params.get('world') as ThemeId) : 'voyage'
// Capture mode renders single frames on request, for deterministic screenshots and video.
const capture = params.has('capture')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

const N = chapters.length
/** Scroll distance per chapter, in viewport heights. */
const SEGMENT_VH = 130

function start() {
  const theme = worlds[worldId]()
  const q = pickQuality(params)
  let dpr = q.dpr

  const canvas = document.getElementById('gl') as HTMLCanvasElement
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: capture })
  renderer.setPixelRatio(q.dpr)
  renderer.setClearColor(theme.background)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(theme.fov, innerWidth / innerHeight, 0.5, 4000)
  theme.build(scene, q)
  theme.prepare?.(renderer, q)
  const post = createPost(renderer, scene, camera, theme, q)
  const audio = createAudio(theme.tone)

  const scrollEl = document.getElementById('scroll')!
  const segment = () => (innerHeight * SEGMENT_VH) / 100
  const jump = (i: number) => scrollTo({ top: i * segment(), behavior: reducedMotion ? 'auto' : 'smooth' })
  const hud = createHud(theme, jump)

  const state: FrameState = { time: 0, dt: 0.016, f: 0, u: 0, speed: 0, pointer: new THREE.Vector2(), aspect: innerWidth / innerHeight }
  const pose: CameraPose = { pos: new THREE.Vector3(), look: new THREE.Vector3(), roll: 0 }
  const subject: Subject = { center: new THREE.Vector3(), radius: 1 }
  const pointerTarget = new THREE.Vector2()
  const right = new THREE.Vector3()
  let baseFov = theme.fov
  const intro = !capture && !reducedMotion

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false)
    post.resize(innerWidth, innerHeight, dpr)
    camera.aspect = state.aspect = innerWidth / innerHeight
    // Narrow screens get a wider view so the subject still fits above the text.
    baseFov = theme.fov * (state.aspect < 1 ? 1.25 : 1)
    scrollEl.style.height = `${(N - 1) * segment() + innerHeight}px`
  }

  /** Lingers near whole chapters and moves quickly between them. */
  const ease = (f: number) => {
    const i = Math.min(N - 2, Math.floor(f))
    return i + smoother((f - i - 0.1) / 0.8)
  }

  function render() {
    state.u = ease(state.f)
    theme.pose(state, pose)
    // Arrival: the first seconds fly in from far behind the starting position.
    const arriving = intro ? 1 - smoother(state.time / 2.8) : 0
    if (arriving > 0) pose.pos.addScaledVector(right.subVectors(pose.pos, pose.look).normalize(), arriving * arriving * 520)
    const warp = Math.min(1, Math.max(Math.abs(state.speed) * 0.9, arriving))
    // The view widens a little at speed.
    camera.fov = baseFov * (1 + warp * 0.1)
    camera.updateProjectionMatrix()
    camera.position.copy(pose.pos)
    camera.up.set(0, 1, 0)
    camera.lookAt(pose.look)
    // Pointer parallax: the camera leans a little towards the cursor.
    right.setFromMatrixColumn(camera.matrixWorld, 0)
    camera.position.addScaledVector(right, state.pointer.x * 1.2).y += state.pointer.y * 0.8
    camera.lookAt(pose.look)
    camera.rotateZ(pose.roll)
    theme.update(state, camera)
    theme.subject(state, subject)
    hud.update(state, capture)
    post.render(state.time, warp, subject)
  }

  const govern = createGovernor(
    q,
    (next) => {
      dpr = next
      resize()
    },
    () => post.degrade()
  )

  let last = performance.now()
  let lastChapter = 0
  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    state.dt = dt
    state.time += dt
    const target = Math.min(N - 1, Math.max(0, scrollY / segment()))
    const prev = state.f
    state.f = reducedMotion ? target : state.f + (target - state.f) * (1 - Math.exp(-dt * 4.5))
    state.speed += ((state.f - prev) / dt - state.speed) * (1 - Math.exp(-dt * 6))
    state.pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 3))
    const chapter = Math.round(state.f)
    if (chapter !== lastChapter) {
      lastChapter = chapter
      audio.whoosh()
    }
    audio.motion(state.speed)
    render()
    if (!document.hidden) govern(dt)
    requestAnimationFrame(tick)
  }

  addEventListener('resize', resize)
  addEventListener('pointermove', (e) => pointerTarget.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)))
  addEventListener('keydown', (e) => {
    const next = ['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)
    const back = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)
    if (!next && !back) return
    e.preventDefault()
    jump(Math.min(N - 1, Math.max(0, Math.round(scrollY / segment()) + (next ? 1 : -1))))
  })
  const soundBtn = document.getElementById('sound')!
  soundBtn.addEventListener('click', async () => {
    const on = await audio.toggle()
    soundBtn.setAttribute('aria-pressed', String(on))
    soundBtn.querySelector('b')!.textContent = on ? 'on' : 'off'
  })

  resize()
  if (capture) {
    // window.__frame(f, time, speed, dt) renders exactly one frame.
    ;(window as unknown as { __frame: (f: number, time: number, speed?: number, dt?: number) => void }).__frame = (f, time, speed = 0, dt = 1 / 30) => {
      state.dt = dt
      state.f = f
      state.time = time
      state.speed = speed
      render()
    }
    ;(window as unknown as { __three: object }).__three = { camera, scene, state, pose }
    render()
  } else {
    requestAnimationFrame(tick)
  }
  document.fonts.ready.then(() => document.getElementById('loader')!.classList.add('done'))
}

try {
  start()
} catch (err) {
  console.error(err)
  const loader = document.getElementById('loader')!
  loader.innerHTML = '<p>This page needs WebGL.</p><a href="https://jerryli.me" style="color:#fff;text-decoration:underline">Open the standard portfolio</a>'
}
