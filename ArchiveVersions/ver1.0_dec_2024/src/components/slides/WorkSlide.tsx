'use client'

import { FiArchive, FiArrowUpRight, FiGitBranch } from 'react-icons/fi'
import { featuredBuilds, freelanceProjects } from '../../data/portfolio'
import Frames from '../Frames'
import { useSlide } from '../FullPage'
import SlideHeading, { stagger } from './SlideHeading'

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function FeaturedBuilds({ on, builds, offset, page, pages }: { on: boolean; builds: typeof featuredBuilds; offset: number; page: number; pages: number }) {
  return (
    <>
      <SlideHeading kicker={pages > 1 ? `Projects ${page} / ${pages}` : 'Projects'} title="Featured builds" active={on} />
      <p className="reveal -mt-3 mb-5 short:mb-3 text-sm text-gray-400" style={stagger(1)}>
        Built for{' '}
        <a href="https://flywingusa.com" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white">
          Flywing USA
        </a>
      </p>
      <ul className="grid gap-2.5 sm:gap-4 md:grid-cols-3">
        {builds.map((build, i) => (
          <li key={build.title} className="reveal glass spot flex flex-col p-3.5 sm:p-5" style={stagger(2 + i)}>
            <span className="font-mono text-[10px] text-indigo-300/70">{String(offset + i + 1).padStart(2, '0')}</span>
            <h3 className="mt-1 font-display text-base sm:text-xl font-semibold text-white">{build.title}</h3>
            <p className="mt-1.5 flex-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{build.description}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {build.tags.map((tag) => (
                <li key={tag} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-gray-300">
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}

function ClientSites({ on }: { on: boolean }) {
  return (
    <>
      <SlideHeading kicker="Freelance" title="Client websites" active={on} />
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
            <li key={project.name} className="reveal" style={stagger(1 + i * 0.5)}>
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

/** Featured builds are split into pages of `perPage` cards, followed by the client websites. */
export function workFrameLabels(perPage: number): string[] {
  const pages = Math.ceil(featuredBuilds.length / perPage)
  return [...Array.from({ length: pages }, (_, i) => (pages > 1 ? `Featured ${i + 1}/${pages}` : 'Featured builds')), 'Client websites']
}

export default function WorkSlide({ perPage }: { perPage: number }) {
  const { step, active } = useSlide()
  const pages = Math.ceil(featuredBuilds.length / perPage)
  const featured = Array.from({ length: pages }, (_, i) => ({
    key: `featured-${i}`,
    content: (
      <FeaturedBuilds
        on={active && step === i}
        builds={featuredBuilds.slice(i * perPage, (i + 1) * perPage)}
        offset={i * perPage}
        page={i + 1}
        pages={pages}
      />
    ),
  }))
  return <Frames frames={[...featured, { key: 'clients', content: <ClientSites on={active && step === pages} /> }]} />
}
