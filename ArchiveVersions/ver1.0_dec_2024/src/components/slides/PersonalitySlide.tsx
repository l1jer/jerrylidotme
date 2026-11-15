'use client'

import { personalityTraits } from '../../data/portfolio'
import SlideHeading, { stagger } from './SlideHeading'

export default function PersonalitySlide() {
  return (
    <>
      <SlideHeading kicker="How I work" title="Personality" />
      <div className="grid gap-2.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {personalityTraits.map((trait, i) => (
          <div key={trait.title} className="reveal glass spot flex gap-3 sm:gap-4 p-3.5 micro:p-3 sm:p-5" style={stagger(1 + i)}>
            <span className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-xl sm:text-2xl">
              {trait.icon}
            </span>
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-white">{trait.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{trait.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
