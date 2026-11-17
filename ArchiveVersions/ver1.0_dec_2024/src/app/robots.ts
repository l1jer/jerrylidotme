import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/seo'

// Crawlers used by AI assistants and AI search. They are already covered by "*"; naming them
// states plainly that this site is happy to be read and quoted by them (GEO / AEO).
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
]

// /archive and /versions are not blocked here on purpose. They carry a noindex header, and a
// crawler that is not allowed to fetch a page never sees that header and may still list the URL.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
