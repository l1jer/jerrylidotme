'use client'

import { FaCloud, FaCode, FaDatabase, FaPalette, FaRobot } from 'react-icons/fa'
import { skillCategories } from '../../data/portfolio'
import { SkillCategory } from '../../types'
import SlideHeading, { stagger } from './SlideHeading'

const icons: Record<SkillCategory['icon'], typeof FaCode> = { FaRobot, FaCode, FaDatabase, FaCloud, FaPalette }

export default function SkillsSlide() {
  return (
    <>
      <SlideHeading kicker="Toolkit" title="Professional skills" />

      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {skillCategories.map((category, i) => {
          const Icon = icons[category.icon]
          return (
            <div
              key={category.title}
              className={`reveal glass spot min-w-0 px-3 py-2.5 sm:p-4 ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              style={stagger(1 + i)}
            >
              <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                <Icon className="h-4 w-4 text-indigo-300" aria-hidden />
                {category.title}
              </h3>
              <ul className="mt-2 sm:mt-2.5 flex flex-nowrap overflow-x-auto -mx-3 px-3 pb-1 gap-1.5 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 chip-strip">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    title={skill.description}
                    className="flex-shrink-0 whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs text-gray-300 hover:border-indigo-400/40 hover:text-white transition-colors cursor-default"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}
