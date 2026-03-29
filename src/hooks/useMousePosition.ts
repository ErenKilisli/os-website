'use client'

import { useState, useEffect, useRef } from 'react'
import type { MousePosition } from '@/types'

/**
 * Tracks the global mouse position.
 * Initialises far off-screen so floating icons don't react
 * before the user has moved their mouse.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: -2000, y: -2000 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return position
}

/**
 * Returns a ref-based mouse position that updates every frame
 * without triggering React re-renders — useful for animation loops.
 */
export function useMousePositionRef() {
  const ref = useRef<MousePosition>({ x: -2000, y: -2000 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      ref.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return ref
}
