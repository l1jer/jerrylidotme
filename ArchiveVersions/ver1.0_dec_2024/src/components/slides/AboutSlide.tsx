'use client'

import Image from 'next/image'
import { FiCpu, FiSearch, FiShoppingCart, FiTrendingUp } from 'react-icons/fi'
import { aboutStats, spokenLanguages } from '../../data/portfolio'
import Frames from '../Frames'
import { useSlide } from '../FullPage'
import SlideHeading, { stagger } from './SlideHeading'

const capabilities = [
  {
    icon: FiShoppingCart,
    title: 'eCommerce',
    text: 'WooCommerce and Shopify stores (plus BigCommerce), ERP integrations and B2B dealer portals.',
  },
  {
    icon: FiTrendingUp,
    title: 'Digital Marketing',
    text: 'Google and Meta ads, EDM automation, CRO and GA4 / Conversions API tracking.',
  },
  {
    icon: FiSearch,
    title: 'SEO · GEO · AEO',
    text: 'Technical SEO, structured data and llms.txt, so pages rank in search and get cited by AI answers.',
  },
  {
    icon: FiCpu,
    title: 'Full-Stack & AI-Assisted',
    text: 'PHP, Node, React/Next.js and three.js, shipped with Claude Code under strict guardrails.',
  },
]

function Portrait() {
  return (
    <div className="reveal relative mx-auto w-24 sm:w-40 md:w-full tiny:w-20 md:tiny:w-full" style={stagger(1)}>
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-lg" />
      <Image
        src="/jerry-li-sketch-2025.webp"
        alt="Sketch portrait of Jerry Li"
        width={400}
        height={400}
        priority
        className="relative w-full rounded-3xl border border-white/10"
      />
    </div>
  )
}

function Intro() {
  return (
    <>
      <p className="reveal text-sm sm:text-base md:text-lg short:md:text-base text-gray-300 leading-relaxed" style={stagger(2)}>
        Web developer with 6+ years of building and running WooCommerce and Shopify stores, from custom
        themes and apps to ERP integrations and B2B portals, plus the growth work around them: SEO, GEO
        and AEO, paid media, email automation and analytics.
        <span className="mt-1 block text-xs text-gray-500">Speaks {spokenLanguages.join(' · ')}</span>
      </p>
      <dl className="reveal mt-5 short:mt-4 grid grid-cols-3 gap-2 sm:gap-3" style={stagger(3)}>
        {aboutStats.map((s) => (
          <div key={s.label} className="glass spot px-3 py-3 sm:px-4 sm:py-4">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-lg sm:text-2xl font-bold text-white leading-tight">{s.value}</dd>
            <dd className="mt-1 text-[11px] sm:text-xs text-gray-400 leading-snug">{s.label}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

function Capabilities({ stacked }: { stacked?: boolean }) {
  return (
    <div className={`mt-3 grid gap-2 sm:gap-3 ${stacked ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {capabilities.map(({ icon: Icon, title, text }, i) => (
        <div key={title} className="reveal glass spot flex gap-3 p-3 sm:p-4" style={stagger((stacked ? 1 : 4) + i * 0.6)}>
          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-300" aria-hidden />
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export const ABOUT_PHONE_FRAMES = ['Intro', 'What I do']

/**
 * Desktop and tablet: one page. Phones: two sideways frames (intro and stats, then capabilities)
 * so nothing needs scrolling and nothing is hidden.
 */
export default function AboutSlide({ split }: { split: boolean }) {
  const { step, active } = useSlide()

  if (split) {
    return (
      <Frames
        frames={[
          {
            key: 'intro',
            content: (
              <>
                <SlideHeading kicker="About me" title="Web, eCommerce & growth" active={active && step === 0} />
                <div className="mb-5 short:mb-3 w-24 tiny:w-20">
                  <Portrait />
                </div>
                <Intro />
              </>
            ),
          },
          {
            key: 'capabilities',
            content: (
              <>
                <SlideHeading kicker="About me" title="What I do" active={active && step === 1} />
                <Capabilities stacked />
              </>
            ),
          },
        ]}
      />
    )
  }

  return (
    <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-6xl px-5 sm:px-8 pt-16 pb-14 short:pt-14 short:pb-10">
      <SlideHeading kicker="About me" title="Web, eCommerce & growth" />
      <div className="grid items-center gap-6 lg:gap-10 md:grid-cols-[minmax(0,260px)_1fr] short:md:grid-cols-[minmax(0,200px)_1fr]">
        <Portrait />
        <div>
          <Intro />
          <Capabilities />
        </div>
      </div>
    </div>
  )
}
