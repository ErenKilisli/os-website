'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useCanvasScale } from './useCanvasScale'

// Logical canvas dimensions (pixel art resolution)
const CW = 480
const CH = 400
const PLAYER_Y = CH * 0.15    // player near top — obstacles rise up
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

let oid = 0

// ─── Colors ─────────────────────────────────────────────────────────────────
const PB = '#00ccff'   // player cyan body
const PY = '#eaea00'   // player yellow accent
const PW = '#ffffff'   // player white board

// Tree colors
const TG = '#1a6020'; const TL = '#2a8030'; const TS = '#ddeeff'; const TT = '#5d3a1a'

// Bear colors — redesigned for clarity
const BBR = '#8B5E3C'; const BDB = '#5C3A1E'; const BLT = '#a87050'
const BSN = '#C9956C'; const BEY = '#1a0800'; const CLW = '#f5f0d0'

// Rock colors
const RGR = '#909090'; const RDK = '#606060'; const RLT = '#c4c4c4'

type Px = string | 0

function drawGrid(ctx: CanvasRenderingContext2D, grid: Px[][], ox: number, oy: number, cs: number) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const v = grid[r][c]
      if (!v) continue
      ctx.fillStyle = v
      ctx.fillRect(ox + c * cs, oy + r * cs, cs, cs)
    }
  }
}

// ─── Player sprites (12 cols × 10 rows, cs=3) ───────────────────────────────
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
// Leaning left — body shifts left, board tilts
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
// Leaning right — body shifts right, board tilts
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

// ─── Bear sprites — redesigned, cleaner animation (10 cols × 11 rows) ──────
// Frame 0: arms at sides
// Frame 1: arms raised / roaring
const BEAR_FRAMES: Px[][][] = [
  [ // frame 0 — resting, arms at sides
    [0,    0,   BDB, BBR, BBR, BBR, BBR, BDB,   0,   0],  // head + ears
    [0,   BBR,  BBR, BBR, BBR, BBR, BBR, BBR,  BBR,  0],  // head wide
    [0,   BBR,  BEY, BBR, BSN, BSN, BBR, BEY,  BBR,  0],  // eyes + snout
    [0,    0,   BBR, BSN, BSN, BSN, BSN, BBR,   0,   0],  // muzzle
    [0,    0,   BBR, BLT, BLT, BLT, BLT, BBR,   0,   0],  // belly
    [BBR, BBR,  BBR, BBR, BBR, BBR, BBR, BBR,  BBR, BBR], // shoulders
    [CLW, BBR,  BBR, BLT, BLT, BLT, BLT, BBR,  BBR, CLW], // arms + belly
    [0,    0,   BBR, BBR, BBR, BBR, BBR, BBR,   0,   0],  // lower body
    [0,    0,   BBR,  0,  BBR, BBR,  0,  BBR,   0,   0],  // legs
    [0,    0,   BBR,  0,   0,   0,   0,  BBR,   0,   0],  // legs lower
    [0,   CLW,  CLW,  0,   0,   0,   0,  CLW,  CLW,  0],  // paws
  ],
  [ // frame 1 — arms raised, roaring
    [CLW,  0,   BDB, BBR, BBR, BBR, BBR, BDB,   0,  CLW], // claws raised
    [0,   BBR,   0,  BBR, BBR, BBR, BBR,  0,   BBR,  0],  // arms up
    [0,   BBR,  BBR, BBR, BBR, BBR, BBR, BBR,  BBR,  0],  // head wide
    [0,   BBR,  BEY, BBR, BSN, BSN, BBR, BEY,  BBR,  0],  // eyes
    [0,    0,   BBR, BSN, BSN, BSN, BSN, BBR,   0,   0],  // muzzle open
    [0,    0,   BBR, BLT, BDB, BDB, BLT, BBR,   0,   0],  // mouth open
    [0,    0,   BBR, BBR, BBR, BBR, BBR, BBR,   0,   0],  // body
    [0,    0,   BLT, BLT, BLT, BLT, BLT, BLT,  0,   0],  // belly
    [0,    0,   BBR,  0,  BBR, BBR,  0,  BBR,   0,   0],  // legs
    [0,    0,   BBR,  0,   0,   0,   0,  BBR,   0,   0],
    [0,   CLW,  CLW,  0,   0,   0,   0,  CLW,  CLW,  0],  // paws
  ],
]

function drawPixelBear(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frame: number) {
  const cs = Math.max(2, Math.round(size / 10))
  drawGrid(ctx, BEAR_FRAMES[frame % 2], Math.round(x - 5 * cs), Math.round(y - 11 * cs), cs)
}

// ─── Tree (10 cols × 13 rows) ────────────────────────────────────────────────
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

// ─── Rock (8 cols × 5 rows) ──────────────────────────────────────────────────
const ROCK_GRID: Px[][] = [
  [0,   0,  RLT, RLT, RGR, RGR,   0,   0],
  [0,  RLT, RGR, RGR, RGR, RGR, RDK,   0],
  [RLT, RGR, RGR, RDK, RDK, RGR, RDK, RDK],
  [RGR, RGR, RDK, RDK, RDK, RDK, RDK, RDK],
  [0,  RDK, RDK, RDK, RDK, RDK, RDK,   0],
]
function drawPixelRock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cs = Math.max(2, Math.round(size / 8))
  drawGrid(ctx, ROCK_GRID, Math.round(x - 4 * cs), Math.round(y - 5 * cs), cs)
}

// ─── Background — white snow ──────────────────────────────────────────────────
function drawBg(ctx: CanvasRenderingContext2D, scroll: number) {
  // Sky — pale blue gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 80)
  skyGrad.addColorStop(0, '#a8d0f0')
  skyGrad.addColorStop(1, '#d8eef8')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, CW, 80)

  // Far mountains (lighter, misty)
  ctx.fillStyle = '#b8d8ee'
  ctx.beginPath()
  ctx.moveTo(0, 80)
  ctx.lineTo(30, 44); ctx.lineTo(60, 58); ctx.lineTo(100, 28); ctx.lineTo(140, 50)
  ctx.lineTo(180, 20); ctx.lineTo(220, 42); ctx.lineTo(260, 14); ctx.lineTo(300, 36)
  ctx.lineTo(340, 10); ctx.lineTo(380, 30); ctx.lineTo(420, 16); ctx.lineTo(460, 32)
  ctx.lineTo(480, 22); ctx.lineTo(480, 80)
  ctx.closePath(); ctx.fill()

  // Near mountains (darker, closer)
  ctx.fillStyle = '#90bcd8'
  ctx.beginPath()
  ctx.moveTo(0, 80)
  ctx.lineTo(50, 56); ctx.lineTo(90, 68); ctx.lineTo(130, 42); ctx.lineTo(170, 62)
  ctx.lineTo(210, 36); ctx.lineTo(250, 54); ctx.lineTo(290, 30); ctx.lineTo(330, 50)
  ctx.lineTo(370, 24); ctx.lineTo(410, 46); ctx.lineTo(450, 34); ctx.lineTo(480, 50)
  ctx.lineTo(480, 80)
  ctx.closePath(); ctx.fill()

  // Snow caps on near mountains
  ctx.fillStyle = '#f0f8ff'
  const caps = [[50,56],[90,68],[130,42],[170,62],[210,36],[250,54],[290,30],[330,50],[370,24],[410,46]]
  caps.forEach(([px, py]) => {
    ctx.beginPath()
    ctx.arc(px, py, 10, 0, Math.PI * 2)
    ctx.fill()
  })

  // White snow slope — main canvas area
  const snowGrad = ctx.createLinearGradient(0, 80, 0, CH)
  snowGrad.addColorStop(0, '#eef6ff')
  snowGrad.addColorStop(0.4, '#f4f9ff')
  snowGrad.addColorStop(1, '#f8fbff')
  ctx.fillStyle = snowGrad
  ctx.fillRect(0, 80, CW, CH - 80)

  // Very subtle snow depth stripes (perspective)
  for (let i = 0; i < 6; i++) {
    const y = 90 + i * 52
    const alpha = 0.02 + i * 0.012
    ctx.fillStyle = `rgba(180,210,240,${alpha})`
    ctx.fillRect(0, y, CW, 18)
  }

  // Previous ski track lines scrolling upward
  ctx.strokeStyle = 'rgba(120,170,220,0.18)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 5; i++) {
    const ty = ((i * 90 + scroll * 0.18) % (CH - 100 + 30)) + 100
    const tx = 55 + i * 80
    ctx.beginPath(); ctx.moveTo(tx - 5, ty); ctx.lineTo(tx - 5, Math.min(ty + 60, CH)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(tx,     ty); ctx.lineTo(tx,     Math.min(ty + 60, CH)); ctx.stroke()
  }
}

// ─── Trail — dark blue ski tracks visible on white snow ──────────────────────
function drawTrail(ctx: CanvasRenderingContext2D, playerX: number, speed: number) {
  const maxLen = Math.min(130, Math.floor(speed * 16))
  const step = 3
  for (let i = step; i <= maxLen; i += step) {
    const alpha = (1 - i / maxLen) * 0.55
    // Left ski track
    ctx.fillStyle = `rgba(40,100,180,${alpha})`
    ctx.fillRect(Math.round(playerX) - 4, Math.round(PLAYER_Y) + 16 + i, 2, step)
    // Right ski track
    ctx.fillStyle = `rgba(40,100,180,${alpha})`
    ctx.fillRect(Math.round(playerX) + 3, Math.round(PLAYER_Y) + 16 + i, 2, step)
  }
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
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

// ─── Component ───────────────────────────────────────────────────────────────
export function SnowboardWindow({ win, isMobile = false }: { win: WindowState; isMobile?: boolean }) {
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
  })
  const [distance, setDistance] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle')
  const rafRef = useRef<number>(0)

  const reset = useCallback(() => {
    const s = stateRef.current
    s.playerX = CW / 2; s.playerVX = 0; s.direction = 'straight'
    s.obstacles = []; s.distance = 0; s.speed = 2.8
    s.started = true; s.dead = false; s.scroll = 0; s.lastSpawn = 0; s.tick = 0
    setDistance(0); setPhase('playing')
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      const s = stateRef.current
      ctx.clearRect(0, 0, CW, CH)

      // ── Idle ──────────────────────────────────────────────────────────────
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
        ctx.fillText('ARROWS / A D TO STEER', CW / 2, CH / 2 - 6)
        ctx.fillStyle = '#eaea00'
        ctx.fillText('SPACE TO DROP IN', CW / 2, CH / 2 + 28)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      // ── Physics ───────────────────────────────────────────────────────────
      if (!s.dead) {
        s.tick++

        // Direction: lean while key held, return to straight on release
        if      (s.keys.left  && !s.keys.right) s.direction = 'left'
        else if (s.keys.right && !s.keys.left)  s.direction = 'right'
        else                                      s.direction = 'straight'

        if (s.keys.left)  s.playerVX -= 0.55
        if (s.keys.right) s.playerVX += 0.55
        if (!s.keys.left && !s.keys.right) s.playerVX *= 0.80
        s.playerVX = Math.max(-6.5, Math.min(6.5, s.playerVX))
        s.playerX  = Math.max(20, Math.min(CW - 20, s.playerX + s.playerVX))

        s.scroll += s.speed

        // Obstacles move UPWARD — player descends into them
        s.obstacles.forEach(o => {
          o.y -= s.speed
          // Bear animation: alternate frames every 18 ticks
          if (o.type === 'bear') o.frame = Math.floor(s.tick / 18)
        })
        s.obstacles = s.obstacles.filter(o => o.y > -100)

        // Spawn from below
        const interval = Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_START - s.distance * 1.8)
        if (Date.now() - s.lastSpawn > interval) {
          const rnd  = Math.random()
          const type: Obstacle['type'] = rnd < 0.28 ? 'bear' : rnd < 0.50 ? 'rock' : 'tree'
          const size = type === 'bear' ? 28 + Math.random() * 18
                     : type === 'rock' ? 20 + Math.random() * 16
                     :                   22 + Math.random() * 24
          s.obstacles.push({ id: oid++, x: 40 + Math.random() * (CW - 80), y: CH + 80, type, size, frame: 0 })
          if (s.distance > 80 && Math.random() < 0.35) {
            const r2 = Math.random()
            const t2: Obstacle['type'] = r2 < 0.3 ? 'bear' : r2 < 0.55 ? 'rock' : 'tree'
            s.obstacles.push({ id: oid++, x: 40 + Math.random() * (CW - 80), y: CH + 140, type: t2, size: 18 + Math.random() * 20, frame: 0 })
          }
          s.lastSpawn = Date.now()
        }

        s.distance += s.speed * 0.045
        s.speed = Math.min(2.8 + s.distance * 0.018, 10)
        setDistance(Math.floor(s.distance))

        // Collision
        for (const o of s.obstacles) {
          const hitR = o.type === 'tree' ? o.size * 0.28 : o.type === 'rock' ? o.size * 0.50 : o.size * 0.44
          const dx   = Math.abs(o.x - s.playerX)
          const dy   = Math.abs(o.y - PLAYER_Y)
          if (dx < hitR + 8 && dy < hitR + 10) {
            s.dead = true
            if (s.distance > s.best) { s.best = s.distance; setBest(Math.floor(s.distance)) }
            setPhase('dead')
            break
          }
        }
      }

      // ── Draw ──────────────────────────────────────────────────────────────
      drawBg(ctx, s.scroll)

      // Trail behind player (dark blue on white snow — visible!)
      if (!s.dead) drawTrail(ctx, s.playerX, s.speed)

      // Obstacles (sorted front-to-back relative to player at top)
      ;[...s.obstacles].sort((a, b) => b.y - a.y).forEach(o => {
        if (o.type === 'tree') drawPixelTree(ctx, o.x, o.y, o.size)
        else if (o.type === 'bear') drawPixelBear(ctx, o.x, o.y, o.size, o.frame)
        else drawPixelRock(ctx, o.x, o.y, o.size)
      })

      if (!s.dead) drawPixelPlayer(ctx, s.playerX, s.direction)

      drawHUD(ctx, s.distance, s.best, s.speed)

      // ── Dead ──────────────────────────────────────────────────────────────
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
        ctx.fillText('SPACE TO RETRY', CW / 2, CH / 2 + 48)
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
      status={`PIXEL SNOWBOARD | ${distance}m | BEST: ${best}m${phase === 'dead' ? ' | WIPEOUT!' : ''}`}
      isMobile={isMobile}
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#c0d8ee',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ display: 'block', imageRendering: 'pixelated' }}
        />
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: '8px', color: '#335566',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '3px 0', width: '100%', textAlign: 'center',
          flexShrink: 0,
        }}>
          ← → / A/D STEER · TREES · BEARS · ROCKS · SPACE TO START
        </div>
      </div>
    </Window>
  )
}
