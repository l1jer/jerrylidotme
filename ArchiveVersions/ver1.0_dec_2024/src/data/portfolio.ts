import {
  EducationItem,
  ExperienceItem,
  FeaturedBuild,
  PersonalityTrait,
  Project,
  SkillCategory,
  Stat,
} from '../types'

// All portfolio content lives here so the slide components only handle layout.
// Source: Jerry Li resume, Nov 2026.

export const aboutStats: Stat[] = [
  { value: '6+', label: 'Years building for the web' },
  { value: '10', label: 'Live WooCommerce stores (AU · US · NZ · EU)' },
  { value: '41%', label: "Of a brand's 2024 orders from organic search" },
]

export const experiences: ExperienceItem[] = [
  {
    title: 'Web Developer, UX Designer & SEO Specialist',
    company: 'TSA Outdoors',
    location: 'Brookvale NSW · Remote',
    period: 'Aug 2022 – Current',
    summary:
      'Own the web platform for a multi-brand outdoor and optics distributor: 10 live WordPress/WooCommerce stores across AU, US, NZ and EU, a Pronto Avenue B2B dealer portal and the Pronto Xi ERP integrations.',
    stats: [
      { value: '10', label: 'Live stores across four markets' },
      { value: '41%', label: "Of a brand's 2024 orders from organic search" },
      { value: '~80%', label: 'Less manual order and stock entry' },
    ],
    highlights: [
      {
        title: 'AI-Assisted Engineering',
        description:
          'Since Aug 2026, ship projects with Claude Code as a coding agent: plan-first workflow, parallel subagents and multi-lens review, with guardrails for secrets, read-only ERP access and tested rollbacks.',
      },
      {
        title: 'WooCommerce ↔ ERP Integration',
        description:
          'PHP 8 plugins syncing orders, inventory, fulfilment and tracking with Pronto in near real time; idempotent pipelines handling 100+ orders a day at peak.',
      },
      {
        title: 'Next-Gen Order Sync',
        description:
          'State machine with leased jobs, retries, a circuit breaker and reconciliation (130 classes, 829 unit tests), proven with fault and concurrency injection.',
      },
      {
        title: 'Unified Stock Sync',
        description:
          'One configurable sync replacing per-site plugins: 23,500 rows in about 31 seconds, an anomaly guard, dry run by default and a live re-check at checkout.',
      },
      {
        title: 'Supplier Delivery-Date Automation',
        description:
          'Plugin that chases suppliers for missing PO dates with tokenised forms and reminders (143 classes, 577 tests), tracking 64 POs across 47 suppliers.',
      },
      {
        title: 'Multi-Site Stockist Map',
        description:
          'Hub-and-spoke plugin replacing a commercial map on nine sites: REST feed, MapLibre GL clustering and a rate-limited geocoder; 1,173 stores merged.',
      },
      {
        title: 'WooCommerce Theme Rebuild',
        description:
          'A 301-product store rebuilt as a lean custom theme via idempotent WP-CLI migrations; mobile Lighthouse up from 27–59 to 58–94.',
      },
      {
        title: 'B2B Dealer Portal Redesign',
        description:
          'About 450 Liquid files reworked on Pronto Avenue: stock badges, Fast Order with paste from spreadsheet, and a responsive retrofit of a fixed layout.',
      },
      {
        title: 'Cloudflare Edge & Security',
        description:
          'Geo-redirect plugin replaced by Redirect Rules and Workers, a scraper stopped with a WAF rule, and SPF/DKIM fixed after an email outage.',
      },
      {
        title: 'Promotions & Store Features',
        description:
          'Gift-with-purchase campaign with Stripe dealer claims, three-tier role pricing and a UPS shipping module (OAuth 2.0).',
      },
      {
        title: 'Product Launch Automation',
        description:
          'Scripted pipelines listing products across stores with different schemas, a brand-page generator and Mailchimp campaign drafts via API.',
      },
      {
        title: 'Product Resources Site',
        description:
          'Next.js static site for 139 products in 23 categories, with JSON-LD, sitemap and llms.txt for search engines and AI assistants.',
      },
      {
        title: '3D / WebGL Prototypes',
        description:
          'three.js product-model platform with an embeddable viewer SDK, plus a look-through-the-scope experience over generated terrain.',
      },
      {
        title: 'Shipping Label App',
        description:
          'Node/TypeScript and PostgreSQL app on the Australia Post API: label time cut from 5–8 minutes to 30 seconds per order.',
      },
      {
        title: 'SEO & Content',
        description:
          'Rank Math, Ahrefs, GA4 and Search Console-led strategy; organic search drove 41% of orders and revenue for one brand in 2024.',
      },
      {
        title: 'Analytics & Tracking',
        description:
          'GTM, GA4, Google Ads and Meta CAPI; fixed Pixel over-reporting (161 vs 60 real orders) and built GA4 and Search Console API clients.',
      },
      {
        title: 'Performance Optimisation',
        description:
          'Minification, lazy loading, Memcached and Cloudflare CDN with WebP images for faster stores across every brand.',
      },
      {
        title: 'UI/UX & LMS',
        description:
          'Mobile-first Figma designs, and a React/Next.js learning platform on a headless WordPress backend.',
      },
    ],
    sites: [
      { name: 'ZeroTech', url: 'https://zerotech.com.au' },
      { name: 'ZeroTech Optics', url: 'https://zerotechoptics.com' },
      { name: 'ZeroTech NZ', url: 'https://zerotech.co.nz' },
      { name: 'BushPig Shotguns', url: 'https://bushpigshotguns.com.au' },
      { name: 'ZeroTech Outdoors', url: 'https://zerotechoutdoors.com.au' },
      { name: 'SkyWatcher', url: 'https://skywatcher.com.au' },
    ],
  },
  {
    title: 'Web Developer & IT Support',
    company: 'Caronlab',
    location: 'North Geelong VIC · Remote',
    period: 'Sep 2020 – Aug 2022',
    summary:
      'Designed and built 13+ custom WordPress sites for a multi-regional beauty brand group, turning Figma and XD designs into mobile-first, cross-browser builds.',
    stats: [
      { value: '13+', label: 'Custom WordPress sites' },
      { value: '+25%', label: 'MySQL performance after tuning' },
    ],
    highlights: [
      {
        title: 'Custom WordPress Development',
        description: 'Responsive sites in JavaScript and SASS/Bootstrap, built from Figma and XD designs with cross-browser support.',
      },
      {
        title: 'Templates & Functionality',
        description: 'Custom WordPress/WooCommerce templates with ACF and complex queries, plus dynamic features in JavaScript and PHP hooks.',
      },
      {
        title: 'Systems & Tool Integration',
        description: 'Yotpo reviews, Zapier and Integrately automations, and Gravity Forms linked to Mailchimp, Campaign Monitor and WooCommerce.',
      },
      {
        title: 'Domain, DNS & Email',
        description: 'Domains and DNS on Cloudflare, SiteGround hosting, and troubleshooting of servers and email deliverability.',
      },
      {
        title: 'Migrations & Performance',
        description: 'Seamless site migrations, MySQL tuned for a 25% boost, and Cloudflare/NGINX caching with WebP and lazy loading.',
      },
      {
        title: 'Secure Payments',
        description: 'Braintree payment integration with SSL/TLS configuration and merchant API tuning.',
      },
      {
        title: 'SEO Strategy',
        description: 'Technical SEO with Rank Math and Yoast: schema and structured data, .htaccess rules and custom XML sitemaps.',
      },
    ],
    sites: [
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
    title: 'Multimedia Developer (Contract)',
    company: 'TAFE Queensland',
    location: 'Southbank QLD · Remote',
    period: 'Aug 2022 – Dec 2022',
    summary: 'Produced interactive, accessible online learning content with educators and subject-matter experts.',
    highlights: [
      {
        title: 'Stakeholder Collaboration',
        description: 'Aligned multimedia deliverables with learning outcomes and accessibility standards alongside educators.',
      },
      {
        title: 'Learning Experience Design',
        description: 'Scoped and storyboarded interactive course modules, advising on structure, platform constraints and engagement.',
      },
      {
        title: 'Multimedia Production',
        description: 'Video, animation and rich-media assets for blended and online delivery in Adobe Creative Suite and After Effects.',
      },
      {
        title: 'UI/UX for Education',
        description: 'WCAG-compliant interfaces for online learning, prioritising clarity, consistent navigation and mobile use.',
      },
      {
        title: 'Interactive Web Development',
        description: 'Quizzes, drag-and-drop activities and progress-tracked modules in HTML, CSS and JavaScript.',
      },
      {
        title: 'QA & Usability Testing',
        description: 'Cross-browser and cross-device testing against WCAG, institutional style guides and LMS compatibility.',
      },
    ],
  },
  {
    title: 'Graduate Frontend Developer',
    company: 'Beijing HiRain Technologies',
    location: 'Beijing, China',
    period: 'Feb – Aug 2020',
    summary: 'Built production UI for a multithreaded automotive diagnostics platform.',
    highlights: [
      {
        title: 'React UI Engineering',
        description: 'Production features in React, Ant Design and Node.js consuming RESTful APIs.',
      },
      {
        title: 'Performance & Debugging',
        description: 'Profiled React rendering, fixed layout regressions and cut unnecessary re-renders in data-heavy dashboards.',
      },
      {
        title: 'Agile Collaboration',
        description: 'Sprint planning, stand-ups and retrospectives in a cross-functional team; Agile Project Management seminar.',
      },
    ],
  },
]

// Built for Flywing USA. Shown as projects only, not as a role.
export const featuredBuilds: FeaturedBuild[] = [
  {
    title: 'Webhook-Driven Commerce Sync',
    description:
      'Production microservice keeping a central Shopify marketplace in sync with vendor stores by SKU through the Shopify Admin GraphQL API, with webhooks, scheduled jobs, Redis caching, rate limiting and monitoring.',
    tags: ['Shopify GraphQL', 'Webhooks', 'Redis', 'OpenAPI'],
  },
  {
    title: 'Browser Flight Trainer',
    description:
      'WebGL trainer for a VTOL RC aircraft shipped as a Shopify theme app extension: PX4-tuned physics, gamepad calibration, English/Chinese UI and 768 automated tests, delivered in five weeks.',
    tags: ['three.js', 'TypeScript', 'Vite', 'Vercel'],
  },
  {
    title: 'Scripted Shopify Operations',
    description:
      'Product-page builds automated through the Shopify Admin API with an image pipeline, backups and a go-live step, plus an Express, MySQL and Chart.js sales dashboard.',
    tags: ['Shopify Admin API', 'Express', 'MySQL', 'Chart.js'],
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
    title: 'AI-Assisted Engineering',
    icon: 'ai',
    skills: ['Claude Code', 'Plan-first workflow', 'Parallel subagents', 'Multi-lens review', 'Cursor', 'Augment', 'Claude · GPT · Gemini', 'Prompt engineering', 'RAG', 'Vercel AI SDK', 'LangChain'],
  },
  {
    title: 'SEO · GEO · AEO',
    icon: 'search',
    skills: ['Technical SEO', 'Schema / JSON-LD', 'XML sitemaps', 'llms.txt', 'Rank Math', 'Yoast', 'Ahrefs', 'Keyword research', 'Core Web Vitals'],
  },
  {
    title: 'Digital Marketing & Analytics',
    icon: 'chart',
    skills: ['GA4 APIs', 'Search Console API', 'Tag Manager', 'Google Ads', 'Meta Pixel / CAPI', 'Server-side tracking', 'EDM automation', 'Mailchimp API', 'CRO & A/B testing', 'Metorik'],
  },
  {
    title: 'eCommerce & ERP',
    icon: 'cart',
    skills: ['WooCommerce', 'Shopify', 'Shopify Admin API', 'Theme app extensions', 'BigCommerce', 'Pronto Avenue (Liquid)', 'Pronto Xi / Connect REST', 'Stripe', 'Braintree'],
  },
  {
    title: 'WordPress',
    icon: 'wordpress',
    skills: ['Custom plugins & themes', 'WooCommerce hooks', 'HPOS', 'Action Scheduler', 'WP-CLI', 'REST API', 'Custom post types', 'ACF', 'Elementor'],
  },
  {
    title: 'Languages',
    icon: 'code',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'Node.js', 'PHP 8.2', 'Python', 'SQL', 'Bash', 'Liquid', 'HTML / CSS'],
  },
  {
    title: 'Frameworks & Libraries',
    icon: 'layers',
    skills: ['React', 'Next.js', 'Redux', 'Express', 'GraphQL', 'Tailwind CSS', 'shadcn/ui', 'Bootstrap', 'Vite', 'three.js / WebGL', 'MapLibre GL', 'Leaflet', 'D3'],
  },
  {
    title: 'Testing & QA',
    icon: 'check',
    skills: ['PHPUnit', 'Vitest', 'Jest', 'Playwright', 'Screenshot diffing', 'Contract tests', 'Fault injection', 'Lighthouse', 'axe'],
  },
  {
    title: 'Cloud & DevOps',
    icon: 'cloud',
    skills: ['Cloudflare Rules · Workers · WAF', 'AWS', 'Vercel', 'Netlify', 'Render', 'Heroku', 'SiteGround', 'GitHub Actions', 'SPF / DKIM / DMARC'],
  },
  {
    title: 'Databases',
    icon: 'database',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    title: 'Tools',
    icon: 'tool',
    skills: ['Git', 'npm / Yarn', 'Postman', 'SSH', 'jq', 'curl'],
  },
  {
    title: 'Design',
    icon: 'pen',
    skills: ['Figma', 'Adobe XD', 'Photoshop'],
  },
]

export const professionalDevelopment: EducationItem[] = [
  { title: 'JavaScript Development', institution: 'General Assembly', period: '2021' },
  { title: 'Advanced Frontend Development', institution: 'NetEase Cloud Classroom', period: '2020' },
]

export const universityEducation: EducationItem[] = [
  { title: 'Graduate Diploma of Information Technology', institution: 'University of Canberra', period: '2019 – 2020' },
  {
    title: 'Bachelor of Information Technology & Bachelor of Media Arts and Production',
    institution: 'University of Canberra',
    period: '2013 – 2016',
  },
]

export const personalityTraits: PersonalityTrait[] = [
  { icon: '🎯', title: 'INTJ', description: 'Detail-oriented, driven by excellence and intellectual curiosity.' },
  { icon: '🤝', title: 'Team & Solo', description: 'Balanced between collaborative teamwork and focused independent work.' },
  { icon: '🧠', title: 'Critical Thinking', description: 'Approaches challenges with critical thinking and objective analysis.' },
  { icon: '🔧', title: 'Methodical', description: 'Patient, methodical problem-solving through active questioning.' },
  { icon: '🌱', title: 'Always Learning', description: 'Adaptable, with a structured approach to continuous learning.' },
]

export const spokenLanguages = ['English', 'Mandarin']
