'use client'

import { useEffect, useState } from 'react'

const GLYPHS = '!<>-_/[]{}=+*^?#ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
const DURATION_MS = 700

/** Text that "decodes" from random glyphs into place each time `active` turns on. */
export default function ScrambleText({ text, active, className = '' }: { text: string; active: boolean; className?: string }) {
  const [output, setOutput] = useState(text)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOutput(text)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      const revealed = Math.floor(progress * text.length)
      setOutput(
        text
          .split('')
          .map((char, i) => (i < revealed || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      )
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    // Start after the slide transition has mostly finished.
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(tick)
    }, 250)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [active, text])

  // The real text reserves the layout so the scrambled glyphs never shift surrounding content.
  return (
    <span className="relative inline-block">
      <span className="invisible">{text}</span>
      {/* Styling (e.g. gradient text) goes on this layer: background-clip: text on a parent
          does not paint absolutely positioned children. */}
      <span className={`absolute inset-0 ${className}`} aria-hidden="true">
        {output}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
