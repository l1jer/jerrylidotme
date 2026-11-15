'use client'

import Universe from '../components/Universe'
import UniverseBackground from '../components/UniverseBackground'
import Header from '../components/Header'
import About from '../components/About'
import Experience, { experiences } from '../components/Experience'
import Skills from '../components/Skills'
import Education from '../components/Education'
import Personality from '../components/Personality'
import Footer from '../components/Footer'
import FullPage, { Slide } from '../components/FullPage'
import { useTooltipTracking } from '../hooks/useTooltip'
import UniverseSoundControl from '../components/UniverseSoundControl'

const slides: Slide[] = [
  { id: 'home', label: 'Home', content: <Header />, bare: true },
  { id: 'about', label: 'About Me', content: <About /> },
  ...experiences.map((exp, index) => ({
    id: `experience-${index + 1}`,
    label: `Experience · ${exp.company.split(',')[0]}`,
    content: <Experience exp={exp} index={index} />,
  })),
  { id: 'skills', label: 'Professional Skills', content: <Skills /> },
  { id: 'education', label: 'Educational Journey', content: <Education /> },
  {
    id: 'personality',
    label: 'Personality',
    content: (
      <>
        <Personality />
        <div className="mt-12">
          <Footer />
        </div>
      </>
    ),
  },
]

export default function Home() {
  useTooltipTracking()

  return (
    <div className="h-[100dvh] overflow-hidden relative">
      {/* Animated universe background colour - cycles through day/night */}
      <UniverseBackground />

      {/* Multi-layer starfield for enhanced 3D depth */}
      <Universe layer="far" />
      <Universe layer="mid" />

      <div className="relative z-10">
        <FullPage slides={slides} />
        <UniverseSoundControl />
      </div>

      {/* Foreground star layers */}
      <Universe layer="near" />
      <Universe layer="closest" />
    </div>
  )
}
