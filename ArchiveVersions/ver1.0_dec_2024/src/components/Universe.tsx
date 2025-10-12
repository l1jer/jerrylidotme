'use client'

import { useEffect, useRef } from 'react'

const STAR_COLOR = '#fff'
const STAR_SIZE = 3
const STAR_MIN_SCALE = 0.2
const OVERFLOW_THRESHOLD = 50

type Star = {
  x: number
  y: number
  z: number
}

interface UniverseProps {
  layer?: 'far' | 'mid' | 'near' | 'closest'
}

export default function Universe({ layer = 'mid' }: UniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let scale = 1
    let width = 0
    let height = 0
    let stars: Star[] = []
    let pointerX: number | null = null
    let pointerY: number | null = null
    const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 }
    let touchInput = false

    // Layer depth configuration for parallax effect
    const layerConfig = {
      far: { 
        density: 32,      // Most stars, smallest
        speed: 0.3,       // Slowest movement
        size: 0.6,        // Smallest stars
        opacity: 0.3      // Dimmest
      },
      mid: { 
        density: 20,      // Medium amount
        speed: 0.7,       // Medium speed
        size: 1,          // Normal size
        opacity: 0.5      // Medium brightness
      },
      near: { 
        density: 48,      // Fewer stars
        speed: 1.5,       // Faster movement
        size: 1.8,        // Larger stars
        opacity: 0.7      // Brighter
      },
      closest: { 
        density: 64,      // Very few stars
        speed: 2.5,       // Fastest movement (closest to camera)
        size: 3,          // Largest stars
        opacity: 0.85     // Brightest
      }
    }

    const config = layerConfig[layer]
    const STAR_COUNT = () => (window.innerWidth + window.innerHeight) / config.density

    function generate() {
      const count = STAR_COUNT()
      stars = []
      for (let i = 0; i < count; i++) {
        stars.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
        })
      }
    }

    function placeStar(star: Star) {
      star.x = Math.random() * width
      star.y = Math.random() * height
    }

    function recycleStar(star: Star) {
      let direction = 'z'
      const vx = Math.abs(velocity.x)
      const vy = Math.abs(velocity.y)

      if (vx > 1 || vy > 1) {
        let axis
        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? 'h' : 'v'
        } else {
          axis = Math.random() < vy / (vx + vy) ? 'v' : 'h'
        }

        if (axis === 'h') {
          direction = velocity.x > 0 ? 'l' : 'r'
        } else {
          direction = velocity.y > 0 ? 't' : 'b'
        }
      }

      star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)

      if (direction === 'z') {
        star.z = 0.1
        star.x = Math.random() * width
        star.y = Math.random() * height
      } else if (direction === 'l') {
        star.x = -OVERFLOW_THRESHOLD
        star.y = height * Math.random()
      } else if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD
        star.y = height * Math.random()
      } else if (direction === 't') {
        star.x = width * Math.random()
        star.y = -OVERFLOW_THRESHOLD
      } else if (direction === 'b') {
        star.x = width * Math.random()
        star.y = height + OVERFLOW_THRESHOLD
      }
    }

    function resize() {
      if (!canvas) return
      scale = window.devicePixelRatio || 1
      width = window.innerWidth * scale
      height = window.innerHeight * scale
      canvas.width = width
      canvas.height = height
      stars.forEach(placeStar)
    }

    function update() {
      velocity.tx *= 0.96
      velocity.ty *= 0.96

      velocity.x += (velocity.tx - velocity.x) * 0.8
      velocity.y += (velocity.ty - velocity.y) * 0.8

      // Apply layer-specific speed multiplier for parallax depth
      const speedMultiplier = config.speed

      stars.forEach((star) => {
        star.x += velocity.x * star.z * speedMultiplier
        star.y += velocity.y * star.z * speedMultiplier

        star.x += (star.x - width / 2) * velocity.z * star.z * speedMultiplier
        star.y += (star.y - height / 2) * velocity.z * star.z * speedMultiplier
        star.z += velocity.z

        if (
          star.x < -OVERFLOW_THRESHOLD ||
          star.x > width + OVERFLOW_THRESHOLD ||
          star.y < -OVERFLOW_THRESHOLD ||
          star.y > height + OVERFLOW_THRESHOLD
        ) {
          recycleStar(star)
        }
      })
    }

    function render() {
      if (!context) return
      stars.forEach((star) => {
        context.beginPath()
        context.lineCap = 'round'
        
        // Layer-specific size and opacity for depth
        context.lineWidth = STAR_SIZE * star.z * scale * config.size
        context.globalAlpha = config.opacity + (0.15 * Math.random())
        context.strokeStyle = STAR_COLOR

        context.beginPath()
        context.moveTo(star.x, star.y)

        // Tail length also affected by layer depth
        let tailX = velocity.x * 2 * config.speed
        let tailY = velocity.y * 2 * config.speed

        if (Math.abs(tailX) < 0.1) tailX = 0.5
        if (Math.abs(tailY) < 0.1) tailY = 0.5

        context.lineTo(star.x + tailX, star.y + tailY)
        context.stroke()
      })
    }

    function step() {
      if (!context) return
      context.clearRect(0, 0, width, height)
      update()
      render()
      animationRef.current = requestAnimationFrame(step)
    }

    function movePointer(x: number, y: number) {
      if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        const ox = x - pointerX
        const oy = y - pointerY

        velocity.tx = velocity.tx + ((ox / 8) * scale) * (touchInput ? 1 : -1)
        velocity.ty = velocity.ty + ((oy / 8) * scale) * (touchInput ? 1 : -1)
      }

      pointerX = x
      pointerY = y
    }

    function onMouseMove(event: MouseEvent) {
      touchInput = false
      movePointer(event.clientX, event.clientY)
    }

    function onTouchMove(event: TouchEvent) {
      touchInput = true
      movePointer(event.touches[0].clientX, event.touches[0].clientY)
      // Don't prevent default to allow scrolling
    }

    function onMouseLeave() {
      pointerX = null
      pointerY = null
    }

    generate()
    resize()
    step()

    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onMouseLeave)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onMouseLeave)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [layer])

  // Z-index mapping for depth layers
  const zIndexMap = {
    far: 'z-0',
    mid: 'z-[1]',
    near: 'z-[15]',
    closest: 'z-[25]'
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${zIndexMap[layer]}`}
      style={{ 
        width: '100%', 
        height: '100%'
      }}
      aria-hidden="true"
    />
  )
}


