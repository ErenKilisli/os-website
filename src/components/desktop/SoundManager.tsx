'use client'
import { useEffect, useRef } from 'react'
import { useWindowStore } from '@/store/windowStore'
import { useSounds } from '@/hooks/useSounds'

export function SoundManager() {
  const windowCount    = useWindowStore((s) => s.windows.length)
  const minimizedCount = useWindowStore((s) => s.windows.filter(w => w.isMinimized).length)
  const { playOpen, playClose, playMinimize } = useSounds()

  const prevCount     = useRef(windowCount)
  const prevMinimized = useRef(minimizedCount)
  const mounted       = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current     = true
      prevCount.current     = windowCount
      prevMinimized.current = minimizedCount
      return
    }

    if (windowCount > prevCount.current) {
      playOpen()
    } else if (windowCount < prevCount.current) {
      playClose()
    } else if (minimizedCount > prevMinimized.current) {
      playMinimize()
    }

    prevCount.current     = windowCount
    prevMinimized.current = minimizedCount
  }, [windowCount, minimizedCount, playOpen, playClose, playMinimize])

  return null
}