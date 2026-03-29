'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMousePositionRef } from '@/hooks/useMousePosition'
import type { FloatingIconDef } from '@/types'

/* ── Icon definitions ─────────────────────────────────── */
const ICONS: FloatingIconDef[] = [
  // Engineer
  { content: '</>',  type: 'engineer', initialX: 8,  initialY: 18, size: 'lg', speed: 1.1 },
  { content: '{ }',  type: 'engineer', initialX: 88, initialY: 22, size: 'md', speed: 0.85 },
  { content: '#',    type: 'engineer', initialX: 4,  initialY: 58, size: 'sm', speed: 1.4 },
  { content: '⌨',   type: 'engineer', initialX: 82, initialY: 72, size: 'md', speed: 1.0 },
  { content: '[ ]',  type: 'engineer', initialX: 14, initialY: 80, size: 'sm', speed: 0.75 },
  { content: '∞',    type: 'engineer', initialX: 50, initialY: 6,  size: 'sm', speed: 1.2 },
  // Film
  { content: '🎬',   type: 'film', initialX: 72, initialY: 14, size: 'lg', speed: 0.9  },
  { content: '🎞',   type: 'film', initialX: 91, initialY: 46, size: 'md', speed: 0.7  },
  { content: '🎥',   type: 'film', initialX: 22, initialY: 35, size: 'sm', speed: 1.3  },
  { content: '📽',   type: 'film', initialX: 60, initialY: 82, size: 'md', speed: 1.05 },
  { content: '✦',    type: 'film', initialX: 38, initialY: 8,  size: 'sm', speed: 1.6  },
  { content: '◎',    type: 'film', initialX: 96, initialY: 88, size: 'sm', speed: 0.8  },
]

const SIZE_STYLES: Record<string, { fontSize: string; opacity: number }> = {
  sm: { fontSize: '1rem',    opacity: 0.18 },
  md: { fontSize: '1.4rem',  opacity: 0.24 },
  lg: { fontSize: '2rem',    opacity: 0.30 },
}

const REPEL_RADIUS   = 170
const REPEL_STRENGTH = 65

/* ── Single floating icon ─────────────────────────────── */
interface IconProps {
  icon: FloatingIconDef
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

function FloatingIcon({ icon, mouseRef }: IconProps) {
  const posX = useMotionValue(0)
  const posY = useMotionValue(0)
  const smoothX = useSpring(posX, { stiffness: 70, damping: 14, mass: 1 })
  const smoothY = useSpring(posY, { stiffness: 70, damping: 14, mass: 1 })

  const domRef  = useRef<HTMLDivElement>(null)
  const frameId = useRef<number>(0)
  const phaseRef = useRef(Math.random() * Math.PI * 2)

  useEffect(() => {
    let tick = 0

    function loop() {
      tick++

      // Base float — smooth sine/cosine orbit
      const floatY = Math.sin(tick * 0.009 * icon.speed + phaseRef.current) * 14
      const floatX = Math.cos(tick * 0.006 * icon.speed + phaseRef.current) * 7

      // Mouse repel
      let repelX = 0
      let repelY = 0

      if (domRef.current) {
        const rect = domRef.current.getBoundingClientRect()
        const cx   = rect.left + rect.width  / 2
        const cy   = rect.top  + rect.height / 2
        const dx   = mouseRef.current.x - cx
        const dy   = mouseRef.current.y - cy
        const dist = Math.hypot(dx, dy)

        if (dist < REPEL_RADIUS && dist > 1) {
          const factor = (1 - dist / REPEL_RADIUS) ** 1.4 * REPEL_STRENGTH
          repelX = -(dx / dist) * factor
          repelY = -(dy / dist) * factor
        }
      }

      posX.set(floatX + repelX)
      posY.set(floatY + repelY)

      frameId.current = requestAnimationFrame(loop)
    }

    frameId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId.current!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { fontSize, opacity } = SIZE_STYLES[icon.size]
  const isText = !icon.content.match(/\p{Emoji}/u) // emoji vs text glyph

  return (
    <motion.div
      ref={domRef}
      style={{
        position:  'absolute',
        left:      `${icon.initialX}%`,
        top:       `${icon.initialY}%`,
        x:         smoothX,
        y:         smoothY,
        fontSize,
        opacity,
        color:     icon.type === 'engineer' ? '#00ffaa' : '#ff6b35',
        fontFamily: isText ? 'var(--font-mono)' : undefined,
        userSelect: 'none',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      aria-hidden
    >
      {icon.content}
    </motion.div>
  )
}

/* ── Container ────────────────────────────────────────── */
export function FloatingIcons() {
  const mouseRef = useMousePositionRef()

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {ICONS.map((icon, i) => (
        <FloatingIcon key={i} icon={icon} mouseRef={mouseRef} />
      ))}
    </div>
  )
}
