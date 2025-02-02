import './globals.css'
import './animations.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jerry Li - Frontend/Web Developer | UI/UX Designer | SEO Specialist',
  description: 'Frontend Developer and UI/UX Designer with expertise in modern web technologies and user experience design',
  keywords: 'Frontend Developer, UI/UX Designer, Web Development, JavaScript, React, User Interface Design',
  authors: [{ name: 'Jerry Li' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Jerry Li - Frontend/Web Developer | UI/UX Designer | SEO Specialist',
    description: 'Frontend Developer and UI/UX Designer specializing in creating engaging web experiences',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Jerry Li - Frontend Developer',
    description: 'Frontend Developer and UI/UX Designer specializing in creating engaging web experiences',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231f2937'/><text x='50%' y='50%' fill='%23ffffff' font-size='60' font-family='Arial, sans-serif' text-anchor='middle' alignment-baseline='central'>JL</text></svg>" />
      </head>
      <body className="bg-gray-900 text-gray-100 font-sans leading-relaxed">
        {children}
      </body>
    </html>
  )
}