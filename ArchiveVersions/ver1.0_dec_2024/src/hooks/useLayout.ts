'use client'

import { useEffect, useState } from 'react'

/** Screen class used to decide how much content fits on one page. Defaults to desktop on the server. */
export function useLayout() {
  const [layout, setLayout] = useState({ phone: false, short: false, wide: true, roomy: true })
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 639px)')
    const short = window.matchMedia('(max-height: 700px)')
    // Two-column layouts start at Tailwind's lg breakpoint.
    const wide = window.matchMedia('(min-width: 1024px)')
    // Enough room for the densest two-column pages: a large width or a tall screen.
    const roomy = window.matchMedia('(min-width: 1280px), (min-height: 860px)')
    const update = () =>
      setLayout({ phone: phone.matches, short: short.matches, wide: wide.matches, roomy: roomy.matches })
    update()
    phone.addEventListener('change', update)
    short.addEventListener('change', update)
    wide.addEventListener('change', update)
    roomy.addEventListener('change', update)
    return () => {
      phone.removeEventListener('change', update)
      short.removeEventListener('change', update)
      wide.removeEventListener('change', update)
      roomy.removeEventListener('change', update)
    }
  }, [])
  return layout
}
