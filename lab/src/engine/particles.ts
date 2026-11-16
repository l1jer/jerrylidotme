import * as THREE from 'three'
import { rng } from './glsl'

/** Motes in a box that wraps around the camera: endless, cheap, and they make speed visible. */
export function createDust(count: number, box: number, color: THREE.ColorRepresentation, dpr: number, size = 90) {
  const rand = rng(41)
  const pos = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    pos.set([rand() * box, rand() * box, rand() * box], i * 3)
    sizes[i] = 0.5 + rand() * 1.5
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uCam: { value: new THREE.Vector3() }, uScale: { value: dpr * size }, uSpeed: { value: 0 }, uBox: { value: box }, uColor: { value: new THREE.Color(color) } },
    vertexShader: /* glsl */ `
      attribute float aSize; uniform vec3 uCam; uniform float uScale, uSpeed, uBox; varying float vA;
      void main(){
        vec3 p = mod(position - uCam + uBox * 0.5, uBox) - uBox * 0.5;
        vec4 mv = viewMatrix * vec4(p + uCam, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = length(p);
        vA = smoothstep(uBox * 0.5, uBox * 0.25, dist) * smoothstep(1.5, 10.0, dist) * (0.35 + uSpeed * 0.65);
        gl_PointSize = aSize * uScale / max(-mv.z, 1.0) * (1.0 + uSpeed * 1.5);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying float vA;
      void main(){ float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)) * vA; gl_FragColor = vec4(uColor * a, a); }`,
  })
  const points = new THREE.Points(geo, material)
  points.frustumCulled = false
  return {
    points,
    update(camera: THREE.Camera, speed: number) {
      material.uniforms.uCam.value.copy(camera.position)
      material.uniforms.uSpeed.value = Math.min(1, Math.abs(speed))
    },
  }
}
