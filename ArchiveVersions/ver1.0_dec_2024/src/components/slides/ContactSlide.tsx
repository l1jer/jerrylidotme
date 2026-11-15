'use client'

import { FiArrowUpRight } from 'react-icons/fi'
import ScrambleText from '../fx/ScrambleText'
import { useSlide } from '../FullPage'
import VersionHistory from '../VersionHistory'
import { socialLinks } from './HeroSlide'
import { stagger } from './SlideHeading'

/** Final slide: replaces the old footer with a call to action and a quiet credits line. */
export default function ContactSlide() {
  const { active, number } = useSlide()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-300/80" style={stagger(0)}>
          {String(number).padStart(2, '0')} — What&apos;s next
        </p>
        <h2
          className="reveal mt-4 max-w-4xl font-display text-4xl sm:text-6xl md:text-7xl short:md:text-6xl font-bold leading-[1.05] tracking-tight"
          style={stagger(1)}
        >
          <ScrambleText
            text="Let's build something stellar."
            active={active}
            className="text-transparent bg-gradient-to-r from-white via-indigo-200 to-pink-300 bg-clip-text"
          />
        </h2>
        <p className="reveal mt-5 max-w-lg text-sm sm:text-base text-gray-300" style={stagger(2)}>
          Available for freelance and full-time work, and always open to collaboration.
        </p>
        <div className="reveal mt-8 short:mt-6 flex flex-wrap justify-center gap-3" style={stagger(3)}>
          {socialLinks.map(({ platform, url, icon: Icon }) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass spot group flex items-center gap-2 px-5 py-3 text-sm text-white transition hover:-translate-y-0.5 hover:border-indigo-400/50"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {platform}
              <FiArrowUpRight className="h-4 w-4 text-indigo-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          ))}
        </div>
      </div>

      <footer className="reveal mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 px-5 sm:px-8 py-5 pr-20 text-xs text-gray-500" style={stagger(4)}>
        <p>
          © {new Date().getFullYear()} Jerry Li ·{' '}
          <a className="text-gray-400 hover:text-indigo-300 transition-colors" href="https://digolasforge.com" target="_blank" rel="noopener noreferrer">
            Digolas Forge
          </a>
        </p>
        <div className="flex items-center gap-4">
          <span>Crafted in Canberra, under the stars</span>
          <VersionHistory />
        </div>
      </footer>
    </div>
  )
}
