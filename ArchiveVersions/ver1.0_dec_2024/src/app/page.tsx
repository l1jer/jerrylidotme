'use client'

import { useMemo } from 'react'
import Universe from '../components/Universe'
import UniverseBackground from '../components/UniverseBackground'
import UniverseSoundControl from '../components/UniverseSoundControl'
import FullPage, { Slide } from '../components/FullPage'
import HeroSlide from '../components/slides/HeroSlide'
import AboutSlide, { ABOUT_PHONE_FRAMES } from '../components/slides/AboutSlide'
import WorkSlide, { workFrameLabels } from '../components/slides/WorkSlide'
import ExperienceSlide, { buildExperienceFrames, experienceGroups } from '../components/slides/ExperienceSlide'
import SkillsSlide, { buildSkillFrames } from '../components/slides/SkillsSlide'
import BackgroundSlide, { BACKGROUND_PHONE_FRAMES } from '../components/slides/BackgroundSlide'
import ContactSlide from '../components/slides/ContactSlide'
import { useLayout } from '../hooks/useLayout'
import { experiences, skillCategories } from '../data/portfolio'
import { FiBookOpen, FiBriefcase, FiGrid, FiHome, FiLayers, FiSend, FiUser } from 'react-icons/fi'

export default function Home() {
  const { phone, short, wide, roomy } = useLayout()

  // How much fits on one page. Phones list everything too, just spread over more sideways frames.
  const cardsPerPage = phone ? (short ? 3 : roomy ? 5 : 4) : wide && roomy && !short ? 8 : 6
  const skillBudget = phone ? (short ? 18 : roomy ? 32 : 26) : 60
  const skillCategoriesPerPage = phone ? (short ? 2 : roomy ? 4 : 3) : 6
  const featuredPerPage = phone ? (short ? 1 : 2) : 4

  const slides: Slide[] = useMemo(() => {
    // Job details sit beside the cards only when there is room for two columns.
    const expFrames = buildExperienceFrames(cardsPerPage, !wide)
    const skillFrames = buildSkillFrames(skillBudget, skillCategoriesPerPage)
    const workLabels = workFrameLabels(featuredPerPage)
    const years = `${experiences[experiences.length - 1].period.match(/\d{4}/)?.[0]} – now`
    return [
      { id: 'home', label: 'Home', icon: FiHome, description: 'Who I am and what I do', content: <HeroSlide />, bare: true },
      {
        id: 'about',
        label: 'About',
        icon: FiUser,
        description: 'eCommerce · marketing · SEO/GEO/AEO',
        content: <AboutSlide split={phone} />,
        bare: true,
        steps: phone ? ABOUT_PHONE_FRAMES.length : 1,
      },
      {
        id: 'experience',
        label: 'Experience',
        icon: FiBriefcase,
        description: `${experiences.length} roles · ${years}`,
        content: <ExperienceSlide perPage={cardsPerPage} separateIntro={!wide} />,
        bare: true,
        steps: expFrames.length,
        menu: experienceGroups(expFrames).map((g) => ({ label: g.label, step: g.start, end: g.start + g.count })),
      },
      {
        id: 'work',
        label: 'Projects',
        icon: FiLayers,
        description: 'Shopify builds and client sites',
        content: <WorkSlide perPage={featuredPerPage} />,
        bare: true,
        steps: workLabels.length,
        menu: [
          { label: 'Featured builds', step: 0, end: workLabels.length - 1 },
          { label: 'Client websites', step: workLabels.length - 1 },
        ],
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: FiGrid,
        description: `${skillCategories.length} toolkits, from AI to SEO`,
        content: <SkillsSlide budget={skillBudget} maxCategories={skillCategoriesPerPage} />,
        bare: true,
        steps: skillFrames.length,
      },
      {
        id: 'background',
        label: 'Background',
        icon: FiBookOpen,
        description: 'Education and how I work',
        content: <BackgroundSlide split={phone} />,
        bare: true,
        steps: phone ? BACKGROUND_PHONE_FRAMES.length : 1,
      },
      { id: 'contact', label: 'Contact', icon: FiSend, description: 'Send me a message', content: <ContactSlide />, bare: true },
    ]
  }, [phone, wide, cardsPerPage, skillBudget, skillCategoriesPerPage, featuredPerPage])

  return (
    <div className="h-[100dvh] overflow-hidden relative">
      {/* Animated universe background colour - cycles through day/night */}
      <UniverseBackground />

      {/* Multi-layer starfield for 3D depth; warps on every page change */}
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
