'use client'
import { useEffect, useRef, useState } from 'react'
import { useSystemStore } from '@/store/systemStore'

const THEME_DOT: Record<string, string> = {
  cybercore: '#00ffff',
  vaporwave: '#ff71ce',
  matrix:    '#00ff41',
  amber:     '#ffaa00',
}

const SPACING    = 32    // px between dots
const RADIUS     = 200   // mouse glow radius in px
const DOT_BASE_R = 1.5   // dot radius when far from mouse
const DOT_GLOW_R = 4.0   // dot radius at mouse center
const BASE_ALPHA = 0.07  // opacity far from mouse
const GLOW_ALPHA = 0.92  // opacity at mouse center
const LERP       = 0.12  // smooth trailing factor (< 1 = animated lag)
const R2         = RADIUS * RADIUS

export function MouseDotGrid() {
  const theme     = useSystemStore((s) => s.theme)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: -9999, y: -9999 })
  // themeRef: RAF loop reads color without restarting when theme changes
  const themeRef  = useRef(theme)
  const smooth    = useRef({ x: -9999, y: -9999 })  // lerped position
  const [enabled, setEnabled] = useState(false)

  // Mobile gate — no canvas on small viewports
  useEffect(() => {
    setEnabled(window.innerWidth >= 768)
  }, [])

  // Keep themeRef in sync (no RAF restart needed)
  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!

    // ── DPR-aware resize — logical coords for drawing, physical for canvas ───
    let logW = window.innerWidth
    let logH = window.innerHeight

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      logW = window.innerWidth
      logH = window.innerHeight
      canvas.width  = logW * dpr
      canvas.height = logH * dpr
      canvas.style.width  = logW + 'px'
      canvas.style.height = logH + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)  // safe reset + scale (vs cumulative ctx.scale)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Track mouse globally (works even when cursor is over windows) ────────
    const onMove  = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    let raf = 0

    const tick = () => {
      const W  = logW   // logical CSS pixels — matches ctx coordinate space
      const H  = logH
      // Lerp smoothed position toward actual mouse → animated trailing feel
      smooth.current.x += (mouse.current.x - smooth.current.x) * LERP
      smooth.current.y += (mouse.current.y - smooth.current.y) * LERP
      const mx = smooth.current.x
      const my = smooth.current.y
      const dotColor = THEME_DOT[themeRef.current] ?? '#00ffff'

      ctx.clearRect(0, 0, W, H)

      // ── Pass 1: far dots — single batched path (very fast) ────────────────
      ctx.fillStyle   = dotColor
      ctx.shadowBlur  = 0
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
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,             // above wallpaper (z:0), below CRT scanlines (z:40) and windows (z:100+)
        pointerEvents: 'none', // never blocks clicks/drags
      }}
    />
  )
}