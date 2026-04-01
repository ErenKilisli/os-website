'use client'
import { useEffect, useRef } from 'react'
import { useSystemStore, Theme, Wallpaper } from '@/store/systemStore'

/* ─── Theme colour maps ──────────────────────────────────── */
const THEME_DOT: Record<Theme, string> = {
  cybercore: '#00ffff',
  vaporwave: '#ff71ce',
  matrix:    '#00ff41',
  amber:     '#ffaa00',
}
const THEME_BG: Record<Theme, string> = {
  cybercore: '#020812',
  vaporwave: '#0d0020',
  matrix:    '#000800',
  amber:     '#0d0500',
}
const THEME_BG2: Record<Theme, string> = {
  cybercore: '#0a1040',
  vaporwave: '#1a0040',
  matrix:    '#001400',
  amber:     '#1a0a00',
}

/* ════════════════════════════════════════════════════════════
   WALLPAPER RENDERERS
════════════════════════════════════════════════════════════ */

function runGrid(canvas: HTMLCanvasElement, theme: Theme): () => void {
  const ctx = canvas.getContext('2d')!
  const dot = THEME_DOT[theme]
  const bg  = THEME_BG[theme]
  let frame = 0
  let raf   = 0

  const tick = () => {
    const W = canvas.width
    const H = canvas.height
    frame++

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    const spacing = 36
    const t = frame * 0.025
    const pulse = (Math.sin(t) + 1) / 2

    for (let x = 0; x <= W; x += spacing) {
      for (let y = 0; y <= H; y += spacing) {
        const dx = x - W / 2
        const dy = y - H / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        const wave = (Math.sin(t * 1.1 - dist * 0.014) + 1) / 2
        ctx.globalAlpha = 0.06 + wave * 0.20 + pulse * 0.04
        ctx.fillStyle = dot
        ctx.fillRect(x - 1, y - 1, 2, 2)
      }
    }

    // Subtle diagonal scan line
    ctx.globalAlpha = 0.04
    ctx.fillStyle = dot
    const scanY = ((frame * 1.5) % (H + 40)) - 20
    ctx.fillRect(0, scanY, W, 2)

    ctx.globalAlpha = 1
    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

function runStars(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width
  const H = canvas.height

  interface Star { x: number; y: number; r: number; spd: number; phase: number; col: string }
  const COLORS = ['#ffffff', '#cce8ff', '#ffeedd', '#ddeeff', '#aaccff']
  const stars: Star[] = Array.from({ length: 280 }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.6 + 0.2,
    spd: Math.random() * 0.6 + 0.08,
    phase: Math.random() * Math.PI * 2,
    col: COLORS[i % COLORS.length],
  }))

  // Shooting stars
  interface Shoot { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }
  let shoots: Shoot[] = []
  let nextShoot = Date.now() + 2000 + Math.random() * 4000
  let frame = 0
  let raf = 0

  const tick = () => {
    frame++
    const W2 = canvas.width
    const H2 = canvas.height

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H2)
    grad.addColorStop(0, '#000408')
    grad.addColorStop(0.6, '#020610')
    grad.addColorStop(1, '#040210')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W2, H2)

    // Stars
    stars.forEach(s => {
      const twinkle = (Math.sin(frame * s.spd + s.phase) + 1) / 2
      ctx.globalAlpha = 0.25 + twinkle * 0.75
      ctx.fillStyle = s.col
      const r = s.r * (0.6 + twinkle * 0.4)
      ctx.beginPath()
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
      ctx.fill()
    })

    // Shooting stars
    const now = Date.now()
    if (now > nextShoot) {
      const angle = -(Math.PI / 6 + Math.random() * Math.PI / 6)
      shoots.push({ x: Math.random() * W2, y: Math.random() * H2 * 0.5, vx: Math.cos(angle) * 14, vy: Math.sin(angle) * 14, life: 0, maxLife: 28 + Math.floor(Math.random() * 20) })
      nextShoot = now + 2500 + Math.random() * 6000
    }
    shoots = shoots.filter(s => s.life < s.maxLife)
    shoots.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.life++
      const progress = s.life / s.maxLife
      ctx.globalAlpha = (1 - progress) * 0.9
      const g = ctx.createLinearGradient(s.x - s.vx * 6, s.y - s.vy * 6, s.x, s.y)
      g.addColorStop(0, 'rgba(255,255,255,0)')
      g.addColorStop(1, '#ffffff')
      ctx.strokeStyle = g
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(s.x - s.vx * 6, s.y - s.vy * 6)
      ctx.lineTo(s.x, s.y)
      ctx.stroke()
    })

    ctx.globalAlpha = 1
    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

function runSynthwave(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  let offset = 0
  let raf = 0

  const tick = () => {
    offset += 0.55
    const W = canvas.width
    const H = canvas.height
    const horizon = H * 0.50

    ctx.clearRect(0, 0, W, H)

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon)
    sky.addColorStop(0, '#04000e')
    sky.addColorStop(0.55, '#1a0038')
    sky.addColorStop(1, '#4a005e')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, horizon)

    // Stars
    ctx.fillStyle = '#fff'
    for (let i = 0; i < 120; i++) {
      const sx = ((i * 139 + 20) % W)
      const sy = ((i * 83 + 10) % (horizon * 0.9))
      const br = (Math.sin(i * 0.9 + offset * 0.04) + 1) / 2
      ctx.globalAlpha = 0.08 + br * 0.55
      ctx.fillRect(sx, sy, 1, 1)
    }
    ctx.globalAlpha = 1

    // Retro sun
    const sunX = W / 2
    const sunY = horizon - 2
    const sunR = Math.min(W, H) * 0.12
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR)
    sunGrad.addColorStop(0,   '#ffee00')
    sunGrad.addColorStop(0.3, '#ff8800')
    sunGrad.addColorStop(0.65,'#ff0070')
    sunGrad.addColorStop(1,   'rgba(255,0,100,0)')
    ctx.fillStyle = sunGrad
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill()

    // Sun scanlines (static stripes)
    ctx.fillStyle = 'rgba(10,0,24,0.72)'
    const stripeH = 5
    for (let sy2 = sunY - sunR; sy2 < sunY + 4; sy2 += stripeH * 2) {
      const halfW = Math.sqrt(Math.max(0, sunR * sunR - (sy2 - sunY) ** 2))
      ctx.fillRect(sunX - halfW, sy2, halfW * 2, stripeH)
    }

    // Horizon glow
    ctx.save()
    ctx.shadowColor = '#ff0080'
    ctx.shadowBlur = 18
    ctx.fillStyle = 'rgba(255,0,120,0.55)'
    ctx.fillRect(0, horizon - 1, W, 3)
    ctx.restore()

    // Ground
    const ground = ctx.createLinearGradient(0, horizon, 0, H)
    ground.addColorStop(0, '#0d0025')
    ground.addColorStop(1, '#02000a')
    ctx.fillStyle = ground
    ctx.fillRect(0, horizon, W, H - horizon)

    // Perspective grid — vertical lines
    ctx.lineWidth = 0.6
    ctx.globalAlpha = 0.65
    const lineCount = 24
    for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
      const baseX = W / 2 + i * (W / lineCount)
      const farness = Math.abs(i) / (lineCount / 2)
      ctx.strokeStyle = farness > 0.85 ? 'rgba(255,0,128,0.15)' : '#ff0080'
      ctx.beginPath()
      ctx.moveTo(W / 2, horizon)
      ctx.lineTo(baseX, H + 20)
      ctx.stroke()
    }

    // Perspective grid — horizontal lines
    const hCount = 14
    for (let i = 0; i < hCount; i++) {
      const t = ((i / hCount + offset * 0.007) % 1)
      const ease = t * t * t
      const y = horizon + ease * (H - horizon + 20)
      const xSpread = ease * W * 0.6
      ctx.globalAlpha = Math.min(ease * 1.4, 0.7)
      ctx.strokeStyle = '#ff0080'
      ctx.lineWidth = 0.5 + ease * 0.8
      ctx.beginPath()
      ctx.moveTo(W / 2 - xSpread, y)
      ctx.lineTo(W / 2 + xSpread, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

function runScanlines(canvas: HTMLCanvasElement, theme: Theme): () => void {
  const ctx = canvas.getContext('2d')!
  const bg1 = THEME_BG[theme]
  const bg2 = THEME_BG2[theme]
  let offset = 0
  let raf = 0

  const tick = () => {
    offset = (offset + 0.35) % 8
    const W = canvas.width
    const H = canvas.height

    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0,   bg1)
    grad.addColorStop(0.5, bg2)
    grad.addColorStop(1,   bg1)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Horizontal scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.28)'
    for (let y = Math.round(offset) % 8; y < H; y += 8) {
      ctx.fillRect(0, y, W, 3)
    }

    // Vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.88)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.6)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

/* ════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════ */
export function DesktopWallpaper() {
  const wallpaper = useSystemStore((s) => s.wallpaper)
  const theme     = useSystemStore((s) => s.theme)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const RUNNERS: Record<string, () => () => void> = {
      synthwave: () => runSynthwave(canvas),
      grid:      () => runGrid(canvas, theme),
      stars:     () => runStars(canvas),
      scanlines: () => runScanlines(canvas, theme),
    }

    const stop = (RUNNERS[wallpaper] ?? RUNNERS['synthwave'])()

    return () => {
      stop()
      window.removeEventListener('resize', resize)
    }
  }, [wallpaper, theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
