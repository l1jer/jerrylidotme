'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export interface Slide {
  id: string
  label: string
  content: ReactNode
  /** Render without the default centred container (e.g. a full-bleed hero). */
  bare?: boolean
}

interface SlideState {
  active: boolean
  /** 1-based position of this slide in the deck. */
  number: number
  total: number
  goTo: (index: number) => void
}

const SlideContext = createContext<SlideState>({ active: true, number: 1, total: 1, goTo: () => {} })

/** Lets slide content know whether it is on screen (to replay entrance effects) and where it sits. */
export const useSlide = () => useContext(SlideContext)

const TRANSITION_MS = 800
// A new gesture must start this long after the last wheel event before it can change slides,
// so trackpad momentum from one swipe can't skip several pages.
const GESTURE_GAP_MS = 200
const SWIPE_THRESHOLD_PX = 50

/**
 * Full-screen slide navigation: wheel, swipe, keyboard, the dot nav and #hash links move one
 * slide at a time. Slides are designed to fit the screen; on unusually small screens a slide
 * scrolls inside itself first and the next gesture past its edge moves on.
 */
export default function FullPage({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const animatingRef = useRef(false)
  const lastWheelRef = useRef(0)
  const touchRef = useRef<{ y: number; atTop: boolean; atBottom: boolean } | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(slides.length - 1, next))
      if (target === indexRef.current) return
      const goingUp = target < indexRef.current
      const el = slideRefs.current[target]
      // Arriving from below lands at the bottom of an overflowing slide, so reading order stays natural.
      if (el) el.scrollTop = goingUp ? el.scrollHeight : 0
      indexRef.current = target
      setIndex(target)
      animatingRef.current = true
      window.setTimeout(() => {
        animatingRef.current = false
      }, TRANSITION_MS)
      window.dispatchEvent(new CustomEvent('universe:warp', { detail: { direction: goingUp ? -1 : 1 } }))
      const id = slides[target].id
      window.history.replaceState(null, '', target === 0 ? window.location.pathname : `#${id}`)
    },
    [slides]
  )

  // Start on the slide named in the URL hash, follow later hash links, and lock page scrolling.
  useEffect(() => {
    const hashIndex = slides.findIndex((s) => `#${s.id}` === window.location.hash)
    if (hashIndex > 0) {
      indexRef.current = hashIndex
      setIndex(hashIndex)
    }
    const onHashChange = () => {
      const i = slides.findIndex((s) => `#${s.id}` === window.location.hash)
      goTo(i < 0 ? 0 : i)
    }
    window.addEventListener('hashchange', onHashChange)

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener('change', onMotionChange)

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevOverflow
      document.body.style.overflow = ''
      media.removeEventListener('change', onMotionChange)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [slides, goTo])

  useEffect(() => {
    const edges = () => {
      const el = slideRefs.current[indexRef.current]
      if (!el) return { atTop: true, atBottom: true }
      return {
        atTop: el.scrollTop <= 1,
        atBottom: el.scrollTop + el.clientHeight >= el.scrollHeight - 1,
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return // pinch-zoom
      const now = Date.now()
      const sinceLast = now - lastWheelRef.current
      lastWheelRef.current = now
      const down = e.deltaY > 0
      const { atTop, atBottom } = edges()
      if (down ? !atBottom : !atTop) return // let an overflowing slide scroll natively
      e.preventDefault()
      if (animatingRef.current || sinceLast < GESTURE_GAP_MS || Math.abs(e.deltaY) < 4) return
      goTo(indexRef.current + (down ? 1 : -1))
    }

    const onTouchStart = (e: TouchEvent) => {
      touchRef.current = { y: e.touches[0].clientY, ...edges() }
    }
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchRef.current
      touchRef.current = null
      if (!start || animatingRef.current) return
      const dy = start.y - e.changedTouches[0].clientY
      if (Math.abs(dy) < SWIPE_THRESHOLD_PX) return
      // Only change slides if the slide was already at that edge when the swipe began.
      if (dy > 0 && start.atBottom) goTo(indexRef.current + 1)
      else if (dy < 0 && start.atTop) goTo(indexRef.current - 1)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        goTo(e.key === 'Home' ? 0 : slides.length - 1)
        return
      }
      let dir = 0
      if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) dir = 1
      else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) dir = -1
      if (!dir) return
      e.preventDefault()
      const el = slideRefs.current[indexRef.current]
      const { atTop, atBottom } = edges()
      const step = el ? el.clientHeight * 0.8 : 0
      if (el && dir > 0 && !atBottom) el.scrollBy({ top: step, behavior: 'smooth' })
      else if (el && dir < 0 && !atTop) el.scrollBy({ top: -step, behavior: 'smooth' })
      else if (!animatingRef.current) goTo(indexRef.current + dir)
    }

    // Feed the pointer position to the hovered card's spotlight.
    const onPointerMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.spot') as HTMLElement | null
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [goTo, slides.length])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${-index * 100}%, 0)`,
          transition: reducedMotion ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        {slides.map((slide, i) => (
          <section
            key={slide.id}
            // Not the bare hash name: an element whose id matches the URL hash makes the browser
            // jump-scroll the locked deck container, which would knock the slides out of place.
            id={`slide-${slide.id}`}
            data-slide={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            aria-label={slide.label}
            aria-hidden={i !== index}
            inert={i !== index}
            className={`slide-scroll h-full w-full overflow-y-auto overscroll-contain ${i === index ? 'is-active' : ''}`}
          >
            <SlideContext.Provider value={{ active: i === index, number: i + 1, total: slides.length, goTo }}>
              {slide.bare ? (
                slide.content
              ) : (
                <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-6xl px-5 sm:px-8 pt-16 pb-14 short:pt-14 short:pb-10 tiny:pt-12 tiny:pb-8">
                  {slide.content}
                </div>
              )}
            </SlideContext.Provider>
          </section>
        ))}
      </div>

      {/* HUD: progress line, monogram and slide counter */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="h-[2px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-[width] duration-700 ease-out"
            style={{ width: `${((index + 1) / slides.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-5 sm:px-8 py-3">
          <button
            type="button"
            onClick={() => goTo(0)}
            aria-label="Jerry Li — back to start"
            className="pointer-events-auto font-display text-sm font-bold tracking-widest text-white/90 hover:text-indigo-300 transition-colors"
          >
            JL<span className="text-indigo-400">.</span>
          </button>
          <p id="hud-counter" className="font-mono text-[11px] tracking-[0.25em] uppercase text-gray-400" aria-live="polite">
            <span className="hidden sm:inline mr-3 text-gray-300">{slides[index].label}</span>
            <span className="text-white">{pad(index + 1)}</span>
            <span className="text-gray-500"> / {pad(slides.length)}</span>
          </p>
        </div>
      </div>

      {/* Slide dots */}
      <nav
        aria-label="Sections"
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={slide.label}
            aria-current={i === index ? 'true' : undefined}
            className="group relative flex items-center justify-end p-1"
          >
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md bg-slate-900/90 border border-white/10 px-2 py-1 text-xs text-gray-200 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {slide.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === index ? 'h-6 w-2 bg-indigo-400' : 'h-2 w-2 bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Back to first slide */}
      <button
        type="button"
        onClick={() => goTo(0)}
        tabIndex={index > 0 ? 0 : -1}
        aria-label="Back to top"
        className={`fixed bottom-[4.5rem] right-4 sm:bottom-24 sm:right-8 z-50 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus:outline-none transition-all duration-300 ease-in-out ${
          index > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <FiArrowUp className="h-6 w-6" />
      </button>
    </div>
  )
}
