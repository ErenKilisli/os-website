'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useCanvasScale } from './useCanvasScale'

// Logical grid dimensions (pixel art resolution)
const CELL = 16
const COLS = 26
const ROWS = 20
const CW = COLS * CELL   // 416
const CH = ROWS * CELL   // 320
const TICK = 120

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
interface Pos { x: number; y: number }

function rand(max: number) { return Math.floor(Math.random() * max) }

function newFood(snake: Pos[]): Pos {
  let pos: Pos
  do { pos = { x: rand(COLS), y: rand(ROWS) } }
  while (snake.some((s) => s.x === pos.x && s.y === pos.y))
  return pos
}

export function SnakeAppCore({ isMobile = false, onScoreChange, onDeadChange }: { isMobile?: boolean, onScoreChange?: (s: number) => void, onDeadChange?: (d: boolean) => void }) {
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

      // Background
      ctx.fillStyle = '#050a05'
      ctx.fillRect(0, 0, CW, CH)

      // Glow effect context for better UI
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // Grid dots
      ctx.fillStyle = 'rgba(0,255,0,0.08)'
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 0.5, y * CELL + CELL / 2 - 0.5, 1, 1)
      }

      if (!g.started) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff00';
        ctx.fillStyle = '#00ff00'
        ctx.font = `bold 16px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('[ SNAKE ]', CW / 2, CH / 2 - 24)
        ctx.shadowBlur = 0;
        ctx.font = `11px monospace`
        ctx.fillStyle = 'rgba(0,255,0,0.8)'
        ctx.fillText(isMobile ? 'TAP D-PAD TO START' : 'PRESS ARROW / WASD TO START', CW / 2, CH / 2 + 4)
        ctx.fillText("WALLS WRAP AROUND. EAT PIXELS.", CW / 2, CH / 2 + 22)
        return
      }

      // Food — pulsing square with glow
      const pulse = (Math.sin(Date.now() * 0.008) + 1) / 2
      ctx.shadowBlur = Math.round(12 + pulse * 8); // integer required
      ctx.shadowColor = '#ff1177';
      ctx.fillStyle = '#ff1177';
      ctx.fillRect(g.food.x * CELL + 4, g.food.y * CELL + 4, CELL - 8, CELL - 8)
      
      // Reset shadow for snake
      ctx.shadowBlur = 0;

      // Snake body
      g.snake.forEach((seg, i) => {
        const t = 1 - i / g.snake.length
        if (i === 0) {
          ctx.fillStyle = '#00ff00'
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00ff00';
        } else {
          ctx.shadowBlur = 0;
          const g2 = Math.round(150 + t * 105)
          ctx.fillStyle = `rgb(0,${g2},0)`
        }
        const pad = i === 0 ? 1 : 2
        ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
      })
      
      ctx.shadowBlur = 0;

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

      // Dead overlay
      if (g.dead) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff1177';
        ctx.fillStyle = '#ff1177'
        ctx.font = `bold 18px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('// GAME OVER //', CW / 2, CH / 2 - 20)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00ff00'
        ctx.font = `bold 14px monospace`
        ctx.fillText(`FINAL SCORE: ${g.score}`, CW / 2, CH / 2 + 10)
        ctx.fillStyle = 'rgba(0,255,0,0.5)'
        ctx.font = `10px monospace`
        ctx.fillText(isMobile ? 'TAP D-PAD TO RESTART' : 'PRESS ANY KEY TO RESTART', CW / 2, CH / 2 + 34)
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

      // Warp around walls
      if (next.x < 0) next.x = COLS - 1
      else if (next.x >= COLS) next.x = 0
      if (next.y < 0) next.y = ROWS - 1
      else if (next.y >= ROWS) next.y = 0

      // Only die if biting yourself
      if (g.snake.some((s) => s.x === next.x && s.y === next.y)) {
        g.dead = true
        setDead(true)
        if (onDeadChange) onDeadChange(true)
        return
      }

      g.snake.unshift(next)
      if (next.x === g.food.x && next.y === g.food.y) {
        g.score += 10
        setScore(g.score)
        if (onScoreChange) onScoreChange(g.score)
        g.food = newFood(g.snake)
      } else {
        g.snake.pop()
      }
    }

    const loop = (ts: number) => {
      draw()
      if (ts - lastTickRef.current >= TICK) {
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
        position: 'relative'
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
          padding: '6px 0', flexShrink: 0, textShadow: '0 0 5px rgba(0,255,0,0.4)'
        }}>
          ARROW KEYS / WASD — EAT RED — WALLS WRAP AROUND
        </div>
      )}
      
      {/* Mobile Controls Overlay */}
      {isMobile && (
        <div style={{ padding: '20px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            {/* Up */}
            <button onTouchStart={() => handleMobileDpad('UP')} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_upward</span>
            </button>
            {/* Down */}
            <button onTouchStart={() => handleMobileDpad('DOWN')} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_downward</span>
            </button>
            {/* Left */}
            <button onTouchStart={() => handleMobileDpad('LEFT')} style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 44, height: 44, background: 'rgba(0,255,0,0.2)', border: '2px solid rgba(0,255,0,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}>
              <span className="material-symbols-outlined" style={{ color: '#0f0', fontSize: 24 }}>arrow_back</span>
            </button>
            {/* Right */}
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
