'use client'

import { ExperienceItem } from '../types'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const experiences: ExperienceItem[] = [
  {
    title: 'Web Developer, UX/UI Designer, Technical Consultant and SEO Specialist',
    company: 'TSA OUTDOORS, Brookvale NSW',
    period: 'Aug 2022 – Current',
    skills: [
      {
        title: 'Platform Architecture',
        description: 'Led end-to-end WordPress and WooCommerce development across six brand websites, including custom plugin development and a React-based LMS integrated with MySQL.',
        color: 'purple',
      },
      {
        title: 'Project & Stakeholder Management',
        description: 'Planned and tracked deliverables in Monday.com with sprint-based workflows; coordinated cross-functional updates via Microsoft Teams.',
        color: 'blue',
      },
      {
        title: 'UI/UX Design',
        description: 'Designed high-fidelity prototypes and responsive layouts in Figma, iterating on user feedback to improve navigation and conversion flows.',
        color: 'indigo',
      },
      {
        title: 'Performance Engineering',
        description: 'Achieved measurable page speed improvements through asset minification, server-side caching, lazy loading, and CDN integration across all brand sites.',
        color: 'pink',
      },
      {
        title: 'SEO & Content Visibility',
        description: 'Drove organic traffic growth through technical SEO audits, keyword strategies, and content optimisation using RankMath, Ahrefs, and SEMrush.',
        color: 'green',
      },
      {
        title: 'Systems Integration & APIs',
        description: 'Architected RESTful API integrations connecting WooCommerce with inventory, shipping, and third-party platforms to automate order and product sync workflows.',
        color: 'yellow',
      },
      {
        title: 'Technical Documentation',
        description: 'Authored internal documentation covering plugin architecture, API contracts, deployment procedures, and troubleshooting runbooks for the development team.',
        color: 'red',
      },
      {
        title: 'Asset & Media Standards',
        description: 'Established and enforced image optimisation guidelines covering format selection (WebP/AVIF), aspect ratios, and resolution standards to ensure consistent load performance.',
        color: 'teal',
      },
      {
        title: 'Client & Technical Liaison',
        description: 'Served as the primary technical point of contact for brand stakeholders, maintaining 90%+ satisfaction through proactive communication and rapid issue resolution.',
        color: 'orange',
      },
      {
        title: 'Analytics & Conversion Tracking',
        description: 'Configured GA4 properties, Google Tag Manager containers, and conversion events to measure campaign ROI and inform data-driven marketing decisions.',
        color: 'cyan',
      },
    ],
    projects: [
      { name: 'ZeroTech', url: 'https://zerotech.com.au' },
      { name: 'ZeroTech Optics', url: 'https://zerotechoptics.com' },
      { name: 'ZeroTech NZ', url: 'https://zerotech.co.nz' },
      { name: 'BushPig Shotguns', url: 'https://bushpigshotguns.com.au' },
      { name: 'ZeroTech Outdoors', url: 'https://zerotechoutdoors.com.au' },
      { name: 'SkyWatcher', url: 'https://skywatcher.com.au' },
      { name: 'Order Sync Automation' },
      { name: 'Product Sync Automation' },
      { name: 'Shipping Label Generator' },
      { name: 'Customised User Tier System' },
    ],
  },
  {
    title: 'Web Developer and IT Support',
    company: 'Caronlab, North Geelong VIC',
    period: 'Sep 2020 – Aug 2022',
    skills: [
      {
        title: 'Custom Theme Development',
        description: 'Built bespoke WordPress themes from scratch using PHP, JavaScript, and CSS, delivering fully responsive designs across seven multi-regional brand websites.',
        color: 'purple',
      },
      {
        title: 'PHP Template Engineering',
        description: 'Developed reusable WordPress PHP templates and custom post types with dynamic functionality powered by ACF, JavaScript, and WP REST API.',
        color: 'blue',
      },
      {
        title: 'Marketing Automation & Integrations',
        description: 'Integrated Yotpo reviews, Zapier automation workflows, and MailChimp email campaigns to streamline customer engagement and retention.',
        color: 'indigo',
      },
      {
        title: 'Infrastructure & DNS Management',
        description: 'Administered domain registrations, Cloudflare DNS, SSL certificates, and SiteGround hosting environments with proactive uptime monitoring.',
        color: 'pink',
      },
      {
        title: 'Migrations & Performance Tuning',
        description: 'Executed zero-downtime website migrations between hosting providers and reduced server memory consumption by 25% through code and query optimisation.',
        color: 'green',
      },
      {
        title: 'Payment Gateway Integration',
        description: 'Implemented PCI-compliant payment flows via Braintree and Stripe, including SSL configuration, tokenised checkout, and merchant API optimisation.',
        color: 'yellow',
      },
      {
        title: 'Technical SEO & Content Strategy',
        description: 'Defined and executed SEO strategies using RankMath and Yoast, covering schema markup, site structure, crawl optimisation, and keyword-driven content planning.',
        color: 'red',
      },
    ],
    projects: [
      { name: 'Waxxxpress US', url: 'https://us.waxxxpress.com' },
      { name: 'Waxxxpress UK', url: 'https://waxxxpress.co.uk' },
      { name: 'Ocean Road Australia', url: 'https://thisisoceanroad.com.au' },
      { name: 'Ocean Road USA', url: 'https://thisisoceanroad.com' },
      { name: 'Hydro 2 Oil', url: 'https://hydro2oil.com.au' },
      { name: 'Caronlab Australia', url: 'https://caronlab.com.au' },
      { name: 'Caronlab North America', url: 'https://caronlab.com' },
    ],
  },
  {
    title: 'Multimedia Developer (Contract / Remote)',
    company: 'TAFE Queensland, Southbank QLD',
    period: 'Aug 2022 – Dec 2022',
    skills: [
      {
        title: 'Stakeholder Collaboration',
        description: 'Partnered with subject-matter experts and educators to align multimedia deliverables with institutional learning outcomes and accessibility standards.',
        color: 'purple',
      },
      {
        title: 'Learning Experience Design',
        description: 'Scoped and storyboarded interactive course modules, advising on content structure, platform constraints, and learner engagement strategies.',
        color: 'blue',
      },
      {
        title: 'Multimedia Production',
        description: 'Produced video, animation, and rich-media assets for blended and fully online course delivery using Adobe Creative Suite and After Effects.',
        color: 'indigo',
      },
      {
        title: 'UI/UX for Education',
        description: 'Designed intuitive, WCAG-compliant interfaces for online learning platforms, prioritising clarity, navigation consistency, and mobile responsiveness.',
        color: 'pink',
      },
      {
        title: 'Interactive Web Development',
        description: 'Built interactive learning resources with HTML, CSS, and JavaScript, including quizzes, drag-and-drop activities, and progress-tracked modules.',
        color: 'green',
      },
      {
        title: 'QA & Usability Testing',
        description: 'Conducted cross-browser and cross-device usability testing, ensuring compliance with WCAG guidelines, institutional style guides, and LMS compatibility.',
        color: 'yellow',
      },
    ],
  },
  {
    title: 'Graduate Frontend Developer (Full-time)',
    company: 'Beijing HiRain Technologies Co., Ltd., China',
    period: 'Feb – Aug 2020',
    skills: [
      {
        title: 'React UI Engineering',
        description: 'Developed production-ready UI features for a multithreaded automotive diagnostics platform using React, Ant Design, and Node.js with RESTful API consumption.',
        color: 'purple',
      },
      {
        title: 'Performance & Debugging',
        description: 'Profiled and optimised React component rendering, resolved layout regressions, and reduced unnecessary re-renders in complex data-driven dashboards.',
        color: 'blue',
      },
      {
        title: 'Agile & Cross-Team Collaboration',
        description: 'Participated in sprint planning, daily stand-ups, and retrospectives within a cross-functional team; completed an Agile Project Management seminar led by senior leadership.',
        color: 'indigo',
      },
    ],
  },
]

export default function Experience() {
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
              Experience
            </h2>
          </div>
          
          {/* Decorative separator */}
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Experience Timeline */}
      <div className={`space-y-12 stagger-fade-in ${isVisible ? 'visible' : ''}`}>
        {experiences.map((exp, index) => (
          <div key={index} className="backdrop-blur-sm bg-white/[.02] border border-white/10 rounded-2xl p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-indigo-300">{exp.title}</h3>
              <p className="text-gray-300 mt-1 sm:mt-0">{exp.period}</p>
            </div>
            <p className="text-indigo-200 font-medium mb-4">{exp.company}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 mb-6">
              {exp.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="relative backdrop-blur-sm bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-400/50 rounded-lg p-3 transition-all duration-300 group/skill cursor-pointer hover:z-50 min-h-[60px] flex items-center justify-center"
                  >
                    <h4 className="text-base font-medium text-gray-300 group-hover/skill:text-white text-center transition-colors">
                      {skill.title}
                    </h4>
                  <div className="opacity-0 group-hover/skill:opacity-100 absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 sm:w-64 p-2 sm:p-3 backdrop-blur-xl bg-slate-900/95 border border-indigo-400/20  text-gray-300 rounded-lg z-[100] pointer-events-none transition-opacity duration-300 shadow-xl">
                    {skill.description}
                  </div>
                </div>
              ))}
            </div>

            {exp.projects && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-base font-bold text-white mb-4 flex items-center">

                  Projects
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                  {exp.projects.map((project) =>
                    project.url ? (
                      <a
                        key={project.name}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group backdrop-blur-sm bg-indigo-500/5 hover:bg-indigo-500/15 border border-indigo-400/20 hover:border-indigo-400/50 rounded-lg px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 min-h-[60px] flex items-center justify-between gap-2"
                      >
                        <span className="font-medium text-gray-300 group-hover:text-white transition-colors leading-snug break-words">
                          {project.name}
                        </span>
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400 group-hover:text-indigo-300 transition-all group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <div
                        key={project.name}
                        className="backdrop-blur-sm bg-emerald-500/5 border border-emerald-400/20 rounded-lg px-3 py-3 min-h-[60px] flex items-center justify-between gap-2"
                      >
                        <span className="font-medium text-gray-300 leading-snug break-words">
                          {project.name}
                        </span>
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}