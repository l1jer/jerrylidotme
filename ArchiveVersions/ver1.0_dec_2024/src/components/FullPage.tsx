'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export interface Slide {
  id: string
  label: string
  content: ReactNode
  /** Render without the default centred container (e.g. a full-bleed hero). */
  bare?: boolean
}

const TRANSITION_MS = 800
// A new gesture must start this long after the last wheel event before it can change slides,
// so trackpad momentum from one swipe (or from scrolling inside a tall slide) can't skip pages.
const GESTURE_GAP_MS = 200
const SWIPE_THRESHOLD_PX = 50

/**
 * Full-screen slide navigation: wheel, swipe, keyboard and the dot nav move one slide at a time.
 * A slide taller than the screen scrolls inside itself first; once its edge is reached, the next
 * gesture in the same direction moves to the neighbouring slide.
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
      // Arriving from below lands at the bottom of a tall slide, so reading order stays natural.
      if (el) el.scrollTop = goingUp ? el.scrollHeight : 0
      indexRef.current = target
      setIndex(target)
      animatingRef.current = true
      window.setTimeout(() => {
        animatingRef.current = false
      }, TRANSITION_MS)
      const id = slides[target].id
      window.history.replaceState(null, '', target === 0 ? window.location.pathname : `#${id}`)
    },
    [slides]
  )

  // Start on the slide named in the URL hash, and lock page scrolling while the deck is mounted.
  useEffect(() => {
    const hashIndex = slides.findIndex((s) => `#${s.id}` === window.location.hash)
    if (hashIndex > 0) {
      indexRef.current = hashIndex
      setIndex(hashIndex)
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener('change', onMotionChange)

    const onHashChange = () => {
      const i = slides.findIndex((s) => `#${s.id}` === window.location.hash)
      goTo(i < 0 ? 0 : i)
    }
    window.addEventListener('hashchange', onHashChange)

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
      const canScrollInside = down ? !atBottom : !atTop
      if (canScrollInside) return // let the slide scroll natively
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
      const el = slideRefs.current[indexRef.current]
      const { atTop, atBottom } = edges()
      const step = el ? el.clientHeight * 0.8 : 0
      let dir = 0
      if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) dir = 1
      else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) dir = -1
      else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
        return
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(slides.length - 1)
        return
      }
      if (!dir) return
      e.preventDefault()
      if (el && dir > 0 && !atBottom) el.scrollBy({ top: step, behavior: 'smooth' })
      else if (el && dir < 0 && !atTop) el.scrollBy({ top: -step, behavior: 'smooth' })
      else if (!animatingRef.current) goTo(indexRef.current + dir)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [goTo, slides.length])

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
            id={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            aria-label={slide.label}
            aria-hidden={i !== index}
            inert={i !== index}
            className="slide-scroll h-full w-full overflow-y-auto overscroll-contain"
          >
            {slide.bare ? (
              slide.content
            ) : (
              <div className="min-h-full flex flex-col justify-center container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-7xl">
                {slide.content}
              </div>
            )}
          </section>
        ))}
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
        className={`fixed bottom-24 right-8 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus:outline-none transition-all duration-300 ease-in-out ${
          index > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <FiArrowUp className="h-6 w-6" />
      </button>
    </div>
  )
}
