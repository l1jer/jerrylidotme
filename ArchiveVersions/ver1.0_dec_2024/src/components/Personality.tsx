'use client'

import { PersonalityTrait } from '../types'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const personalityTraits: PersonalityTrait[] = [
  {
    icon: '💡',
    title: 'INTP Personality Traits',
    description:
      'Both outgoing and reserved (slightly more reserved), cautious, and focused on excellence according to the DISC Assessment.',
  },
  {
    icon: '🧠',
    title: 'Thirst for Knowledge',
    description: 'Exhibits curiosity, patience, and a keenness to learn.',
  },
  {
    icon: '🔧',
    title: 'Problem-Solving Approach',
    description:
      'Maintains an open mind, actively questions, excels in problem-solving, and is collaborative, supportive, yet dominant.',
  },
  {
    icon: '🤔',
    title: 'Critical Thinking',
    description:
      'Demonstrates a blend of flexibility and adaptability, paired with critical thinking that is objective.',
  },
]

export default function Personality() {
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <section ref={ref} className={`mb-16 relative scroll-fade-in ${isVisible ? 'visible' : ''}`}>
      {/* Title Section with Stunning Design */}
      <div className="relative mb-12">
        <div className="text-center">
          <div className="inline-block relative">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse"></div>
            
            {/* Title */}
            <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 px-4">
              Personality
            </h2>
          </div>
          
          {/* Decorative separator */}
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="backdrop-blur-sm bg-white/[.02] border border-white/10 rounded-2xl p-4 sm:p-8">
        <div className={`grid sm:grid-cols-2 gap-4 stagger-fade-in ${isVisible ? 'visible' : ''}`}>
          {personalityTraits.map((trait, index) => (
            <div
              key={index}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              {/* Row 1: Icon + Title */}
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-xl border border-indigo-400/20 flex items-center justify-center text-2xl">
                  {trait.icon}
                </div>
                <h3 className="font-bold text-xl text-white self-center">
                  {trait.title}
                </h3>
              </div>
              
              {/* Row 2: Empty + Description */}
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <div className="w-12"></div>
                <p className="text-gray-300 leading-relaxed">{trait.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
