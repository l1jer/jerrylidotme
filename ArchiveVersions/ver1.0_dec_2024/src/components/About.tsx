'use client'

import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface Project {
  name: string;
  url: string;
}

const freelanceProjects: Project[] = [
  { name: 'Fly Wing USA', url: 'https://flywingusa.com' },
  { name: 'SJD Phone Repair', url: 'https://www.sjdtech.com.au/' },
  { name: 'Ginger and Spice', url: 'https://gingerandspice.com.au' },
  { name: '926 Trades', url: 'https://926-trades.com' },
  { name: 'SJD Auto', url: 'https://sjdauto.com.au' },
  { name: 'Bashan', url: 'https://bashan.com.au' },
  { name: 'Dumpling Social', url: 'https://dumplingsocial.com.au' },
]

export default function About() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className={`mb-12 sm:mb-16 relative overflow-visible scroll-fade-in ${isVisible ? 'visible' : ''}`}>
      {/* Animated background gradient orbs */}
      <div className="absolute -top-10 sm:-top-20 -left-10 sm:-left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 sm:-bottom-20 -right-10 sm:-right-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative">
        <div className="relative mb-8 sm:mb-12">
          <div className="text-center">
            <div className="inline-block relative">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse"></div>
              
              {/* Title */}
              <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 px-4">
                About Me
              </h2>
            </div>
            
            {/* Decorative separator */}
            <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/[.02] border border-white/10 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-8 p-4 md:p-12">
            {/* Profile Image Section - Stunning Design */}
            <div className="lg:col-span-1 flex items-start justify-center">
              <div className="relative group w-full max-w-sm">
                {/* Animated rings */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 rounded-2xl opacity-55 group-hover:opacity-100 blur-xl transition-all duration-500 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
                
                {/* Image container */}
                <div className="relative overflow-hidden rounded-2xl group-hover:border-white/20 transition-all duration-500 bg-transparent">
                  <img
                    src="/jerry-li-sketch-2025.webp"
                    alt="Jerry Li Portrait"
                    className="w-full h-auto object-cover  transition-transform duration-700"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-6 py-2 shadow-2xl">
                  <p className="text-sm font-bold text-white whitespace-nowrap">5+ Years Experience</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Highlighted intro card */}
              <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-400/30 rounded-2xl p-5 sm:p-4 hover:border-indigo-400/50 transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Frontend & Web Development Expert</h3>
                    <p className="text-gray-300 leading-relaxed text-base">
                      As a seasoned Frontend Developer with over five years of experience, I specialise in building and optimising high-performance WordPress/Shopify websites (e-commerce & non-e-commerce) and crafting dynamic applications using React. My expertise extends to strategic SEO analysis, enhancing content visibility, and integrating RESTful APIs to streamline functionality and support robust digital strategies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Two column feature cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-purple-400/50 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1">
                  {/* Row 1: Icon + Title */}
                  <div className="grid grid-cols-[auto_1fr] gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-white self-center">UI/UX Excellence</h4>
                  </div>
                  
                  {/* Row 2: Empty + Description */}
                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <div className="w-10"></div>
                    <p className="text-gray-300 leading-relaxed">
                      I excel in designing engaging user interfaces that prioritise usability and aesthetic appeal, collaborating seamlessly with creative teams to transform concepts into user-centric digital solutions.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-pink-400/50 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1">
                  {/* Row 1: Icon + Title */}
                  <div className="grid grid-cols-[auto_1fr] gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-white self-center">Full-Stack Capability</h4>
                  </div>
                  
                  {/* Row 2: Empty + Description */}
                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <div className="w-10"></div>
                    <p className="text-gray-300 leading-relaxed">
                      Beyond frontend development, my foundational skills in full-stack development allow me to tackle complex backend challenges effectively, positioning me as a versatile contributor to any tech team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Freelance Projects Section - Enhanced */}
              <div className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-4 mt-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Freelance Portfolio</h3>
                  </div>
                </div>
                
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 stagger-fade-in ${isVisible ? 'visible' : ''}`}>
                          {freelanceProjects.map((project, index) => (
                          <a
                            key={project.name}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group backdrop-blur-sm bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-400/50 rounded-xl px-4 py-3.5 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 min-h-[60px] flex items-center justify-between gap-2 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <span className="font-semibold text-gray-100 group-hover:text-white transition-colors leading-snug break-words">
                              {project.name}
                            </span>
                            <svg className="w-4 h-4 flex-shrink-0 text-indigo-400 group-hover:text-indigo-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}