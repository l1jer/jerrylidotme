'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { FiCheckCircle, FiSend } from 'react-icons/fi'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme?: string; callback: (token: string) => void }) => string
      reset: (id?: string) => void
    }
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const field =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 backdrop-blur-md outline-none transition focus:border-indigo-400/60 focus:bg-white/[0.07]'

/** Glass contact form. Spam checks run on the server; the honeypot and timer are invisible to people. */
export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const startedAt = useRef(Date.now())
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileId = useRef<string | undefined>(undefined)
  const [token, setToken] = useState('')

  // Optional Cloudflare Turnstile challenge, only when a site key is configured.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return
    const render = () => {
      if (window.turnstile && turnstileRef.current && !turnstileId.current) {
        turnstileId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          callback: setToken,
        })
      }
    }
    if (window.turnstile) return render()
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = render
    document.head.appendChild(script)
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, startedAt: startedAt.current, turnstileToken: token }),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.')
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      if (turnstileId.current) window.turnstile?.reset(turnstileId.current)
    }
  }

  if (status === 'sent') {
    return (
      <div className="glass flex flex-col items-center justify-center gap-3 p-8 text-center" role="status">
        <FiCheckCircle className="h-8 w-8 text-emerald-300" aria-hidden />
        <p className="font-display text-xl font-semibold text-white">Message sent</p>
        <p className="text-sm text-gray-400">Thanks for reaching out. I&apos;ll reply by email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-2.5 sm:space-y-3 p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="Email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={4}
          placeholder="Tell me about your project…"
          className={`${field} resize-none short:h-20`}
        />
      </label>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {TURNSTILE_SITE_KEY && <div ref={turnstileRef} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-gray-500">Plain text only · up to two links</p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-indigo-500/35 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <FiSend className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {status === 'error' && (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
