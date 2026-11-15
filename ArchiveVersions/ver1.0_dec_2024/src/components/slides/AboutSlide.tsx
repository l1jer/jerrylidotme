'use client'

import Image from 'next/image'
import { FiLayers, FiLayout } from 'react-icons/fi'
import { experiences, freelanceProjects } from '../../data/portfolio'
import SlideHeading, { stagger } from './SlideHeading'

// Live websites delivered, counted from the projects listed in experience and freelance work.
const sitesShipped =
  experiences.flatMap((e) => e.projects ?? []).filter((p) => p.url).length +
  freelanceProjects.filter((p) => p.url).length

const stats = [
  { value: '6+', label: 'Years building for the web' },
  { value: `${sitesShipped}`, label: 'Websites shipped' },
  { value: 'AU · NZ · US · UK', label: 'Markets served' },
]

const strengths = [
  {
    icon: FiLayout,
    title: 'UI/UX Excellence',
    text: 'Interfaces that put usability first and still look great, built hand in hand with creative teams.',
  },
  {
    icon: FiLayers,
    title: 'Full-Stack Capability',
    text: 'Comfortable past the frontend: APIs, databases, integrations and the backend work in between.',
  },
]

export default function AboutSlide() {
  return (
    <>
      <SlideHeading kicker="About me" title="Frontend & web development" />

      <div className="grid items-center gap-6 lg:gap-10 md:grid-cols-[minmax(0,260px)_1fr] short:md:grid-cols-[minmax(0,200px)_1fr]">
        <div className="reveal relative mx-auto w-24 sm:w-40 md:w-full tiny:hidden md:tiny:block" style={stagger(1)}>
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

        <div>
          <p className="reveal text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed" style={stagger(2)}>
            Frontend developer with over six years of experience building and optimising high-performance
            WordPress and Shopify sites and dynamic React and Next.js applications. I also handle technical SEO,
            REST API and AI integrations, and multi-regional e-commerce storefronts.
          </p>

          <dl className="reveal mt-5 short:mt-4 grid grid-cols-3 gap-2 sm:gap-3" style={stagger(3)}>
            {stats.map((s) => (
              <div key={s.label} className="glass spot px-3 py-3 sm:px-4 sm:py-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-lg sm:text-2xl font-bold text-white leading-tight">{s.value}</dd>
                <dd className="mt-1 text-[11px] sm:text-xs text-gray-400 leading-snug">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 tiny:hidden sm:tiny:grid">
            {strengths.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="reveal glass spot flex gap-3 p-3 sm:p-4" style={stagger(4 + i)}>
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-300" aria-hidden />
                <div>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
