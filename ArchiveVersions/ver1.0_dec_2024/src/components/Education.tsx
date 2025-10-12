'use client'

import { EducationItem } from '../types'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const professionalDevelopment: EducationItem[] = [
  {
    title: 'JavaScript Development',
    institution: 'General Assembly',
    period: '2021',
  },
  {
    title: 'Senior Frontend Development',
    institution: 'NetEase Cloud Classroom',
    period: '2020',
  },
]

const universityEducation: EducationItem[] = [
  {
    title: 'Graduate Diploma of Information Technology',
    institution: 'University of Canberra',
    period: '2019 – 2020',
  },
  {
    title: 'Double Bachelors of Information Technology & Media Arts and Production',
    institution: 'University of Canberra',
    period: '2013 – 2016',
  },
]

export default function Education() {
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
              Educational Journey
            </h2>
          </div>
          
          {/* Decorative separator */}
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Education Cards */}
      <div className={`grid md:grid-cols-2 gap-8 stagger-fade-in ${isVisible ? 'visible' : ''}`}>
        {/* Professional Development */}
        <div className="backdrop-blur-sm bg-white/[.02] border border-white/10 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-indigo-300">Professional Development</h3>
          <div className="space-y-4">
            {professionalDevelopment.map((item, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-indigo-500/10 hover:border-indigo-400/50 transition-all duration-300">
                <p className="font-semibold text-white mb-2">{item.title}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-300">{item.institution}</p>
                  <p className="text-gray-300 whitespace-nowrap">{item.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* University Education */}
        <div className="backdrop-blur-sm bg-white/[.02] border border-white/10 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-purple-300">University Education</h3>
          <div className="space-y-4">
            {universityEducation.map((item, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-indigo-500/10 hover:border-indigo-400/50 transition-all duration-300">
                <p className="font-semibold text-white mb-1">{item.title}</p>
                {item.subtitle && (
                  <p className="text-gray-100 mb-2">{item.subtitle}</p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-300">{item.institution}</p>
                  <p className="text-gray-300 whitespace-nowrap">{item.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
