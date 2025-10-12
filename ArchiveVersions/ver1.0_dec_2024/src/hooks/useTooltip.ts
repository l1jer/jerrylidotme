'use client'

import { useState, useCallback, useEffect } from 'react'

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      x: e.clientX - rect.left + 20,
      y: e.clientY - rect.top + 20,
      visible: true,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  return { tooltip, handleMouseMove, handleMouseLeave }
}

export function useTooltipTracking() {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const groups = document.querySelectorAll('.group')
    groups.forEach(group => {
      const rect = (group as HTMLElement).getBoundingClientRect()
      const x = e.clientX - rect.left + 20 // Offset by 20px to the right
      const y = e.clientY - rect.top + 20 // Offset by 20px down
      const tooltip = group.querySelector('div[class*="invisible"]') as HTMLElement
      if (tooltip) {
        tooltip.style.setProperty('--mouse-x', `${x}px`)
        tooltip.style.setProperty('--mouse-y', `${y}px`)
      }
    })
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])
}