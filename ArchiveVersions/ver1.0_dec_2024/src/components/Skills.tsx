'use client'

import { FaCode, FaDatabase, FaCloud, FaPalette } from 'react-icons/fa'

const skillCategories = [
  {
    title: 'Frontend',
    icon: <FaCode className="w-8 h-8 text-indigo-400" />,
    bgClass: 'bg-indigo-500/20',
    textClass: 'from-indigo-400 to-purple-400',
    skills: [
      { name: 'HTML5', description: 'Semantic structure for accessible and SEO-optimized web pages.' },
      { name: 'CSS3', description: 'Responsive layouts, animations, and visual styling.' },
      { name: 'JavaScript', description: 'Interactive functionality and client-side logic for web apps.' },
      { name: 'React', description: 'Component-based architecture for dynamic and scalable UIs.' },
      { name: 'Redux', description: 'State management for complex frontend applications.' },
      { name: 'Tailwind', description: 'Utility-first CSS framework for rapid UI development.' },
    ],
  },
  {
    title: 'Backend',
    icon: <FaDatabase className="w-8 h-8 text-purple-400" />,
    bgClass: 'bg-purple-500/20',
    textClass: 'from-purple-400 to-pink-400',
    skills: [
      { name: 'Node.js', description: 'Asynchronous server-side programming for scalable apps.' },
      { name: 'Next.js', description: 'Server-side rendering and static site generation for React apps.' },
      { name: 'Express.js', description: 'Framework for building robust APIs and web apps.' },
      { name: 'MySQL', description: 'Relational database management for structured data.' },
      { name: 'MongoDB', description: 'NoSQL database for scalable, high-performance data storage.' },
      { name: 'GraphQL', description: 'Query language and runtime for precise data fetching.' },
    ],
  },
  {
    title: 'Deployment',
    icon: <FaCloud className="w-8 h-8 text-blue-400" />,
    bgClass: 'bg-blue-500/20',
    textClass: 'from-blue-400 to-cyan-400',
    skills: [
      { name: 'Netlify', description: 'Static site hosting and serverless functions.' },
      { name: 'Heroku', description: 'Cloud platform for deploying and managing apps.' },
      { name: 'AWS EC2', description: 'Virtual servers for scalable cloud applications.' },
      { name: 'SiteGround', description: 'Managed WordPress hosting with advanced features.' },
      { name: 'Hostinger', description: 'Web hosting with integrated development tools.' },
      { name: 'GitHub Pages', description: 'Static site hosting directly from GitHub repositories.' },
      { name: 'Vercel', description: 'Frontend deployment and serverless functions platform.' },
    ],
  },
  {
    title: 'Design',
    icon: <FaPalette className="w-8 h-8 text-pink-400" />,
    bgClass: 'bg-pink-500/20',
    textClass: 'from-pink-400 to-rose-400',
    skills: [
      { name: 'Photoshop', description: 'Image editing and manipulation for web graphics.' },
      { name: 'Adobe XD', description: 'UX/UI prototyping and wireframing tools.' },
      { name: 'Figma', description: 'Collaborative design for modern web and mobile interfaces.' },
    ],
  },
]

export default function Skills() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-8 text-indigo-400 text-center">
        Professional Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-3 ${category.bgClass} rounded-lg`}>
                {category.icon}
              </div>
              <h3
                className={`font-bold text-xl bg-gradient-to-r ${category.textClass} bg-clip-text text-transparent`}
              >
                {category.title}
              </h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all group relative"
                >
                  <span className="text-gray-300">{skill.name}</span>
                  <div className="invisible group-hover:visible absolute z-10 p-2 bg-gray-900 text-xs rounded text-gray-300 pointer-events-none">
                    {skill.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}