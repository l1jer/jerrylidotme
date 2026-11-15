'use client'

import { FiAward, FiBookOpen } from 'react-icons/fi'
import { professionalDevelopment, universityEducation } from '../../data/portfolio'
import { EducationItem } from '../../types'
import SlideHeading, { stagger } from './SlideHeading'

function Timeline({ title, icon: Icon, items, i }: { title: string; icon: typeof FiAward; items: EducationItem[]; i: number }) {
  return (
    <div className="reveal glass spot p-4 sm:p-6" style={stagger(i)}>
      <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-300/90">
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h3>
      <ol className="mt-4 space-y-4 border-l border-white/10 pl-5">
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

export default function EducationSlide() {
  return (
    <>
      <SlideHeading kicker="Education" title="Educational journey" />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Timeline title="University education" icon={FiBookOpen} items={universityEducation} i={1} />
        <Timeline title="Professional development" icon={FiAward} items={professionalDevelopment} i={2} />
      </div>
    </>
  )
}
