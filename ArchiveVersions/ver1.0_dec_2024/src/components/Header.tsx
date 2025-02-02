import { SocialLink } from '../types'
import { FaGithub } from 'react-icons/fa'
import { FaCodepen } from 'react-icons/fa'

const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/l1jer',
    icon: <FaGithub className="w-6 h-6" />,
  },
  {
    platform: 'CodePen',
    url: 'https://codepen.io/jerrylidotme',
    icon: <FaCodepen className="w-6 h-6" />,
  },
]

const roles = [
  {
    title: 'Frontend Developer',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    ),
  },
  {
    title: 'UI/UX Designer',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    ),
  },
  {
    title: 'SEO Specialist',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    ),
  },
  {
    title: 'Technical Consultant',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
]

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-center py-12">
      <h1 className="text-5xl font-extrabold text-white fade-in">Jerry Li</h1>
      <div className="flex flex-col items-center justify-center mt-4 fade-in">
        <div className="py-6 px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8 text-indigo-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {role.icon}
              </svg>
              <span className="text-md font-medium text-gray-300 text-center">
                {role.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-20 h-1 bg-indigo-500 rounded-full mb-8"></div>
        <div className="flex gap-4">
          <span className="px-4 py-2 bg-indigo-600/30 rounded-full text-sm font-medium text-indigo-300 border border-indigo-500/30">
            Available for Work
          </span>
          <span className="px-4 py-2 bg-purple-600/30 rounded-full text-sm font-medium text-purple-300 border border-purple-500/30">
            Open to Collaboration
          </span>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-200">
          Canberra, Australia
        </p>
        <div className="mt-2 flex items-center justify-center space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-indigo-300 hover:text-indigo-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}