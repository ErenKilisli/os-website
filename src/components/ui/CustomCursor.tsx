'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Two-layer custom cursor:
 *  • Dot  — snappy, follows exactly (stiffness 700)
 *  • Ring — laggy, trails behind (stiffness 130) — mix-blend-difference
 *
 * The cursor CSS class on <body> hides the default OS cursor.
 */
export function CustomCursor() {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)

  const dotX  = useSpring(mx, { stiffness: 700, damping: 32, mass: 0.4 })
  const dotY  = useSpring(my, { stiffness: 700, damping: 32, mass: 0.4 })
  const ringX = useSpring(mx, { stiffness: 130, damping: 22, mass: 0.8 })
  const ringY = useSpring(my, { stiffness: 130, damping: 22, mass: 0.8 })

  const isHoveringRef = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }

    // Expand ring on interactive elements
    const onEnter = () => { isHoveringRef.current = true }
    const onLeave = () => { isHoveringRef.current = false }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [mx, my])

  return (
    <>
      {/* Dot — precise, accent-green */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#00ffaa]"
        style={{
          width: 6,
          height: 6,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Ring — lagging, inverts colours underneath */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-white mix-blend-difference"
        style={{
          width: 32,
          height: 32,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  )
}
