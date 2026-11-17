import './globals.css'
import './animations.css'
import { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Schoolbell, Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { buildJsonLd, site, SITE_URL } from '../lib/seo'

const schoolbell = Schoolbell({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-schoolbell',
  display: 'swap',
})

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

// SEO: what search results and link previews show. Wording and structured data live in lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    // Lets search results and AI answers quote the page in full, with large image previews.
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en_AU',
    firstName: 'Jerry',
    lastName: 'Li',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
}

// GEO / AEO: schema.org data that tells search engines and AI assistants who this site is about.
// "<" is escaped so no text in the data can close the script tag.
const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU" className={`${schoolbell.variable} ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231f2937'/><text x='50%' y='50%' fill='%23ffffff' font-size='60' font-family='Arial, sans-serif' text-anchor='middle' alignment-baseline='central'>JL</text></svg>" />
      </head>
      <body className="bg-gray-900 text-gray-100 font-sans leading-relaxed">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}