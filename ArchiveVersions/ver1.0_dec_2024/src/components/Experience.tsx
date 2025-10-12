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
        title: 'Website Development',
        description: 'Led WordPress platform development with custom plugins and React LMS integration with MySQL database.',
        color: 'purple',
      },
      {
        title: 'Project Planning',
        description: 'Created detailed project documentation using Microsoft Teams and Monday.com.',
        color: 'blue',
      },
      {
        title: 'UI/UX Design',
        description: 'Produced comprehensive designs in Figma focusing on user-friendly interfaces.',
        color: 'indigo',
      },
      {
        title: 'Website Optimisation',
        description: 'Implemented advanced optimization techniques including minification, caching and CDN integration.',
        color: 'pink',
      },
      {
        title: 'SEO Optimisation',
        description: 'Conducted SEO analysis using RankMath, Ahrefs and SEMrush to drive traffic growth.',
        color: 'green',
      },
      {
        title: 'API Integration',
        description: 'Implemented RESTful APIs connecting WordPress, WooCommerce and external systems.',
        color: 'yellow',
      },
      {
        title: 'Documentation',
        description: 'Created comprehensive documentation for websites, plugins, APIs and workflows.',
        color: 'red',
      },
      {
        title: 'Graphics Optimisation',
        description: 'Maintained strict image standards for aspect ratios, sizes and resolutions.',
        color: 'teal',
      },
      {
        title: 'Technical Liaison',
        description: 'Maintained 90%+ client satisfaction as primary technical support contact.',
        color: 'orange',
      },
      {
        title: 'Web Analytics',
        description: 'Utilized GA4, GTM and conversion tracking for campaign optimization.',
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
    ],
  },
  {
    title: 'Web Developer and IT Support',
    company: 'Caronlab, North Geelong VIC',
    period: 'Sep 2020 – Aug 2022',
    skills: [
      {
        title: 'Custom WordPress Development',
        description: 'Designed and executed custom WordPress sites with JavaScript and CSS for responsive designs.',
        color: 'purple',
      },
      {
        title: 'Template and Functionality Creation',
        description: 'Developed WordPress PHP templates and dynamic functionalities using JavaScript and PHP.',
        color: 'blue',
      },
      {
        title: 'System and Tool Integration',
        description: 'Integrated systems like Yotpo and tools like Zapier, linking with platforms such as MailChimp.',
        color: 'indigo',
      },
      {
        title: 'Domain & DNS Management',
        description: 'Managed domain registration and DNS via Cloudflare; hosted on SiteGround with troubleshooting support.',
        color: 'pink',
      },
      {
        title: 'Website Migrations & Performance',
        description: 'Executed website migrations and optimized performance, reducing memory consumption by 25%.',
        color: 'green',
      },
      {
        title: 'Secure Payment Integration',
        description: 'Integrated secure payment systems like Braintree, set up SSL configurations, and optimized merchant APIs.',
        color: 'yellow',
      },
      {
        title: 'SEO Strategy & Implementation',
        description: 'Led SEO strategies using tools like RankMath and YoastSEO, enhancing technical SEO and web content.',
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
        title: 'Cultural Transformation',
        description: 'Contributed to transformation and cultural change by promoting established values of Commerciality, Teamwork, Innovation, and Accountability.',
        color: 'purple',
      },
      {
        title: 'Educational Content Design',
        description: 'Scoped concepts, advising on design options and software parameters for online educational content development.',
        color: 'blue',
      },
      {
        title: 'Multimedia Implementation',
        description: 'Designed and implemented multimedia content for blended and online educational delivery.',
        color: 'indigo',
      },
      {
        title: 'UI/UX Design',
        description: 'Created visually appealing, user-friendly interfaces demonstrating contemporary design practices.',
        color: 'pink',
      },
      {
        title: 'Interactive Development',
        description: 'Developed interactive learning resources using Adobe Creative Suite®, HTML, CSS, and JavaScript.',
        color: 'green',
      },
      {
        title: 'Quality Assurance',
        description: 'Conducted usability testing, ensuring adherence to web standards, style guides, and quality assurance practices.',
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
        title: 'UI Development',
        description: 'Developed new UI functionality for multithreaded user-facing applications using React, Ant Design UI, Node.js, and RESTful APIs.',
        color: 'purple',
      },
      {
        title: 'Performance Optimization',
        description: 'Optimized components for maximum performance in development tools, debugging and fixing layout issues.',
        color: 'blue',
      },
      {
        title: 'Agile Training',
        description: 'Completed Agile Project Management Seminar hosted by senior project managers and co-founders.',
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
                  {exp.projects.map((project) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}