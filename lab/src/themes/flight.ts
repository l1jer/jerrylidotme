import * as THREE from 'three'
import { chapters } from '../content'
import { NOISE } from '../engine/glsl'
import { createDust } from '../engine/particles'
import type { CameraPose, FrameState, Quality, Theme } from '../engine/types'

/**
 * Flight: an RC helicopter flies a canyon route at dusk. Every chapter is a waypoint gate.
 * The terrain is one plane displaced in the vertex shader and drawn as a contour map.
 */

const SPACING = 150
const SUN = new THREE.Vector3(0.28, 0.085, -1).normalize()
const UP = new THREE.Vector3(0, 1, 0)
const GATE_SIDES = [96, 6, 4, 96, 3, 8, 6, 96]
// Chase-camera framing per chapter: [distance behind, height, distance to the left].
const FRAMING: [number, number, number][] = [[17, 4.6, 6.5], [13, 2.2, 5.5], [20, 7.5, 7], [15, 3.2, 6], [22, 10, 8], [13.5, 1.6, 5.5], [18, 5.5, 6.5], [24, 6.5, 9]]

// Same curve in JS and GLSL: the canyon follows it.
const pathX = (z: number) => Math.sin((-z / SPACING) * 0.9) * 46
const TERRAIN = /* glsl */ `
  ${NOISE}
  float height(vec2 xz){
    float px = sin((-xz.y / ${SPACING.toFixed(1)}) * 0.9) * 46.0;
    float valley = smoothstep(14.0, 115.0, abs(xz.x - px));
    float h = fbm3(vec3(xz * 0.011, 0.0)) * 96.0 + vnoise(vec3(xz * 0.05, 3.0)) * 7.0;
    return h * valley * valley - 3.0;
  }`

function buildHelicopter() {
  const heli = new THREE.Group()
  const hull = new THREE.MeshStandardMaterial({ color: 0x2c4a55, metalness: 0.45, roughness: 0.42, emissive: 0x0b2a30, emissiveIntensity: 0.6 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x16252b, metalness: 0.3, roughness: 0.6 })
  const amber = new THREE.MeshBasicMaterial({ color: 0xffb347 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x0a2a30, emissive: 0x22e3c8, emissiveIntensity: 0.55, metalness: 0.2, roughness: 0.15 })
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = heli) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }
  // Forward is +Z.
  add(new THREE.SphereGeometry(1, 28, 20), hull).scale.set(0.95, 1.05, 2.1)
  add(new THREE.SphereGeometry(0.82, 24, 16), glass, 0, 0.18, 0.95).scale.set(0.92, 0.9, 1.25)
  add(new THREE.CylinderGeometry(0.13, 0.3, 4.4, 10), hull, 0, 0.25, -3.7).rotation.x = Math.PI / 2
  add(new THREE.BoxGeometry(0.08, 1.5, 0.75), hull, 0, 0.85, -5.7).rotation.x = -0.3
  add(new THREE.BoxGeometry(1.5, 0.06, 0.45), hull, 0, 0.3, -5.2)
  add(new THREE.BoxGeometry(1.94, 0.09, 1.3), amber, 0, -0.1, -0.2)
  add(new THREE.CylinderGeometry(0.09, 0.09, 0.75, 8), dark, 0, 1.3, -0.1)
  for (const x of [-0.85, 0.85]) {
    add(new THREE.CylinderGeometry(0.06, 0.06, 3.3, 8), dark, x, -1.32, 0.15).rotation.x = Math.PI / 2
    for (const z of [-0.7, 0.9]) add(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 6), dark, x * 0.82, -1.0, z).rotation.z = x > 0 ? 0.35 : -0.35
  }
  const rotor = new THREE.Group()
  rotor.position.y = 1.68
  for (const r of [0, Math.PI / 2]) add(new THREE.BoxGeometry(9.6, 0.05, 0.3), dark, 0, 0, 0, rotor).rotation.y = r
  const disc = add(new THREE.CircleGeometry(4.8, 48), new THREE.MeshBasicMaterial({ color: 0x7ff5e6, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false }), 0, 0.02, 0, rotor)
  disc.rotation.x = -Math.PI / 2
  heli.add(rotor)
  const tailRotor = new THREE.Group()
  tailRotor.position.set(0.16, 0.95, -5.75)
  add(new THREE.BoxGeometry(0.04, 1.7, 0.14), dark, 0, 0, 0, tailRotor)
  add(new THREE.BoxGeometry(0.04, 0.14, 1.7), dark, 0, 0, 0, tailRotor)
  heli.add(tailRotor)
  const lights = [
    add(new THREE.SphereGeometry(0.11, 10, 10), new THREE.MeshBasicMaterial({ color: 0xff4d4d }), -0.97, 0, 0.2),
    add(new THREE.SphereGeometry(0.11, 10, 10), new THREE.MeshBasicMaterial({ color: 0x4dff9a }), 0.97, 0, 0.2),
    add(new THREE.SphereGeometry(0.13, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 1.65, -5.9),
  ]
  return { heli, rotor, tailRotor, lights }
}

export function createFlight(): Theme {
  const N = chapters.length
  const altitude = (i: number) => 23 + Math.sin(i * 1.7) * 5
  // One extra point before and after, so the route has a lead-in and a way out.
  const waypoints = Array.from({ length: N + 2 }, (_, k) => {
    const i = k - 1
    return new THREE.Vector3(pathX(-i * SPACING), altitude(i), -i * SPACING)
  })
  const path = new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5)
  const param = (u: number) => Math.min(1, Math.max(0, (u + 1) / (N + 1)))

  const { heli, rotor, tailRotor, lights } = buildHelicopter()
  const H = new THREE.Vector3(), T = new THREE.Vector3(), R = new THREE.Vector3(), T2 = new THREE.Vector3()
  const gates: { ring: THREE.Mesh; gem: THREE.LineSegments; mat: THREE.MeshBasicMaterial }[] = []
  let terrainMat: THREE.ShaderMaterial, sky: THREE.Mesh, crumbsMat: THREE.ShaderMaterial
  let dust: ReturnType<typeof createDust>
  let prevU = 0, uSpeed = 0, bank = 0

  function build(scene: THREE.Scene, q: Quality) {
    scene.add(new THREE.HemisphereLight(0x8fd9d0, 0x05080a, 1.5))
    const sun = new THREE.DirectionalLight(0xffb066, 2.4)
    sun.position.copy(SUN).multiplyScalar(100)
    const fill = new THREE.DirectionalLight(0x9eeaff, 2.6)
    fill.position.set(-60, 40, 80)
    scene.add(sun, fill)

    const sx = Math.floor(190 * (q.mobile ? 0.6 : 1))
    const length = (N - 1) * SPACING + 760
    const geo = new THREE.PlaneGeometry(1000, length, sx, Math.floor((sx * length) / 1000))
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, 0, -((N - 1) * SPACING) / 2 - 100)
    terrainMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uHeli: { value: new THREE.Vector3() }, uFog: { value: new THREE.Color(0x06171c) } },
      vertexShader: /* glsl */ `
        varying vec3 vW; varying float vH;
        ${TERRAIN}
        void main(){
          vec3 p = position; p.y = height(p.xz); vH = p.y;
          vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform vec3 uHeli, uFog; varying vec3 vW; varying float vH;
        void main(){
          // Flat-shaded facets from screen-space derivatives.
          vec3 n = cross(dFdx(vW), dFdy(vW));
          n /= max(length(n), 1e-6);
          float shade = clamp(dot(n, normalize(vec3(0.4, 0.55, -0.7))) * 0.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(vec3(0.004, 0.02, 0.028), vec3(0.02, 0.075, 0.09), shade);
          vec2 g = vW.xz / 10.0;
          vec2 gd = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), vec2(1e-5));
          float grid = 1.0 - min(min(gd.x, gd.y), 1.0);
          float c = vH / 7.0;
          float contour = 1.0 - min(abs(fract(c - 0.5) - 0.5) / max(fwidth(c), 1e-5), 1.0);
          float dist = length(vW - cameraPosition);
          float fade = exp(-dist * 0.0042);
          vec3 teal = vec3(0.13, 0.95, 0.8), amber = vec3(1.0, 0.6, 0.16);
          col += teal * grid * 0.3 * fade;
          col += mix(teal, amber, smoothstep(18.0, 70.0, vH)) * contour * 0.55 * fade;
          // A radar sweep spreading from the helicopter.
          float ring = fract(uTime * 0.2);
          float pulse = (1.0 - smoothstep(0.0, 2.2, abs(length(vW.xz - uHeli.xz) - ring * 280.0))) * (1.0 - ring);
          col += amber * pulse * (0.12 + grid * 0.8);
          col += amber * smoothstep(40.0, 92.0, vH) * shade * 0.14;
          col = mix(uFog, col, exp(-dist * 0.0024));
          // One bad pixel would spread through the bloom pass, so never emit NaN.
          if (isnan(col.r) || isnan(col.g) || isnan(col.b)) col = uFog;
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
    scene.add(new THREE.Mesh(geo, terrainMat))

    sky = new THREE.Mesh(
      new THREE.SphereGeometry(2400, 32, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uSun: { value: SUN.clone() }, uNight: { value: 0 } },
        vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uSun; uniform float uNight; varying vec3 vDir;
          ${NOISE}
          void main(){
            vec3 d = normalize(vDir);
            vec3 col = mix(vec3(0.02, 0.085, 0.11), vec3(0.004, 0.012, 0.04), smoothstep(0.0, 0.42, d.y));
            vec3 warm = mix(vec3(1.0, 0.4, 0.12), vec3(0.85, 0.2, 0.55), uNight);
            float az = max(dot(normalize(d.xz + vec2(1e-5)), normalize(uSun.xz)), 0.0);
            col += warm * pow(az, 14.0) * exp(-abs(d.y) * 11.0) * 0.8;
            col += warm * exp(-abs(d.y) * 26.0) * 0.07;
            col += vec3(1.0, 0.78, 0.45) * smoothstep(0.062, 0.04, distance(d, uSun)) * 1.6;
            vec3 cell = floor(d * 240.0);
            col += vec3(0.8, 0.9, 1.0) * step(mix(0.9975, 0.993, uNight), hash31(cell)) * smoothstep(0.06, 0.4, d.y) * (0.7 + uNight * 0.6);
            gl_FragColor = vec4(col, 1.0);
          }`,
      })
    )
    sky.renderOrder = -2
    scene.add(sky)

    // Route markers: a dotted line of lights along the planned path.
    const crumbCount = 520
    const cp = new Float32Array(crumbCount * 3), ct = new Float32Array(crumbCount)
    for (let i = 0; i < crumbCount; i++) {
      const t = i / (crumbCount - 1)
      const p = path.getPoint(t)
      cp.set([p.x, p.y - 2.4, p.z], i * 3)
      ct[i] = t
    }
    const crumbGeo = new THREE.BufferGeometry()
    crumbGeo.setAttribute('position', new THREE.BufferAttribute(cp, 3))
    crumbGeo.setAttribute('aT', new THREE.BufferAttribute(ct, 1))
    crumbsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uHead: { value: 0 }, uScale: { value: q.dpr } },
      vertexShader: /* glsl */ `
        attribute float aT; uniform float uTime, uHead, uScale; varying float vA;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float ahead = step(uHead, aT);
          float run = 0.5 + 0.5 * sin(aT * 700.0 - uTime * 5.0);
          vA = mix(0.12, 0.45 + run * 0.55, ahead);
          gl_PointSize = uScale * 150.0 / max(-mv.z, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){ float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5)) * vA; gl_FragColor = vec4(vec3(1.0, 0.68, 0.25) * a, a); }`,
    })
    const crumbs = new THREE.Points(crumbGeo, crumbsMat)
    crumbs.frustumCulled = false
    scene.add(crumbs)

    // One gate per chapter, a little past the hover point, with a beam down to the canyon floor.
    for (let i = 0; i < N; i++) {
      const t = param(i + 0.085)
      const pos = path.getPoint(t)
      const mat = new THREE.MeshBasicMaterial({ color: 0x22e3c8 })
      // A different gate outline per chapter: triangle, square, hexagon, octagon or a full ring.
      const sides = GATE_SIDES[i % GATE_SIDES.length]
      const ring = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.16, 8, sides), mat)
      ring.rotation.z = sides === 4 ? Math.PI / 4 : sides === 3 ? Math.PI / 2 : 0
      ring.position.copy(pos)
      const spin = ring.rotation.z
      ring.lookAt(pos.clone().add(path.getTangent(t)))
      ring.rotateZ(spin)
      const inner = new THREE.Mesh(new THREE.TorusGeometry(7.6, 0.04, 6, sides), new THREE.MeshBasicMaterial({ color: 0x22e3c8, transparent: true, opacity: 0.5 }))
      ring.add(inner)
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 40, 6), new THREE.MeshBasicMaterial({ color: 0x22e3c8, transparent: true, opacity: 0.35 }))
      beam.position.set(pos.x, pos.y - 28.5, pos.z)
      const gem = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.OctahedronGeometry(1.3, 0)), new THREE.LineBasicMaterial({ color: 0xffb347 }))
      gem.position.set(pos.x, pos.y + 11.5, pos.z)
      scene.add(ring, beam, gem)
      gates.push({ ring, gem, mat })
    }

    scene.add(heli)
    dust = createDust(Math.floor(700 * q.density), 180, 0x9ff5ea, q.dpr, 70)
    scene.add(dust.points)
  }

  function locate(u: number, time: number) {
    const t = param(u)
    path.getPoint(t, H)
    path.getTangent(t, T).normalize()
    R.crossVectors(T, UP).normalize()
    // A gentle hover.
    H.y += Math.sin(time * 1.3) * 0.35
    H.addScaledVector(R, Math.sin(time * 0.9) * 0.3)
  }

  function pose(s: FrameState, out: CameraPose) {
    locate(s.u, s.time)
    if (s.aspect < 0.9) {
      out.pos.copy(H).addScaledVector(T, -24).addScaledVector(UP, 1.5)
      out.look.copy(H).addScaledVector(T, 10).addScaledVector(UP, -8)
    } else {
      // Chase from behind and to the left, so the helicopter sits right of centre.
      // Blend between the framings of the two nearest chapters.
      const i0 = Math.min(N - 1, Math.floor(s.u)), i1 = Math.min(N - 1, i0 + 1), k = s.u - i0
      const a = FRAMING[i0], b = FRAMING[i1]
      const back = a[0] + (b[0] - a[0]) * k, up = a[1] + (b[1] - a[1]) * k, left = a[2] + (b[2] - a[2]) * k
      out.pos.copy(H).addScaledVector(T, -back).addScaledVector(UP, up).addScaledVector(R, -left)
      out.look.copy(H).addScaledVector(T, 10).addScaledVector(R, -left * 1.08).addScaledVector(UP, 1)
    }
    out.pos.y += Math.sin(s.time * 0.7) * 0.25
    out.roll = -bank * 0.35
  }

  function update(s: FrameState, camera: THREE.PerspectiveCamera) {
    uSpeed += (THREE.MathUtils.clamp((s.u - prevU) / Math.max(s.dt, 1e-3), -3, 3) - uSpeed) * 0.2
    prevU = s.u
    locate(s.u, s.time)
    // Bank into turns in proportion to speed, pitch the nose down when moving forward.
    path.getTangent(param(s.u + 0.12), T2)
    const turn = T2.x * T.z - T2.z * T.x
    bank += (THREE.MathUtils.clamp(turn * uSpeed * 9, -0.6, 0.6) - bank) * 0.12
    heli.position.copy(H)
    heli.lookAt(H.clone().add(T))
    heli.rotateZ(bank + Math.sin(s.time * 1.1) * 0.025)
    heli.rotateX(THREE.MathUtils.clamp(uSpeed * 0.22, -0.3, 0.3))
    rotor.rotation.y = s.time * 34
    tailRotor.rotation.x = s.time * 48
    lights[2].visible = s.time % 1.4 < 0.12

    terrainMat.uniforms.uTime.value = s.time
    terrainMat.uniforms.uHeli.value.copy(H)
    crumbsMat.uniforms.uTime.value = s.time
    crumbsMat.uniforms.uHead.value = param(s.u)
    sky.position.copy(camera.position)
    // The flight runs from dusk into night: the sun sinks and the stars come out.
    const night = THREE.MathUtils.smoothstep(s.u, 1.5, N - 1.5)
    const skyU = (sky.material as THREE.ShaderMaterial).uniforms
    skyU.uNight.value = night
    skyU.uSun.value.set(SUN.x, SUN.y - night * 0.1, SUN.z).normalize()
    dust.update(camera, uSpeed * 0.6)
    const active = Math.round(s.f)
    gates.forEach((g, i) => {
      g.mat.color.set(i === active ? 0xffb347 : 0x22e3c8)
      g.gem.rotation.y = s.time * 0.8 + i
    })
  }

  return {
    id: 'flight',
    name: 'Flight',
    unit: 'Waypoint',
    finale: 'Cleared for the next project.',
    background: 0x030b0e,
    accent: '#5eead4',
    accent2: '#fbbf24',
    fov: 50,
    bloom: { strength: 0.42, radius: 0.5, threshold: 0.8 },
    tone: 98,
    build,
    pose,
    update,
    telemetry: (s) => {
      const heading = (Math.atan2(T.x, -T.z) * 180) / Math.PI
      return [
        ['Wpt', chapters[Math.round(s.f)].label],
        ['Alt', `${Math.round(H.y * 12)} ft`],
        ['Hdg', `${String(Math.round((heading + 360) % 360)).padStart(3, '0')}°`],
        ['Spd', `${Math.round(Math.abs(uSpeed) * 42)} kt`],
      ]
    },
  }
}
