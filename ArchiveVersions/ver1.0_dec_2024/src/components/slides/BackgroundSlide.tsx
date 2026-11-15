'use client'

import { FiAward, FiBookOpen } from 'react-icons/fi'
import { personalityTraits, professionalDevelopment, universityEducation } from '../../data/portfolio'
import { EducationItem } from '../../types'
import Frames from '../Frames'
import { useSlide } from '../FullPage'
import SlideHeading, { stagger } from './SlideHeading'

function Timeline({ title, icon: Icon, items }: { title: string; icon: typeof FiAward; items: EducationItem[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-300/90">
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h3>
      <ol className="mt-3 space-y-3 border-l border-white/10 pl-5">
        {items.map((item) => (
          <li key={item.title} className="relative">
            <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-indigo-400 bg-slate-950" />
            <p className="font-semibold text-white text-sm sm:text-base leading-snug">{item.title}</p>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-400">
              {item.institution} · <span className="font-mono">{item.period}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Education({ i }: { i: number }) {
  return (
    <div className="reveal glass spot space-y-5 short:space-y-4 p-4 sm:p-6" style={stagger(i)}>
      <Timeline title="University education" icon={FiBookOpen} items={universityEducation} />
      <Timeline title="Professional development" icon={FiAward} items={professionalDevelopment} />
    </div>
  )
}

function Personality({ i }: { i: number }) {
  return (
    <ul className="grid gap-2 sm:gap-2.5">
      {personalityTraits.map((trait, k) => (
        <li key={trait.title} className="reveal glass spot flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3" style={stagger(i + k * 0.5)}>
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-500/10 text-lg">
            {trait.icon}
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">{trait.title}</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-snug">{trait.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export const BACKGROUND_PHONE_FRAMES = ['Education', 'Personality']

/** Education and personality: side by side on wide screens, two sideways frames on phones. */
export default function BackgroundSlide({ split }: { split: boolean }) {
  const { step, active } = useSlide()

  if (split) {
    return (
      <Frames
        frames={[
          {
            key: 'education',
            content: (
              <>
                <SlideHeading kicker="Background" title="Education" active={active && step === 0} />
                <Education i={1} />
              </>
            ),
          },
          {
            key: 'personality',
            content: (
              <>
                <SlideHeading kicker="Background" title="How I work" active={active && step === 1} />
                <Personality i={1} />
              </>
            ),
          },
        ]}
      />
    )
  }

  return (
    <div className="min-h-full flex flex-col justify-center mx-auto w-full max-w-6xl px-5 sm:px-8 pt-16 pb-14 short:pt-14 short:pb-10">
      <SlideHeading kicker="Background" title="Education & how I work" />
      <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
        <Education i={1} />
        <Personality i={2} />
      </div>
    </div>
  )
}
