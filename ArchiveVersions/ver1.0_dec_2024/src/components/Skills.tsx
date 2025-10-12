'use client'

import { FaCode, FaDatabase, FaCloud, FaPalette } from 'react-icons/fa'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const skillCategories = [
  {
    title: 'Frontend',
    icon: <FaCode className="w-8 h-8 text-indigo-400" />,
    bgClass: 'bg-indigo-500/20',
    textClass: 'from-indigo-400 to-purple-400',
    skills: [
      { name: 'HTML5', description: 'Semantic structure for accessible and SEO-optimized web pages.' },
      { name: 'CSS3', description: 'Responsive layouts, animations, and visual styling.' },
      { name: 'JavaScript', description: 'Interactive functionality and client-side logic for web apps.' },
      { name: 'React', description: 'Component-based architecture for dynamic and scalable UIs.' },
      { name: 'Redux', description: 'State management for complex frontend applications.' },
      { name: 'Tailwind', description: 'Utility-first CSS framework for rapid UI development.' },
    ],
  },
  {
    title: 'Backend',
    icon: <FaDatabase className="w-8 h-8 text-purple-400" />,
    bgClass: 'bg-purple-500/20',
    textClass: 'from-purple-400 to-pink-400',
    skills: [
      { name: 'Node.js', description: 'Asynchronous server-side programming for scalable apps.' },
      { name: 'Next.js', description: 'Server-side rendering and static site generation for React apps.' },
      { name: 'Express.js', description: 'Framework for building robust APIs and web apps.' },
      { name: 'MySQL', description: 'Relational database management for structured data.' },
      { name: 'MongoDB', description: 'NoSQL database for scalable, high-performance data storage.' },
      { name: 'GraphQL', description: 'Query language and runtime for precise data fetching.' },
    ],
  },
  {
    title: 'Deployment',
    icon: <FaCloud className="w-8 h-8 text-blue-400" />,
    bgClass: 'bg-blue-500/20',
    textClass: 'from-blue-400 to-cyan-400',
    skills: [
      { name: 'Netlify', description: 'Static site hosting and serverless functions.' },
      { name: 'Heroku', description: 'Cloud platform for deploying and managing apps.' },
      { name: 'AWS EC2', description: 'Virtual servers for scalable cloud applications.' },
      { name: 'SiteGround', description: 'Managed WordPress hosting with advanced features.' },
      { name: 'Hostinger', description: 'Web hosting with integrated development tools.' },
      { name: 'GitHub Pages', description: 'Static site hosting directly from GitHub repositories.' },
      { name: 'Vercel', description: 'Frontend deployment and serverless functions platform.' },
    ],
  },
  {
    title: 'Design',
    icon: <FaPalette className="w-8 h-8 text-pink-400" />,
    bgClass: 'bg-pink-500/20',
    textClass: 'from-pink-400 to-rose-400',
    skills: [
      { name: 'Photoshop', description: 'Image editing and manipulation for web graphics.' },
      { name: 'Adobe XD', description: 'UX/UI prototyping and wireframing tools.' },
      { name: 'Figma', description: 'Collaborative design for modern web and mobile interfaces.' },
    ],
  },
]

export default function Skills() {
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
              Professional Skills
            </h2>
          </div>
          
          {/* Decorative separator */}
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="backdrop-blur-sm bg-white/[.02] border border-white/10 rounded-2xl p-4 sm:p-8">
        <div className={`space-y-8 stagger-fade-in ${isVisible ? 'visible' : ''}`}>
          {skillCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-400/20">
                  {category.icon}
                </div>
                <h3 className={`font-bold text-2xl bg-gradient-to-r ${category.textClass} bg-clip-text text-transparent`}>
                  {category.title}
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="group/skill relative backdrop-blur-sm bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-400/50 rounded-lg p-3 transition-all duration-300 cursor-pointer hover:z-50"
                  >
                    <span className=" font-medium text-gray-100 group-hover/skill:text-white transition-colors">
                      {skill.name}
                    </span>
                    <div className="opacity-0 group-hover/skill:opacity-100 absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-3 backdrop-blur-xl bg-slate-900/95 border border-indigo-400/20 text-xs text-gray-100 rounded-lg z-[100] pointer-events-none transition-opacity duration-300 shadow-xl">
                      {skill.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}