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
import EducationSlide from '../components/slides/EducationSlide'
import PersonalitySlide from '../components/slides/PersonalitySlide'
import ContactSlide from '../components/slides/ContactSlide'
import { useLayout } from '../hooks/useLayout'

export default function Home() {
  const { phone, short } = useLayout()

  // How much fits on one page: phones list everything, just spread over more sideways frames.
  const highlightsPerPage = phone ? (short ? 3 : 4) : 6
  const skillBudget = phone ? (short ? 18 : 26) : 60
  const skillCategoriesPerPage = phone ? (short ? 2 : 3) : 6
  const buildsPerPage = phone ? (short ? 1 : 2) : 3

  const slides: Slide[] = useMemo(() => {
    const expFrames = buildExperienceFrames(highlightsPerPage)
    const skillFrames = buildSkillFrames(skillBudget, skillCategoriesPerPage)
    const workLabels = workFrameLabels(buildsPerPage)
    return [
      { id: 'home', label: 'Home', content: <HeroSlide />, bare: true },
      {
        id: 'about',
        label: 'About',
        content: <AboutSlide split={phone} />,
        bare: true,
        steps: phone ? ABOUT_PHONE_FRAMES.length : 1,
        stepLabels: phone ? ABOUT_PHONE_FRAMES : undefined,
      },
      {
        id: 'experience',
        label: 'Experience',
        content: <ExperienceSlide perPage={highlightsPerPage} />,
        bare: true,
        steps: expFrames.length,
        stepLabels: expFrames.map((f) => (f.kind === 'overview' ? f.job.company : `${f.job.company} ${f.page}/${f.pages}`)),
        menu: experienceGroups(expFrames).map((g) => ({ label: g.label, step: g.start })),
      },
      {
        id: 'work',
        label: 'Projects',
        content: <WorkSlide perPage={buildsPerPage} />,
        bare: true,
        steps: workLabels.length,
        stepLabels: workLabels,
        menu: [
          { label: 'Featured builds', step: 0 },
          { label: 'Client websites', step: workLabels.length - 1 },
        ],
      },
      {
        id: 'skills',
        label: 'Skills',
        content: <SkillsSlide budget={skillBudget} maxCategories={skillCategoriesPerPage} />,
        bare: true,
        steps: skillFrames.length,
        stepLabels: skillFrames.map((_, i) => `${i + 1}/${skillFrames.length}`),
      },
      { id: 'education', label: 'Education', content: <EducationSlide /> },
      { id: 'personality', label: 'Personality', content: <PersonalitySlide /> },
      { id: 'contact', label: 'Contact', content: <ContactSlide />, bare: true },
    ]
  }, [phone, highlightsPerPage, skillBudget, skillCategoriesPerPage, buildsPerPage])

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
