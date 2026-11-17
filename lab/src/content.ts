export interface Chapter {
  id: string
  /** The matching section of the standard portfolio (its URL hash), for the switch button. */
  section: string
  /** Short label for the chapter bar and index. */
  label: string
  kicker: string
  title: string
  line: string
  stats?: [value: string, label: string][]
  tags?: string[]
}

// Source: the portfolio's own content (resume, Nov 2026).
export const chapters: Chapter[] = [
  {
    id: 'home',
    section: '',
    label: 'Start',
    kicker: 'Portfolio · Canberra, Australia',
    title: 'Jerry Li',
    line: 'Web developer & eCommerce specialist. WooCommerce and Shopify stores, ERP integrations, and the SEO, GEO and AEO that get them found.',
  },
  {
    id: 'about',
    section: '#about',
    label: 'About',
    kicker: 'About',
    title: 'Web, eCommerce & growth',
    line: 'Six years building and running online stores, from custom themes and apps to ERP integrations, plus the growth work around them: search, paid media, email and analytics.',
    stats: [
      ['6+', 'Years building for the web'],
      ['10+', 'Live WooCommerce & Shopify stores'],
      ['41%', "Of a brand's 2024 orders from organic search"],
    ],
  },
  {
    id: 'tsa',
    section: '#experience',
    label: 'TSA Outdoors',
    kicker: 'Aug 2022 – Now · Web Developer, UX Designer & SEO Specialist',
    title: 'TSA Outdoors',
    line: 'I own the web platform for a multi-brand outdoor and optics distributor: ten live stores across AU, US, NZ and EU, a B2B dealer portal and the ERP integrations behind them.',
    stats: [
      ['10', 'Live stores across four markets'],
      ['~80%', 'Less manual order and stock entry'],
      ['829', 'Unit tests in the next-gen order sync'],
    ],
  },
  {
    id: 'caronlab',
    section: '#experience',
    label: 'Caronlab',
    kicker: 'Sep 2020 – Aug 2022 · Web Developer & IT Support',
    title: 'Caronlab',
    line: 'Thirteen-plus custom WordPress sites for a multi-regional beauty brand group, built mobile-first from Figma and XD designs.',
    stats: [
      ['13+', 'Custom WordPress sites'],
      ['+25%', 'MySQL performance after tuning'],
    ],
  },
  {
    id: 'earlier',
    section: '#experience',
    label: 'Earlier',
    kicker: '2020 – 2022 · Where it started',
    title: 'TAFE QLD & HiRain',
    line: 'Interactive, accessible online learning at TAFE QLD, and production React UI for an automotive diagnostics platform at HiRain Technologies.',
    stats: [
      ['2022', 'TAFE QLD · Multimedia Developer'],
      ['2020', 'HiRain Technologies · Frontend Developer'],
    ],
  },
  {
    id: 'builds',
    section: '#work',
    label: 'Builds',
    kicker: 'Featured builds · Shopify platform work for Flywing USA',
    title: 'Built to move numbers',
    line: 'A webhook-driven commerce sync, a browser flight trainer in three.js, and scripted Shopify operations.',
    stats: [
      ['+33%', 'Online revenue'],
      ['0 → 5.5%', 'Conversion rate within a month'],
      ['768', 'Automated tests in the flight trainer'],
    ],
  },
  {
    id: 'toolkit',
    section: '#skills',
    label: 'Toolkit',
    kicker: 'Toolkit',
    title: 'What I build with',
    line: 'Full-stack and AI-assisted: shipped with Claude Code under strict guardrails, tested, and measured.',
    tags: [
      'TypeScript', 'PHP 8.2', 'React · Next.js', 'three.js / WebGL', 'WooCommerce', 'Shopify APIs',
      'Pronto ERP', 'Cloudflare', 'GA4 · GTM', 'SEO · GEO · AEO', 'Playwright', 'Claude Code',
    ],
  },
  {
    id: 'contact',
    section: '#contact',
    label: 'Contact',
    kicker: 'Available for freelance and full-time work',
    title: '', // set per theme
    line: 'Bring the idea. I will take it from sketch to shipped.',
  },
]

// Joined in the browser only, so the address is not in the HTML that harvesters scrape.
export const emailParts = ['jerry.li.adev', 'gmail.com'] as const
export const links = {
  github: 'https://github.com/l1jer',
  portfolio: 'https://jerryli.me',
}
