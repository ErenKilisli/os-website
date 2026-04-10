'use client'
import { useEffect, useRef } from 'react'
import { useSystemStore, Theme, Wallpaper } from '@/store/systemStore'

// ── Photo wallpaper imports ───────────────────────────────────────────────────
import imgRice      from '@/img/wallpaper/pexels-jplenio-1146708.jpg'
import imgDawn      from '@/img/wallpaper/pexels-lastly-1671630.jpg'
import imgIstanbul  from '@/img/wallpaper/pexels-muhammed-mahsum-tunc-859110584-35389651.jpg'
import imgLizard    from '@/img/wallpaper/pexels-litti-lens-680831702-31598217.jpg'
import imgHighland  from '@/img/wallpaper/pexels-cmrcn-27756912.jpg'
import imgJaguar    from '@/img/wallpaper/pexels-benni-fish-40038242-17528288.jpg'

const src = (img: { src: string } | string) =>
  typeof img === 'string' ? img : img.src

/* ─── Theme colour maps ──────────────────────────────────── */
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

function runGrid(canvas: HTMLCanvasElement, _theme: Theme): () => void {
  // Pure black background — MouseDotGrid handles all dot rendering in grid mode
  return runSolid(canvas, '#000000')
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

  interface Shoot { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }
  let shoots: Shoot[] = []
  let nextShoot = Date.now() + 2000 + Math.random() * 4000
  let frame = 0
  let raf = 0

  const tick = () => {
    frame++
    const W2 = canvas.width
    const H2 = canvas.height

    const grad = ctx.createLinearGradient(0, 0, 0, H2)
    grad.addColorStop(0, '#000408')
    grad.addColorStop(0.6, '#020610')
    grad.addColorStop(1, '#040210')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W2, H2)

    stars.forEach(s => {
      const twinkle = (Math.sin(frame * s.spd + s.phase) + 1) / 2
      ctx.globalAlpha = 0.25 + twinkle * 0.75
      ctx.fillStyle = s.col
      const r = s.r * (0.6 + twinkle * 0.4)
      ctx.beginPath()
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
      ctx.fill()
    })

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

    const sky = ctx.createLinearGradient(0, 0, 0, horizon)
    sky.addColorStop(0, '#04000e')
    sky.addColorStop(0.55, '#1a0038')
    sky.addColorStop(1, '#4a005e')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, horizon)

    ctx.fillStyle = '#fff'
    for (let i = 0; i < 120; i++) {
      const sx = ((i * 139 + 20) % W)
      const sy = ((i * 83 + 10) % (horizon * 0.9))
      const br = (Math.sin(i * 0.9 + offset * 0.04) + 1) / 2
      ctx.globalAlpha = 0.08 + br * 0.55
      ctx.fillRect(sx, sy, 1, 1)
    }
    ctx.globalAlpha = 1

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

    ctx.fillStyle = 'rgba(10,0,24,0.72)'
    const stripeH = 5
    for (let sy2 = sunY - sunR; sy2 < sunY + 4; sy2 += stripeH * 2) {
      const halfW = Math.sqrt(Math.max(0, sunR * sunR - (sy2 - sunY) ** 2))
      ctx.fillRect(sunX - halfW, sy2, halfW * 2, stripeH)
    }

    ctx.save()
    ctx.shadowColor = '#ff0080'
    ctx.shadowBlur = 18
    ctx.fillStyle = 'rgba(255,0,120,0.55)'
    ctx.fillRect(0, horizon - 1, W, 3)
    ctx.restore()

    const ground = ctx.createLinearGradient(0, horizon, 0, H)
    ground.addColorStop(0, '#0d0025')
    ground.addColorStop(1, '#02000a')
    ctx.fillStyle = ground
    ctx.fillRect(0, horizon, W, H - horizon)

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

    ctx.fillStyle = 'rgba(0,0,0,0.28)'
    for (let y = Math.round(offset) % 8; y < H; y += 8) {
      ctx.fillRect(0, y, W, 3)
    }

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

function runSolid(canvas: HTMLCanvasElement, color: string): () => void {
  const ctx = canvas.getContext('2d')!
  const draw = () => {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  draw()
  // Re-draw on resize
  const observer = new ResizeObserver(draw)
  observer.observe(canvas)
  return () => observer.disconnect()
}

const AURORA_BANDS = [
  { r: 0,   g: 255, b: 180, phase: 0,   amp: 0.12, yBase: 0.25 },
  { r: 100, g: 80,  b: 255, phase: 1.2, amp: 0.10, yBase: 0.30 },
  { r: 0,   g: 220, b: 255, phase: 2.4, amp: 0.14, yBase: 0.20 },
]

function runAurora(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  let t = 0
  let raf = 0

  const tick = () => {
    t += 0.005
    const W = canvas.width
    const H = canvas.height

    // Dark night sky
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#010810')
    sky.addColorStop(1, '#020c18')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Stars
    for (let i = 0; i < 200; i++) {
      const sx = ((i * 137 + 47) % W)
      const sy = ((i * 97 + 13) % (H * 0.8))
      const br = (Math.sin(i * 1.3 + t * 2) + 1) / 2
      ctx.globalAlpha = 0.1 + br * 0.6
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(sx, sy, 1, 1)
    }
    ctx.globalAlpha = 1

    // Aurora curtains — draw vertical slabs with globalAlpha instead of per-column gradients
    for (const band of AURORA_BANDS) {
      for (let x = 0; x < W; x += 2) {
        const wave   = Math.sin(x * 0.008 + t + band.phase) * band.amp
        const baseY  = (band.yBase + wave) * H
        const height = 0.25 * H * (0.5 + 0.5 * Math.sin(x * 0.012 + t * 0.7 + band.phase))
        const third  = height / 3
        ctx.fillStyle = `rgb(${band.r},${band.g},${band.b})`
        // top fade
        ctx.globalAlpha = 0.04
        ctx.fillRect(x, baseY, 2, third)
        // core
        ctx.globalAlpha = 0.18
        ctx.fillRect(x, baseY + third, 2, third)
        // bottom fade
        ctx.globalAlpha = 0.08
        ctx.fillRect(x, baseY + third * 2, 2, third)
      }
    }
    ctx.globalAlpha = 1

    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

const SUNSET_BUILDINGS = [
  [0, 0.12], [0.06, 0.09], [0.10, 0.14], [0.16, 0.08], [0.20, 0.11],
  [0.25, 0.07], [0.30, 0.13], [0.36, 0.06], [0.42, 0.10], [0.48, 0.08],
  [0.52, 0.12], [0.57, 0.09], [0.63, 0.15], [0.70, 0.07], [0.76, 0.11],
  [0.82, 0.08], [0.88, 0.13], [0.93, 0.10], [0.97, 0.06], [1.0, 0],
]

function runSunset(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  let t = 0
  let raf = 0

  const tick = () => {
    t += 0.004
    const W = canvas.width
    const H = canvas.height

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7)
    sky.addColorStop(0, '#0a0525')
    sky.addColorStop(0.35, '#2d0a40')
    sky.addColorStop(0.65, '#8b1a4a')
    sky.addColorStop(1, '#d4502a')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Horizon glow
    const glow = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.8)
    glow.addColorStop(0, 'rgba(255,140,50,0.8)')
    glow.addColorStop(1, 'rgba(255,80,20,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, H * 0.6, W, H * 0.2)

    // Sun
    const sunX = W * 0.5
    const sunY = H * 0.68
    const sunR = Math.min(W, H) * 0.10
    const sunG = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR)
    sunG.addColorStop(0, '#fffde0')
    sunG.addColorStop(0.4, '#ffcc44')
    sunG.addColorStop(0.8, '#ff6600')
    sunG.addColorStop(1, 'rgba(255,80,0,0)')
    ctx.fillStyle = sunG
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill()

    // Water reflection
    const water = ctx.createLinearGradient(0, H * 0.7, 0, H)
    water.addColorStop(0, '#1a0820')
    water.addColorStop(0.3, '#0d0516')
    water.addColorStop(1, '#060310')
    ctx.fillStyle = water
    ctx.fillRect(0, H * 0.7, W, H * 0.3)

    // Shimmer on water
    ctx.globalAlpha = 0.3
    for (let i = 0; i < 12; i++) {
      const shimX = W * (0.3 + 0.4 * ((Math.sin(t * 1.2 + i * 0.8) + 1) / 2))
      const shimY = H * (0.72 + i * 0.024)
      const shimW = (60 + 40 * Math.sin(t + i)) * (1 - i * 0.06)
      ctx.fillStyle = '#ffcc66'
      ctx.fillRect(shimX - shimW / 2, shimY, shimW, 2)
    }
    ctx.globalAlpha = 1

    // City silhouette
    ctx.fillStyle = '#0a0410'
    ctx.beginPath()
    ctx.moveTo(0, H)
    for (let i = 0; i < SUNSET_BUILDINGS.length - 1; i++) {
      const bx = SUNSET_BUILDINGS[i][0] * W
      const bh = SUNSET_BUILDINGS[i][1] * H * 0.4
      const by = H * 0.7 - bh
      const nx = SUNSET_BUILDINGS[i + 1][0] * W
      ctx.lineTo(bx, H * 0.7)
      ctx.lineTo(bx, by)
      ctx.lineTo(nx, by)
    }
    ctx.lineTo(W, H * 0.7)
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.fill()

    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

function runOcean(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  let t = 0
  let raf = 0

  const tick = () => {
    t += 0.012
    const W = canvas.width
    const H = canvas.height

    // Deep ocean gradient
    const ocean = ctx.createLinearGradient(0, 0, 0, H)
    ocean.addColorStop(0, '#000a14')
    ocean.addColorStop(0.4, '#001824')
    ocean.addColorStop(0.7, '#002030')
    ocean.addColorStop(1, '#001018')
    ctx.fillStyle = ocean
    ctx.fillRect(0, 0, W, H)

    // Bioluminescent particles
    for (let i = 0; i < 80; i++) {
      const px = ((i * 137.5 + t * 20) % W)
      const py = ((i * 97.3 + t * 8 + Math.sin(t * 0.5 + i) * 30) % H)
      const bright = (Math.sin(t * 2.1 + i * 0.7) + 1) / 2
      ctx.globalAlpha = bright * 0.7
      ctx.fillStyle = i % 3 === 0 ? '#00ffcc' : i % 3 === 1 ? '#0088ff' : '#44ffaa'
      const r = 1 + bright * 1.5
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1

    // Caustic light patterns
    for (let i = 0; i < 20; i++) {
      const cx2 = (i * 71 + t * 15) % W
      const cy2 = H * (0.1 + 0.3 * ((i * 43) % 100) / 100) + Math.sin(t * 0.8 + i) * 20
      const cr = 15 + Math.sin(t + i * 0.5) * 10
      const cg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, cr)
      cg.addColorStop(0, 'rgba(0,200,180,0.12)')
      cg.addColorStop(1, 'rgba(0,100,120,0)')
      ctx.fillStyle = cg
      ctx.beginPath(); ctx.arc(cx2, cy2, cr, 0, Math.PI * 2); ctx.fill()
    }

    // Wave layers
    for (let layer = 0; layer < 4; layer++) {
      const baseY = H * (0.5 + layer * 0.12)
      const alpha = 0.06 + layer * 0.03
      ctx.beginPath()
      ctx.moveTo(0, H)
      for (let x = 0; x <= W; x += 4) {
        const y = baseY + Math.sin(x * 0.015 + t * (1 + layer * 0.3)) * 18
          + Math.sin(x * 0.028 - t * 0.7) * 10
        ctx.lineTo(x, y)
      }
      ctx.lineTo(W, H)
      ctx.closePath()
      ctx.fillStyle = `rgba(0,${80 + layer * 20},${120 + layer * 15},${alpha})`
      ctx.fill()
    }

    raf = requestAnimationFrame(tick)
  }
  tick()
  return () => cancelAnimationFrame(raf)
}

function runPhoto(canvas: HTMLCanvasElement, photoUrl: string): () => void {
  const ctx = canvas.getContext('2d')!
  const img = new Image()
  img.onload = () => {
    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const scale = Math.max(W / img.width, H / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
    }
    draw()
  }
  img.src = photoUrl
  return () => {}
}

/* ════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════ */
export function DesktopWallpaper() {
  const wallpaper     = useSystemStore((s) => s.wallpaper)
  const theme         = useSystemStore((s) => s.theme)
  const wallpaperColor = useSystemStore((s) => s.wallpaperColor)
  const wallpaperPhoto = useSystemStore((s) => s.wallpaperPhoto)
  const canvasRef     = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Runner = () => () => void
    const RUNNERS: Record<Wallpaper, Runner> = {
      synthwave:      () => runSynthwave(canvas),
      grid:           () => runGrid(canvas, theme),
      stars:          () => runStars(canvas),
      scanlines:      () => runScanlines(canvas, theme),
      solid:          () => runSolid(canvas, wallpaperColor),
      photo:          () => runPhoto(canvas, wallpaperPhoto || '#020812'),
      'preset-aurora':    () => runAurora(canvas),
      'preset-sunset':    () => runSunset(canvas),
      'preset-ocean':     () => runOcean(canvas),
      'preset-rice':      () => runPhoto(canvas, src(imgRice)),
      'preset-dawn':      () => runPhoto(canvas, src(imgDawn)),
      'preset-istanbul':  () => runPhoto(canvas, src(imgIstanbul)),
      'preset-lizard':    () => runPhoto(canvas, src(imgLizard)),
      'preset-highland':  () => runPhoto(canvas, src(imgHighland)),
      'preset-jaguar':    () => runPhoto(canvas, src(imgJaguar)),
    }

    const stop = RUNNERS[wallpaper]()

    return () => {
      stop()
      window.removeEventListener('resize', resize)
    }
  }, [wallpaper, theme, wallpaperColor, wallpaperPhoto])

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
