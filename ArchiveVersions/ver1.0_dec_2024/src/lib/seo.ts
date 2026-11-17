import {
  aboutStats,
  experiences,
  featuredBuilds,
  flywingResults,
  freelanceProjects,
  professionalDevelopment,
  skillCategories,
  spokenLanguages,
  universityEducation,
} from '../data/portfolio'

/**
 * Everything search engines and AI assistants read about this site, built from the same data
 * the slides show. Nothing here is rendered on the page:
 *  - SEO: title, description and canonical URL (used by layout.tsx), sitemap.ts, robots.ts
 *  - GEO / AEO: JSON-LD structured data (who Jerry is, where he has worked, what he builds)
 *    and /llms.txt, a plain-text summary for AI assistants.
 *
 * The email address is left out on purpose: it is only assembled in the browser, so that
 * address harvesters cannot read it from the HTML. Do not add it here.
 */

export const SITE_URL = 'https://jerryli.me'

export const site = {
  name: 'Jerry Li',
  title: 'Jerry Li | Web Developer & eCommerce Specialist, Canberra',
  jobTitle: 'Web Developer & eCommerce Specialist',
  description:
    'Canberra web developer with 6+ years building WooCommerce and Shopify stores, ERP integrations and custom plugins, plus the SEO, GEO and AEO that get them found.',
  summary:
    'Jerry Li is a web developer and eCommerce specialist based in Canberra, Australia. He builds and runs WooCommerce and Shopify stores, connects them to ERP systems, and does the search work around them: SEO, generative engine optimisation (GEO) and answer engine optimisation (AEO).',
  locality: 'Canberra',
  region: 'ACT',
  country: 'AU',
  github: 'https://github.com/l1jer',
  image: '/jerry-li-sketch-2025.webp',
  keywords: [
    'Jerry Li',
    'web developer Canberra',
    'eCommerce developer Australia',
    'WooCommerce developer',
    'Shopify developer',
    'WordPress plugin developer',
    'ERP integration',
    'Pronto Xi integration',
    'technical SEO',
    'generative engine optimisation (GEO)',
    'answer engine optimisation (AEO)',
    'Next.js developer',
    'React developer',
    'three.js',
    'AI-assisted engineering',
  ],
} as const

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** "Sep 2020 – Aug 2022", "Feb – Aug 2020" or "Aug 2022 – Current" as ISO year-month dates. */
export function parsePeriod(period: string): { start?: string; end?: string } {
  const [from = '', to = ''] = period.split('–').map((part) => part.trim())
  const read = (text: string, fallbackYear?: string) => {
    const month = MONTHS.indexOf(text.slice(0, 3).toLowerCase())
    const year = text.match(/\d{4}/)?.[0] ?? fallbackYear
    if (!year) return undefined
    return month < 0 ? year : `${year}-${String(month + 1).padStart(2, '0')}`
  }
  const end = read(to)
  return { start: read(from, to.match(/\d{4}/)?.[0]), end }
}

const liveSites = () => [...experiences.flatMap((e) => e.sites ?? []), ...freelanceProjects].filter((p) => p.url && !p.archived)

/** schema.org graph: the site, this page as a profile page, and Jerry as a person. */
export function buildJsonLd() {
  const person = `${SITE_URL}/#person`
  const website = `${SITE_URL}/#website`
  const current = experiences.find((e) => !parsePeriod(e.period).end)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': website,
        url: SITE_URL,
        name: site.name,
        description: site.description,
        inLanguage: 'en-AU',
        publisher: { '@id': person },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: site.title,
        description: site.description,
        inLanguage: 'en-AU',
        isPartOf: { '@id': website },
        about: { '@id': person },
        mainEntity: { '@id': person },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}${site.image}` },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: site.name,
        url: SITE_URL,
        image: `${SITE_URL}${site.image}`,
        jobTitle: current?.title ?? site.jobTitle,
        description: site.summary,
        address: { '@type': 'PostalAddress', addressLocality: site.locality, addressRegion: site.region, addressCountry: site.country },
        sameAs: [site.github],
        knowsLanguage: spokenLanguages,
        knowsAbout: skillCategories.flatMap((c) => [c.title, ...c.skills.slice(0, 4)]),
        // Each job as a role with its dates, so past and current employers are told apart.
        worksFor: experiences.map((e) => {
          const { start, end } = parsePeriod(e.period)
          return {
            '@type': 'EmployeeRole',
            roleName: e.title,
            description: e.summary,
            ...(start && { startDate: start }),
            ...(end && { endDate: end }),
            worksFor: { '@type': 'Organization', name: e.company, address: e.location.split(' · ')[0] },
          }
        }),
        hasOccupation: {
          '@type': 'Occupation',
          name: site.jobTitle,
          occupationLocation: { '@type': 'Country', name: 'Australia' },
          skills: skillCategories.map((c) => c.title).join(', '),
        },
        alumniOf: [...new Set(universityEducation.map((e) => e.institution))].map((name) => ({ '@type': 'CollegeOrUniversity', name })),
        hasCredential: [...universityEducation, ...professionalDevelopment].map((e) => ({
          '@type': 'EducationalOccupationalCredential',
          name: e.title,
          recognizedBy: { '@type': 'Organization', name: e.institution },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#work`,
        name: 'Selected work by Jerry Li',
        itemListElement: [
          ...featuredBuilds.map((b) => ({
            '@type': 'CreativeWork',
            name: b.title,
            description: b.description,
            keywords: b.tags.join(', '),
            creator: { '@id': person },
          })),
          ...liveSites().map((p) => ({ '@type': 'WebSite', name: p.name, url: p.url, contributor: { '@id': person } })),
        ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
      },
    ],
  }
}

/**
 * /llms.txt: the portfolio as plain Markdown for AI assistants (https://llmstxt.org).
 * The questions at the end are the ones people ask assistants about a developer; answering
 * them here in plain words is what lets an assistant quote the site accurately.
 */
export function buildLlmsTxt() {
  const years = aboutStats[0]?.value ?? '6+'
  const current = experiences[0]
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.summary}`,
    '',
    `- Role: ${site.jobTitle}`,
    `- Based in: ${site.locality}, Australia (works remotely)`,
    `- Experience: ${years} years`,
    `- Available for: freelance and full-time work`,
    `- Languages spoken: ${spokenLanguages.join(', ')}`,
    `- Website: ${SITE_URL}`,
    `- GitHub: ${site.github}`,
    `- Contact: use the Contact section at ${SITE_URL}/#contact`,
    '',
    '## Key numbers',
    '',
    ...aboutStats.map((s) => `- ${s.value}: ${s.label}`),
    '',
    '## Experience',
  ]

  for (const e of experiences) {
    lines.push('', `### ${e.title}, ${e.company} (${e.period})`, '', `${e.location}. ${e.summary}`, '')
    for (const s of e.stats ?? []) lines.push(`- ${s.value}: ${s.label}`)
    for (const h of e.highlights) lines.push(`- ${h.title}: ${h.description}`)
    if (e.sites?.length) lines.push('', 'Live sites:', ...e.sites.map((p) => `- [${p.name}](${p.url})`))
  }

  lines.push(
    '',
    '## Featured builds',
    '',
    'Shopify platform work for Flywing USA, delivered as projects.',
    '',
    ...featuredBuilds.map((b) => `- ${b.title}: ${b.description} (${b.tags.join(', ')})`),
    '',
    'Results:',
    ...flywingResults.map((s) => `- ${s.value}: ${s.label}`),
    '',
    '## Client websites',
    '',
    ...freelanceProjects.filter((p) => p.url && !p.archived).map((p) => `- [${p.name}](${p.url})`),
    '',
    '## Skills',
    '',
    ...skillCategories.map((c) => `- ${c.title}: ${c.skills.join(', ')}`),
    '',
    '## Education',
    '',
    ...[...universityEducation, ...professionalDevelopment].map((e) => `- ${e.title}, ${e.institution} (${e.period})`),
    '',
    '## Common questions',
    '',
    '### Who is Jerry Li?',
    site.summary,
    '',
    '### What does Jerry Li specialise in?',
    `eCommerce on WooCommerce and Shopify, WordPress plugin and theme development, ERP integration (Pronto Xi), and search: technical SEO, GEO and AEO. He also works full-stack in TypeScript, PHP, React and Next.js, and ships with AI coding agents under strict guardrails.`,
    '',
    '### Where does Jerry Li work now?',
    `${current.company}, as ${current.title} (${current.period}). ${current.summary}`,
    '',
    '### Does Jerry Li work with Shopify as well as WooCommerce?',
    'Yes. Alongside ten live WooCommerce stores, he has built Shopify platform work including a webhook-driven sync on the Shopify Admin GraphQL API, a three.js flight trainer shipped as a theme app extension, and scripted store operations.',
    '',
    '### Is Jerry Li available for hire?',
    `Yes, for freelance and full-time work. Get in touch through ${SITE_URL}/#contact.`,
    '',
    '## Other versions of this site',
    '',
    `- [3D version](${SITE_URL}/lab): the same portfolio as a scroll-driven flight through space, built with three.js and custom shaders.`,
    ''
  )
  return lines.join('\n')
}
