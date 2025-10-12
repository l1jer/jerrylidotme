'use client'

import { useEffect } from 'react'
import Universe from '../components/Universe'
import UniverseBackground from '../components/UniverseBackground'
import Header from '../components/Header'
import About from '../components/About'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Education from '../components/Education'
import Personality from '../components/Personality'
import Footer from '../components/Footer'
import { useTooltipTracking } from '../hooks/useTooltip'
import ScrollToTopButton from '../components/ScrollToTopButton'
import UniverseSoundControl from '../components/UniverseSoundControl'

export default function Home() {
  useTooltipTracking()

    useEffect(() => {
      // no-op: Universe canvas handles its own animation
    }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Animated universe background colour - cycles through day/night */}
      <UniverseBackground />
      
      {/* Multi-layer starfield for enhanced 3D depth */}
      {/* Far background - smallest, slowest, dimmest */}
      <Universe layer="far" />
      
      {/* Mid background - medium size and speed */}
      <Universe layer="mid" />
      
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
        <UniverseSoundControl />
      </div>

      {/* Near foreground - larger, faster, brighter */}
      <Universe layer="near" />
      
      {/* Closest foreground - largest stars, fastest movement, dramatic parallax */}
      <Universe layer="closest" />
    </div>
  )
}