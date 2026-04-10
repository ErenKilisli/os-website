'use client'
import { useEffect, useRef } from 'react'
import { useSystemStore } from '@/store/systemStore'

const THEME_DOT: Record<string, string> = {
  cybercore: '#00ffff',
  vaporwave: '#ff71ce',
  matrix:    '#00ff41',
  amber:     '#ffaa00',
}

const SPACING    = 32    // px between dots
const RADIUS     = 160   // mouse glow radius in px
const DOT_BASE_R = 1.5   // dot radius when far from mouse
const DOT_GLOW_R = 4.0   // dot radius at mouse center
const BASE_ALPHA = 0.07  // opacity far from mouse
const GLOW_ALPHA = 0.88  // opacity at mouse center

export function MouseDotGrid() {
  const theme    = useSystemStore((s) => s.theme)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse    = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dotColor = THEME_DOT[theme] ?? '#00ffff'
    const R2 = RADIUS * RADIUS

    // ── Size canvas to viewport ──────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Track mouse globally (works even when cursor is over windows) ────────
    const onMove  = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const ctx = canvas.getContext('2d')!
    let raf = 0

    const tick = () => {
      const W  = canvas.width
      const H  = canvas.height
      const mx = mouse.current.x
      const my = mouse.current.y

      ctx.clearRect(0, 0, W, H)

      // ── Pass 1: far dots — single batched path (very fast) ────────────────
      ctx.fillStyle  = dotColor
      ctx.shadowBlur = 0
      ctx.globalAlpha = BASE_ALPHA
      ctx.beginPath()
      for (let x = SPACING / 2; x < W; x += SPACING) {
        for (let y = SPACING / 2; y < H; y += SPACING) {
          const dx = mx - x, dy = my - y
          if (dx * dx + dy * dy > R2) {
            ctx.moveTo(x + DOT_BASE_R, y)
            ctx.arc(x, y, DOT_BASE_R, 0, Math.PI * 2)
          }
        }
      }
      ctx.fill()

      // ── Pass 2: glow dots near mouse — individual draws with shadow ───────
      ctx.shadowColor = dotColor
      for (let x = SPACING / 2; x < W; x += SPACING) {
        for (let y = SPACING / 2; y < H; y += SPACING) {
          const dx = mx - x, dy = my - y
          const d2 = dx * dx + dy * dy
          if (d2 > R2) continue

          const s = Math.pow(1 - Math.sqrt(d2) / RADIUS, 1.5)
          ctx.globalAlpha = BASE_ALPHA + s * (GLOW_ALPHA - BASE_ALPHA)
          ctx.shadowBlur  = s * 14
          ctx.fillStyle   = dotColor
          ctx.beginPath()
          ctx.arc(x, y, DOT_BASE_R + s * (DOT_GLOW_R - DOT_BASE_R), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Reset context state
      ctx.shadowBlur  = 0
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,          // above wallpaper (z:0), below windows (z:100+)
        pointerEvents: 'none',  // never blocks clicks/drags
      }}
    />
  )
}