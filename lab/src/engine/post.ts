import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { NOISE } from './glsl'
import type { Quality, Subject, Theme } from './types'

/**
 * Frame pipeline. Expensive steps run at half resolution:
 *
 *   scene (colour + depth, full)
 *   nebula (half)  -> composite scene + nebula (full)
 *   blur of the composite (half, two passes) -> depth of field = mix(sharp, blurred) by depth (full)
 *   bloom -> lens (warp streaks, star flare, fringe, vignette, grain) -> output
 */

const FULLSCREEN = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`

// Converts a depth-buffer value to distance along the view axis.
const DEPTH = /* glsl */ `
  uniform sampler2D tDepth; uniform float uNear, uFar;
  float viewDepth(vec2 uv){
    float d = texture2D(tDepth, uv).x;
    return (uNear * uFar) / max(uFar - d * (uFar - uNear), 1e-4);
  }
  bool isSky(vec2 uv){ return texture2D(tDepth, uv).x >= 0.99999; }`

// Glowing gas between the camera and the scene, marched in a few steps. Output: rgb = light
// added by the gas, a = how much of the scene still shows through.
const nebulaMaterial = () =>
  new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tDepth: { value: null as THREE.Texture | null },
      uNear: { value: 0.5 },
      uFar: { value: 4000 },
      uInvProj: { value: new THREE.Matrix4() },
      uCamWorld: { value: new THREE.Matrix4() },
      uTime: { value: 0 },
      uSteps: { value: 6 },
      uLight: { value: new THREE.Vector3() },
      uClear: { value: new THREE.Vector4() },
      uColA: { value: new THREE.Color() },
      uColB: { value: new THREE.Color() },
    },
    vertexShader: FULLSCREEN,
    fragmentShader: /* glsl */ `
      uniform mat4 uInvProj, uCamWorld; uniform float uTime; uniform int uSteps;
      uniform vec3 uLight, uColA, uColB; uniform vec4 uClear; varying vec2 vUv;
      ${DEPTH}
      ${NOISE}
      void main(){
        // The corners are darkened by the vignette anyway: skip the march there.
        vec2 c = vUv - 0.5;
        if (dot(c, c) > 0.36) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
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
            density *= stepLen * 0.0034;
            vec3 toLight = uLight - p;
            float towards = pow(max(dot(rd, normalize(toLight)), 0.0), 5.0);
            vec3 gas = mix(uColA, uColB, smoothstep(0.35, 0.75, vnoise(p * 0.03 + 7.0))) * 0.5;
            gas += vec3(1.0, 0.62, 0.3) * towards * (1.6 / (1.0 + length(toLight) * 0.0035));
            glow += through * gas * density;
            through *= 1.0 - min(density, 1.0);
          }
        }
        if (isnan(glow.r) || isnan(glow.g) || isnan(glow.b) || isnan(through)) { glow = vec3(0.0); through = 1.0; }
        gl_FragColor = vec4(glow, through);
      }`,
  })

const compositeMaterial = () =>
  new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: { tScene: { value: null as THREE.Texture | null }, tNebula: { value: null as THREE.Texture | null } },
    vertexShader: FULLSCREEN,
    fragmentShader: /* glsl */ `
      uniform sampler2D tScene, tNebula; varying vec2 vUv;
      void main(){
        vec4 n = texture2D(tNebula, vUv);
        gl_FragColor = vec4(texture2D(tScene, vUv).rgb * mix(1.0, n.a, 0.55) + n.rgb, 1.0);
      }`,
  })

// One direction of a 13-tap Gaussian. Run twice (across, then down) for a smooth blur.
const blurMaterial = () =>
  new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: { tDiffuse: { value: null as THREE.Texture | null }, uStep: { value: new THREE.Vector2() } },
    vertexShader: FULLSCREEN,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse; uniform vec2 uStep; varying vec2 vUv;
      void main(){
        vec3 sum = texture2D(tDiffuse, vUv).rgb * 0.1964;
        sum += (texture2D(tDiffuse, vUv + uStep * 1.4118).rgb + texture2D(tDiffuse, vUv - uStep * 1.4118).rgb) * 0.2969;
        sum += (texture2D(tDiffuse, vUv + uStep * 3.2941).rgb + texture2D(tDiffuse, vUv - uStep * 3.2941).rgb) * 0.0945;
        sum += (texture2D(tDiffuse, vUv + uStep * 5.1765).rgb + texture2D(tDiffuse, vUv - uStep * 5.1765).rgb) * 0.0104;
        gl_FragColor = vec4(sum, 1.0);
      }`,
  })

// Depth of field: the further from the focus plane, the more of the blurred image shows.
// The sky stays sharp so stars stay points.
const focusMaterial = () =>
  new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tSharp: { value: null as THREE.Texture | null },
      tBlur: { value: null as THREE.Texture | null },
      tDepth: { value: null as THREE.Texture | null },
      uNear: { value: 0.5 },
      uFar: { value: 4000 },
      uFocus: { value: 50 },
      uRange: { value: 20 },
      uOn: { value: 1 },
    },
    vertexShader: FULLSCREEN,
    fragmentShader: /* glsl */ `
      uniform sampler2D tSharp, tBlur; uniform float uFocus, uRange, uOn; varying vec2 vUv;
      ${DEPTH}
      void main(){
        vec3 sharp = texture2D(tSharp, vUv).rgb;
        float k = isSky(vUv) ? 0.0 : clamp((abs(viewDepth(vUv) - uFocus) - uRange) / 240.0, 0.0, 1.0);
        gl_FragColor = vec4(mix(sharp, texture2D(tBlur, vUv).rgb, k * uOn), 1.0);
      }`,
  })

// Lens finish: radial streaks at speed, a flare from the star, a slight chromatic fringe,
// vignette and grain.
const LensShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null as THREE.Texture | null },
    uNear: { value: 0.5 },
    uFar: { value: 4000 },
    uTime: { value: 0 },
    uWarp: { value: 0 },
    uAspect: { value: 1 },
    uLightUv: { value: new THREE.Vector2(0.5, 0.5) },
    uLightDepth: { value: 1000 },
    uLightOn: { value: 0 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime, uWarp, uAspect, uLightDepth, uLightOn; uniform vec2 uLightUv; varying vec2 vUv;
    ${DEPTH}
    float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    void main(){
      vec2 c = vUv - 0.5; float r2 = dot(c, c);
      vec2 off = c * r2 * (0.012 + uWarp * 0.05);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      // At speed, smear the image outwards from the centre.
      if (uWarp > 0.03) {
        vec3 smear = col;
        for (int i = 1; i < 8; i++) smear += texture2D(tDiffuse, vUv - c * (float(i) / 8.0) * uWarp * 0.16).rgb;
        col = mix(col, smear / 8.0, min(1.0, uWarp * 1.4));
      }
      // The star throws a streak across the lens while nothing is in front of it.
      if (uLightOn > 0.01) {
        float seen = step(uLightDepth * 0.9, viewDepth(uLightUv));
        vec2 d = vUv - uLightUv;
        float streak = exp(-abs(d.y) * 110.0) * exp(-abs(d.x) * 3.4);
        float halo = exp(-length(d * vec2(uAspect, 1.0)) * 10.0);
        col += vec3(1.0, 0.72, 0.45) * (streak * 0.4 + halo * 0.28) * uLightOn * seen;
      }
      col *= mix(1.0, 0.36, smoothstep(0.16, 0.8, r2 * 1.9));
      col += (h(vUv * 900.0 + fract(uTime) * 37.0) - 0.5) * 0.035;
      gl_FragColor = vec4(col, 1.0);
    }`,
}

export function createPost(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, theme: Theme, q: Quality) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  const target = (scale: number, extra: THREE.RenderTargetOptions = {}) =>
    new THREE.WebGLRenderTarget(Math.max(1, Math.round(size.x * scale)), Math.max(1, Math.round(size.y * scale)), { type: THREE.HalfFloatType, depthBuffer: false, ...extra })

  const sceneTarget = target(1, { samples: q.msaa, depthBuffer: true, depthTexture: new THREE.DepthTexture(size.x, size.y) })
  const nebulaTarget = target(0.5)
  const compositeTarget = target(1)
  const blurA = target(0.5)
  const blurB = target(0.5)
  const focusTarget = target(1)
  const depth = sceneTarget.depthTexture

  const nebula = nebulaMaterial()
  const composite = compositeMaterial()
  const blur = blurMaterial()
  const focus = focusMaterial()
  for (const m of [nebula, focus]) {
    m.uniforms.tDepth.value = depth
    m.uniforms.uNear.value = camera.near
    m.uniforms.uFar.value = camera.far
  }
  nebula.uniforms.uSteps.value = q.fogSteps
  nebula.uniforms.uLight.value.copy(theme.light)
  nebula.uniforms.uColA.value.set(theme.accent)
  nebula.uniforms.uColB.value.set(theme.accent2)
  composite.uniforms.tScene.value = sceneTarget.texture
  composite.uniforms.tNebula.value = nebulaTarget.texture
  focus.uniforms.tSharp.value = compositeTarget.texture
  focus.uniforms.tBlur.value = blurB.texture
  const quad = new FullScreenQuad()
  const draw = (material: THREE.ShaderMaterial, to: THREE.WebGLRenderTarget) => {
    quad.material = material
    renderer.setRenderTarget(to)
    quad.render(renderer)
  }

  let dofOn = q.dof
  const composer = new EffectComposer(renderer)
  const input = new TexturePass(dofOn ? focusTarget.texture : compositeTarget.texture)
  composer.addPass(input)
  if (q.bloom) composer.addPass(new UnrealBloomPass(size.clone().multiplyScalar(0.5), theme.bloom.strength, theme.bloom.radius, theme.bloom.threshold))
  const lens = new ShaderPass(LensShader)
  lens.uniforms.tDepth.value = depth
  lens.uniforms.uNear.value = camera.near
  lens.uniforms.uFar.value = camera.far
  composer.addPass(lens)
  composer.addPass(new OutputPass())

  const view = new THREE.Vector3()
  const ndc = new THREE.Vector3()
  let halfTexel = new THREE.Vector2(1, 1)
  return {
    render(time: number, warp: number, subject: Subject) {
      renderer.setRenderTarget(sceneTarget)
      renderer.render(scene, camera)

      nebula.uniforms.uTime.value = time
      nebula.uniforms.uInvProj.value.copy(camera.projectionMatrixInverse)
      nebula.uniforms.uCamWorld.value.copy(camera.matrixWorld)
      nebula.uniforms.uClear.value.set(subject.center.x, subject.center.y, subject.center.z, subject.radius)
      draw(nebula, nebulaTarget)
      draw(composite, compositeTarget)

      if (dofOn) {
        blur.uniforms.tDiffuse.value = compositeTarget.texture
        blur.uniforms.uStep.value.set(halfTexel.x, 0)
        draw(blur, blurA)
        blur.uniforms.tDiffuse.value = blurA.texture
        blur.uniforms.uStep.value.set(0, halfTexel.y)
        draw(blur, blurB)
        // Focus on the subject: its distance along the view axis.
        view.copy(subject.center).applyMatrix4(camera.matrixWorldInverse)
        focus.uniforms.uFocus.value = Math.max(1, -view.z)
        focus.uniforms.uRange.value = subject.radius * 1.8
        draw(focus, focusTarget)
      }
      renderer.setRenderTarget(null)

      // Where the star sits on screen, for the lens flare.
      view.copy(theme.light).applyMatrix4(camera.matrixWorldInverse)
      ndc.copy(theme.light).project(camera)
      const inFront = view.z < 0 && Math.abs(ndc.x) < 1.3 && Math.abs(ndc.y) < 1.3
      lens.uniforms.uLightUv.value.set(ndc.x * 0.5 + 0.5, ndc.y * 0.5 + 0.5)
      lens.uniforms.uLightDepth.value = -view.z
      // Strongest from afar, where the star is a point; fades as it grows into a disc.
      lens.uniforms.uLightOn.value = inFront ? THREE.MathUtils.smoothstep(-view.z, 70, 320) * 0.85 + 0.12 : 0
      lens.uniforms.uTime.value = time
      lens.uniforms.uWarp.value = warp
      composer.render()
    },
    resize(w: number, h: number, dpr: number) {
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      const W = Math.round(w * dpr), H = Math.round(h * dpr)
      sceneTarget.setSize(W, H)
      compositeTarget.setSize(W, H)
      focusTarget.setSize(W, H)
      const hw = Math.max(1, Math.round(W / 2)), hh = Math.max(1, Math.round(H / 2))
      for (const t of [nebulaTarget, blurA, blurB]) t.setSize(hw, hh)
      // Blur reach scales with the frame so it looks the same at every resolution.
      const reach = Math.max(1, H / 900)
      halfTexel = new THREE.Vector2(reach / hw, reach / hh)
      composer.setPixelRatio(dpr)
      composer.setSize(w, h)
      lens.uniforms.uAspect.value = w / h
    },
    /** Last resort when the frame rate stays low: drop the depth of field and thin the nebula. */
    degrade() {
      dofOn = false
      input.map = compositeTarget.texture
      nebula.uniforms.uSteps.value = 3
    },
  }
}
