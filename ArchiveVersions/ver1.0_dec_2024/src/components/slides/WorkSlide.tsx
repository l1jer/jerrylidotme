'use client'

import { FiArchive, FiArrowUpRight, FiGitBranch } from 'react-icons/fi'
import { freelanceProjects } from '../../data/portfolio'
import SlideHeading, { stagger } from './SlideHeading'

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function WorkSlide() {
  return (
    <>
      <SlideHeading kicker="Selected work" title="Freelance portfolio" />

      <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {freelanceProjects.map((project, i) => {
          const body = (
            <>
              <span className="block font-semibold text-sm sm:text-base text-white leading-snug">{project.name}</span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400 micro:hidden sm:micro:flex">
                {project.archived ? (
                  <>
                    <FiArchive className="h-3 w-3 text-amber-300" aria-hidden />
                    <span className="text-amber-300/90">Archived snapshot</span>
                  </>
                ) : project.url ? (
                  <span className="truncate">{host(project.url)}</span>
                ) : (
                  <>
                    <FiGitBranch className="h-3 w-3 text-emerald-300" aria-hidden />
                    <span className="text-emerald-300/90">Open source</span>
                  </>
                )}
              </span>
            </>
          )
          return (
            <li key={project.name} className="reveal" style={stagger(1 + Math.min(i, 9) * 0.5)}>
              {project.url ? (
                <a
                  href={project.url}
                  target={project.archived ? undefined : '_blank'}
                  rel={project.archived ? undefined : 'noopener noreferrer'}
                  className="glass spot group flex h-full items-start justify-between gap-2 p-3 sm:p-4 tiny:p-2.5 transition hover:-translate-y-0.5 hover:border-indigo-400/40"
                >
                  <span className="min-w-0">{body}</span>
                  <FiArrowUpRight
                    className="h-4 w-4 flex-shrink-0 text-indigo-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden
                  />
                </a>
              ) : (
                <div className="glass spot flex h-full items-start p-3 sm:p-4 tiny:p-2.5">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
