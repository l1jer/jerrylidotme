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
  /** Show the summary, stats and live sites (the job's first page). */
  full: boolean
  items: Highlight[]
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

/**
 * Pages for every job. Wide screens put the job details beside its cards, so a job is usually
 * one to three pages. Phones (`separateIntro`) give the job details a page of their own first.
 */
export function buildExperienceFrames(perPage: number, separateIntro: boolean): ExperienceFrame[] {
  return experiences.flatMap((job, jobIndex) => {
    const chunks = balancedPages(job.highlights, perPage)
    const cardPages = chunks.map((items, i) => ({ items, full: !separateIntro && i === 0 }))
    const all = separateIntro ? [{ items: [] as Highlight[], full: true }, ...cardPages] : cardPages
    return all.map((p, page) => ({ job, jobIndex, full: p.full, items: p.items, page: page + 1, pages: all.length }))
  })
}

export function experienceGroups(frames: ExperienceFrame[]): FrameGroup[] {
  return experiences.map((job, jobIndex) => ({
    label: job.company,
    start: frames.findIndex((f) => f.jobIndex === jobIndex),
    count: frames.filter((f) => f.jobIndex === jobIndex).length,
  }))
}


function JobDetails({ frame, on }: { frame: ExperienceFrame; on: boolean }) {
  const { job, full } = frame
  return (
    <div>
      <SlideHeading
        kicker="Experience"
        title={job.company}
        active={on}
      />
      <div className="reveal -mt-2" style={stagger(1)}>
        <h3 className="text-base sm:text-xl short:sm:text-lg font-semibold text-indigo-200 leading-snug">{job.title}</h3>
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
      </div>

      {full && (
        <>
          <p className="reveal mt-3 sm:mt-4 text-sm sm:text-base short:sm:text-sm text-gray-300 leading-relaxed tiny:leading-snug" style={stagger(2)}>
            {job.summary}
          </p>
          {job.stats && (
            <dl className="reveal mt-4 short:mt-3 grid grid-cols-3 gap-2" style={stagger(3)}>
              {job.stats.map((s) => (
                <div key={s.label} className="glass spot px-2.5 py-2 sm:px-3 sm:py-2.5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-lg sm:text-2xl font-bold text-white">{s.value}</dd>
                  <dd className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400 leading-snug">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {job.sites && (
            <div className="reveal mt-4 short:mt-3" style={stagger(4)}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">Live sites</p>
              <ul className="flex flex-wrap gap-1.5">
                {job.sites.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-indigo-400/20 bg-indigo-500/[0.06] px-2 py-0.5 sm:py-1 text-xs sm:text-[13px] text-gray-200 transition hover:border-indigo-400/50 hover:text-white"
                    >
                      {p.name}
                      <FiArrowUpRight className="h-3 w-3 text-indigo-300" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Cards({ items }: { items: Highlight[] }) {
  return (
    <ul className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
      {items.map((h, i) => (
        <li key={h.title} className="reveal glass spot p-3 tiny:p-2.5 sm:p-4 sm:tiny:p-3" style={stagger(2 + i * 0.5)}>
          <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">{h.title}</h4>
          <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed tiny:leading-snug">{h.description}</p>
        </li>
      ))}
    </ul>
  )
}

function ExperiencePage({ frame, on }: { frame: ExperienceFrame; on: boolean }) {
  if (frame.items.length === 0) {
    // Phone intro page: job details only, with a nudge to keep going.
    return (
      <>
        <JobDetails frame={frame} on={on} />
        <p className="reveal mt-5 short:mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500" style={stagger(5)}>
          Scroll for more <FiArrowRight className="h-3 w-3 animate-pulse" aria-hidden />
        </p>
      </>
    )
  }
  return (
    <div className="grid items-center gap-5 lg:gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <JobDetails frame={frame} on={on} />
      <Cards items={frame.items} />
    </div>
  )
}

/** All jobs in one slide: scrolling down moves sideways through each job's pages. */
export default function ExperienceSlide({ perPage, separateIntro }: { perPage: number; separateIntro: boolean }) {
  const { step, active } = useSlide()
  const data = buildExperienceFrames(perPage, separateIntro)
  const frames: Frame[] = data.map((frame, i) => ({
    key: `${frame.jobIndex}-${frame.page}`,
    content: <ExperiencePage frame={frame} on={active && step === i} />,
  }))
  return <Frames frames={frames} groups={experienceGroups(data)} />
}
