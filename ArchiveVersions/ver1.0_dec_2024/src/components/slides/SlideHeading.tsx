'use client'

import { CSSProperties } from 'react'
import ScrambleText from '../fx/ScrambleText'
import { useSlide } from '../FullPage'

/** Section heading: a kicker line and a decoding gradient title. Page numbers live in the HUD and frame bar only. */
export default function SlideHeading({ kicker, title, active: activeOverride }: { kicker: string; title: string; active?: boolean }) {
  const slide = useSlide()
  const active = activeOverride ?? slide.active
  return (
    <div className="reveal mb-6 sm:mb-8 short:mb-4 tiny:mb-3" style={{ '--i': 0 } as CSSProperties}>
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-300/80">
        <span className="h-px w-10 bg-gradient-to-r from-indigo-400 to-transparent" />
        <span>{kicker}</span>
      </div>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl short:text-3xl short:md:text-4xl font-bold leading-tight tracking-tight">
        <ScrambleText text={title} active={active} className="text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text" />
      </h2>
    </div>
  )
}

/** Inline style helper for staggered .reveal children. */
export const stagger = (i: number) => ({ '--i': i }) as CSSProperties
