'use client'

import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiCheck, FiCopy, FiMail } from 'react-icons/fi'
import { socialLinks } from './slides/HeroSlide'

// Stored in pieces and joined only in the browser, so the address never appears in the HTML
// that address-harvesting bots scrape. People see and use it normally.
const EMAIL_PARTS = ['jerry.li.adev', 'gmail.com'] as const

/** Glass card with the email address, a mail link, a copy button and GitHub. */
export default function EmailCard() {
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEmail(EMAIL_PARTS.join('@'))
  }, [])

  async function copy() {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the address is still visible to copy by hand.
    }
  }

  const button =
    'flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium backdrop-blur-md transition'

  return (
    <div className="glass spot p-5 sm:p-7">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
        <FiMail className="h-3.5 w-3.5" aria-hidden />
        Email me
      </p>
      <p className="mt-3 break-all font-display text-xl sm:text-3xl font-semibold text-white min-h-[1.75rem] sm:min-h-[2.5rem]">
        {email || <span className="text-gray-500">Loading…</span>}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
        <a
          href={email ? `mailto:${email}` : undefined}
          className={`${button} border-indigo-400/40 bg-indigo-500/20 text-white hover:bg-indigo-500/35`}
        >
          Send email
          <FiArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
        <button
          type="button"
          onClick={copy}
          className={`${button} border-white/10 bg-white/[0.04] text-gray-200 hover:border-white/25 hover:text-white`}
          aria-live="polite"
        >
          {copied ? (
            <>
              Copied <FiCheck className="h-4 w-4 text-emerald-300" aria-hidden />
            </>
          ) : (
            <>
              Copy address <FiCopy className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-sm text-gray-400">
        <span>Or find me on</span>
        {socialLinks.map(({ platform, url, icon: Icon }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-200 transition hover:text-indigo-300"
          >
            <Icon className="h-4 w-4" aria-hidden />
            {platform}
          </a>
        ))}
      </div>
    </div>
  )
}
