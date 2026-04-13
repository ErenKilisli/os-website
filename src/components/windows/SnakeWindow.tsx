'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useCanvasScale } from './useCanvasScale'

const CELL = 16
const COLS = 26
const ROWS = 20
const CW = COLS * CELL   // 416
const CH = ROWS * CELL   // 320
const BASE_TICK = 120    // ms per tick at score 0

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
interface Pos { x: number; y: number }
interface Popup { x: number; y: number; val: number; startTime: number }

function rand(max: number) { return Math.floor(Math.random() * max) }

function newFood(snake: Pos[], exclude?: Pos | null): Pos {
  let pos: Pos
  do { pos = { x: rand(COLS), y: rand(ROWS) } }
  while (
    snake.some((s) => s.x === pos.x && s.y === pos.y) ||
    (exclude && exclude.x === pos.x && exclude.y === pos.y)
  )
  return pos
}

function getCurrentTick(score: number) {
  // Gets 4ms faster every 30 pts, bottoms out at 52ms (~2.3× faster than start)
  return Math.max(52, BASE_TICK - Math.floor(score / 30) * 4)
}

export function SnakeAppCore({ isMobile = false, onScoreChange, onDeadChange }: {
  isMobile?: boolean
  onScoreChange?: (s: number) => void
  onDeadChange?: (d: boolean) => void
}) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef({
    snake: [{ x: 13, y: 10 }] as Pos[],
    dir: 'RIGHT' as Dir,
    nextDir: 'RIGHT' as Dir,
    food: { x: rand(COLS), y: rand(ROWS) } as Pos,
    score: 0,
    dead: false,
    started: false,
    // Bonus food system
    bonusFood: null as Pos | null,
    bonusTimer: 0,       // ticks bonus has been alive
    nextBonusIn: 45,     // ticks until next bonus spawns
    // Floating score popups
    popups: [] as Popup[],
  })
  const [score, setScore] = useState(0)
  const [dead, setDead] = useState(false)
  const rafRef = useRef<number>(0)
  const lastTickRef = useRef(0)

  const reset = useCallback(() => {
    const g = gameRef.current
    g.snake = [{ x: 13, y: 10 }]
    g.dir = 'RIGHT'
    g.nextDir = 'RIGHT'
    g.food = newFood(g.snake)
    g.score = 0
    g.dead = false
    g.started = true
    g.bonusFood = null
    g.bonusTimer = 0
    g.nextBonusIn = 45
    g.popups = []
    setScore(0)
    setDead(false)
    if (onScoreChange) onScoreChange(0)
    if (onDeadChange) onDeadChange(false)
  }, [onScoreChange, onDeadChange])

  useCanvasScale(containerRef, canvasRef, CW, CH, 2.5)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const g = gameRef.current
      const MAP: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      }
      const d = MAP[e.key]
      if (!d) return
      e.preventDefault()
      if (!g.started || g.dead) { reset(); return }
      const OPP: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }
      if (d !== OPP[g.dir]) g.nextDir = d
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [reset])

  const handleMobileDpad = (d: Dir) => {
    const g = gameRef.current
    if (!g.started || g.dead) { reset(); return }
    const OPP: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }
    if (d !== OPP[g.dir]) g.nextDir = d
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const g = gameRef.current
      const now = Date.now()
      const speedLevel = Math.min(Math.floor(g.score / 30) + 1, 20)

      // Background
      ctx.fillStyle = '#050a05'
      ctx.fillRect(0, 0, CW, CH)

      // Grid dots
      ctx.fillStyle = 'rgba(0,255,0,0.07)'
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 0.5, y * CELL + CELL / 2 - 0.5, 1, 1)
      }

      if (!g.started) {
        ctx.shadowBlur = 10; ctx.shadowColor = '#00ff00'
        ctx.fillStyle = '#00ff00'
        ctx.font = `bold 16px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('[ SNAKE ]', CW / 2, CH / 2 - 30)
        ctx.shadowBlur = 0
        ctx.font = `10px monospace`
        ctx.fillStyle = 'rgba(0,255,0,0.75)'
        ctx.fillText(isMobile ? 'TAP D-PAD TO START' : 'PRESS ARROW / WASD TO START', CW / 2, CH / 2 + 4)
        ctx.fillText('EAT RED — WALLS WRAP — SPEED INCREASES', CW / 2, CH / 2 + 20)
        ctx.fillStyle = '#ffd700'
        ctx.fillText('GOLDEN STAR = BONUS POINTS!', CW / 2, CH / 2 + 38)
        return
      }

      // Regular food — pulsing pink square
      const pulse = (Math.sin(now * 0.008) + 1) / 2
      ctx.shadowBlur = Math.round(12 + pulse * 8)
      ctx.shadowColor = '#ff1177'
      ctx.fillStyle = '#ff1177'
      ctx.fillRect(g.food.x * CELL + 4, g.food.y * CELL + 4, CELL - 8, CELL - 8)
      ctx.shadowBlur = 0

      // Bonus food — spinning gold diamond
      if (g.bonusFood) {
        const expiring = g.bonusTimer > 42
        const visible  = expiring ? (now % 280 < 180) : true
        if (visible) {
          const rot = now * 0.0025
          const bx  = g.bonusFood.x * CELL + CELL / 2
          const by  = g.bonusFood.y * CELL + CELL / 2
          ctx.save()
          ctx.translate(bx, by)
          ctx.rotate(rot)
          ctx.shadowBlur = Math.round(14 + pulse * 10)
          ctx.shadowColor = '#ffd700'
          ctx.fillStyle = '#ffd700'
          ctx.fillRect(-5, -5, 10, 10)
          ctx.shadowBlur = 0
          ctx.fillStyle = '#fff8c0'
          ctx.fillRect(-2, -2, 4, 4)
          ctx.restore()
        }
      }

      // Snake body
      g.snake.forEach((seg, i) => {
        const t = 1 - i / g.snake.length
        if (i === 0) {
          ctx.fillStyle = '#00ff00'
          ctx.shadowBlur = 8; ctx.shadowColor = '#00ff00'
        } else {
          ctx.shadowBlur = 0
          const gv = Math.round(150 + t * 105)
          ctx.fillStyle = `rgb(0,${gv},0)`
        }
        const pad = i === 0 ? 1 : 2
        ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
      })
      ctx.shadowBlur = 0

      // Snake head eyes
      const head = g.snake[0]
      ctx.fillStyle = '#000'
      const eyeMap: Record<Dir, number[][]> = {
        RIGHT: [[11, 4], [11, 10]], LEFT: [[2, 4], [2, 10]],
        UP:    [[4, 2], [10, 2]],  DOWN: [[4, 11], [10, 11]],
      }
      eyeMap[g.dir].forEach(([ex, ey]) => {
        ctx.fillRect(head.x * CELL + ex, head.y * CELL + ey, 2, 2)
      })

      // Speed level indicator — top-right corner
      ctx.font = `bold 7px monospace`
      ctx.textAlign = 'right'
      ctx.fillStyle = speedLevel > 10 ? '#ff4444' : speedLevel > 5 ? '#eaea00' : 'rgba(0,255,0,0.65)'
      ctx.fillText(`LV.${speedLevel}`, CW - 5, 12)

      // Floating score popups
      g.popups.forEach(p => {
        const elapsed  = now - p.startTime
        if (elapsed > 1200) return
        const progress = elapsed / 1200
        const alpha    = 1 - progress
        const yOff     = progress * 26
        ctx.shadowBlur = 0
        ctx.font = p.val >= 20 ? `bold 10px monospace` : `bold 8px monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = p.val >= 20 ? `rgba(255,215,0,${alpha})` : `rgba(0,255,120,${alpha})`
        ctx.fillText(`+${p.val}`, p.x, p.y - yOff)
      })

      // Dead overlay
      if (g.dead) {
        ctx.fillStyle = 'rgba(0,0,0,0.82)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.shadowBlur = 15; ctx.shadowColor = '#ff1177'
        ctx.fillStyle = '#ff1177'
        ctx.font = `bold 18px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('// GAME OVER //', CW / 2, CH / 2 - 26)
        ctx.shadowBlur = 0
        ctx.fillStyle = '#00ff00'
        ctx.font = `bold 14px monospace`
        ctx.fillText(`SCORE: ${g.score}`, CW / 2, CH / 2 + 4)
        ctx.fillStyle = '#eaea00'
        ctx.font = `bold 10px monospace`
        ctx.fillText(`MAX SPEED: LV.${speedLevel}`, CW / 2, CH / 2 + 24)
        ctx.fillStyle = 'rgba(0,255,0,0.45)'
        ctx.font = `9px monospace`
        ctx.fillText(isMobile ? 'TAP D-PAD TO RESTART' : 'PRESS ANY KEY TO RESTART', CW / 2, CH / 2 + 46)
      }
    }

    const tick = () => {
      const g = gameRef.current
      if (!g.started || g.dead) return
      g.dir = g.nextDir
      const head = g.snake[0]
      const delta: Record<Dir, Pos> = {
        RIGHT: { x: 1, y: 0 }, LEFT: { x: -1, y: 0 },
        UP: { x: 0, y: -1 },  DOWN: { x: 0, y: 1 },
      }
      const next = { x: head.x + delta[g.dir].x, y: head.y + delta[g.dir].y }

      // Wrap walls
      if (next.x < 0) next.x = COLS - 1
      else if (next.x >= COLS) next.x = 0
      if (next.y < 0) next.y = ROWS - 1
      else if (next.y >= ROWS) next.y = 0

      if (g.snake.some((s) => s.x === next.x && s.y === next.y)) {
        g.dead = true
        setDead(true)
        if (onDeadChange) onDeadChange(true)
        return
      }

      g.snake.unshift(next)

      if (g.bonusFood && next.x === g.bonusFood.x && next.y === g.bonusFood.y) {
        // Ate bonus — no growth, +30
        g.score += 30
        setScore(g.score)
        if (onScoreChange) onScoreChange(g.score)
        g.popups.push({ x: next.x * CELL + CELL / 2, y: next.y * CELL, val: 30, startTime: Date.now() })
        g.bonusFood = null
        g.nextBonusIn = 50
        g.snake.pop()
      } else if (next.x === g.food.x && next.y === g.food.y) {
        // Ate regular food — grow, +10
        g.score += 10
        setScore(g.score)
        if (onScoreChange) onScoreChange(g.score)
        g.popups.push({ x: next.x * CELL + CELL / 2, y: next.y * CELL, val: 10, startTime: Date.now() })
        g.food = newFood(g.snake, g.bonusFood)
      } else {
        g.snake.pop()
      }

      // Clean up expired popups
      const now = Date.now()
      g.popups = g.popups.filter(p => now - p.startTime < 1300)

      // Bonus food lifecycle
      if (g.score >= 30) {
        if (g.bonusFood === null) {
          g.nextBonusIn--
          if (g.nextBonusIn <= 0) {
            g.bonusFood = newFood(g.snake, g.food)
            g.bonusTimer = 0
            g.nextBonusIn = 80
          }
        } else {
          g.bonusTimer++
          if (g.bonusTimer >= 65) {
            g.bonusFood = null
            g.nextBonusIn = 70
          }
        }
      }
    }

    const loop = (ts: number) => {
      draw()
      const currentTick = getCurrentTick(gameRef.current.score)
      if (ts - lastTickRef.current >= currentTick) {
        tick()
        lastTickRef.current = ts
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onScoreChange, onDeadChange, isMobile])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#050a05',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{ imageRendering: 'pixelated', display: 'block', border: '2px solid rgba(0,255,0,0.3)', boxShadow: '0 0 20px rgba(0,255,0,0.1)' }}
      />
      {!isMobile && (
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: '8px', color: 'rgba(0,255,0,0.5)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '6px 0', flexShrink: 0, textShadow: '0 0 5px rgba(0,255,0,0.4)',
        }}>
          ARROW / WASD — EAT RED — GOLD STAR = BONUS — SPEED INCREASES
        </div>
      )}

      {isMobile && (
        <div style={{ padding: '20px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <button onTouchStart={() => handleMobileDpad('UP')} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_upward</span>
            </button>
            <button onTouchStart={() => handleMobileDpad('DOWN')} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_downward</span>
            </button>
            <button onTouchStart={() => handleMobileDpad('LEFT')} style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_back</span>
            </button>
            <button onTouchStart={() => handleMobileDpad('RIGHT')} style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function SnakeWindow({ win, isMobile = false }: { win: WindowState; isMobile?: boolean }) {
  const [score, setScore] = useState(0)
  const [dead, setDead] = useState(false)

  return (
    <Window
      win={win}
      menu={['Game', 'Options', 'Help']}
      status={`SNAKE.EXE | SCORE: ${score}${dead ? ' | GAME OVER — PRESS ANY KEY' : ''}`}
      isMobile={isMobile}
    >
      <SnakeAppCore isMobile={isMobile} onScoreChange={setScore} onDeadChange={setDead} />
    </Window>
  )
}
