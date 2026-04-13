'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useCanvasScale } from './useCanvasScale'

const CW = 480
const CH = 400
const PLAYER_Y = CH * 0.30
const SPAWN_INTERVAL_START = 1600
const SPAWN_INTERVAL_MIN = 400

type Direction = 'left' | 'straight' | 'right'

interface Obstacle {
  id: number
  x: number
  y: number
  type: 'tree' | 'bear' | 'rock'
  size: number
  frame: number
}

interface TrailPoint {
  x: number
  dy: number
}

let oid = 0

const PB = '#00ccff'; const PY = '#eaea00'; const PW = '#ffffff'
const TG = '#1a6020'; const TL = '#2a8030'; const TS = '#ddeeff'; const TT = '#5d3a1a'
const BBR = '#8B5E3C'; const BDB = '#5C3A1E'; const BLT = '#a87050'
const BSN = '#C9956C'; const BEY = '#1a0800'; const CLW = '#f5f0d0'
const RGR = '#909090'; const RDK = '#606060'; const RLT = '#c4c4c4'

type Px = string | 0

function drawGrid(ctx: CanvasRenderingContext2D, grid: Px[][], ox: number, oy: number, cs: number) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const v = grid[r][c]
      if (!v) continue
      ctx.fillStyle = v as string
      ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs)
    }
  }
}

const PLAYER_S: Px[][] = [
  [0,   0,   0,  PB,  PB,  PB,   0,   0,   0,   0,   0,  0],
  [0,   0,   0,  PB,  PB,  PB,  PB,   0,   0,   0,   0,  0],
  [0,   0,   0,  PB,  PY,  PB,  PB,   0,   0,   0,   0,  0],
  [0,   0,   0,   0,  PB,  PB,   0,   0,   0,   0,   0,  0],
  [0,  PB,  PB,  PB,  PB,  PB,  PB,  PB,  PB,   0,   0,  0],
  [0,   0,   0,  PB,  PB,  PB,  PB,  PB,   0,   0,   0,  0],
  [0,   0,   0,   0,  PB,  PB,  PB,  PB,   0,   0,   0,  0],
  [0,   0,   0,  PB,  PB,   0,  PB,  PB,   0,   0,   0,  0],
  [0,  PW,  PB,  PB,   0,   0,   0,  PB,  PB,  PW,   0,  0],
  [0,  PW,  PW,  PW,  PW,  PW,  PW,  PW,  PW,  PW,  PW,  0],
]
const PLAYER_L: Px[][] = [
  [0,  PB,  PB,  PB,   0,   0,   0,   0,   0,   0,   0,  0],
  [0,  PB,  PB,  PB,  PB,   0,   0,   0,   0,   0,   0,  0],
  [0,  PB,  PY,  PB,  PB,   0,   0,   0,   0,   0,   0,  0],
  [0,   0,  PB,  PB,   0,   0,   0,   0,   0,   0,   0,  0],
  [PB, PB,  PB,  PB,  PB,  PB,  PB,  PB,   0,   0,   0,  0],
  [0,  PB,  PB,  PB,  PB,  PB,  PB,   0,   0,   0,   0,  0],
  [0,   0,  PB,  PB,  PB,  PB,   0,   0,   0,   0,   0,  0],
  [0,  PB,  PB,   0,  PB,  PB,   0,   0,   0,   0,   0,  0],
  [PW, PB,  PB,   0,   0,  PB,  PB,  PW,   0,   0,   0,  0],
  [PW, PW,  PW,  PW,  PW,  PW,  PW,  PW,   0,   0,   0,  0],
]
const PLAYER_R: Px[][] = [
  [0,   0,   0,   0,   0,  PB,  PB,  PB,   0,   0,   0,  0],
  [0,   0,   0,   0,   0,  PB,  PB,  PB,  PB,   0,   0,  0],
  [0,   0,   0,   0,   0,  PB,  PY,  PB,  PB,   0,   0,  0],
  [0,   0,   0,   0,   0,   0,  PB,  PB,   0,   0,   0,  0],
  [0,   0,   0,   0,  PB,  PB,  PB,  PB,  PB,  PB,  PB, PB],
  [0,   0,   0,   0,   0,  PB,  PB,  PB,  PB,  PB,  PB,  0],
  [0,   0,   0,   0,   0,   0,  PB,  PB,  PB,  PB,   0,  0],
  [0,   0,   0,   0,   0,  PB,  PB,   0,  PB,  PB,   0,  0],
  [0,   0,   0,  PW,  PB,  PB,   0,   0,  PB,  PB,  PW,  0],
  [0,   0,   0,  PW,  PW,  PW,  PW,  PW,  PW,  PW,  PW, PW],
]

function drawPixelPlayer(ctx: CanvasRenderingContext2D, x: number, dir: Direction) {
  const cs = 3
  const grid = dir === 'left' ? PLAYER_L : dir === 'right' ? PLAYER_R : PLAYER_S
  drawGrid(ctx, grid, Math.round(x - 6 * cs), Math.round(PLAYER_Y - 10 * cs), cs)
}

const BEAR_FRAMES: Px[][][] = [
  [
    [0,    0,   BDB, BBR, BBR, BBR, BBR, BDB,   0,   0],
    [0,   BBR,  BBR, BBR, BBR, BBR, BBR, BBR,  BBR,  0],
    [0,   BBR,  BEY, BBR, BSN, BSN, BBR, BEY,  BBR,  0],
    [0,    0,   BBR, BSN, BSN, BSN, BSN, BBR,   0,   0],
    [0,    0,   BBR, BLT, BLT, BLT, BLT, BBR,   0,   0],
    [BBR, BBR,  BBR, BBR, BBR, BBR, BBR, BBR,  BBR, BBR],
    [CLW, BBR,  BBR, BLT, BLT, BLT, BLT, BBR,  BBR, CLW],
    [0,    0,   BBR, BBR, BBR, BBR, BBR, BBR,   0,   0],
    [0,    0,   BBR,  0,  BBR, BBR,  0,  BBR,   0,   0],
    [0,    0,   BBR,  0,   0,   0,   0,  BBR,   0,   0],
    [0,   CLW,  CLW,  0,   0,   0,   0,  CLW,  CLW,  0],
  ],
  [
    [CLW,  0,   BDB, BBR, BBR, BBR, BBR, BDB,   0,  CLW],
    [0,   BBR,   0,  BBR, BBR, BBR, BBR,  0,   BBR,  0],
    [0,   BBR,  BBR, BBR, BBR, BBR, BBR, BBR,  BBR,  0],
    [0,   BBR,  BEY, BBR, BSN, BSN, BBR, BEY,  BBR,  0],
    [0,    0,   BBR, BSN, BSN, BSN, BSN, BBR,   0,   0],
    [0,    0,   BBR, BLT, BDB, BDB, BLT, BBR,   0,   0],
    [0,    0,   BBR, BBR, BBR, BBR, BBR, BBR,   0,   0],
    [0,    0,   BLT, BLT, BLT, BLT, BLT, BLT,  0,   0],
    [0,    0,   BBR,  0,  BBR, BBR,  0,  BBR,   0,   0],
    [0,    0,   BBR,  0,   0,   0,   0,  BBR,   0,   0],
    [0,   CLW,  CLW,  0,   0,   0,   0,  CLW,  CLW,  0],
  ],
]

function drawPixelBear(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frame: number) {
  const cs = Math.max(2, Math.round(size / 10))
  drawGrid(ctx, BEAR_FRAMES[frame % 2], Math.round(x - 5 * cs), Math.round(y - 11 * cs), cs)
}

const TREE_GRID: Px[][] = [
  [0,   0,   0,   0,  TG,  TS,   0,   0,   0,  0],
  [0,   0,   0,  TG,  TG,  TS,  TG,   0,   0,  0],
  [0,   0,  TG,  TL,  TG,  TG,  TL,  TG,   0,  0],
  [0,   0,  TG,  TG,  TG,  TG,  TG,  TG,   0,  0],
  [0,  TG,  TG,  TS,  TS,  TG,  TG,  TG,  TG,  0],
  [0,  TG,  TL,  TG,  TG,  TG,  TL,  TG,  TG,  0],
  [TG, TG,  TG,  TG,  TG,  TG,  TG,  TG,  TG, TG],
  [TG, TG,  TS,  TS,  TG,  TG,  TS,  TG,  TG, TG],
  [TG, TG,  TG,  TG,  TG,  TG,  TG,  TG,  TG, TG],
  [0,   0,   0,   0,  TT,  TT,   0,   0,   0,  0],
  [0,   0,   0,   0,  TT,  TT,   0,   0,   0,  0],
  [0,   0,   0,   0,  TT,  TT,   0,   0,   0,  0],
  [0,   0,   0,   0,  TT,  TT,   0,   0,   0,  0],
]
function drawPixelTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cs = Math.max(2, Math.round(size / 10))
  drawGrid(ctx, TREE_GRID, Math.round(x - 5 * cs), Math.round(y - 13 * cs), cs)
}

// Normal rock (8×5)
const ROCK_GRID: Px[][] = [
  [0,   0,  RLT, RLT, RGR, RGR,   0,   0],
  [0,  RLT, RGR, RGR, RGR, RGR, RDK,   0],
  [RLT, RGR, RGR, RDK, RDK, RGR, RDK, RDK],
  [RGR, RGR, RDK, RDK, RDK, RDK, RDK, RDK],
  [0,  RDK, RDK, RDK, RDK, RDK, RDK,   0],
]

// Large boulder with snow cap (11×8)
const BOULDER_GRID: Px[][] = [
  [0,    0,    0,   RLT,  RLT, '#fff', '#fff', RLT,   0,    0,   0  ],
  [0,    0,   RLT, '#fff','#fff','#fff','#fff','#fff', RLT,  0,   0  ],
  [0,   RLT,  RGR,  RGR,  RLT,  RLT,  RGR,  RGR,  RLT,  RDK,  0  ],
  [RLT,  RGR,  RGR,  RDK,  RGR,  RGR,  RDK,  RGR,  RGR,  RDK, RDK],
  [RGR,  RGR,  RDK,  RDK,  RGR,  RGR,  RDK,  RDK,  RDK,  RDK, RDK],
  [RGR,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK, RGR],
  [0,   RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  0  ],
  [0,    0,   RDK,  RDK,  RDK,  RDK,  RDK,  RDK,  RDK,   0,   0  ],
]

function drawPixelRock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  if (size > 45) {
    const cs = Math.max(3, Math.round(size / 11))
    drawGrid(ctx, BOULDER_GRID, Math.round(x - 5.5 * cs), Math.round(y - 8 * cs), cs)
  } else {
    const cs = Math.max(2, Math.round(size / 8))
    drawGrid(ctx, ROCK_GRID, Math.round(x - 4 * cs), Math.round(y - 5 * cs), cs)
  }
}

// Pure white snow slope — no sky, no mountains, just the piste
function drawBg(ctx: CanvasRenderingContext2D, scroll: number) {
  const snowGrad = ctx.createLinearGradient(0, 0, 0, CH)
  snowGrad.addColorStop(0,   '#ddeeff')
  snowGrad.addColorStop(0.3, '#eef5ff')
  snowGrad.addColorStop(1,   '#f8fbff')
  ctx.fillStyle = snowGrad
  ctx.fillRect(0, 0, CW, CH)

  // Subtle perspective depth — cooler tint at top (distance)
  for (let i = 0; i < 6; i++) {
    const y = i * (CH / 6)
    const alpha = Math.max(0, 0.032 - i * 0.004)
    ctx.fillStyle = `rgba(120,170,220,${alpha})`
    ctx.fillRect(0, y, CW, CH / 6)
  }

  // Soft wind-blown streaks scrolling across the snow
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const ty = ((i * 62 + scroll * 0.15) % (CH + 20)) - 10
    const tx = ((i * 71 + scroll * 0.06) % CW)
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(tx + 22, ty + 5)
    ctx.stroke()
  }
  ctx.restore()
}

// Ski trail following actual player path
function drawTrail(ctx: CanvasRenderingContext2D, trailPoints: TrailPoint[]) {
  if (trailPoints.length < 2) return
  // Trail goes UPWARD from player — shows the path they came from
  const maxDy = PLAYER_Y + 30
  ctx.save()
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  for (let i = 0; i < trailPoints.length - 1; i++) {
    const p = trailPoints[i]
    const n = trailPoints[i + 1]
    const alpha = (1 - p.dy / maxDy) * 0.62
    if (alpha <= 0) break
    ctx.strokeStyle = `rgba(40,100,200,${alpha})`
    // Left ski
    ctx.beginPath()
    ctx.moveTo(p.x - 5, PLAYER_Y - p.dy)
    ctx.lineTo(n.x - 5, PLAYER_Y - n.dy)
    ctx.stroke()
    // Right ski
    ctx.beginPath()
    ctx.moveTo(p.x + 5, PLAYER_Y - p.dy)
    ctx.lineTo(n.x + 5, PLAYER_Y - n.dy)
    ctx.stroke()
  }
  ctx.restore()
}

function drawHUD(ctx: CanvasRenderingContext2D, dist: number, best: number, speed: number) {
  ctx.fillStyle = 'rgba(0,8,24,0.78)'
  ctx.fillRect(6, 6, 210, 46)
  ctx.fillStyle = '#00ffff'
  ctx.fillRect(6, 6, 210, 2); ctx.fillRect(6, 50, 210, 2)
  ctx.fillRect(6, 6, 2, 46); ctx.fillRect(214, 6, 2, 46)
  ctx.font = 'bold 8px "Press Start 2P", monospace'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#00ffff'; ctx.fillText(`${Math.floor(dist)}M`, 14, 25)
  ctx.fillStyle = '#eaea00'; ctx.fillText(`BEST:${Math.floor(best)}M`, 14, 42)
  ctx.fillStyle = '#aaaaaa'; ctx.fillText(`SPD:${speed.toFixed(1)}x`, 116, 25)
}

export function SnowboardAppCore({ isMobile = false, onDistanceChange, onBestChange, onPhaseChange }: {
  isMobile?: boolean
  onDistanceChange?: (d: number) => void
  onBestChange?: (b: number) => void
  onPhaseChange?: (p: 'idle' | 'playing' | 'dead') => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    playerX: CW / 2,
    playerVX: 0,
    direction: 'straight' as Direction,
    obstacles: [] as Obstacle[],
    distance: 0,
    speed: 2.8,
    started: false,
    dead: false,
    best: 0,
    scroll: 0,
    keys: { left: false, right: false },
    lastSpawn: 0,
    tick: 0,
    trailPoints: [] as TrailPoint[],
  })
  const [distance, setDistance] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle')
  const rafRef = useRef<number>(0)
  const touchLastXRef = useRef(0)
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    const s = stateRef.current
    s.playerX = CW / 2; s.playerVX = 0; s.direction = 'straight'
    s.obstacles = []; s.distance = 0; s.speed = 2.8
    s.started = true; s.dead = false; s.scroll = 0; s.lastSpawn = 0; s.tick = 0
    s.trailPoints = []
    setDistance(0); setPhase('playing')
    onDistanceChange?.(0); onPhaseChange?.('playing')
  }, [])

  useCanvasScale(containerRef, canvasRef, CW, CH, 2.0)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (e.key === 'ArrowLeft'  || e.key === 'a') { e.preventDefault(); s.keys.left  = true }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); s.keys.right = true }
      if ((e.key === ' ' || e.key === 'Enter') && !s.started) reset()
      if ((e.key === ' ' || e.key === 'Enter') && s.dead) reset()
    }
    const up = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (e.key === 'ArrowLeft'  || e.key === 'a') s.keys.left  = false
      if (e.key === 'ArrowRight' || e.key === 'd') s.keys.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [reset])

  // Mobile swipe controls — press & slide left/right
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const s = stateRef.current
    if (!s.started || s.dead) { reset(); return }
    touchLastXRef.current = e.touches[0].clientX
  }, [reset])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const s = stateRef.current
    if (!s.started || s.dead) return
    const dx = e.touches[0].clientX - touchLastXRef.current
    touchLastXRef.current = e.touches[0].clientX
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    if (dx < -4)      { s.keys.left = true;  s.keys.right = false }
    else if (dx > 4)  { s.keys.right = true; s.keys.left = false  }
    // Auto-release if finger stops moving
    touchTimerRef.current = setTimeout(() => {
      s.keys.left = false; s.keys.right = false
    }, 80)
  }, [])

  const handleTouchEnd = useCallback(() => {
    const s = stateRef.current
    s.keys.left = false; s.keys.right = false
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      ctx.clearRect(0, 0, CW, CH)

      if (!s.started) {
        drawBg(ctx, 0)
        drawPixelPlayer(ctx, CW / 2, 'straight')
        ctx.fillStyle = 'rgba(0,8,24,0.65)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.textAlign = 'center'
        ctx.font = 'bold 11px "Press Start 2P", monospace'
        ctx.fillStyle = '#00ffff'
        ctx.fillText('PIXEL SNOWBOARD', CW / 2, CH / 2 - 58)
        ctx.font = 'bold 7px "Press Start 2P", monospace'
        ctx.fillStyle = '#aaddff'
        ctx.fillText('AVOID TREES, BEARS & ROCKS', CW / 2, CH / 2 - 24)
        ctx.fillText(isMobile ? 'PRESS & SLIDE TO STEER' : 'ARROWS / A D TO STEER', CW / 2, CH / 2 - 6)
        ctx.fillStyle = '#eaea00'
        ctx.fillText(isMobile ? 'TAP TO DROP IN' : 'SPACE TO DROP IN', CW / 2, CH / 2 + 28)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (!s.dead) {
        s.tick++

        if      (s.keys.left  && !s.keys.right) s.direction = 'left'
        else if (s.keys.right && !s.keys.left)  s.direction = 'right'
        else                                      s.direction = 'straight'

        if (s.keys.left)  s.playerVX -= 0.55
        if (s.keys.right) s.playerVX += 0.55
        if (!s.keys.left && !s.keys.right) s.playerVX *= 0.80
        s.playerVX = Math.max(-6.5, Math.min(6.5, s.playerVX))
        s.playerX  = Math.max(20, Math.min(CW - 20, s.playerX + s.playerVX))

        s.scroll += s.speed

        // Trail: push current position, scroll existing points downward
        s.trailPoints.forEach(p => { p.dy += s.speed })
        s.trailPoints.unshift({ x: s.playerX, dy: 0 })
        while (s.trailPoints.length > 0 && s.trailPoints[s.trailPoints.length - 1].dy > PLAYER_Y + 30) {
          s.trailPoints.pop()
        }

        s.obstacles.forEach(o => {
          o.y -= s.speed
          if (o.type === 'bear') o.frame = Math.floor(s.tick / 18)
        })
        s.obstacles = s.obstacles.filter(o => o.y > -120)

        const interval = Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_START - s.distance * 1.8)
        if (Date.now() - s.lastSpawn > interval) {
          const rnd  = Math.random()
          const type: Obstacle['type'] = rnd < 0.28 ? 'bear' : rnd < 0.50 ? 'rock' : 'tree'
          // 25% of rocks are boulders
          const size = type === 'bear' ? 28 + Math.random() * 18
                     : type === 'rock' ? (Math.random() < 0.25 ? 60 + Math.random() * 30 : 20 + Math.random() * 18)
                     :                   22 + Math.random() * 24
          s.obstacles.push({ id: oid++, x: 40 + Math.random() * (CW - 80), y: CH + 80, type, size, frame: 0 })
          if (s.distance > 80 && Math.random() < 0.35) {
            const r2 = Math.random()
            const t2: Obstacle['type'] = r2 < 0.3 ? 'bear' : r2 < 0.55 ? 'rock' : 'tree'
            const s2 = t2 === 'rock' ? (Math.random() < 0.2 ? 58 + Math.random() * 25 : 18 + Math.random() * 20)
                     : 18 + Math.random() * 20
            s.obstacles.push({ id: oid++, x: 40 + Math.random() * (CW - 80), y: CH + 140, type: t2, size: s2, frame: 0 })
          }
          s.lastSpawn = Date.now()
        }

        s.distance += s.speed * 0.045
        s.speed = Math.min(2.8 + s.distance * 0.018, 10)
        setDistance(Math.floor(s.distance)); onDistanceChange?.(Math.floor(s.distance))

        for (const o of s.obstacles) {
          const hitR = o.type === 'tree' ? o.size * 0.28
                     : o.type === 'rock' ? (o.size > 45 ? o.size * 0.38 : o.size * 0.50)
                     : o.size * 0.44
          const dx   = Math.abs(o.x - s.playerX)
          const dy   = Math.abs(o.y - PLAYER_Y)
          if (dx < hitR + 8 && dy < hitR + 10) {
            s.dead = true
            if (s.distance > s.best) {
              s.best = s.distance
              setBest(Math.floor(s.distance)); onBestChange?.(Math.floor(s.distance))
            }
            setPhase('dead'); onPhaseChange?.('dead')
            break
          }
        }
      }

      drawBg(ctx, s.scroll)
      drawTrail(ctx, s.trailPoints)

      ;[...s.obstacles].sort((a, b) => b.y - a.y).forEach(o => {
        if (o.type === 'tree') drawPixelTree(ctx, o.x, o.y, o.size)
        else if (o.type === 'bear') drawPixelBear(ctx, o.x, o.y, o.size, o.frame)
        else drawPixelRock(ctx, o.x, o.y, o.size)
      })

      if (!s.dead) drawPixelPlayer(ctx, s.playerX, s.direction)

      drawHUD(ctx, s.distance, s.best, s.speed)

      if (s.dead) {
        ctx.fillStyle = 'rgba(0,8,24,0.80)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.textAlign = 'center'
        ctx.font = 'bold 16px "Press Start 2P", monospace'
        ctx.fillStyle = '#ff3344'
        ctx.fillText('WIPEOUT!', CW / 2, CH / 2 - 58)
        ctx.font = 'bold 9px "Press Start 2P", monospace'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`${Math.floor(s.distance)}M`, CW / 2, CH / 2 - 20)
        ctx.fillStyle = '#eaea00'
        ctx.fillText(`BEST: ${Math.floor(s.best)}M`, CW / 2, CH / 2 + 8)
        ctx.font = 'bold 7px "Press Start 2P", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText(isMobile ? 'TAP TO RETRY' : 'SPACE TO RETRY', CW / 2, CH / 2 + 48)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchCancel={isMobile ? handleTouchEnd : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#ddeeff',
        overflow: 'hidden',
        touchAction: isMobile ? 'none' : 'auto',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ display: 'block', imageRendering: 'pixelated', pointerEvents: 'none' }}
      />
      {!isMobile && (
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: '8px', color: '#335566',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '3px 0', width: '100%', textAlign: 'center', flexShrink: 0,
        }}>
          ← → / A/D STEER · TREES · BEARS · ROCKS · SPACE TO START
        </div>
      )}
    </div>
  )
}

export function SnowboardWindow({ win, isMobile = false }: { win: WindowState; isMobile?: boolean }) {
  const [distance, setDistance] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle')
  return (
    <Window
      win={win}
      menu={['Game', 'Options', 'Help']}
      status={`PIXEL SNOWBOARD | ${distance}m | BEST: ${best}m${phase === 'dead' ? ' | WIPEOUT!' : ''}`}
      isMobile={isMobile}
    >
      <SnowboardAppCore
        isMobile={isMobile}
        onDistanceChange={setDistance}
        onBestChange={setBest}
        onPhaseChange={setPhase}
      />
    </Window>
  )
}
