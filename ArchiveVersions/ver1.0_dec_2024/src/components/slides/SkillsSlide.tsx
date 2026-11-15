'use client'

import { FaWordpress } from 'react-icons/fa'
import { FiCheckSquare, FiCloud, FiCode, FiCpu, FiDatabase, FiLayers, FiPenTool, FiSearch, FiShoppingCart, FiTool, FiTrendingUp } from 'react-icons/fi'
import { skillCategories } from '../../data/portfolio'
import { SkillCategory } from '../../types'
import Frames from '../Frames'
import { useSlide } from '../FullPage'
import SlideHeading, { stagger } from './SlideHeading'

const icons: Record<SkillCategory['icon'], typeof FiCode> = {
  ai: FiCpu,
  code: FiCode,
  layers: FiLayers,
  wordpress: FaWordpress,
  cart: FiShoppingCart,
  chart: FiTrendingUp,
  search: FiSearch,
  check: FiCheckSquare,
  database: FiDatabase,
  cloud: FiCloud,
  tool: FiTool,
  pen: FiPenTool,
}

/** Groups categories into pages holding at most `budget` skills (and `maxCategories` cards). */
export function buildSkillFrames(budget: number, maxCategories: number): SkillCategory[][] {
  const pages: SkillCategory[][] = [[]]
  let used = 0
  for (const category of skillCategories) {
    const page = pages[pages.length - 1]
    if (page.length > 0 && (used + category.skills.length > budget || page.length >= maxCategories)) {
      pages.push([category])
      used = category.skills.length
    } else {
      page.push(category)
      used += category.skills.length
    }
  }
  return pages
}

function SkillPage({ categories, on }: { categories: SkillCategory[]; on: boolean }) {
  return (
    <>
      <SlideHeading kicker="Toolkit" title="Professional skills" active={on} />
      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => {
          const Icon = icons[category.icon]
          return (
            <div key={category.title} className="reveal glass spot p-3 sm:p-4" style={stagger(1 + i * 0.6)}>
              <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                <Icon className="h-4 w-4 text-indigo-300" aria-hidden />
                {category.title}
              </h3>
              <ul className="mt-2 sm:mt-2.5 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <li key={skill} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs text-gray-300">
                    {skill}
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

export default function SkillsSlide({ budget, maxCategories }: { budget: number; maxCategories: number }) {
  const { step, active } = useSlide()
  const pages = buildSkillFrames(budget, maxCategories)
  return (
    <Frames
      frames={pages.map((categories, i) => ({
        key: categories[0].title,
        content: <SkillPage categories={categories} on={active && step === i} />,
      }))}
    />
  )
}
