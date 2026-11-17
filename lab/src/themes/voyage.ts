import * as THREE from 'three'
import { chapters } from '../content'
import { NOISE, rng } from '../engine/glsl'
import type { CameraPose, FrameState, Quality, Subject, Theme } from '../engine/types'

/**
 * Voyage: a route through deep space. Every chapter is a world on the route, and the last
 * one is the star the route leads to. Planets are procedural (fbm in the fragment shader).
 */

const SUN = new THREE.Vector3(-0.8, 0.32, 0.38).normalize()

const planetVertex = /* glsl */ `
  varying vec3 vObj; varying vec3 vN; varying vec3 vW;
  void main(){
    vObj = normalize(position);
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`

// uType: 0 ocean/rock with clouds, 1 banded gas giant, 2 dark rock with glowing seams, 3 star.
const planetFragment = /* glsl */ `
  uniform vec3 uA, uB, uC, uSun; uniform float uSeed, uType, uTime;
  varying vec3 vObj; varying vec3 vN; varying vec3 vW;
  ${NOISE}
  void main(){
    vec3 p = vObj * 2.2 + uSeed;
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vW);
    vec3 col; float seam = 0.0, land = 0.0, cloud = 0.0, ocean = 0.0;
    if (uType < 0.5) {
      land = smoothstep(0.46, 0.58, fbm(p * 1.6));
      col = mix(uA, uB, land);
      cloud = smoothstep(0.55, 0.75, fbm(p * 2.6 + vec3(uTime * 0.015, 0.0, 7.0)));
      col = mix(col, uC, cloud * 0.75);
      ocean = (1.0 - land) * (1.0 - cloud);
    } else if (uType < 1.5) {
      float warp = fbm(p * 1.2 + vec3(0.0, uTime * 0.01, 0.0));
      float y = vObj.y * 7.0 + warp * 2.4;
      col = mix(uA, uB, sin(y * 2.4) * 0.5 + 0.5);
      col = mix(col, uC, smoothstep(0.5, 0.9, fbm(vec3(p.x * 0.6, y * 0.9, p.z * 0.6))) * 0.6);
    } else if (uType < 2.5) {
      col = mix(uA, uB, fbm(p * 1.8));
      seam = smoothstep(0.05, 0.0, abs(fbm(p * 3.4 + 2.0) - 0.5));
    } else {
      float n = fbm(p * 2.6 + vec3(uTime * 0.06));
      float m = fbm(p * 6.0 - vec3(uTime * 0.09));
      col = mix(uA, uB, n) + uC * pow(m, 2.0) * 1.4;
    }
    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    if (uType < 2.5) {
      float lit = smoothstep(-0.12, 0.62, dot(N, uSun));
      col *= mix(0.012, 0.85, lit);
      col += uC * seam * 1.6;
      col += uC * rim * (0.05 + lit * 0.42);
      // Sun glint on open water, and settlements lighting up on the night side.
      col += vec3(1.0, 0.95, 0.85) * pow(max(dot(N, normalize(uSun + V)), 0.0), 160.0) * ocean * 0.5;
      float towns = step(0.6, vnoise(vObj * 46.0 + uSeed)) * smoothstep(0.5, 0.62, fbm3(vObj * 9.0 + uSeed));
      col += vec3(1.0, 0.72, 0.38) * towns * land * (1.0 - cloud) * (1.0 - smoothstep(0.0, 0.25, lit)) * 0.9;
    } else {
      col = col * 0.82 + uB * rim * 0.5;
    }
    gl_FragColor = vec4(col, 1.0);
  }`

const haloFragment = /* glsl */ `
  uniform vec3 uColor; uniform float uPower;
  varying vec3 vN; varying vec3 vW;
  void main(){
    vec3 V = normalize(cameraPosition - vW);
    // Back faces: 0 at the outer edge of the halo, strongest where it meets the planet's limb.
    float i = pow(clamp(-dot(normalize(vN), V) / 0.5, 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * i * 0.45, i * 0.45);
  }`

const ringFragment = /* glsl */ `
  uniform vec3 uA, uB; uniform float uIn, uOut, uSeed;
  varying float vR;
  ${NOISE}
  void main(){
    float t = (vR - uIn) / (uOut - uIn);
    float s = fbm3(vec3(t * 18.0 + uSeed, 0.0, 0.0));
    float gaps = smoothstep(0.32, 0.5, vnoise(vec3(t * 60.0, uSeed, 0.0)));
    float a = (0.25 + 0.75 * s) * gaps * smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.9, t) * 0.85;
    gl_FragColor = vec4(mix(uA, uB, s) * 1.2, a);
  }`

interface World {
  type: 0 | 1 | 2 | 3
  r: number
  a: number
  b: number
  c: number
  ring?: [inner: number, outer: number, tilt: number]
}

// One world per chapter, in chapter order.
const WORLDS: World[] = [
  { type: 0, r: 9, a: 0x0b2a6b, b: 0x1f8a70, c: 0xdfe9ff }, // home: an ocean world
  { type: 1, r: 16, a: 0x3b2a8f, b: 0x9d7bff, c: 0xf0abfc, ring: [1.3, 1.85, 0.42] }, // about
  { type: 0, r: 19, a: 0x0c3b2e, b: 0x4d7c3a, c: 0xcfe8d8 }, // TSA Outdoors: ten stores in orbit
  { type: 1, r: 13, a: 0xb8336a, b: 0xf7a8c4, c: 0xfff0f5, ring: [1.5, 2.0, -0.3] }, // Caronlab
  { type: 2, r: 7, a: 0x1a1c2e, b: 0x3a3f66, c: 0x7dd3fc }, // earlier: a pair of small worlds
  { type: 1, r: 14, a: 0x9a3412, b: 0xfbbf24, c: 0xfff3c4 }, // Flywing builds
  { type: 0, r: 11, a: 0x2a1f5c, b: 0x5b6ee1, c: 0xdbe4ff, ring: [1.35, 1.6, 0.25] }, // toolkit: twelve moons
  { type: 3, r: 24, a: 0xff7a18, b: 0xffd166, c: 0xfff6d6 }, // contact: the star
]

export function createVoyage(): Theme {
  const N = chapters.length
  const stations = WORLDS.map((_, i) => new THREE.Vector3(Math.sin(i * 1.9) * 70, Math.cos(i * 1.3) * 30, -i * 230))

  // Camera stops: the world sits to the right on wide screens, and above the text on tall ones.
  const curve = (offset: (r: number) => [number, number, number]) =>
    new THREE.CatmullRomCurve3(stations.map((s, i) => s.clone().add(new THREE.Vector3(...offset(WORLDS[i].r)))), false, 'catmullrom', 0.5)
  const wide = { pos: curve((r) => [-r * 1.55, r * 0.4, r * 2.7]), look: curve((r) => [-r * 1.05, -r * 0.05, 0]) }
  const tall = { pos: curve((r) => [0, -r * 0.9, r * 5.2]), look: curve((r) => [0, -r * 1.3, 0]) }

  // The visible route sweeps past the left side of each world and ends at the star.
  const routePoints = stations.map((s, i) => s.clone().add(new THREE.Vector3(-WORLDS[i].r * 1.7, -WORLDS[i].r * 0.55, WORLDS[i].r * 0.4)))
  routePoints.unshift(routePoints[0].clone().add(new THREE.Vector3(12, -5, 130)))
  routePoints[N] = stations[N - 1].clone().add(new THREE.Vector3(-WORLDS[N - 1].r * 0.8, 0, WORLDS[N - 1].r * 0.7))
  const route = new THREE.CatmullRomCurve3(routePoints, false, 'catmullrom', 0.5)

  const timeUniforms: { value: number }[] = []
  const spinners: { obj: THREE.Object3D; speed: number }[] = []
  const orbits: { mesh: THREE.InstancedMesh; center: THREE.Vector3; items: { size: number; r: number; speed: number; phase: number; tilt: number; node: number }[] }[] = []
  const dummy = new THREE.Object3D()
  let sky: THREE.Mesh, stars: THREE.Points, dust: THREE.Points, probe: THREE.Mesh
  let routeMat: THREE.ShaderMaterial, dustMat: THREE.ShaderMaterial, skyMat: THREE.ShaderMaterial

  function addOrbiters(scene: THREE.Scene, center: THREE.Vector3, count: number, rMin: number, rMax: number, size: number, color: number, seed: number) {
    const rand = rng(seed)
    // Moons are small lit spheres: same sun as the planets, so they show a day and a night side.
    const moon = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uSun: { value: SUN } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vW;
        void main(){
          mat4 m = modelMatrix * instanceMatrix;
          vN = normalize(mat3(m) * normal);
          vec4 w = m * vec4(position, 1.0); vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor, uSun; varying vec3 vN; varying vec3 vW;
        void main(){
          vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
          float lit = smoothstep(-0.12, 0.62, dot(N, uSun));
          float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
          gl_FragColor = vec4(uColor * mix(0.03, 0.95, lit) + uColor * rim * (0.05 + lit * 0.35), 1.0);
        }`,
    })
    const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 24, 16), moon, count)
    const items = Array.from({ length: count }, () => ({
      size: size * (0.7 + rand() * 0.6),
      r: rMin + rand() * (rMax - rMin),
      speed: (0.12 + rand() * 0.2) * (rand() > 0.5 ? 1 : -1),
      phase: rand() * Math.PI * 2,
      tilt: (rand() - 0.5) * 1.1,
      node: rand() * Math.PI * 2,
    }))
    mesh.frustumCulled = false
    scene.add(mesh)
    orbits.push({ mesh, center, items })
  }

  function build(scene: THREE.Scene, q: Quality) {
    // Nebula backdrop, centred on the camera so it never gets closer.
    skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uShift: { value: 0 } },
      vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uShift; varying vec3 vDir;
        ${NOISE}
        void main(){
          vec3 d = normalize(vDir);
          float n = fbm(d * 2.4 + 3.0);
          float n2 = fbm(d * 5.0 + n * 2.0);
          vec3 cool = vec3(0.16, 0.14, 0.52) * smoothstep(0.42, 0.78, n) * 0.5 + vec3(0.72, 0.28, 0.85) * pow(n2, 3.0) * 0.9 * smoothstep(0.3, 0.7, n);
          vec3 warm = vec3(0.5, 0.2, 0.12) * smoothstep(0.42, 0.78, n) * 0.5 + vec3(1.0, 0.55, 0.2) * pow(n2, 3.0) * 0.9 * smoothstep(0.3, 0.7, n);
          float band = exp(-pow(dot(d, normalize(vec3(0.3, 1.0, 0.2))) * 3.2, 2.0));
          // The sky warms up as the route nears its star.
          vec3 col = vec3(0.004, 0.005, 0.016) + mix(cool, warm, uShift) * 0.34 + vec3(0.35, 0.4, 0.8) * band * 0.035 * (0.5 + n2);
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
    sky = new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 32), skyMat)
    sky.renderOrder = -2
    scene.add(sky)

    // Distant stars: a shell that follows the camera, twinkling.
    const rand = rng(7)
    const starCount = Math.floor(5200 * q.density)
    const sp = new Float32Array(starCount * 3), ss = new Float32Array(starCount), sph = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      const v = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize().multiplyScalar(1500)
      sp.set([v.x, v.y, v.z], i * 3)
      ss[i] = 0.8 + Math.pow(rand(), 6) * 3.6
      sph[i] = rand()
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(ss, 1))
    starGeo.setAttribute('aPhase', new THREE.BufferAttribute(sph, 1))
    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uScale: { value: q.dpr } },
      vertexShader: /* glsl */ `
        attribute float aSize; attribute float aPhase; uniform float uTime, uScale; varying float vA; varying float vTint;
        void main(){
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          float tw = 0.62 + 0.38 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0);
          vA = tw; vTint = aPhase;
          gl_PointSize = aSize * uScale * (0.8 + 0.2 * tw);
        }`,
      fragmentShader: /* glsl */ `
        varying float vA; varying float vTint;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vA;
          vec3 col = mix(vec3(0.72, 0.8, 1.0), vec3(1.0, 0.86, 0.72), step(0.82, vTint));
          gl_FragColor = vec4(col * a, a);
        }`,
    })
    timeUniforms.push(starMat.uniforms.uTime)
    stars = new THREE.Points(starGeo, starMat)
    stars.frustumCulled = false
    stars.renderOrder = -1
    scene.add(stars)

    // Nearby dust wraps around the camera, so travelling between worlds reads as speed.
    const dustCount = Math.floor(1600 * q.density)
    const dp = new Float32Array(dustCount * 3), ds = new Float32Array(dustCount)
    for (let i = 0; i < dustCount; i++) {
      dp.set([rand() * 260, rand() * 260, rand() * 260], i * 3)
      ds[i] = 0.5 + rand() * 1.5
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3))
    dustGeo.setAttribute('aSize', new THREE.BufferAttribute(ds, 1))
    dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uCam: { value: new THREE.Vector3() }, uScale: { value: q.dpr }, uSpeed: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSize; uniform vec3 uCam; uniform float uScale, uSpeed; varying float vA;
        void main(){
          vec3 p = mod(position - uCam + 130.0, 260.0) - 130.0;
          vec4 mv = viewMatrix * vec4(p + uCam, 1.0);
          gl_Position = projectionMatrix * mv;
          float dist = length(p);
          vA = smoothstep(130.0, 60.0, dist) * smoothstep(2.0, 14.0, dist) * (0.35 + uSpeed * 0.65);
          gl_PointSize = aSize * uScale * (90.0 / max(-mv.z, 1.0)) * (1.0 + uSpeed * 1.5);
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main(){ float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)) * vA; gl_FragColor = vec4(vec3(0.75, 0.8, 1.0) * a, a); }`,
    })
    dust = new THREE.Points(dustGeo, dustMat)
    dust.frustumCulled = false
    scene.add(dust)

    // The route: a thin tube with dashes of light flowing towards the star.
    routeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uHead: { value: 0 } },
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime, uHead; varying vec2 vUv;
        void main(){
          float dash = smoothstep(0.0, 0.5, fract(vUv.x * 260.0 - uTime * 0.8));
          // Brighter just ahead of the traveller.
          float head = exp(-pow((vUv.x - uHead) * 18.0, 2.0));
          vec3 col = mix(vec3(0.38, 0.42, 1.0), vec3(1.0, 0.5, 0.85), vUv.x);
          float a = 0.07 + dash * 0.26 + head * 0.9;
          gl_FragColor = vec4(col * a, a);
        }`,
    })
    timeUniforms.push(routeMat.uniforms.uTime)
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(route, 1800, 0.08, 6, false), routeMat))

    // A small probe that runs ahead along the route.
    probe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }))
    scene.add(probe)

    WORLDS.forEach((w, i) => {
      const center = stations[i]
      const uniforms = {
        uA: { value: new THREE.Color(w.a) },
        uB: { value: new THREE.Color(w.b) },
        uC: { value: new THREE.Color(w.c) },
        uSun: { value: SUN },
        uSeed: { value: i * 13.7 + 1 },
        uType: { value: w.type },
        uTime: { value: 0 },
      }
      timeUniforms.push(uniforms.uTime)
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader: planetVertex, fragmentShader: planetFragment })
      const halo = (r: number, color: number, power: number) =>
        new THREE.Mesh(
          new THREE.SphereGeometry(r, 48, 48),
          new THREE.ShaderMaterial({
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: { uColor: { value: new THREE.Color(color) }, uPower: { value: power } },
            vertexShader: /* glsl */ `varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
            fragmentShader: haloFragment,
          })
        )

      if (i === 4) {
        // "Earlier": two small worlds circling each other, one per early role.
        const pair = new THREE.Group()
        pair.position.copy(center)
        ;[w.r * 0.8, w.r * 0.52].forEach((r, k) => {
          const m = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 48), material)
          m.position.x = k ? -w.r * 1.15 : w.r * 0.55
          const h = halo(r * 1.16, w.c, 2.2)
          h.position.copy(m.position)
          pair.add(m, h)
        })
        pair.rotation.z = 0.35
        scene.add(pair)
        spinners.push({ obj: pair, speed: 0.11 })
        return
      }

      const planet = new THREE.Mesh(new THREE.SphereGeometry(w.r, q.tier === 'low' ? 48 : 96, q.tier === 'low' ? 32 : 64), material)
      planet.position.copy(center)
      planet.rotation.z = 0.2
      scene.add(planet)
      spinners.push({ obj: planet, speed: w.type === 3 ? 0.012 : 0.03 })
      const h = halo(w.r * (w.type === 3 ? 1.35 : 1.16), w.type === 3 ? 0xff7a1c : w.c, w.type === 3 ? 2.2 : 2.4)
      h.position.copy(center)
      scene.add(h)

      if (w.ring) {
        const [inner, outer, tilt] = w.ring
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(w.r * inner, w.r * outer, 180, 1),
          new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            uniforms: { uA: { value: new THREE.Color(w.b) }, uB: { value: new THREE.Color(w.c) }, uIn: { value: w.r * inner }, uOut: { value: w.r * outer }, uSeed: { value: i * 3.1 } },
            vertexShader: /* glsl */ `varying float vR; void main(){ vR = length(position.xy); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: ringFragment,
          })
        )
        ring.position.copy(center)
        ring.rotation.set(-Math.PI / 2 + tilt, 0.25, 0)
        scene.add(ring)
      }

      // Twelve moons for the twelve toolkits.
      if (i === 6) addOrbiters(scene, center, 12, w.r * 1.4, w.r * 1.95, 0.6, 0xc7d2fe, 47)
      if (i === 0) addOrbiters(scene, center, 1, w.r * 1.9, w.r * 1.9, 1.1, 0xcbd5e1, 11)
      // Ten satellites for the ten live stores.
      if (i === 2) addOrbiters(scene, center, 10, w.r * 1.35, w.r * 2.1, 0.5, 0x9ef0c6, 23)
      if (i === 5) {
        // A bright craft on a tilted flight ring.
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(w.r * 1.6, 0.07, 6, 160), new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.6 }))
        hoop.position.copy(center)
        hoop.rotation.set(1.2, 0.3, 0)
        scene.add(hoop)
        addOrbiters(scene, center, 3, w.r * 1.6, w.r * 1.6, 0.6, 0xfffbeb, 31)
      }
    })
  }

  // The nebula backdrop never changes, so it is drawn once into two cube maps (cool and warm)
  // and then only sampled. This removes the most expensive full-screen shader from every frame.
  function prepare(renderer: THREE.WebGLRenderer, q: Quality) {
    const bakeScene = new THREE.Scene()
    const shell = new THREE.Mesh(sky.geometry, skyMat)
    bakeScene.add(shell)
    const size = q.tier === 'low' ? 512 : 1024
    const bake = (shift: number) => {
      const target = new THREE.WebGLCubeRenderTarget(size, { type: THREE.HalfFloatType })
      skyMat.uniforms.uShift.value = shift
      new THREE.CubeCamera(1, 3000, target).update(renderer, bakeScene)
      return target.texture
    }
    const baked = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uCool: { value: bake(0) }, uWarm: { value: bake(1) }, uShift: { value: 0 } },
      vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform samplerCube uCool, uWarm; uniform float uShift; varying vec3 vDir;
        void main(){
          vec3 d = vec3(-vDir.x, vDir.y, vDir.z);
          gl_FragColor = vec4(mix(textureCube(uCool, d).rgb, textureCube(uWarm, d).rgb, uShift), 1.0);
        }`,
    })
    renderer.setRenderTarget(null)
    sky.material = baked
    skyMat.dispose()
    skyMat = baked
  }

  function pose(s: FrameState, out: CameraPose) {
    const t = Math.min(1, Math.max(0, s.u / (N - 1)))
    const path = s.aspect < 0.9 ? tall : wide
    path.pos.getPoint(t, out.pos)
    path.look.getPoint(t, out.look)
    // A slow drift, so the view is never frozen.
    out.pos.x += Math.sin(s.time * 0.21) * 0.6
    out.pos.y += Math.cos(s.time * 0.17) * 0.4
    out.roll = Math.sin(s.time * 0.1) * 0.012 - s.speed * 0.05
  }

  const centers = new THREE.CatmullRomCurve3(stations, false, 'catmullrom', 0.5)
  function subject(s: FrameState, out: Subject) {
    centers.getPoint(Math.min(1, Math.max(0, s.u / (N - 1))), out.center)
    const i = Math.min(N - 2, Math.floor(s.u))
    out.radius = THREE.MathUtils.lerp(WORLDS[i].r, WORLDS[i + 1].r, s.u - i)
  }

  function update(s: FrameState, camera: THREE.PerspectiveCamera) {
    for (const u of timeUniforms) u.value = s.time
    sky.position.copy(camera.position)
    stars.position.copy(camera.position)
    skyMat.uniforms.uShift.value = THREE.MathUtils.smoothstep(s.u, N - 2.4, N - 1)
    dustMat.uniforms.uCam.value.copy(camera.position)
    dustMat.uniforms.uSpeed.value = Math.min(1, Math.abs(s.speed) * 1.4)
    for (const sp of spinners) sp.obj.rotation.y = s.time * sp.speed

    const head = Math.min(1, (1 + s.u + 0.16) / N)
    routeMat.uniforms.uHead.value = head
    route.getPoint(head, probe.position)

    for (const o of orbits) {
      o.items.forEach((it, k) => {
        const a = s.time * it.speed + it.phase
        dummy.position.set(Math.cos(a) * it.r, 0, Math.sin(a) * it.r).applyAxisAngle(new THREE.Vector3(1, 0, 0), it.tilt).applyAxisAngle(new THREE.Vector3(0, 1, 0), it.node).add(o.center)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(it.size)
        dummy.updateMatrix()
        o.mesh.setMatrixAt(k, dummy.matrix)
      })
      o.mesh.instanceMatrix.needsUpdate = true
    }
  }

  return {
    id: 'voyage',
    name: 'Voyage',
    unit: 'Orbit',
    finale: "Let's build something stellar.",
    background: 0x03040c,
    accent: '#a5b4fc',
    accent2: '#f0abfc',
    fov: 45,
    bloom: { strength: 0.42, radius: 0.55, threshold: 0.82 },
    tone: 110,
    build,
    prepare,
    pose,
    update,
    subject,
    light: stations[N - 1],
    telemetry: (s) => [
      ['Sector', chapters[Math.round(s.f)].label],
      ['Distance', `${(s.u * 1.52).toFixed(2)} AU`],
      ['Velocity', `${(Math.abs(s.speed) * 29.8).toFixed(1)} km/s`],
    ],
  }
}
