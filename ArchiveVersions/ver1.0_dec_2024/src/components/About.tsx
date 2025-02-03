import Image from 'next/image';

interface Project {
  name: string;
  url: string;
}

const freelanceProjects: Project[] = [
  { name: 'Ginger&Spice', url: 'https://gingerandspice.com.au' },
  { name: '926 Trades', url: 'https://926-trades.com' },
  { name: 'SJD Phone Repair', url: 'https://sjdphonerepaire.vercel.app/' },
  { name: 'Gateway Innovation', url: 'https://gatewaybuy.com' },
  { name: 'SJD Auto', url: 'https://sjdauto.com.au' },

  { name: 'Bashan', url: 'https://bashan.com.au' },
  { name: 'Dumpling Social', url: 'https://dumplingsocial.com.au' },
]

export default function About() {
  return (
    <section className="mb-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-3xl"></div>
      <div className="relative p-4 sm:p-8">
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-center">
          About Me
        </h2>
        <div className="p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex flex-col xl:flex-row items-center gap-8">
            <div className="w-3/4 max-sm:w-4/5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
              <div className="relative">
                <Image
                  src="https://jerryli.me/jerry-li-sketch-2024.webp"
                  alt="Jerry Li Sketch"
                  className="rounded-xl shadow-xl transition duration-500"
                />
              </div>
            </div>
            <div className="w-full max-md:w-auto px-2 sm:px-6 max-md:text-md">
              <p className="text-gray-300 leading-relaxed animate-fadeIn">
                As a seasoned Frontend Developer with over five years of experience,
                I specialize in building and optimizing high-performance
                WordPress/Shopify websites(e-commerce & non-e-commerce) and crafting
                dynamic applications using React. My expertise extends to strategic
                SEO analysis, enhancing content visibility, and integrating RESTful
                APIs to streamline functionality and support robust digital
                strategies.
              </p>
              <br />
              <p className="text-gray-300 leading-relaxed animate-fadeIn">
                I excel in designing engaging user interfaces that prioritize
                usability and aesthetic appeal, collaborating seamlessly with
                creative teams to transform concepts into user-centric digital
                solutions. My proficiency with advanced web analytics tools enables
                me to provide actionable insights, enhancing both the development
                process and end-user experience.
              </p>
              <br />
              <p className="text-gray-300 leading-relaxed animate-fadeIn">
                Beyond my frontend development role, my foundational skills in
                full-stack development allow me to tackle complex backend
                challenges effectively, positioning me as a versatile contributor to
                any tech team. Committed to professional growth, I actively engage
                in continuous learning and contribute to coding communities,
                staying ahead of industry trends and technological advancements.
              </p>
              <br />
              <div className="text-sm projects-list">
                <span className="mx-2">Freelance Projects: </span>
                {freelanceProjects.map((project, index) => (
                  <div key={project.name} className="inline">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-indigo-400"
                    >
                      {project.name}
                    </a>
                    {index < freelanceProjects.length - 1 && (
                      <span className="mx-2">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}