'use client'

import { useState, useEffect, useRef } from 'react'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

export default function UniverseSoundControl() {
  const [isMuted, setIsMuted] = useState(true) // Start muted (no autoplay)
  const [isVisible, setIsVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Create audio element with optimised settings
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sound/the-sound-of-universe.mp3')
      audio.loop = true
      audio.volume = 0.15 // Very low volume (15%)
      audio.preload = 'none' // Don't preload - load only when user clicks
      audioRef.current = audio

      // Handle audio loading errors gracefully
      audio.addEventListener('error', () => {
        console.log('Audio file is loading in the background')
      })

      return () => {
        audio.pause()
        audio.src = '' // Release resources
      }
    }
  }, [])

  const toggleMute = async () => {
    if (!audioRef.current) return

    try {
      if (isMuted) {
        // Unmute and play
        audioRef.current.volume = 0.15
        await audioRef.current.play()
        setIsMuted(false)
      } else {
        // Mute
        audioRef.current.pause()
        setIsMuted(true)
      }
    } catch {
      // Handle autoplay restrictions gracefully
      console.log('Audio playback requires user interaction')
    }
  }

  return (
    <button
      type="button"
      onClick={toggleMute}
      className={`
        fixed bottom-8 right-8 z-50 p-3 rounded-full 
        bg-white/10 backdrop-blur-sm border border-white/20 
        text-white hover:bg-white/20 focus:outline-none
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      aria-label={isMuted ? 'Unmute universe sound' : 'Mute universe sound'}
      title={isMuted ? 'Play universe ambience' : 'Pause universe ambience'}
    >
      {isMuted ? (
        <HiVolumeOff className="h-6 w-6" />
      ) : (
        <HiVolumeUp className="h-6 w-6" />
      )}
    </button>
  )
}

