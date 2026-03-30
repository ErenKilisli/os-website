'use client'
import { useEffect, useRef, useCallback } from 'react'

/* ─── Types ──────────────────────────────────────────────── */
interface Blade {
  x: number
  baseY: number
  h: number
  angle: number
  target: number
  baseAngle: number
  col: string
  w: number
}

interface Bird {
  x: number
  y: number
  vx: number
  phase: number
  size: number
  id: number
}

/* ─── Main Wallpaper Component ───────────────────────────── */
export function DesktopWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bladesRef = useRef<Blade[]>([])
  const birdsRef = useRef<Bird[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0 })
  const rafRef = useRef<number>(0)
  const birdIdRef = useRef(0)

  /* Draw static pixel-art Bliss scene */
  const drawScene = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const P = Math.ceil(w / 320) // pixel size — chunky art
    function rect(x: number, y: number, pw: number, ph: number, col: string) {
      ctx.fillStyle = col
      ctx.fillRect(Math.round(x) * P, Math.round(y) * P, Math.round(pw) * P, Math.round(ph) * P)
    }
    function hline(y: number, x0: number, x1: number, col: string) {
      ctx.fillStyle = col
      ctx.fillRect(Math.round(x0) * P, Math.round(y) * P, Math.round(x1 - x0) * P, P)
    }

    const cols = Math.round(w / P)
    const rows = Math.round(h / P)

    /* Sky gradient — block rows */
    const skyColors = ['#5ba3f5', '#55a0f5', '#50a0f5', '#5aabf5', '#62b0f2', '#6ab5ef', '#72b8ec']
    const skyRows = Math.round(rows * 0.50)
    for (let row = 0; row < skyRows; row++) {
      const t = row / skyRows
      const ci = Math.min(Math.floor(t * skyColors.length), skyColors.length - 1)
      for (let col = 0; col < cols; col++) {
        // Halftone dot pattern
        if ((col + row) % 3 === 0) {
          rect(col, row, 1, 1, 'rgba(50,100,200,0.18)')
        } else {
          rect(col, row, 1, 1, skyColors[ci])
        }
      }
    }

    /* Pixel clouds */
    const clouds = [
      { cx: 0.10, cy: 0.05, w: 30, h: 8 },
      { cx: 0.25, cy: 0.08, w: 22, h: 6 },
      { cx: 0.35, cy: 0.03, w: 18, h: 5 },
      { cx: 0.50, cy: 0.10, w: 28, h: 7 },
      { cx: 0.62, cy: 0.04, w: 20, h: 5 },
      { cx: 0.72, cy: 0.08, w: 32, h: 8 },
      { cx: 0.88, cy: 0.03, w: 25, h: 6 },
      { cx: 0.95, cy: 0.12, w: 16, h: 4 },
    ]
    for (const cld of clouds) {
      const cx = Math.round(cld.cx * cols)
      const cy = Math.round(cld.cy * rows)
      const cw = cld.w
      const ch = cld.h
      // Shadow
      for (let dx = 0; dx < cw; dx++) {
        for (let dy = Math.floor(ch * 0.5); dy < ch; dy++) {
          if (dx >= 1 && dx < cw - 1) rect(cx + dx - cw / 2, cy + dy, 1, 1, '#c8dcfa')
        }
      }
      // Main body
      for (let dx = 0; dx < cw; dx++) {
        for (let dy = 0; dy < Math.floor(ch * 0.7); dy++) {
          if (dx >= 2 && dx < cw - 2) rect(cx + dx - cw / 2, cy + dy, 1, 1, '#ffffff')
        }
      }
    }

    /* Back hill (dark green range) */
    const hillBase = Math.round(rows * 0.42)
    for (let col = 0; col < cols; col++) {
      const t = col / cols
      // Rolling hill shape — peaks left-center
      const hillY = hillBase - Math.round(
        Math.sin(t * Math.PI * 1.2) * rows * 0.14 +
        Math.sin(t * Math.PI * 0.6 + 0.3) * rows * 0.08
      )
      for (let row = hillY; row < Math.round(rows * 0.62); row++) {
        const shade = row < hillY + 2 ? '#2a5c18' : '#3a7620'
        rect(col, row, 1, 1, shade)
      }
    }

    /* Tree silhouette at ridge */
    for (let col = 0; col < cols; col++) {
      const t = col / cols
      const hillY = hillBase - Math.round(
        Math.sin(t * Math.PI * 1.2) * rows * 0.14 +
        Math.sin(t * Math.PI * 0.6 + 0.3) * rows * 0.08
      )
      // Jagged trees
      const treeNoise = (Math.sin(col * 0.7) * 2.5 + Math.sin(col * 1.3) * 1.5)
      const treeTop = hillY - Math.round(3 + Math.abs(treeNoise))
      for (let row = treeTop; row <= hillY; row++) {
        if (row >= 0 && row < rows) {
          const col2 = row === hillY ? '#1c3d0c' : '#162c08'
          rect(col, row, 1, 1, col2)
        }
      }
    }

    /* Mid foreground hill */
    for (let col = 0; col < cols; col++) {
      const t = col / cols
      const midY = Math.round(rows * 0.58) - Math.round(
        Math.sin(t * Math.PI * 0.9 + 0.5) * rows * 0.10 +
        Math.sin(t * Math.PI * 1.8) * rows * 0.03
      )
      for (let row = midY; row < Math.round(rows * 0.78); row++) {
        const shade = row < midY + 3 ? '#5cb028' : '#4a9020'
        rect(col, row, 1, 1, shade)
      }
    }

    /* Foreground grass */
    for (let col = 0; col < cols; col++) {
      const t = col / cols
      const fgY = Math.round(rows * 0.72) + Math.round(Math.sin(t * Math.PI * 2.4) * rows * 0.02)
      for (let row = fgY; row < rows; row++) {
        const depth = (row - fgY) / (rows - fgY)
        let shade: string
        if (depth < 0.1) shade = '#70c032'
        else if (depth < 0.3) shade = '#5daa28'
        else if (depth < 0.6) shade = '#4d9020'
        else shade = '#3d7818'
        rect(col, row, 1, 1, shade)
      }
    }

    /* Dirt path lines  */
    for (let col = Math.round(cols * 0.28); col < Math.round(cols * 0.52); col++) {
      const pathY = Math.round(rows * 0.82) + Math.round((col - cols * 0.28) * 0.06)
      hline(pathY, col, col + 1, '#2a1a08')
      hline(pathY + 1, col, col + 1, '#1a1008')
    }

    /* Yellow diamond flowers */
    const flowerPos = [
      [0.32, 0.85], [0.45, 0.82], [0.58, 0.88], [0.68, 0.80],
      [0.78, 0.84], [0.85, 0.90], [0.22, 0.88], [0.92, 0.83],
      [0.15, 0.82], [0.55, 0.92],
    ]
    for (const [fx, fy] of flowerPos) {
      const fpx = Math.round(fx * cols)
      const fpy = Math.round(fy * rows)
      rect(fpx, fpy - 1, 1, 1, '#d4d428')
      rect(fpx - 1, fpy, 1, 1, '#d4d428')
      rect(fpx, fpy, 1, 1, '#e8e830')
      rect(fpx + 1, fpy, 1, 1, '#d4d428')
      rect(fpx, fpy + 1, 1, 1, '#d4d428')
    }
  }, [])

  /* Init grass blades */
  const initBlades = useCallback((w: number, h: number) => {
    const blades: Blade[] = []
    const grassTop = h * 0.71
    for (let i = 0; i < Math.floor(w / 4.5); i++) {
      const x = (i / Math.floor(w / 4.5)) * w + (Math.random() - 0.5) * 8
      const baseAngle = (Math.random() - 0.5) * 0.25
      blades.push({
        x,
        baseY: grassTop + Math.random() * h * 0.10,
        h: 14 + Math.random() * 22,
        angle: baseAngle,
        target: baseAngle,
        baseAngle,
        col: `hsl(${98 + Math.random() * 20}, ${62 + Math.random() * 15}%, ${22 + Math.random() * 18}%)`,
        w: 1.5 + Math.random() * 1.8,
      })
    }
    bladesRef.current = blades
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setup = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      drawScene(ctx, w, h)
      initBlades(w, h)
    }
    setup()

    const handleResize = () => setup()
    window.addEventListener('resize', handleResize)

    /* Mouse */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      mouseRef.current.vx = nx - mouseRef.current.x
      mouseRef.current.x = nx
      mouseRef.current.y = ny
    }
    window.addEventListener('mousemove', onMouseMove)

    /* Spawn birds */
    let spawnTimer: ReturnType<typeof setTimeout>
    const spawnBird = () => {
      const w = canvas.width
      const h = canvas.height
      const numBirds = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < numBirds; i++) {
        const dir = Math.random() > 0.5 ? 1 : -1
        setTimeout(() => {
          birdsRef.current.push({
            x: dir > 0 ? -80 : w + 80,
            y: h * (0.03 + Math.random() * 0.38),
            vx: dir * (1.2 + Math.random() * 1.8),
            phase: Math.random() * Math.PI * 2,
            size: 5 + Math.random() * 7,
            id: birdIdRef.current++,
          })
        }, i * 400)
      }
      spawnTimer = setTimeout(spawnBird, 4000 + Math.random() * 8000)
    }
    spawnTimer = setTimeout(spawnBird, 2000)

    /* Animation loop (grass + birds drawn on top of static scene) */
    // We draw on top of the already-painted static scene
    // For this we use a second canvas overlay — actually we redraw the whole thing
    // but we only re-clear the sky+grass area and redraw blades
    // Actually let's use a simpler approach: use two canvases
    // => we will just create an overlay canvas for animated parts
    // BUT since we have one canvas here, let's create an overlay div with a canvas
    const overlay = document.createElement('canvas')
    overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1'
    canvas.parentElement?.appendChild(overlay)

    const resizeOverlay = () => {
      overlay.width = window.innerWidth
      overlay.height = window.innerHeight
    }
    resizeOverlay()
    window.addEventListener('resize', resizeOverlay)

    const tick = () => {
      const w2 = overlay.width
      const h2 = overlay.height
      const ctx2 = overlay.getContext('2d')
      if (!ctx2) { rafRef.current = requestAnimationFrame(tick); return }

      ctx2.clearRect(0, 0, w2, h2)

      const { x: mx, y: my, vx: mvx } = mouseRef.current
      mouseRef.current.vx *= 0.85
      const now = Date.now() * 0.001

      /* Grass blades */
      for (const b of bladesRef.current) {
        const dx = b.x - mx
        const dy = b.baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          const force = (1 - dist / 120)
          b.target = b.baseAngle + mvx * 0.025 * force
          b.target = Math.max(-0.8, Math.min(0.8, b.target))
        } else {
          // gentle wind sway
          b.target = b.baseAngle + Math.sin(now * 1.2 + b.x * 0.04) * 0.18
        }
        b.angle += (b.target - b.angle) * 0.1

        ctx2.save()
        ctx2.translate(b.x, b.baseY)
        ctx2.beginPath()
        ctx2.moveTo(0, 0)
        const tipX = Math.sin(b.angle) * b.h
        const tipY = -Math.cos(b.angle) * b.h
        const cpX = Math.sin(b.angle * 0.5) * b.h * 0.55
        const cpY = -b.h * 0.55
        ctx2.quadraticCurveTo(cpX, cpY, tipX, tipY)
        ctx2.strokeStyle = b.col
        ctx2.lineWidth = b.w
        ctx2.lineCap = 'round'
        ctx2.globalAlpha = 0.85
        ctx2.stroke()
        ctx2.restore()
      }

      /* Birds */
      birdsRef.current = birdsRef.current.filter(bird => {
        bird.x += bird.vx
        bird.phase += 0.13

        if (bird.x < -150 || bird.x > w2 + 150) return false

        const wing = Math.sin(bird.phase) * bird.size * 0.5
        ctx2.save()
        ctx2.translate(bird.x, bird.y)
        ctx2.strokeStyle = '#1a1822'
        ctx2.lineWidth = 2
        ctx2.lineCap = 'round'
        ctx2.lineJoin = 'round'
        ctx2.beginPath()
        ctx2.moveTo(-bird.size, wing)
        ctx2.lineTo(-bird.size * 0.35, 0)
        ctx2.lineTo(0, wing * 0.4)
        ctx2.lineTo(bird.size * 0.35, 0)
        ctx2.lineTo(bird.size, wing)
        ctx2.stroke()
        ctx2.restore()
        return true
      })

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(spawnTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', resizeOverlay)
      overlay.remove()
    }
  }, [drawScene, initBlades])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
        zIndex: 0,
      }}
    />
  )
}
