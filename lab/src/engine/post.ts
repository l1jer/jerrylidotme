import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import type { Quality, Theme } from './types'

// Lens finish: slight chromatic fringe towards the edges (stronger while moving), vignette and grain.
const LensShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uWarp: { value: 0 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
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

export function createPost(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, theme: Theme, q: Quality) {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  if (q.bloom) {
    composer.addPass(new UnrealBloomPass(size.clone().multiplyScalar(0.5), theme.bloom.strength, theme.bloom.radius, theme.bloom.threshold))
  }
  const lens = new ShaderPass(LensShader)
  composer.addPass(lens)
  composer.addPass(new OutputPass())
  return {
    render(time: number, warp: number) {
      lens.uniforms.uTime.value = time
      lens.uniforms.uWarp.value = warp
      composer.render()
    },
    resize(w: number, h: number, dpr: number) {
      composer.setPixelRatio(dpr)
      composer.setSize(w, h)
    },
  }
}
