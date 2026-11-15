'use client'

import { useEffect, useState } from 'react'

/** Screen class used to decide how much content fits on one page. Defaults to desktop on the server. */
export function useLayout() {
  const [layout, setLayout] = useState({ phone: false, short: false })
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 639px)')
    const short = window.matchMedia('(max-height: 700px)')
    const update = () => setLayout({ phone: phone.matches, short: short.matches })
    update()
    phone.addEventListener('change', update)
    short.addEventListener('change', update)
    return () => {
      phone.removeEventListener('change', update)
      short.removeEventListener('change', update)
    }
  }, [])
  return layout
}
