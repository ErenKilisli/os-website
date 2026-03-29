'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Mix of Katakana, latin, and code characters for the "Engineer" aesthetic
const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノ' +
  '0123456789ABCDEF<>{}[]|#$%&/*+-=_'

interface Props {
  /** 0–1 opacity multiplier. Transitions smoothly via Framer Motion. */
  intensity?: number
}

export function MatrixCanvas({ intensity = 0.12 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const FONT_SIZE = 13
    let cols: number
    let drops: number[]

    function init() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
      cols  = Math.floor(window.innerWidth / FONT_SIZE)
      drops = Array.from({ length: cols }, () => Math.random() * -50)
    }
    init()

    const onResize = () => init()
    window.addEventListener('resize', onResize)

    let rafId: number

    function draw() {
      if (!ctx || !canvas) return

      // Translucent black overlay — creates the fading trail
      ctx.fillStyle = 'rgba(5, 5, 5, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${FONT_SIZE}px 'Courier New', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char  = CHARS[Math.floor(Math.random() * CHARS.length)]
        const alpha = Math.random() > 0.93 ? 0.9 : 0.35 // occasional bright "head"
        ctx.fillStyle = `rgba(0, 255, 170, ${alpha})`
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE)

        // Reset column when it scrolls off screen
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      animate={{ opacity: intensity }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  )
}
