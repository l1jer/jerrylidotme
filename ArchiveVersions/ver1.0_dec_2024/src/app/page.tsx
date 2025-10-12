'use client'

import { useEffect } from 'react'
import Universe from '../components/Universe'
import Header from '../components/Header'
import About from '../components/About'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Education from '../components/Education'
import Personality from '../components/Personality'
import Footer from '../components/Footer'
import { useTooltipTracking } from '../hooks/useTooltip'
import ScrollToTopButton from '../components/ScrollToTopButton'

export default function Home() {
  useTooltipTracking()

    useEffect(() => {
      // no-op: Universe canvas handles its own animation
    }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Interactive starfield canvas */}
      <Universe />
      
      {/* Radial gradient overlays matching the provided design */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at top right, rgba(121, 68, 154, 0.13), transparent),
            radial-gradient(circle at 20% 80%, rgba(41, 196, 255, 0.13), transparent)
          `
        }}
      ></div>
      
      <div className="relative z-10">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-7xl">
          <About />
          <Experience />
          <Skills />
          <Education />
          <Personality />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </div>
  )
}