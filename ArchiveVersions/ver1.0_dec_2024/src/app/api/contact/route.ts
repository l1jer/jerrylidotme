import { NextRequest, NextResponse } from 'next/server'

/**
 * Contact form endpoint. Emails each message to CONTACT_TO_EMAIL through Resend as plain text.
 *
 * Spam and abuse defences, cheapest first:
 * - same-origin only, small bodies only
 * - honeypot field and a minimum time-to-fill (bots get a fake success so they don't adapt)
 * - strict length and email checks, no HTML, at most two links
 * - per-IP rate limit (best effort: per server instance)
 * - Cloudflare Turnstile, when TURNSTILE_SECRET_KEY is set
 * The recipient address lives in an environment variable, never in the public site code.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 10_000
const MIN_FILL_MS = 3_000
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 3
const EMAIL_RE = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[a-z]{2,}$/i

const hits = new Map<string, number[]>()

const json = (body: object, status = 200) => NextResponse.json(body, { status })
const accepted = () => json({ ok: true })

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  // Drop control characters except newlines and tabs.
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
  return cleaned.length > max ? null : cleaned
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').slice(0, 100)

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5_000) hits.clear() // keep memory bounded
  return false
}

async function turnstileOk(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== 'string' || !token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const data = (await res.json().catch(() => ({}))) as { success?: boolean }
  return data.success === true
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  try {
    if (!origin || !host || new URL(origin).host !== host) return json({ error: 'Forbidden.' }, 403)
  } catch {
    return json({ error: 'Forbidden.' }, 403)
  }

  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'Message is too long.' }, 413)
  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  // Honeypot filled or form submitted inhumanly fast: pretend it worked.
  if (typeof body.website === 'string' && body.website.trim() !== '') return accepted()
  const startedAt = Number(body.startedAt)
  const age = Date.now() - startedAt
  if (!Number.isFinite(startedAt) || age > MAX_FORM_AGE_MS) return json({ error: 'Please reload the page and try again.' }, 400)
  if (age < MIN_FILL_MS) return accepted()

  const name = text(body.name, 100)
  const email = text(body.email, 200)
  const message = text(body.message, 4000)
  if (!name) return json({ error: 'Please enter your name (up to 100 characters).' }, 422)
  if (!email || !EMAIL_RE.test(email)) return json({ error: 'Please enter a valid email address.' }, 422)
  if (!message || message.length < 10) return json({ error: 'Please write a message of at least 10 characters.' }, 422)
  if (/<\s*\/?\s*[a-z][^>]*>/i.test(name + message)) return json({ error: 'Please send plain text without HTML.' }, 422)
  const links = (message.match(/https?:\/\/|www\./gi) ?? []).length + (name.match(/https?:\/\/|www\./gi) ?? []).length
  if (links > 2) return json({ error: 'Please include at most two links.' }, 422)

  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) return json({ error: 'Too many messages. Please try again later.' }, 429)
  if (!(await turnstileOk(body.turnstileToken, ip))) return json({ error: 'Verification failed. Please try again.' }, 403)

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) return json({ error: 'The contact form is not available right now. Please reach out on GitHub.' }, 503)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `Portfolio message from ${oneLine(name)}`,
      // Plain text only: nothing in a message can render as HTML or load remote content.
      text: [`Name: ${name}`, `Email: ${email}`, `IP: ${ip}`, `Sent: ${new Date().toISOString()}`, '', message].join('\n'),
    }),
  })
  if (!res.ok) return json({ error: 'Sending failed. Please try again later.' }, 502)
  return accepted()
}
