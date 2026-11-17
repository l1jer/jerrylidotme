import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { NOISE } from './glsl'
import type { Quality, Subject, Theme } from './types'

/**
 * Frame pipeline:
 *   scene (colour + depth) -> volumetric nebula -> depth of field -> bloom -> lens -> output
 * The scene is drawn once into a target with a depth texture; the nebula and the depth of
 * field both read that depth.
 */

const FULLSCREEN = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

// Converts a depth-buffer value to distance along the view axis.
const DEPTH = /* glsl */ `
  uniform sampler2D tDepth; uniform float uNear, uFar;
  float viewDepth(vec2 uv){
    float d = texture2D(tDepth, uv).x;
    return (uNear * uFar) / max(uFar - d * (uFar - uNear), 1e-4);
  }
  bool isSky(vec2 uv){ return texture2D(tDepth, uv).x >= 0.99999; }`

// Glowing gas between the camera and whatever the scene shows, marched in a few steps.
const NebulaShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    uNear: { value: 0.5 },
    uFar: { value: 4000 },
    uInvProj: { value: new THREE.Matrix4() },
    uCamWorld: { value: new THREE.Matrix4() },
    uTime: { value: 0 },
    uSteps: { value: 8 },
    uAmount: { value: 1 },
    uLight: { value: new THREE.Vector3() },
    uClear: { value: new THREE.Vector4() },
    uColA: { value: new THREE.Color(0x4338ca) },
    uColB: { value: new THREE.Color(0xc026d3) },
  },
  vertexShader: FULLSCREEN,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform mat4 uInvProj, uCamWorld; uniform float uTime, uAmount; uniform int uSteps;
    uniform vec3 uLight, uColA, uColB; uniform vec4 uClear; varying vec2 vUv;
    ${DEPTH}
    ${NOISE}
    void main(){
      vec3 scene = texture2D(tDiffuse, vUv).rgb;
      vec4 v = uInvProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
      vec3 rdView = normalize(v.xyz / v.w);
      vec3 rd = normalize((uCamWorld * vec4(rdView, 0.0)).xyz);
      vec3 ro = uCamWorld[3].xyz;
      float sceneDist = isSky(vUv) ? 1e5 : viewDepth(vUv) / max(-rdView.z, 1e-4);
      float tMin = 8.0, tMax = min(sceneDist, 560.0);
      vec3 glow = vec3(0.0); float through = 1.0;
      if (tMax > tMin) {
        float stepLen = (tMax - tMin) / float(uSteps);
        // Interleaved gradient noise offsets each ray so the few steps do not show as bands.
        float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
        for (int i = 0; i < 8; i++) {
          if (i >= uSteps) break;
          vec3 p = ro + rd * (tMin + (float(i) + jitter) * stepLen);
          float density = smoothstep(0.57, 0.84, fbm3(p * 0.011 + vec3(0.0, 0.0, uTime * 0.012)));
          // Keep the chapter's subject in clear space.
          density *= smoothstep(uClear.w * 1.4, uClear.w * 3.4, length(p - uClear.xyz));
          density *= uAmount * stepLen * 0.0034;
          vec3 toLight = uLight - p;
          float towards = pow(max(dot(rd, normalize(toLight)), 0.0), 5.0);
          vec3 gas = mix(uColA, uColB, smoothstep(0.35, 0.75, vnoise(p * 0.03 + 7.0))) * 0.5;
          gas += vec3(1.0, 0.62, 0.3) * towards * (1.6 / (1.0 + length(toLight) * 0.0035));
          glow += through * gas * density;
          through *= 1.0 - min(density, 1.0);
        }
      }
      vec3 col = scene * mix(1.0, through, 0.55) + glow;
      if (isnan(col.r) || isnan(col.g) || isnan(col.b)) col = scene;
      gl_FragColor = vec4(col, 1.0);
    }`,
}

// Blur that grows with distance from the focus plane. The sky stays sharp so stars stay points.
const dofShader = (taps: number) => ({
  defines: { TAPS: Math.max(1, taps) },
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    uNear: { value: 0.5 },
    uFar: { value: 4000 },
    uFocus: { value: 50 },
    uRange: { value: 20 },
    uFalloff: { value: 260 },
    uRadius: { value: new THREE.Vector2() },
    uOn: { value: taps > 0 ? 1 : 0 },
  },
  vertexShader: FULLSCREEN,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uFocus, uRange, uFalloff, uOn; uniform vec2 uRadius; varying vec2 vUv;
    ${DEPTH}
    float blurAt(vec2 uv){
      if (isSky(uv)) return 0.0;
      return clamp((abs(viewDepth(uv) - uFocus) - uRange) / uFalloff, 0.0, 1.0);
    }
    void main(){
      vec3 sum = texture2D(tDiffuse, vUv).rgb;
      if (uOn < 0.5) { gl_FragColor = vec4(sum, 1.0); return; }
      float here = blurAt(vUv);
      float weight = 1.0;
      for (int i = 0; i < TAPS; i++) {
        // Golden-angle spiral over a disc.
        float r = sqrt((float(i) + 0.5) / float(TAPS));
        float a = float(i) * 2.39996323;
        vec2 uv = vUv + vec2(cos(a), sin(a)) * r * uRadius;
        // A sample counts when this pixel or the sample itself is blurred at least that far.
        float k = smoothstep(r - 0.12, r + 0.02, max(here, blurAt(uv)));
        sum += texture2D(tDiffuse, uv).rgb * k;
        weight += k;
      }
      gl_FragColor = vec4(sum / weight, 1.0);
    }`,
})

// Lens finish: slight chromatic fringe towards the edges (stronger while moving), vignette and grain.
const LensShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uWarp: { value: 0 } },
  vertexShader: FULLSCREEN,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uWarp; varying vec2 vUv;
    float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    void main(){
      vec2 c = vUv - 0.5; float r2 = dot(c, c);
      vec2 off = c * r2 * (0.012 + uWarp * 0.05);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col *= mix(1.0, 0.42, smoothstep(0.18, 0.85, r2 * 1.9));
      col += (h(vUv * 900.0 + fract(uTime) * 37.0) - 0.5) * 0.035;
      gl_FragColor = vec4(col, 1.0);
    }`,
}

export function createPost(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, theme: Theme, q: Quality) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  const sceneTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
    type: THREE.HalfFloatType,
    samples: q.msaa,
    depthTexture: new THREE.DepthTexture(size.x, size.y),
  })

  const composer = new EffectComposer(renderer)
  composer.addPass(new TexturePass(sceneTarget.texture))
  const nebula = new ShaderPass(NebulaShader)
  const dof = new ShaderPass(dofShader(q.dofTaps))
  for (const pass of [nebula, dof]) {
    pass.uniforms.tDepth.value = sceneTarget.depthTexture
    pass.uniforms.uNear.value = camera.near
    pass.uniforms.uFar.value = camera.far
  }
  nebula.uniforms.uSteps.value = q.fogSteps
  nebula.uniforms.uLight.value.copy(theme.light)
  nebula.uniforms.uColA.value.set(theme.accent)
  nebula.uniforms.uColB.value.set(theme.accent2)
  composer.addPass(nebula)
  if (q.dofTaps > 0) composer.addPass(dof)
  if (q.bloom) composer.addPass(new UnrealBloomPass(size.clone().multiplyScalar(0.5), theme.bloom.strength, theme.bloom.radius, theme.bloom.threshold))
  const lens = new ShaderPass(LensShader)
  composer.addPass(lens)
  composer.addPass(new OutputPass())

  const view = new THREE.Vector3()
  return {
    render(time: number, warp: number, subject: Subject) {
      renderer.setRenderTarget(sceneTarget)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)

      nebula.uniforms.uTime.value = time
      nebula.uniforms.uInvProj.value.copy(camera.projectionMatrixInverse)
      nebula.uniforms.uCamWorld.value.copy(camera.matrixWorld)
      nebula.uniforms.uClear.value.set(subject.center.x, subject.center.y, subject.center.z, subject.radius)
      // Focus on the subject: its distance along the view axis.
      view.copy(subject.center).applyMatrix4(camera.matrixWorldInverse)
      dof.uniforms.uFocus.value = Math.max(1, -view.z)
      dof.uniforms.uRange.value = subject.radius * 1.8
      lens.uniforms.uTime.value = time
      lens.uniforms.uWarp.value = warp
      composer.render()
    },
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      sceneTarget.setSize(Math.round(w * dpr), Math.round(h * dpr))
      composer.setPixelRatio(dpr)
      composer.setSize(w, h)
      // Largest blur disc: about 1.1% of the frame height.
      const r = 0.011
      dof.uniforms.uRadius.value.set(r * (h / w), r)
    },
    /** Last resort when the frame rate stays low: drop the depth of field and thin the nebula. */
    degrade() {
      dof.uniforms.uOn.value = 0
      nebula.uniforms.uSteps.value = 3
    },
  }
}
