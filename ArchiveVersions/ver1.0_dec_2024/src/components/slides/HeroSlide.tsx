'use client'

import { FaGithub } from 'react-icons/fa'
import { FiCode, FiCpu, FiDatabase, FiPenTool, FiSearch, FiShoppingCart, FiTrendingUp } from 'react-icons/fi'
import ScrambleText from '../fx/ScrambleText'
import { useSlide } from '../FullPage'
import { stagger } from './SlideHeading'

const roles = [
  { title: 'eCommerce', icon: FiShoppingCart },
  { title: 'Digital Marketing', icon: FiTrendingUp },
  { title: 'SEO · GEO · AEO', icon: FiSearch },
  { title: 'Frontend & Full-Stack', icon: FiCode },
  { title: 'ERP Integration', icon: FiDatabase },
  { title: 'UI/UX Design', icon: FiPenTool },
  { title: 'AI-Assisted Engineering', icon: FiCpu },
]

export const socialLinks = [
  { platform: 'GitHub', url: 'https://github.com/l1jer', icon: FaGithub },
]

export default function HeroSlide() {
  const { active, goTo } = useSlide()

  return (
    <header className="relative h-full flex flex-col items-center justify-center px-6 text-center">
      <p className="reveal font-mono text-[11px] sm:text-xs uppercase tracking-[0.4em] text-indigo-300/80" style={stagger(0)}>
        Portfolio · Canberra, Australia
      </p>

      <h1
        className="reveal mt-4 font-display text-6xl sm:text-7xl md:text-8xl short:md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_40px_rgba(129,140,248,0.35)]"
        style={stagger(1)}
      >
        <ScrambleText text="Jerry Li" active={active} />
      </h1>

      <p className="reveal mt-4 max-w-2xl text-base sm:text-lg text-gray-300" style={stagger(2)}>
        Web developer &amp; eCommerce specialist building fast online stores, ERP integrations and the
        SEO, GEO and AEO that get them found by search engines and AI assistants.
      </p>

      <ul className="reveal mt-7 short:mt-5 flex max-w-3xl flex-wrap justify-center gap-2" style={stagger(3)}>
        {roles.map(({ title, icon: Icon }) => (
          <li
            key={title}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs sm:text-sm text-gray-200 backdrop-blur-sm"
          >
            <Icon className="h-3.5 w-3.5 text-indigo-300" aria-hidden />
            {title}
          </li>
        ))}
      </ul>

      <div className="reveal mt-7 short:mt-5 flex flex-wrap items-center justify-center gap-3" style={stagger(4)}>
        <span className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for work
        </span>
        {socialLinks.map(({ platform, url, icon: Icon }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-gray-300 transition hover:border-indigo-400/50 hover:text-white"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(1)}
        className="reveal absolute bottom-8 short:bottom-5 flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        style={stagger(6)}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll</span>
        <span className="relative h-9 w-5 rounded-full border border-white/30">
          <span className="absolute left-1/2 top-1.5 h-2 w-0.5 -translate-x-1/2 rounded-full bg-indigo-300 animate-bounce" />
        </span>
      </button>
    </header>
  )
}
