'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'universe-time-phase'
const STORAGE_TIMESTAMP_KEY = 'universe-last-timestamp'

export default function UniverseBackground() {
  const [timePhase, setTimePhase] = useState(0)

  useEffect(() => {
    // Restore the last known time phase and calculate elapsed time
    if (typeof window !== 'undefined') {
      const savedPhase = localStorage.getItem(STORAGE_KEY)
      const savedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY)
      
      if (savedPhase && savedTimestamp) {
        const lastPhase = parseInt(savedPhase, 10)
        const lastTimestamp = parseInt(savedTimestamp, 10)
        const currentTimestamp = Date.now()
        
        // Calculate how many seconds have passed since last visit
        const elapsedSeconds = Math.floor((currentTimestamp - lastTimestamp) / 1000)
        
        // Resume from where we left off plus elapsed time
        const resumedPhase = (lastPhase + elapsedSeconds) % 360
        setTimePhase(resumedPhase)
      }
    }

    const interval = setInterval(() => {
      setTimePhase((prev) => {
        const nextPhase = (prev + 1) % 360
        
        // Persist the current phase and timestamp to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, nextPhase.toString())
          localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
        }
        
        return nextPhase
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // Calculate current colours based on time phase (0-360)
  const getBackgroundColours = () => {
    const phase = timePhase / 360 // 0 to 1

    if (phase < 0.25) {
      // Dawn (0-90s): Deep blue-purple to bright blue
      const t = phase * 4
      return {
        bg: interpolateColour('#0a0a1a', '#1a1a3a', t),
        gradient1: { 
          color: interpolateColour('#1a0a2a', '#3a2a5a', t), 
          opacity: 0.3 + t * 0.2 
        },
        gradient2: { 
          color: interpolateColour('#0a1a2a', '#2a4a6a', t), 
          opacity: 0.2 + t * 0.2 
        }
      }
    } else if (phase < 0.5) {
      // Day (90-180s): Bright blue peak
      const t = (phase - 0.25) * 4
      return {
        bg: interpolateColour('#1a1a3a', '#1a2a4a', t),
        gradient1: { 
          color: interpolateColour('#3a2a5a', '#4a3a6a', t), 
          opacity: 0.5 
        },
        gradient2: { 
          color: interpolateColour('#2a4a6a', '#3a5a8a', t), 
          opacity: 0.4 
        }
      }
    } else if (phase < 0.75) {
      // Dusk (180-270s): Blue to deep purple-black
      const t = (phase - 0.5) * 4
      return {
        bg: interpolateColour('#1a2a4a', '#0f0f1f', t),
        gradient1: { 
          color: interpolateColour('#4a3a6a', '#2a1a3a', t), 
          opacity: 0.5 - t * 0.2 
        },
        gradient2: { 
          color: interpolateColour('#3a5a8a', '#1a2a4a', t), 
          opacity: 0.4 - t * 0.2 
        }
      }
    } else {
      // Night (270-360s): Deep black to dawn prep
      const t = (phase - 0.75) * 4
      return {
        bg: interpolateColour('#0f0f1f', '#0a0a1a', t),
        gradient1: { 
          color: interpolateColour('#2a1a3a', '#1a0a2a', t), 
          opacity: 0.3 
        },
        gradient2: { 
          color: interpolateColour('#1a2a4a', '#0a1a2a', t), 
          opacity: 0.2 
        }
      }
    }
  }

  // Helper function to interpolate between two hex colours
  function interpolateColour(color1: string, color2: string, factor: number): string {
    const c1 = parseInt(color1.slice(1), 16)
    const c2 = parseInt(color2.slice(1), 16)
    
    const r1 = (c1 >> 16) & 0xff
    const g1 = (c1 >> 8) & 0xff
    const b1 = c1 & 0xff
    
    const r2 = (c2 >> 16) & 0xff
    const g2 = (c2 >> 8) & 0xff
    const b2 = c2 & 0xff
    
    const r = Math.round(r1 + (r2 - r1) * factor)
    const g = Math.round(g1 + (g2 - g1) * factor)
    const b = Math.round(b1 + (b2 - b1) * factor)
    
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  const colours = getBackgroundColours()

  return (
    <>
      {/* Solid background colour */}
      <div 
        className="fixed inset-0 z-0 transition-colors duration-[2000ms] ease-in-out"
        style={{ backgroundColor: colours.bg }}
      />
      
      {/* Animated gradient overlays for depth */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2] transition-all duration-[2000ms] ease-in-out"
        style={{
          background: `
            radial-gradient(circle at top right, ${colours.gradient1.color}, transparent),
            radial-gradient(circle at 20% 80%, ${colours.gradient2.color}, transparent)
          `,
          opacity: colours.gradient1.opacity
        }}
      />
    </>
  )
}

