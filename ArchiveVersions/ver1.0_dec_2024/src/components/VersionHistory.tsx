'use client'

import { useEffect, useRef, useState } from 'react'

const versions = [
  { label: 'v3', period: 'Nov 2026 – now', note: 'Slides', href: null },
  { label: 'v2', period: '2025 – 2026', note: 'Scrolling starfield', href: '/versions/v2' },
  { label: 'v1', period: 'Dec 2024', note: 'Plain HTML', href: '/versions/v1' },
]

// The same portfolio as a scroll-driven 3D journey (three.js), built from /lab.
const labs = [{ label: 'Voyage', note: 'The portfolio as a flight through space', href: '/lab' }]

/** A deliberately quiet tag that opens links to earlier versions of this site and to the 3D lab. */
export default function VersionHistory() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-mono text-[11px] text-gray-600 hover:text-gray-300 transition-colors"
        title="Version history and 3D lab"
      >
        v3.0 · lab
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-72 rounded-xl border border-white/10 bg-slate-950/95 p-3 text-left shadow-2xl backdrop-blur">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">Version history</p>
          <ul className="space-y-1">
            {versions.map((v) => {
              const row = (
                <>
                  <span className="font-mono text-indigo-300">{v.label}</span>
                  <span className="flex-1 text-gray-300">{v.note}</span>
                  <span className="text-gray-500">{v.period}</span>
                </>
              )
              return (
                <li key={v.label}>
                  {v.href ? (
                    <a href={v.href} rel="nofollow" className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-white/5">
                      {row}
                    </a>
                  ) : (
                    <span className="flex items-center gap-3 rounded-md px-2 py-1.5 bg-white/[0.03]">{row}</span>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mb-2 mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">3D lab</p>
          <ul className="space-y-1">
            {labs.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-white/5">
                  <span className="font-mono text-indigo-300">{l.label}</span>
                  <span className="flex-1 text-right text-gray-500">{l.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
