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
    title: 'Frontend Development',
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
    title: 'UI/UX Design',
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
    title: 'API Integration',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    title: 'Autoflow',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: 'SEO Optimisation',
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
    <header className="relative overflow-hidden min-h-screen flex flex-col">
      <div className="relative container mx-auto px-6 py-16 sm:py-20 text-center flex-1 flex flex-col justify-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight fade-in">
          Jerry Li
        </h1>
        <div className="w-16 h-1 bg-indigo-500 mx-auto mb-6"></div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 fade-in">
          {roles.map((role, index) => (
            <div
              key={index}
              className={`
              p-3 sm:p-4 rounded-xl text-center transition-all duration-300 
              backdrop-blur-sm bg-white/[.02] border border-white/10 shadow-lg 
              hover:bg-white/20 hover:border-white/30 hover:shadow-indigo-500/20
              animate-scaleIn
            `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {role.icon}
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {role.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <span className="px-5 py-2 backdrop-blur-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-sm font-medium fade-in-delay-1">
            Available for Work
          </span>
          <span className="px-5 py-2 backdrop-blur-sm bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium fade-in-delay-1">
            Open to Collaboration
          </span>
        </div>

        <p className="text-gray-300 mb-4 fade-in-delay-2">
          Canberra, Australia
        </p>

        <div className="flex items-center justify-center space-x-4 sm:space-x-5 fade-in-delay-3">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-gray-300 hover:text-indigo-300 transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6">
                {link.icon}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="relative bottom-4 pb-4 fade-in-delay-3">
        <div className="flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '2s' }}>
          <span className="text-gray-300 text-base font-medium" style={{ fontFamily: 'var(--font-schoolbell), cursive' }}>Scroll Down</span>
          <svg 
            className="w-8 h-8 text-indigo-400" 
            viewBox="-25 0 98 98" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.3411 74.1924C18.3411 72.0809 18.3411 69.7582 18.3411 67.6467C18.5525 49.0651 18.9754 30.2725 19.1869 11.6909C19.1869 9.57939 19.1869 7.679 19.3984 5.56747C19.6098 2.82247 20.2442 -0.555987 23.8389 0.0774737C25.3191 0.288627 27.0108 3.45593 27.2222 5.35632C28.0681 20.9817 28.7024 36.3959 29.3368 52.0213C29.5483 55.6109 29.3368 59.2005 31.2399 63.0013C33.7774 58.7782 35.892 54.344 38.6409 50.332C39.9096 48.4317 43.0815 46.3201 44.9846 46.7424C48.7908 47.5871 48.3679 51.8101 47.0992 54.344C41.6013 67.0132 36.1034 79.8936 29.5483 92.1405C25.3191 99.9532 18.9754 99.9532 14.7463 92.1405C9.03698 81.7939 4.80785 70.6028 0.155803 59.834C-0.478567 58.567 1.00163 56.4555 1.42454 54.7663C3.11619 55.3997 5.65367 55.3997 6.4995 56.6667C8.61407 59.2005 9.88281 62.579 11.5745 65.5351C13.2661 68.7024 14.9578 71.8697 16.6494 74.8259C17.0723 74.4036 17.7067 74.1924 18.3411 74.1924Z" />
          </svg>
        </div>
      </div>
    </header>
  )
}