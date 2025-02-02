import { ExperienceItem } from '../types'

const experiences: ExperienceItem[] = [
  {
    title: 'Web Developer, UX/UI Designer, Technical Consultant and SEO Specialist',
    company: 'Tasco Sales Australia, Brookvale NSW',
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
      { name: 'This Is Ocean Road AU', url: 'https://thisisoceanroad.com.au' },
      { name: 'This Is Ocean Road USA', url: 'https://thisisoceanroad.com' },
      { name: 'Hydro 2 Oil AU', url: 'https://hydro2oil.com.au' },
      { name: 'Caronlab AU', url: 'https://caronlab.com.au' },
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
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
        Experience
      </h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-indigo-300">{exp.title}</h3>
            <p className="text-gray-400 max-sm:text-sm">{exp.company}</p>
            <p className="text-gray-400 max-sm:text-sm">{exp.period}</p>
            <div className="list-disc mt-4 text-gray-300">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {exp.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className={`relative p-4 bg-${skill.color}-600/20 rounded-xl hover:bg-${skill.color}-600/30 transition-all duration-300 group flex flex-col items-center cursor-pointer`}
                  >
                    <h4
                      className={`text-base font-semibold text-${skill.color}-300 text-center h-full flex items-center`}
                    >
                      {skill.title}
                      <span className="pointer-events-none opacity-0 group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 top-full w-full p-4 backdrop-blur-xl bg-gray-900/70 text-xs rounded-lg z-10 text-left transition-opacity duration-500 pointer-events-none">
                        {skill.description}
                      </span>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
            {exp.projects && (
              <>
                <br />
                <div className="text-sm projects-list">
                  <span className="mx-2">Projects: </span>
                  {exp.projects.map((project, projectIndex) => (
                    <div key={project.name} className="inline">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-indigo-400"
                      >
                        {project.name}
                      </a>
                      {projectIndex < exp.projects!.length - 1 && (
                        <span className="mx-2">|</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}