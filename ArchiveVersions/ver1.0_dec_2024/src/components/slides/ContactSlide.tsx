'use client'

import { FiArrowUpRight } from 'react-icons/fi'
import ContactForm from '../ContactForm'
import ScrambleText from '../fx/ScrambleText'
import { useSlide } from '../FullPage'
import VersionHistory from '../VersionHistory'
import { socialLinks } from './HeroSlide'
import { stagger } from './SlideHeading'

/** Final slide: headline and a glass contact form, with a quiet credits line in place of a footer. */
export default function ContactSlide() {
  const { active, number } = useSlide()

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto grid w-full max-w-6xl flex-1 content-center items-center gap-5 sm:gap-8 px-5 sm:px-8 pt-16 pb-4 short:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-300/80" style={stagger(0)}>
            {String(number).padStart(2, '0')} — What&apos;s next
          </p>
          <h2
            className="reveal mt-3 font-display text-3xl sm:text-5xl lg:text-6xl short:lg:text-5xl font-bold leading-[1.05] tracking-tight"
            style={stagger(1)}
          >
            <ScrambleText
              text="Let's build something stellar."
              active={active}
              className="text-transparent bg-gradient-to-r from-white via-indigo-200 to-pink-300 bg-clip-text"
            />
          </h2>
          <p className="reveal mt-3 sm:mt-5 max-w-md text-sm sm:text-base text-gray-300" style={stagger(2)}>
            Available for freelance and full-time work, and always open to collaboration. Send a message and
            I&apos;ll reply by email.
          </p>
          <div className="reveal mt-4 sm:mt-6 hidden sm:flex flex-wrap gap-3" style={stagger(3)}>
            {socialLinks.map(({ platform, url, icon: Icon }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass spot group flex items-center gap-2 px-4 py-2.5 text-sm text-white transition hover:-translate-y-0.5 hover:border-indigo-400/50"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {platform}
                <FiArrowUpRight className="h-4 w-4 text-indigo-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            ))}
          </div>
        </div>
        <div className="reveal" style={stagger(3)}>
          <ContactForm />
        </div>
      </div>

      <footer
        className="reveal mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/10 px-5 sm:px-8 py-4 short:py-3 pr-20 text-xs text-gray-500"
        style={stagger(4)}
      >
        <p>
          © {new Date().getFullYear()} Jerry Li ·{' '}
          <a className="text-gray-400 hover:text-indigo-300 transition-colors" href="https://digolasforge.com" target="_blank" rel="noopener noreferrer">
            Digolas Forge
          </a>
          <span className="sm:hidden">
            {' · '}
            <a className="text-gray-400 hover:text-indigo-300" href="https://github.com/l1jer" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </span>
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Crafted in Canberra, under the stars</span>
          <VersionHistory />
        </div>
      </footer>
    </div>
  )
}
