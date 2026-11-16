import * as THREE from 'three'
import { chapters } from '../content'
import { NOISE, rng } from '../engine/glsl'
import { createDust } from '../engine/particles'
import type { CameraPose, FrameState, Quality, Theme } from '../engine/types'

/**
 * Dataflow: a pipeline above a city of servers. Every chapter is a node, and packets of data
 * stream between nodes the way orders and stock move between a store and an ERP.
 */

const CYAN = 0x22d3ee
const MAGENTA = 0xe879f9
const VIOLET = 0x818cf8
const FLOOR = -34

type Animator = (time: number) => void

const edges = (geo: THREE.BufferGeometry, color: number, opacity = 1) =>
  new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }))
const solid = (geo: THREE.BufferGeometry, color: number) => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color }))

/** One node per chapter. Each returns its group and a per-frame animation. */
const NODES: ((g: THREE.Group) => Animator)[] = [
  // Origin: a bright core in two counter-rotating shells.
  (g) => {
    const a = edges(new THREE.IcosahedronGeometry(5, 1), CYAN, 0.9)
    const b = edges(new THREE.IcosahedronGeometry(7.6, 0), VIOLET, 0.6)
    const core = solid(new THREE.SphereGeometry(1.5, 24, 24), 0xe0fbff)
    g.add(a, b, core)
    return (t) => {
      a.rotation.set(t * 0.25, t * 0.33, 0)
      b.rotation.set(-t * 0.14, 0, t * 0.2)
      core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.12)
    }
  },
  // About: three rings for three disciplines (commerce, marketing, search).
  (g) => {
    const rings = [CYAN, MAGENTA, VIOLET].map((c, k) => {
      const r = solid(new THREE.TorusGeometry(6.4 - k * 0.9, 0.11, 8, 120), c)
      g.add(r)
      return r
    })
    g.add(solid(new THREE.OctahedronGeometry(1.5, 0), 0xffffff))
    return (t) => rings.forEach((r, k) => r.rotation.set(t * (0.3 + k * 0.11) + k, t * (0.21 - k * 0.07), k * 1.1))
  },
  // TSA Outdoors: a hub with ten connected stores.
  (g) => {
    const hub = new THREE.Group()
    hub.add(edges(new THREE.OctahedronGeometry(2.8, 0), CYAN), solid(new THREE.OctahedronGeometry(1.4, 0), 0xd9faff))
    const wheel = new THREE.Group()
    const stores: THREE.Mesh[] = []
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI * 2
      const p = new THREE.Vector3(Math.cos(a) * 8.2, Math.sin(a) * 8.2, 0)
      const box = solid(new THREE.BoxGeometry(1.25, 1.25, 1.25), 0x0b3f4d)
      box.add(edges(new THREE.BoxGeometry(1.25, 1.25, 1.25), k % 2 ? CYAN : 0xa5f3fc))
      box.position.copy(p)
      stores.push(box)
      wheel.add(box, new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), p]), new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.45 })))
    }
    g.add(hub, wheel)
    g.rotation.set(-0.35, 0.5, 0)
    return (t) => {
      wheel.rotation.z = t * 0.12
      hub.rotation.y = t * 0.5
      stores.forEach((s, k) => s.scale.setScalar(1 + Math.max(0, Math.sin(t * 2 - k * 0.63)) * 0.45))
    }
  },
  // Caronlab: thirteen plates, one per site.
  (g) => {
    const plates = Array.from({ length: 13 }, (_, k) => {
      const geo = new THREE.CylinderGeometry(4.4, 4.4, 0.26, 6)
      const plate = new THREE.Group()
      plate.add(solid(geo, 0x1b0a22), edges(geo, k % 3 ? MAGENTA : 0xfbcfe8))
      plate.position.y = (k - 6) * 0.82
      g.add(plate)
      return plate
    })
    g.rotation.set(0.3, 0, 0.2)
    return (t) => plates.forEach((p, k) => (p.rotation.y = Math.sin(t * 0.4 + k * 0.25) * 0.9))
  },
  // Earlier: two small frames, one per early role.
  (g) => {
    const cubes = [3.6, 2.7].map((s, k) => {
      const c = new THREE.Group()
      c.add(edges(new THREE.BoxGeometry(s, s, s), k ? VIOLET : CYAN), solid(new THREE.BoxGeometry(s * 0.35, s * 0.35, s * 0.35), 0xffffff))
      c.position.set(k ? -3.6 : 3, k ? -1.6 : 1.2, k ? 1 : 0)
      g.add(c)
      return c
    })
    return (t) => cubes.forEach((c, k) => c.rotation.set(t * (0.3 + k * 0.1), t * (0.4 - k * 0.15), 0))
  },
  // Builds: the numbers going up.
  (g) => {
    g.add(edges(new THREE.BoxGeometry(12.5, 9.5, 5), VIOLET, 0.55))
    const heights = [1.6, 2.6, 3.5, 5.2, 7.4]
    const bars = heights.map((h, k) => {
      const geo = new THREE.BoxGeometry(1.5, 1, 1.5)
      geo.translate(0, 0.5, 0)
      const bar = solid(geo, new THREE.Color(CYAN).lerp(new THREE.Color(MAGENTA), k / 4).getHex())
      bar.position.set((k - 2) * 2.25, -4.2, 0)
      g.add(bar)
      return { bar, h }
    })
    g.rotation.set(0.12, -0.5, 0)
    return (t) => bars.forEach(({ bar, h }, k) => (bar.scale.y = h * (0.82 + 0.18 * Math.sin(t * 1.4 + k * 0.7))))
  },
  // Toolkit: twelve parts on a rack.
  (g) => {
    const shapes = [() => new THREE.BoxGeometry(1.5, 1.5, 1.5), () => new THREE.OctahedronGeometry(1.1, 0), () => new THREE.TetrahedronGeometry(1.3, 0), () => new THREE.IcosahedronGeometry(1.05, 0)]
    const parts = Array.from({ length: 12 }, (_, k) => {
      const geo = shapes[k % 4]()
      const part = new THREE.Group()
      part.add(edges(geo, [CYAN, MAGENTA, VIOLET][k % 3]), solid(new THREE.SphereGeometry(0.22, 10, 10), 0xffffff))
      part.position.set(((k % 4) - 1.5) * 3.5, (1 - Math.floor(k / 4)) * 3.5, 0)
      g.add(part)
      return part
    })
    g.rotation.set(0.1, -0.45, 0)
    return (t) => parts.forEach((p, k) => p.rotation.set(t * 0.5 + k, t * 0.35 + k * 0.5, 0))
  },
  // Contact: an open port.
  (g) => {
    const swirl = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; varying vec2 vUv;
        ${NOISE}
        void main(){
          vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
          float n = fbm(vec3(cos(a + r * 3.0 - uTime * 0.5) * 2.0, sin(a + r * 3.0 - uTime * 0.5) * 2.0, r * 2.0 - uTime * 0.3));
          float i = smoothstep(1.0, 0.2, r) * (0.25 + n * 1.3) * smoothstep(0.0, 0.25, r);
          gl_FragColor = vec4(mix(vec3(0.13, 0.83, 0.93), vec3(0.91, 0.47, 0.98), n) * i, i);
        }`,
    })
    const ring = solid(new THREE.TorusGeometry(9, 0.22, 10, 160), 0xbff6ff)
    const outer = solid(new THREE.TorusGeometry(10.4, 0.06, 6, 160), MAGENTA)
    g.add(new THREE.Mesh(new THREE.CircleGeometry(9, 96), swirl), ring, outer)
    g.rotation.y = 0.5
    return (t) => {
      swirl.uniforms.uTime.value = t
      outer.rotation.z = t * 0.2
    }
  },
]

export function createFlow(): Theme {
  const N = chapters.length
  const stations = Array.from({ length: N }, (_, i) => new THREE.Vector3(Math.sin(i * 1.3) * 34, 8 + Math.sin(i * 0.8) * 9, -i * 125))
  const curve = (o: [number, number, number]) => new THREE.CatmullRomCurve3(stations.map((s) => s.clone().add(new THREE.Vector3(...o))), false, 'catmullrom', 0.5)
  const wide = { pos: curve([-17, 5, 30]), look: curve([-10, 0, 0]) }
  const tall = { pos: curve([0, -7, 46]), look: curve([0, -11.5, 0]) }

  const animators: Animator[] = []
  const timeUniforms: { value: number }[] = []
  const dummy = new THREE.Object3D()
  let sky: THREE.Mesh, packets: THREE.InstancedMesh
  let dust: ReturnType<typeof createDust>
  // Every strand is sampled into a lookup table so packets can be placed cheaply each frame.
  const SAMPLES = 72
  const strands: Float32Array[] = []
  const packetData: { strand: number; phase: number; speed: number }[] = []

  function build(scene: THREE.Scene, q: Quality) {
    const rand = rng(5)

    sky = new THREE.Mesh(
      new THREE.SphereGeometry(2400, 24, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          varying vec3 vDir;
          void main(){
            vec3 d = normalize(vDir);
            vec3 col = mix(vec3(0.03, 0.02, 0.075), vec3(0.004, 0.006, 0.02), smoothstep(-0.05, 0.5, d.y));
            col += vec3(0.5, 0.12, 0.6) * exp(-abs(d.y + 0.02) * 16.0) * 0.22;
            col += vec3(0.05, 0.4, 0.5) * exp(-abs(d.y + 0.02) * 5.0) * 0.1;
            gl_FragColor = vec4(col, 1.0);
          }`,
      })
    )
    sky.renderOrder = -2
    scene.add(sky)

    // Floor grid with pulses running along its lanes.
    const length = (N - 1) * 125 + 900
    const floorGeo = new THREE.PlaneGeometry(1800, length)
    floorGeo.rotateX(-Math.PI / 2)
    floorGeo.translate(0, FLOOR, -((N - 1) * 125) / 2 - 150)
    const floorMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; varying vec3 vW;
        ${NOISE}
        void main(){
          vec2 g = vW.xz / 12.0;
          vec2 gd = abs(fract(g - 0.5) - 0.5) / fwidth(g);
          float grid = 1.0 - min(min(gd.x, gd.y), 1.0);
          float lineX = 1.0 - min(gd.x, 1.0);
          float lane = floor(g.x + 0.5);
          float run = fract(vW.z / 110.0 + uTime * 0.22 * (0.5 + hash21(vec2(lane, 1.0))) + hash21(vec2(lane, 7.0)));
          float pulse = smoothstep(0.93, 1.0, run) * lineX;
          float dist = length(vW - cameraPosition);
          float fade = exp(-dist * 0.0038);
          vec3 col = vec3(0.006, 0.008, 0.022) + vec3(0.13, 0.83, 0.93) * grid * 0.2 * fade + vec3(0.91, 0.47, 0.98) * pulse * 1.3 * fade;
          gl_FragColor = vec4(mix(vec3(0.02, 0.014, 0.05), col, exp(-dist * 0.0022)), 1.0);
        }`,
    })
    timeUniforms.push(floorMat.uniforms.uTime)
    scene.add(new THREE.Mesh(floorGeo, floorMat))

    // The server city: instanced towers with lit windows, kept clear of the pipeline.
    const towerCount = Math.floor(1100 * q.density)
    const towerGeo = new THREE.BoxGeometry(1, 1, 1)
    towerGeo.translate(0, 0.5, 0)
    const seeds = new Float32Array(towerCount)
    const towerMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSeed; varying vec3 vLocal; varying vec3 vSize; varying float vSeed; varying vec3 vW; varying vec3 vN;
        void main(){
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vW = w.xyz; vLocal = position; vSeed = aSeed; vN = normal;
          vSize = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; varying vec3 vLocal; varying vec3 vSize; varying float vSeed; varying vec3 vW; varying vec3 vN;
        ${NOISE}
        void main(){
          vec2 uv = abs(vN.x) > 0.5 ? vec2(vLocal.z * vSize.z, vLocal.y * vSize.y) : vec2(vLocal.x * vSize.x, vLocal.y * vSize.y);
          vec2 cell = floor(uv / vec2(1.7, 2.3)); vec2 f = fract(uv / vec2(1.7, 2.3));
          float lit = step(0.5, hash21(cell + vSeed * 31.0)) * step(0.2, f.x) * step(f.x, 0.8) * step(0.3, f.y) * step(f.y, 0.72);
          lit *= 0.55 + 0.45 * step(0.4, fract(hash21(cell + 3.0) * 10.0 + uTime * 0.15));
          lit *= step(abs(vN.y), 0.5);
          vec3 tint = mix(vec3(0.13, 0.83, 0.93), vec3(0.91, 0.47, 0.98), step(0.68, fract(vSeed * 7.31)));
          float roof = step(0.5, vN.y) * smoothstep(0.42, 0.5, max(abs(vLocal.x), abs(vLocal.z)));
          vec3 col = vec3(0.007, 0.01, 0.024) + tint * (lit * 0.6 + roof * 0.4);
          float dist = length(vW - cameraPosition);
          gl_FragColor = vec4(mix(vec3(0.02, 0.014, 0.05), col, exp(-dist * 0.0026)), 1.0);
        }`,
    })
    timeUniforms.push(towerMat.uniforms.uTime)
    const towers = new THREE.InstancedMesh(towerGeo, towerMat, towerCount)
    for (let i = 0; i < towerCount; i++) {
      const z = 260 - rand() * (length - 80)
      const laneX = Math.sin((-z / 125) * 1.3) * 34
      const side = rand() > 0.5 ? 1 : -1
      const x = laneX + side * (95 + Math.pow(rand(), 1.6) * 520)
      const h = 10 + Math.pow(rand(), 2.2) * 95
      dummy.position.set(x, FLOOR, z)
      dummy.scale.set(8 + rand() * 16, h, 8 + rand() * 16)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      towers.setMatrixAt(i, dummy.matrix)
      seeds[i] = rand()
    }
    towerGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))
    towers.frustumCulled = false
    scene.add(towers)

    // Nodes.
    NODES.forEach((make, i) => {
      const g = new THREE.Group()
      g.position.copy(stations[i])
      animators.push(make(g))
      scene.add(g)
    })

    // Pipes between nodes, and the packets that travel along them.
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1d7f99, transparent: true, opacity: 0.55 })
    const perStrand = Math.max(4, Math.floor(13 * q.density))
    for (let i = 0; i < N - 1; i++) {
      const a = stations[i], b = stations[i + 1]
      for (let k = 0; k < 6; k++) {
        const off = () => new THREE.Vector3((rand() - 0.5) * 20, (rand() - 0.5) * 14, (rand() - 0.5) * 8)
        const strand = new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.33).add(off()), a.clone().lerp(b, 0.66).add(off()), b])
        const pts = strand.getPoints(SAMPLES)
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
        const table = new Float32Array((SAMPLES + 1) * 3)
        pts.forEach((p, n) => table.set([p.x, p.y, p.z], n * 3))
        strands.push(table)
        for (let n = 0; n < perStrand; n++) packetData.push({ strand: strands.length - 1, phase: rand(), speed: 0.045 + rand() * 0.09 })
      }
    }
    packets = new THREE.InstancedMesh(new THREE.BoxGeometry(0.46, 0.46, 0.46), new THREE.MeshBasicMaterial(), packetData.length)
    const palette = [new THREE.Color(0x67e8f9), new THREE.Color(0xf0abfc), new THREE.Color(0xffffff)]
    packetData.forEach((_, n) => packets.setColorAt(n, palette[n % 7 === 0 ? 2 : n % 3 === 0 ? 1 : 0]))
    packets.frustumCulled = false
    scene.add(packets)

    dust = createDust(Math.floor(600 * q.density), 200, 0xa5f3fc, q.dpr, 60)
    scene.add(dust.points)
  }

  function pose(s: FrameState, out: CameraPose) {
    const t = Math.min(1, Math.max(0, s.u / (N - 1)))
    const path = s.aspect < 0.9 ? tall : wide
    path.pos.getPoint(t, out.pos)
    path.look.getPoint(t, out.look)
    out.pos.x += Math.sin(s.time * 0.23) * 0.5
    out.pos.y += Math.cos(s.time * 0.19) * 0.35
    out.roll = -s.speed * 0.04
  }

  function update(s: FrameState, camera: THREE.PerspectiveCamera) {
    for (const u of timeUniforms) u.value = s.time
    for (const a of animators) a(s.time)
    sky.position.copy(camera.position)
    dust.update(camera, s.speed)

    packetData.forEach((p, n) => {
      const t = (p.phase + s.time * p.speed) % 1
      const table = strands[p.strand]
      const x = t * SAMPLES
      const i0 = Math.floor(x) * 3
      const k = x - Math.floor(x)
      dummy.position.set(
        table[i0] + (table[i0 + 3] - table[i0]) * k,
        table[i0 + 1] + (table[i0 + 4] - table[i0 + 1]) * k,
        table[i0 + 2] + (table[i0 + 5] - table[i0 + 2]) * k
      )
      dummy.rotation.set(t * 9, t * 6, 0)
      // Packets shrink away at both ends instead of popping.
      dummy.scale.setScalar(Math.min(1, t * 12, (1 - t) * 12))
      dummy.updateMatrix()
      packets.setMatrixAt(n, dummy.matrix)
    })
    packets.instanceMatrix.needsUpdate = true
  }

  return {
    id: 'flow',
    name: 'Dataflow',
    unit: 'Node',
    finale: 'Open a connection.',
    background: 0x03040d,
    accent: '#67e8f9',
    accent2: '#f0abfc',
    fov: 46,
    bloom: { strength: 0.5, radius: 0.55, threshold: 0.72 },
    tone: 82.4,
    build,
    pose,
    update,
    telemetry: (s) => [
      ['Node', chapters[Math.round(s.f)].label],
      ['Synced', (128400 + Math.floor(s.time * 3.4)).toLocaleString('en-AU')],
      ['Latency', `${Math.round(38 + Math.sin(s.time * 0.8) * 6)} ms`],
      ['Errors', '0'],
    ],
  }
}
