'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

const CW = 480
const CH = 380
const PLAYER_Y = CH * 0.78
const SPAWN_INTERVAL_START = 1600
const SPAWN_INTERVAL_MIN = 400

interface Obstacle {
  id: number
  x: number
  y: number
  type: 'tree' | 'bear'
  w: number
  h: number
}

let oid = 0

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  // trunk
  ctx.fillStyle = '#5d3a1a'
  ctx.fillRect(x - 3, y, 6, size * 0.45)
  // three triangle layers
  const layers = [
    { scale: 1.0, yOff: -size * 0.90 },
    { scale: 0.72, yOff: -size * 0.55 },
    { scale: 0.48, yOff: -size * 0.22 },
  ]
  layers.forEach(({ scale, yOff }) => {
    const hw = size * scale * 0.52
    ctx.fillStyle = '#1c5c1c'
    ctx.beginPath()
    ctx.moveTo(x, y + yOff)
    ctx.lineTo(x + hw, y + yOff + size * scale * 0.60)
    ctx.lineTo(x - hw, y + yOff + size * scale * 0.60)
    ctx.closePath()
    ctx.fill()
    // snow cap
    ctx.fillStyle = 'rgba(230,242,255,0.82)'
    const sw = hw * 0.45
    ctx.beginPath()
    ctx.moveTo(x, y + yOff)
    ctx.lineTo(x + sw, y + yOff + size * scale * 0.28)
    ctx.lineTo(x - sw, y + yOff + size * scale * 0.28)
    ctx.closePath()
    ctx.fill()
  })
}

function drawBear(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const r = size * 0.4
  // body
  ctx.fillStyle = '#7a4428'
  ctx.beginPath()
  ctx.ellipse(x, y + r * 0.3, r * 1.1, r * 0.85, 0, 0, Math.PI * 2)
  ctx.fill()
  // head
  ctx.fillStyle = '#8c5030'
  ctx.beginPath()
  ctx.arc(x, y - r * 0.4, r * 0.72, 0, Math.PI * 2)
  ctx.fill()
  // ears
  ctx.fillStyle = '#7a4428'
  ;[[-0.5, -1.05], [0.5, -1.05]].forEach(([ex, ey]) => {
    ctx.beginPath()
    ctx.arc(x + ex * r, y + ey * r * 0.55, r * 0.28, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#c0704a'
    ctx.beginPath()
    ctx.arc(x + ex * r, y + ey * r * 0.55, r * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#7a4428'
  })
  // snout
  ctx.fillStyle = '#c0886a'
  ctx.beginPath()
  ctx.ellipse(x, y - r * 0.22, r * 0.38, r * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()
  // eyes
  ctx.fillStyle = '#1a0a00'
  ;[[-0.28, -0.65], [0.28, -0.65]].forEach(([ex, ey]) => {
    ctx.beginPath()
    ctx.arc(x + ex * r * 1.4, y + ey * r * 1.4, r * 0.1, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number) {
  const y = PLAYER_Y
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.beginPath()
  ctx.ellipse(x, y + 10, 16, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  // board
  ctx.save()
  ctx.translate(x, y + 4)
  ctx.rotate(0.10)
  ctx.fillStyle = '#0044cc'
  ctx.beginPath()
  ctx.roundRect(-16, -4, 32, 8, 4)
  ctx.fill()
  ctx.fillStyle = '#ffcc00'
  ctx.fillRect(-6, -4, 12, 3)
  ctx.restore()
  // legs
  ctx.fillStyle = '#222266'
  ctx.fillRect(x - 5, y - 8, 4, 12)
  ctx.fillRect(x + 1, y - 8, 4, 12)
  // jacket
  ctx.fillStyle = '#cc2222'
  ctx.fillRect(x - 6, y - 20, 12, 12)
  // arms
  ctx.fillStyle = '#cc2222'
  ctx.fillRect(x - 12, y - 18, 6, 4)
  ctx.fillRect(x + 6, y - 18, 6, 4)
  // hands
  ctx.fillStyle = '#222'
  ctx.fillRect(x - 14, y - 18, 4, 4)
  ctx.fillRect(x + 10, y - 18, 4, 4)
  // head
  ctx.fillStyle = '#ffcc88'
  ctx.beginPath()
  ctx.arc(x, y - 25, 8, 0, Math.PI * 2)
  ctx.fill()
  // helmet
  ctx.fillStyle = '#0044cc'
  ctx.beginPath()
  ctx.arc(x, y - 25, 8, Math.PI, 0)
  ctx.fill()
  // goggles
  ctx.fillStyle = '#ffcc00'
  ctx.fillRect(x - 7, y - 28, 14, 5)
  ctx.fillStyle = 'rgba(0,150,255,0.4)'
  ctx.fillRect(x - 6, y - 27, 5, 3)
  ctx.fillRect(x + 1, y - 27, 5, 3)
}

function drawBackground(ctx: CanvasRenderingContext2D, scroll: number) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, CH * 0.25)
  sky.addColorStop(0, '#a8c8f0')
  sky.addColorStop(1, '#d0e8f8')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CW, CH * 0.25)

  // mountain silhouette
  ctx.fillStyle = '#c8dce8'
  ctx.beginPath()
  ctx.moveTo(0, CH * 0.25)
  ctx.lineTo(CW * 0.2, CH * 0.1)
  ctx.lineTo(CW * 0.4, CH * 0.18)
  ctx.lineTo(CW * 0.6, CH * 0.05)
  ctx.lineTo(CW * 0.8, CH * 0.15)
  ctx.lineTo(CW, CH * 0.08)
  ctx.lineTo(CW, CH * 0.25)
  ctx.closePath()
  ctx.fill()

  // snow ground
  const snow = ctx.createLinearGradient(0, CH * 0.25, 0, CH)
  snow.addColorStop(0, '#e8f2fc')
  snow.addColorStop(0.5, '#ddeaf8')
  snow.addColorStop(1, '#c8d8ec')
  ctx.fillStyle = snow
  ctx.fillRect(0, CH * 0.25, CW, CH)

  // speed stripes
  const stripeCount = 8
  ctx.strokeStyle = 'rgba(200,220,240,0.45)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < stripeCount; i++) {
    const baseX = (i / stripeCount) * CW + (scroll * 0.08) % (CW / stripeCount)
    const waviness = Math.sin(i * 1.3 + scroll * 0.003) * 12
    ctx.beginPath()
    ctx.moveTo(baseX + waviness, CH * 0.28)
    ctx.bezierCurveTo(
      baseX + waviness * 0.6, CH * 0.5,
      baseX - waviness * 0.4, CH * 0.7,
      baseX + waviness * 0.2, CH
    )
    ctx.stroke()
  }
}

export function SnowboardWindow({ win, isMobile = false }: { win: WindowState; isMobile?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    playerX: CW / 2,
    playerVX: 0,
    obstacles: [] as Obstacle[],
    distance: 0,
    speed: 2.8,
    started: false,
    dead: false,
    best: 0,
    scroll: 0,
    keys: { left: false, right: false },
    lastSpawn: 0,
  })
  const [distance, setDistance] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle')
  const rafRef = useRef<number>(0)

  const reset = useCallback(() => {
    const s = stateRef.current
    s.playerX = CW / 2
    s.playerVX = 0
    s.obstacles = []
    s.distance = 0
    s.speed = 2.8
    s.started = true
    s.dead = false
    s.scroll = 0
    s.lastSpawn = 0
    setDistance(0)
    setPhase('playing')
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); s.keys.left = true }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); s.keys.right = true }
      if ((e.key === ' ' || e.key === 'Enter') && !s.started) reset()
      if ((e.key === ' ' || e.key === 'Enter') && s.dead) reset()
    }
    const up = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (e.key === 'ArrowLeft' || e.key === 'a') s.keys.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') s.keys.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [reset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      ctx.clearRect(0, 0, CW, CH)

      // Idle screen
      if (!s.started) {
        drawBackground(ctx, 0)
        drawPlayer(ctx, CW / 2)
        ctx.fillStyle = 'rgba(0,20,60,0.55)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold 20px "Space Grotesk", monospace`
        ctx.fillText('SNOWBOARD.EXE', CW / 2, CH / 2 - 50)
        ctx.font = `bold 11px "Space Grotesk", monospace`
        ctx.fillStyle = '#a0d8ff'
        ctx.fillText('AVOID TREES & BEARS', CW / 2, CH / 2 - 18)
        ctx.fillText('← → OR A/D TO STEER', CW / 2, CH / 2 + 4)
        ctx.fillStyle = '#ffcc00'
        ctx.font = `bold 14px "Space Grotesk", monospace`
        ctx.fillText('PRESS SPACE TO DROP IN', CW / 2, CH / 2 + 40)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (!s.dead) {
        // Physics
        const accel = 0.55
        const friction = 0.80
        if (s.keys.left) s.playerVX -= accel
        if (s.keys.right) s.playerVX += accel
        if (!s.keys.left && !s.keys.right) s.playerVX *= friction
        s.playerVX = Math.max(-6.5, Math.min(6.5, s.playerVX))
        s.playerX = Math.max(18, Math.min(CW - 18, s.playerX + s.playerVX))

        s.scroll += s.speed
        s.obstacles.forEach((o) => { o.y += s.speed })
        s.obstacles = s.obstacles.filter((o) => o.y < CH + 80)

        // Spawn
        const interval = Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_START - s.distance * 1.8)
        if (Date.now() - s.lastSpawn > interval) {
          const isBear = Math.random() < 0.28
          const size = isBear ? 28 + Math.random() * 18 : 22 + Math.random() * 24
          s.obstacles.push({
            id: oid++,
            x: 40 + Math.random() * (CW - 80),
            y: -60,
            type: isBear ? 'bear' : 'tree',
            w: size,
            h: size,
          })
          // Sometimes spawn two
          if (s.distance > 80 && Math.random() < 0.35) {
            s.obstacles.push({
              id: oid++,
              x: 40 + Math.random() * (CW - 80),
              y: -100,
              type: Math.random() < 0.3 ? 'bear' : 'tree',
              w: 20 + Math.random() * 20,
              h: 20 + Math.random() * 20,
            })
          }
          s.lastSpawn = Date.now()
        }

        // Distance & speed
        s.distance += s.speed * 0.045
        s.speed = Math.min(2.8 + s.distance * 0.018, 10)
        setDistance(Math.floor(s.distance))

        // Collision
        for (const o of s.obstacles) {
          const hitR = o.type === 'tree' ? o.w * 0.28 : o.w * 0.42
          const dx = Math.abs(o.x - s.playerX)
          const dy = Math.abs(o.y - PLAYER_Y)
          if (dx < hitR + 8 && dy < hitR + 10) {
            s.dead = true
            if (s.distance > s.best) {
              s.best = s.distance
              setBest(Math.floor(s.distance))
            }
            setPhase('dead')
            break
          }
        }
      }

      drawBackground(ctx, s.scroll)

      // Obstacles
      s.obstacles.forEach((o) => {
        if (o.type === 'tree') drawTree(ctx, o.x, o.y, o.w)
        else drawBear(ctx, o.x, o.y, o.w)
      })

      // Player
      if (!s.dead) {
        drawPlayer(ctx, s.playerX)
        // speed lines
        if (s.speed > 4) {
          ctx.strokeStyle = `rgba(180,210,240,${Math.min(0.5, (s.speed - 4) * 0.1)})`
          ctx.lineWidth = 1.2
          for (let i = 0; i < 5; i++) {
            const lx = s.playerX + (Math.random() - 0.5) * 40
            const len = s.speed * 5
            ctx.beginPath(); ctx.moveTo(lx, PLAYER_Y + 12); ctx.lineTo(lx, PLAYER_Y + 12 + len); ctx.stroke()
          }
        }
      }

      // HUD
      ctx.fillStyle = 'rgba(0,20,60,0.5)'
      ctx.fillRect(8, 8, 150, 38)
      ctx.fillStyle = '#fff'
      ctx.font = `bold 10px "Space Grotesk", monospace`
      ctx.textAlign = 'left'
      ctx.fillText(`DISTANCE: ${Math.floor(s.distance)}m`, 14, 22)
      ctx.fillText(`SPEED: ${s.speed.toFixed(1)}x  |  BEST: ${Math.floor(s.best)}m`, 14, 36)

      // Dead screen
      if (s.dead) {
        ctx.fillStyle = 'rgba(0,10,40,0.72)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ff3344'
        ctx.font = `bold 22px "Space Grotesk", monospace`
        ctx.fillText('WIPEOUT!', CW / 2, CH / 2 - 52)
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold 13px "Space Grotesk", monospace`
        ctx.fillText(`DISTANCE: ${Math.floor(s.distance)}m`, CW / 2, CH / 2 - 20)
        ctx.fillStyle = '#ffcc00'
        ctx.font = `bold 13px "Space Grotesk", monospace`
        ctx.fillText(`BEST: ${Math.floor(s.best)}m`, CW / 2, CH / 2 + 4)
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.font = `bold 10px "Space Grotesk", monospace`
        ctx.fillText('PRESS SPACE TO RETRY', CW / 2, CH / 2 + 36)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <Window
      win={win}
      menu={['Game', 'Options', 'Help']}
      status={`SNOWBOARD.EXE | ${distance}m | BEST: ${best}m${phase === 'dead' ? ' | WIPEOUT!' : ''}`}
      isMobile={isMobile}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#c8d8ec' }}>
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ display: 'block', imageRendering: 'auto' }}
        />
        <div style={{ fontFamily: 'var(--font-h)', fontSize: '8px', color: '#446', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 0', background: '#c8d8ec' }}>
          ← → / A/D — AVOID TREES & BEARS — SPACE TO START
        </div>
      </div>
    </Window>
  )
}
