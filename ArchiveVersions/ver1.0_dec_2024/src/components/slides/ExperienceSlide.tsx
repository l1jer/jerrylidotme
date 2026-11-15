'use client'

import { useState } from 'react'
import { FiArrowUpRight, FiCalendar, FiMapPin, FiSettings } from 'react-icons/fi'
import { ExperienceItem } from '../../types'
import { experiences } from '../../data/portfolio'
import SlideHeading, { stagger } from './SlideHeading'

/** One job per slide. Focus areas are compact chips; the selected one's detail shows alongside. */
export default function ExperienceSlide({ exp, index }: { exp: ExperienceItem; index: number }) {
  const [selected, setSelected] = useState(0)
  // "Company, Location" — split on the last comma so names like "Co., Ltd." stay intact.
  const cut = exp.company.lastIndexOf(',')
  const company = cut > 0 ? exp.company.slice(0, cut) : exp.company
  const place = cut > 0 ? exp.company.slice(cut + 1).trim() : ''
  const skill = exp.skills[selected]

  return (
    <>
      <SlideHeading kicker={`Experience ${index + 1} / ${experiences.length}`} title={company} />

      <div className="reveal mb-5 short:mb-3 tiny:mb-2" style={stagger(1)}>
        <h3 className="text-lg sm:text-xl md:text-2xl short:md:text-xl font-semibold text-indigo-200 leading-snug">
          {exp.title}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="h-3.5 w-3.5" aria-hidden />
            {exp.period}
          </span>
          {place && (
            <span className="flex items-center gap-1.5">
              <FiMapPin className="h-3.5 w-3.5" aria-hidden />
              {place}
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="reveal min-w-0" style={stagger(2)}>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Focus areas</p>
          <div className="flex flex-nowrap overflow-x-auto -mx-5 px-5 pb-1 gap-1.5 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:gap-2 chip-strip" role="tablist" aria-label="Focus areas">
            {exp.skills.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === selected}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onClick={() => setSelected(i)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm transition ${
                  i === selected
                    ? 'border-indigo-400/60 bg-indigo-500/20 text-white shadow-[0_0_20px_rgba(129,140,248,0.25)]'
                    : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/25 hover:text-white'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="glass mt-3 p-3 sm:p-4 min-h-[7.5rem] sm:min-h-[5.5rem]" role="tabpanel" aria-live="polite">
            <p className="text-sm font-semibold text-white">{skill.title}</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 leading-relaxed">{skill.description}</p>
          </div>
        </div>

        {exp.projects && (
          <div className="reveal min-w-0" style={stagger(3)}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Projects</p>
            <ul className="flex flex-nowrap overflow-x-auto -mx-5 px-5 pb-1 gap-1.5 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:gap-2 chip-strip">
              {exp.projects.map((p) => (
                <li key={p.name} className="flex-shrink-0 whitespace-nowrap">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-indigo-400/20 bg-indigo-500/[0.06] px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm text-gray-200 transition hover:border-indigo-400/50 hover:text-white"
                    >
                      {p.name}
                      <FiArrowUpRight className="h-3 w-3 text-indigo-300" aria-hidden />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 rounded-lg border border-emerald-400/20 bg-emerald-500/[0.06] px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm text-gray-200">
                      <FiSettings className="h-3 w-3 text-emerald-300" aria-hidden />
                      {p.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
