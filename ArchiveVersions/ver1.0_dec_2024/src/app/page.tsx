'use client'

import Header from '../components/Header'
import About from '../components/About'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Education from '../components/Education'
import Personality from '../components/Personality'
import Footer from '../components/Footer'
import { useTooltipTracking } from '../hooks/useTooltip'

export default function Home() {
  useTooltipTracking()

  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12">
        <About />
        <Experience />
        <Skills />
        <Education />
        <Personality />
      </main>
      <Footer />
    </>
  )
}