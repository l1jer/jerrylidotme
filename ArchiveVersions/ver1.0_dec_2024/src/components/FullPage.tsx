'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { FiArrowRight, FiArrowUp, FiMenu, FiX } from 'react-icons/fi'

export interface Slide {
  id: string
  label: string
  content: ReactNode
  /** Render without the default centred container (e.g. a full-bleed hero or a frame track). */
  bare?: boolean
  /** Number of horizontal frames inside this slide. Scrolling down walks through them sideways first. */
  steps?: number
  /** Optional label per frame, shown in the HUD. */
  stepLabels?: string[]
  /** One line on what this slide holds, shown in the jump menu. */
  description?: string
  icon?: IconType
  /** Shortcuts under this slide in the jump menu (e.g. each job in Experience); `end` is exclusive. */
  menu?: { label: string; step: number; end?: number }[]
}

interface SlideState {
  active: boolean
  /** 1-based position of this slide in the deck. */
  number: number
  total: number
  /** Current horizontal frame of this slide. */
  step: number
  goTo: (index: number, step?: number) => void
}

const SlideContext = createContext<SlideState>({ active: true, number: 1, total: 1, step: 0, goTo: () => {} })

/** Lets slide content know whether it is on screen, which frame is showing and where it sits. */
export const useSlide = () => useContext(SlideContext)

const TRANSITION_MS = 800
// A new gesture must start this long after the last wheel event before it can move again,
// so trackpad momentum from one swipe can't skip several pages.
const GESTURE_GAP_MS = 200
const SWIPE_THRESHOLD_PX = 50

/**
 * Full-screen slide navigation. Wheel, swipe, keyboard, the dot nav, the jump menu and #hash
 * links move one page at a time. A slide with `steps` holds a row of frames: scrolling down moves
 * sideways through them before continuing to the next slide. Slides are designed to fit the
 * screen; on unusually small screens a page scrolls inside itself first.
 */
export default function FullPage({ slides }: { slides: Slide[] }) {
  const [pos, setPos] = useState({ index: 0, step: 0 })
  const posRef = useRef(pos)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const animatingRef = useRef(false)
  const lastWheelRef = useRef(0)
  const touchRef = useRef<{ x: number; y: number; atTop: boolean; atBottom: boolean } | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenRef = useRef(false)
  menuOpenRef.current = menuOpen

  // Lets controls outside the deck (e.g. the sound button) step aside while the menu is open.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-menu-open', menuOpen)
  }, [menuOpen])

  const stepsOf = useCallback((i: number) => Math.max(1, slides[i]?.steps ?? 1), [slides])

  const goTo = useCallback(
    (nextIndex: number, nextStep = 0) => {
      const index = Math.max(0, Math.min(slides.length - 1, nextIndex))
      const step = Math.max(0, Math.min(stepsOf(index) - 1, nextStep))
      const prev = posRef.current
      if (index === prev.index && step === prev.step) return
      const vertical = index !== prev.index
      const forward = index > prev.index || (index === prev.index && step > prev.step)
      if (vertical) {
        const el = slideRefs.current[index]
        // Arriving from below lands at the bottom of an overflowing slide, so reading order stays natural.
        if (el) el.scrollTop = forward ? 0 : el.scrollHeight
      }
      posRef.current = { index, step }
      setPos({ index, step })
      animatingRef.current = true
      window.setTimeout(() => {
        animatingRef.current = false
      }, TRANSITION_MS)
      window.dispatchEvent(
        new CustomEvent('universe:warp', { detail: { direction: forward ? 1 : -1, axis: vertical ? 'y' : 'x' } })
      )
      if (vertical) {
        window.history.replaceState(null, '', index === 0 ? window.location.pathname : `#${slides[index].id}`)
      }
    },
    [slides, stepsOf]
  )

  /** One page forward or back: through a slide's frames first, then to the neighbouring slide. */
  const move = useCallback(
    (dir: 1 | -1) => {
      const { index, step } = posRef.current
      if (dir > 0) {
        if (step < stepsOf(index) - 1) goTo(index, step + 1)
        else goTo(index + 1, 0)
      } else if (step > 0) goTo(index, step - 1)
      else if (index > 0) goTo(index - 1, stepsOf(index - 1) - 1)
    },
    [goTo, stepsOf]
  )

  // Frame counts can change (e.g. phones split content into more frames): keep the position valid.
  useEffect(() => {
    const { index, step } = posRef.current
    const last = stepsOf(index) - 1
    if (step > last) {
      posRef.current = { index, step: last }
      setPos({ index, step: last })
    }
  }, [stepsOf])

  // Start on the slide named in the URL hash, follow later hash links, and lock page scrolling.
  useEffect(() => {
    const hashIndex = slides.findIndex((s) => `#${s.id}` === window.location.hash)
    if (hashIndex > 0) {
      posRef.current = { index: hashIndex, step: 0 }
      setPos({ index: hashIndex, step: 0 })
    }
    const onHashChange = () => {
      const i = slides.findIndex((s) => `#${s.id}` === window.location.hash)
      goTo(i < 0 ? 0 : i, 0)
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
    // Only on mount: later slide-array changes must not reset the position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // The element that may scroll on a tiny screen: the visible frame if the slide has frames.
    const scroller = () => {
      const section = slideRefs.current[posRef.current.index]
      return (section?.querySelector('[data-frame-active="true"]') as HTMLElement | null) ?? section
    }
    const edges = () => {
      const el = scroller()
      if (!el) return { atTop: true, atBottom: true }
      return {
        atTop: el.scrollTop <= 1,
        atBottom: el.scrollTop + el.clientHeight >= el.scrollHeight - 1,
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (menuOpenRef.current || e.ctrlKey) return
      const now = Date.now()
      const sinceLast = now - lastWheelRef.current
      lastWheelRef.current = now
      // Trackpads also scroll sideways; treat a mostly-horizontal swipe as moving through frames.
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      const delta = horizontal ? e.deltaX : e.deltaY
      const down = delta > 0
      if (!horizontal) {
        const { atTop, atBottom } = edges()
        if (down ? !atBottom : !atTop) return // let an overflowing page scroll natively
      }
      e.preventDefault()
      if (animatingRef.current || sinceLast < GESTURE_GAP_MS || Math.abs(delta) < 4) return
      if (horizontal) {
        const { index, step } = posRef.current
        if (down && step < stepsOf(index) - 1) goTo(index, step + 1)
        else if (!down && step > 0) goTo(index, step - 1)
        return
      }
      move(down ? 1 : -1)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (menuOpenRef.current) return
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ...edges() }
    }
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchRef.current
      touchRef.current = null
      if (!start || animatingRef.current || menuOpenRef.current) return
      const dx = start.x - e.changedTouches[0].clientX
      const dy = start.y - e.changedTouches[0].clientY
      if (Math.abs(dx) > Math.abs(dy)) {
        // Sideways swipe: move between frames of the current slide only.
        if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return
        const { index, step } = posRef.current
        if (dx > 0 && step < stepsOf(index) - 1) goTo(index, step + 1)
        else if (dx < 0 && step > 0) goTo(index, step - 1)
        return
      }
      if (Math.abs(dy) < SWIPE_THRESHOLD_PX) return
      // Only change pages if the page was already at that edge when the swipe began.
      if (dy > 0 && start.atBottom) move(1)
      else if (dy < 0 && start.atTop) move(-1)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (menuOpenRef.current) return
      const target = e.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      const { index, step } = posRef.current
      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        if (e.key === 'Home') goTo(0, 0)
        else goTo(slides.length - 1, stepsOf(slides.length - 1) - 1)
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (stepsOf(index) < 2 || animatingRef.current) return
        e.preventDefault()
        goTo(index, step + (e.key === 'ArrowRight' ? 1 : -1))
        return
      }
      let dir: 0 | 1 | -1 = 0
      if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) dir = 1
      else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) dir = -1
      if (!dir) return
      e.preventDefault()
      const el = scroller()
      const { atTop, atBottom } = edges()
      const page = el ? el.clientHeight * 0.8 : 0
      if (el && dir > 0 && !atBottom) el.scrollBy({ top: page, behavior: 'smooth' })
      else if (el && dir < 0 && !atTop) el.scrollBy({ top: -page, behavior: 'smooth' })
      else if (!animatingRef.current) move(dir)
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
  }, [goTo, move, slides.length, stepsOf])

  const { index, step } = pos
  const current = slides[index]
  const stepLabel = current.stepLabels?.[step]
  const pad = (n: number) => String(n).padStart(2, '0')
  const jump = (i: number, s = 0) => {
    setMenuOpen(false)
    goTo(i, s)
  }

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
            <SlideContext.Provider
              value={{ active: i === index, number: i + 1, total: slides.length, step: i === index ? step : 0, goTo }}
            >
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

      {/* HUD: progress line, monogram and a section pill that opens the jump menu.
          Kept above the open menu so the same pill can close it. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70]">
        <div className="h-[2px] bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-[width] duration-700 ease-out"
            style={{ width: `${((index + (step + 1) / stepsOf(index)) / slides.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-2.5">
          <button
            type="button"
            onClick={() => jump(0)}
            aria-label="Jerry Li — back to start"
            className="pointer-events-auto font-display text-sm font-bold tracking-widest text-white/90 hover:text-indigo-300 transition-colors"
          >
            JL<span className="text-indigo-400">.</span>
          </button>
          <button
            id="hud-counter"
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="jump-menu"
            aria-label={menuOpen ? 'Close menu' : `Open menu (current: ${current.label})`}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/15 bg-slate-950/50 py-1.5 pl-3.5 pr-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-300 backdrop-blur-md transition hover:border-indigo-400/50 hover:text-white"
          >
            <span className="max-w-[46vw] truncate sm:max-w-none">
              <span className="text-white">{current.label}</span>
              {stepLabel && <span className="hidden md:inline text-gray-400"> · {stepLabel}</span>}
            </span>
            <span className="text-gray-500">
              {pad(index + 1)}/{pad(slides.length)}
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white">
              {menuOpen ? <FiX className="h-3.5 w-3.5" /> : <FiMenu className="h-3.5 w-3.5" />}
            </span>
          </button>
        </div>
      </div>

      {/* Jump menu: a card per slide with what's inside, the current one marked, plus shortcuts
          such as each job in Experience. */}
      <div
        id="jump-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to section"
        className={`fixed inset-0 z-[60] overflow-y-auto bg-slate-950/85 backdrop-blur-xl transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        inert={!menuOpen}
      >
        <nav className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-4 sm:px-8 pt-14 sm:pt-16 pb-6 sm:pb-10">
          <p className="mb-2 sm:mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-gray-500">Jump to</p>
          <ol className="grid grid-cols-1 gap-1.5 sm:gap-3 sm:grid-cols-2">
            {slides.map((slide, i) => {
              const Icon = slide.icon
              const here = i === index
              return (
                <li
                  key={slide.id}
                  className={`min-w-0 transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'} ${
                    slide.menu ? 'sm:col-span-2' : ''
                  }`}
                  style={{ transitionDelay: menuOpen ? `${80 + i * 40}ms` : '0ms' }}
                >
                  <div
                    className={`glass spot overflow-hidden ${here ? 'border-indigo-400/60 bg-indigo-500/[0.12]' : 'hover:border-white/25'}`}
                  >
                    <button type="button" onClick={() => jump(i)} className="group flex w-full items-center gap-3 px-3 sm:px-3.5 py-2 sm:py-3 text-left">
                      <span
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-xl border ${
                          here ? 'border-indigo-300/60 bg-indigo-400/20 text-white' : 'border-white/10 bg-white/[0.04] text-indigo-300'
                        }`}
                      >
                        {Icon ? <Icon className="h-4 w-4" aria-hidden /> : <span className="font-mono text-[11px]">{pad(i + 1)}</span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-gray-500">{pad(i + 1)}</span>
                          <span className="font-display text-base sm:text-lg font-semibold text-white">{slide.label}</span>
                          {here && (
                            <span className="rounded-full bg-indigo-400/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-indigo-200">
                              You are here
                            </span>
                          )}
                        </span>
                        {slide.description && <span className="block truncate text-xs text-gray-400">{slide.description}</span>}
                      </span>
                      <FiArrowRight
                        className="h-4 w-4 flex-shrink-0 text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-white"
                        aria-hidden
                      />
                    </button>
                    {slide.menu && (
                      <ul className="flex flex-wrap gap-1.5 border-t border-white/10 px-3 sm:px-3.5 py-1.5 sm:py-2.5">
                        {slide.menu.map((item) => {
                          const atItem = here && step >= item.step && step < (item.end ?? item.step + 1)
                          return (
                            <li key={item.label}>
                              <button
                                type="button"
                                onClick={() => jump(i, item.step)}
                                className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs transition ${
                                  atItem
                                    ? 'border-indigo-400/60 bg-indigo-500/20 text-white'
                                    : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/25 hover:text-white'
                                }`}
                              >
                                {item.label}
                                <FiArrowRight className="h-3 w-3 opacity-60" aria-hidden />
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      {/* Slide dots */}
      <nav aria-label="Sections" className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3">
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
        <FiArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </div>
  )
}
