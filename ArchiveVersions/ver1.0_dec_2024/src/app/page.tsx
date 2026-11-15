'use client'

import Universe from '../components/Universe'
import UniverseBackground from '../components/UniverseBackground'
import UniverseSoundControl from '../components/UniverseSoundControl'
import FullPage, { Slide } from '../components/FullPage'
import HeroSlide from '../components/slides/HeroSlide'
import AboutSlide from '../components/slides/AboutSlide'
import WorkSlide from '../components/slides/WorkSlide'
import ExperienceSlide from '../components/slides/ExperienceSlide'
import SkillsSlide from '../components/slides/SkillsSlide'
import EducationSlide from '../components/slides/EducationSlide'
import PersonalitySlide from '../components/slides/PersonalitySlide'
import ContactSlide from '../components/slides/ContactSlide'
import { experiences } from '../data/portfolio'

const slides: Slide[] = [
  { id: 'home', label: 'Home', content: <HeroSlide />, bare: true },
  { id: 'about', label: 'About', content: <AboutSlide /> },
  ...experiences.map((exp, index) => ({
    id: `experience-${index + 1}`,
    label: `Experience · ${exp.company.slice(0, exp.company.lastIndexOf(',')) || exp.company}`,
    content: <ExperienceSlide exp={exp} index={index} />,
  })),
  { id: 'work', label: 'Freelance', content: <WorkSlide /> },
  { id: 'skills', label: 'Skills', content: <SkillsSlide /> },
  { id: 'education', label: 'Education', content: <EducationSlide /> },
  { id: 'personality', label: 'Personality', content: <PersonalitySlide /> },
  { id: 'contact', label: 'Contact', content: <ContactSlide />, bare: true },
]

export default function Home() {
  return (
    <div className="h-[100dvh] overflow-hidden relative">
      {/* Animated universe background colour - cycles through day/night */}
      <UniverseBackground />

      {/* Multi-layer starfield for 3D depth; warps on every slide change */}
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
