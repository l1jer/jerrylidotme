'use client'

import { FiArrowRight, FiArrowUpRight, FiCalendar, FiMapPin } from 'react-icons/fi'
import { experiences } from '../../data/portfolio'
import { ExperienceItem, Highlight } from '../../types'
import Frames, { Frame, FrameGroup } from '../Frames'
import { useSlide } from '../FullPage'
import SlideHeading, { stagger } from './SlideHeading'

interface ExperienceFrame {
  job: ExperienceItem
  jobIndex: number
  kind: 'overview' | 'highlights'
  highlights: Highlight[]
  page: number
  pages: number
}

/** Splits `items` into the fewest pages of at most `perPage`, balanced so no page is left nearly empty. */
function balancedPages<T>(items: T[], perPage: number): T[][] {
  const pages = Math.max(1, Math.ceil(items.length / perPage))
  const base = Math.floor(items.length / pages)
  const extra = items.length % pages
  const out: T[][] = []
  let start = 0
  for (let i = 0; i < pages; i++) {
    const size = base + (i < extra ? 1 : 0)
    out.push(items.slice(start, start + size))
    start += size
  }
  return out
}

/** Splits every job into an overview frame plus balanced pages of highlights (at most `perPage` each). */
export function buildExperienceFrames(perPage: number): ExperienceFrame[] {
  return experiences.flatMap((job, jobIndex) => {
    const chunks = balancedPages(job.highlights, perPage)
    return [
      { job, jobIndex, kind: 'overview' as const, highlights: [], page: 0, pages: chunks.length },
      ...chunks.map((highlights, page) => ({
        job,
        jobIndex,
        kind: 'highlights' as const,
        highlights,
        page: page + 1,
        pages: chunks.length,
      })),
    ]
  })
}

export function experienceGroups(frames: ExperienceFrame[]): FrameGroup[] {
  return experiences.map((job, jobIndex) => {
    const start = frames.findIndex((f) => f.jobIndex === jobIndex)
    return { label: job.company, start, count: frames.filter((f) => f.jobIndex === jobIndex).length }
  })
}

function JobMeta({ job }: { job: ExperienceItem }) {
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400">
      <span className="flex items-center gap-1.5">
        <FiCalendar className="h-3.5 w-3.5" aria-hidden />
        {job.period}
      </span>
      <span className="flex items-center gap-1.5">
        <FiMapPin className="h-3.5 w-3.5" aria-hidden />
        {job.location}
      </span>
    </p>
  )
}

function Overview({ frame, on }: { frame: ExperienceFrame; on: boolean }) {
  const { job, jobIndex } = frame
  return (
    <>
      <SlideHeading kicker={`Experience ${jobIndex + 1} / ${experiences.length}`} title={job.company} active={on} />
      <div className="reveal" style={stagger(1)}>
        <h3 className="text-lg sm:text-2xl short:sm:text-xl font-semibold text-indigo-200 leading-snug">{job.title}</h3>
        <JobMeta job={job} />
      </div>
      <p className="reveal mt-3 sm:mt-4 max-w-3xl text-sm sm:text-base md:text-lg short:md:text-base text-gray-300 leading-relaxed tiny:leading-snug" style={stagger(2)}>
        {job.summary}
      </p>

      {job.stats && (
        <dl className="reveal mt-5 short:mt-3 grid max-w-3xl grid-cols-3 gap-2 sm:gap-3" style={stagger(3)}>
          {job.stats.map((s) => (
            <div key={s.label} className="glass spot px-2.5 py-2 sm:px-4 sm:py-3">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-lg sm:text-3xl font-bold text-white">{s.value}</dd>
              <dd className="mt-0.5 text-[10px] sm:text-xs text-gray-400 leading-snug">{s.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {job.sites && (
        <div className="reveal mt-5 short:mt-3" style={stagger(4)}>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Live sites</p>
          <ul className="flex flex-wrap gap-1.5 sm:gap-2">
            {job.sites.map((p) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-indigo-400/20 bg-indigo-500/[0.06] px-2 sm:px-2.5 py-0.5 sm:py-1.5 text-xs sm:text-sm text-gray-200 transition hover:border-indigo-400/50 hover:text-white"
                >
                  {p.name}
                  <FiArrowUpRight className="h-3 w-3 text-indigo-300" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="reveal mt-6 short:mt-4 tiny:hidden flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500" style={stagger(5)}>
        Scroll for highlights <FiArrowRight className="h-3 w-3 animate-pulse" aria-hidden />
      </p>
    </>
  )
}

function Highlights({ frame }: { frame: ExperienceFrame }) {
  const { job } = frame
  return (
    <>
      <div className="reveal mb-4 sm:mb-6 short:mb-3" style={stagger(0)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-300/80">
          Highlights {frame.page} / {frame.pages}
        </p>
        <h3 className="mt-1.5 font-display text-2xl sm:text-3xl short:sm:text-2xl font-bold text-white leading-tight">
          {job.company}
          <span className="ml-3 align-middle text-sm sm:text-base font-sans font-medium text-indigo-200/80">{job.title}</span>
        </h3>
      </div>
      <ul className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {frame.highlights.map((h, i) => (
          <li key={h.title} className="reveal glass spot p-3 sm:p-4" style={stagger(1 + i * 0.6)}>
            <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">{h.title}</h4>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{h.description}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

/** All jobs in one slide: scrolling down moves sideways through each job's overview and highlights. */
export default function ExperienceSlide({ perPage }: { perPage: number }) {
  const { step, active } = useSlide()
  const data = buildExperienceFrames(perPage)
  const frames: Frame[] = data.map((frame, i) => ({
    key: `${frame.jobIndex}-${frame.page}`,
    content:
      frame.kind === 'overview' ? <Overview frame={frame} on={active && step === i} /> : <Highlights frame={frame} />,
  }))
  return <Frames frames={frames} groups={experienceGroups(data)} />
}
