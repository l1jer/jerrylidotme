import { EducationItem, ExperienceItem, PersonalityTrait, Project, SkillCategory } from '../types'

// All portfolio content lives here so the slide components only handle layout.

export const experiences: ExperienceItem[] = [
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

export const freelanceProjects: Project[] = [
  { name: 'Flywing USA', url: 'https://flywingusa.com' },
  { name: 'SJD Tech', url: 'https://sjdtech.com.au/' },
  { name: 'SJD Auto', url: 'https://sjdauto.com.au' },
  { name: 'IT&A Bit Computing Solutions', url: '/archive/itabit', archived: true },
  { name: 'Blast Energy', url: 'https://blastenergy.com.au' },
  { name: 'Ginger and Spice', url: 'https://gingerandspice.com.au' },
  { name: '926 Trades', url: '/archive/926-trades', archived: true },
  { name: 'Bashan', url: 'https://bashan.com.au' },
  { name: 'Dumpling Social', url: 'https://dumplingsocial.com.au' },
  { name: 'QR Code Generator & Management' },
]

export const skillCategories: SkillCategory[] = [
  {
    title: 'AI & LLM Integration',
    icon: 'FaRobot',
    skills: [
      { name: 'Prompt Engineering', description: 'Designing effective prompts for large language models to produce reliable, high-quality outputs.' },
      { name: 'OpenAI API', description: 'Integrating GPT and other LLMs into web applications via REST APIs.' },
      { name: 'LangChain', description: 'Building LLM-powered applications with chains, agents, and retrieval-augmented generation.' },
      { name: 'AI-Assisted Development', description: 'Leveraging Cursor, GitHub Copilot, and other AI coding assistants to accelerate development workflows.' },
      { name: 'Vercel AI SDK', description: 'Streaming AI responses in React and Next.js apps with built-in UI primitives.' },
      { name: 'RAG', description: 'Retrieval-augmented generation for building AI features grounded on custom data sources.' },
    ],
  },
  {
    title: 'Frontend',
    icon: 'FaCode',
    skills: [
      { name: 'HTML5', description: 'Semantic structure for accessible and SEO-optimized web pages.' },
      { name: 'CSS3', description: 'Responsive layouts, animations, and visual styling.' },
      { name: 'JavaScript', description: 'Interactive functionality and client-side logic for web apps.' },
      { name: 'React', description: 'Component-based architecture for dynamic and scalable UIs.' },
      { name: 'Redux', description: 'State management for complex frontend applications.' },
      { name: 'Tailwind', description: 'Utility-first CSS framework for rapid UI development.' },
      { name: 'shadcn/ui', description: 'Accessible, customisable component library built on Radix UI and Tailwind CSS.' },
    ],
  },
  {
    title: 'Backend',
    icon: 'FaDatabase',
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
    icon: 'FaCloud',
    skills: [
      { name: 'Netlify', description: 'Static site hosting and serverless functions.' },
      { name: 'Heroku', description: 'Cloud platform for deploying and managing apps.' },
      { name: 'AWS EC2', description: 'Virtual servers for scalable cloud applications.' },
      { name: 'Render', description: 'Cloud platform for deploying web services, databases, and static sites with zero DevOps.' },
      { name: 'SiteGround', description: 'Managed WordPress hosting with advanced features.' },
      { name: 'Hostinger', description: 'Web hosting with integrated development tools.' },
      { name: 'GitHub Pages', description: 'Static site hosting directly from GitHub repositories.' },
      { name: 'Vercel', description: 'Frontend deployment and serverless functions platform.' },
    ],
  },
  {
    title: 'Design',
    icon: 'FaPalette',
    skills: [
      { name: 'Photoshop', description: 'Image editing and manipulation for web graphics.' },
      { name: 'Adobe XD', description: 'UX/UI prototyping and wireframing tools.' },
      { name: 'Figma', description: 'Collaborative design for modern web and mobile interfaces.' },
    ],
  },
]

export const professionalDevelopment: EducationItem[] = [
  {
    title: 'JavaScript Development',
    institution: 'General Assembly',
    period: '2021',
  },
  {
    title: 'Senior Frontend Development',
    institution: 'NetEase Cloud Classroom',
    period: '2020',
  },
]

export const universityEducation: EducationItem[] = [
  {
    title: 'Graduate Diploma of Information Technology',
    institution: 'University of Canberra',
    period: '2019 – 2020',
  },
  {
    title: 'Double Bachelors of Information Technology & Media Arts and Production',
    institution: 'University of Canberra',
    period: '2013 – 2016',
  },
]

export const personalityTraits: PersonalityTrait[] = [
  {
    icon: '💡',
    title: 'INTP Personality Traits',
    description:
      'Both outgoing and reserved (slightly more reserved), cautious, and focused on excellence according to the DISC Assessment.',
  },
  {
    icon: '🧠',
    title: 'Thirst for Knowledge',
    description: 'Exhibits curiosity, patience, and a keenness to learn.',
  },
  {
    icon: '🔧',
    title: 'Problem-Solving Approach',
    description:
      'Maintains an open mind, actively questions, excels in problem-solving, and is collaborative, supportive, yet dominant.',
  },
  {
    icon: '🤔',
    title: 'Critical Thinking',
    description:
      'Demonstrates a blend of flexibility and adaptability, paired with critical thinking that is objective.',
  },
]
