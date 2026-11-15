'use client'

import { ReactNode } from 'react'
import { useSlide } from './FullPage'

export interface Frame {
  key: string
  content: ReactNode
}

export interface FrameGroup {
  label: string
  start: number
  count: number
}

/**
 * A horizontal row of full-screen frames inside one slide. The deck's step decides which frame
 * shows, so scrolling down moves sideways through them. The segmented bar at the bottom shows
 * progress (grouped, e.g. per job) and jumps straight to a frame.
 */
export default function Frames({ frames, groups }: { frames: Frame[]; groups?: FrameGroup[] }) {
  const { step, active, number, goTo } = useSlide()
  const slideIndex = number - 1
  const segments = groups ?? [{ label: '', start: 0, count: frames.length }]

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(${-step * 100}%, 0, 0)` }}
      >
        {frames.map((frame, i) => (
          <div
            key={frame.key}
            data-frame-active={active && i === step}
            aria-hidden={i !== step}
            inert={i !== step}
            className={`frame slide-scroll h-full w-full flex-shrink-0 overflow-y-auto overscroll-contain ${i === step ? 'frame-on' : ''}`}
          >
            <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-6xl px-5 sm:px-8 pt-16 pb-20 short:pt-14 short:pb-16 tiny:pt-12 tiny:pb-14">
              {frame.content}
            </div>
          </div>
        ))}
      </div>

      {frames.length > 1 && (
        <nav
          aria-label="Pages in this section"
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-end gap-3 sm:gap-4 short:bottom-3"
        >
          {segments.map((group) => (
            <div key={group.label || 'all'} className="flex flex-col items-center gap-1.5">
              <div className="flex gap-1">
                {Array.from({ length: group.count }, (_, k) => {
                  const i = group.start + k
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(slideIndex, i)}
                      aria-label={`${group.label ? `${group.label}, ` : ''}page ${k + 1} of ${group.count}`}
                      aria-current={i === step ? 'true' : undefined}
                      className="py-1.5"
                    >
                      <span
                        className={`block h-1 rounded-full transition-all duration-300 ${
                          i === step ? 'w-6 bg-indigo-400' : 'w-2.5 bg-white/25 hover:bg-white/50'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
              {group.label && (
                <span
                  className={`hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    step >= group.start && step < group.start + group.count ? 'text-indigo-300' : 'text-gray-600'
                  }`}
                >
                  {group.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}
