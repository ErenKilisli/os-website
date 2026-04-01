'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

const CELL = 16
const COLS = 26
const ROWS = 20
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

export function SnakeWindow({ win, isMobile = false }: { win: WindowState; isMobile?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
  }, [])

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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const CW = COLS * CELL
    const CH = ROWS * CELL

    const draw = () => {
      const g = gameRef.current

      // Background
      ctx.fillStyle = '#0a0f0a'
      ctx.fillRect(0, 0, CW, CH)

      // Grid dots
      ctx.fillStyle = 'rgba(0,253,0,0.06)'
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 0.5, y * CELL + CELL / 2 - 0.5, 1, 1)
      }

      if (!g.started) {
        ctx.fillStyle = '#00fd00'
        ctx.font = `bold 13px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('[ SNAKE.EXE ]', CW / 2, CH / 2 - 22)
        ctx.font = `10px monospace`
        ctx.fillStyle = 'rgba(0,253,0,0.6)'
        ctx.fillText('PRESS ARROW / WASD TO START', CW / 2, CH / 2 + 2)
        ctx.fillText("EAT RED PIXELS. DON'T CRASH.", CW / 2, CH / 2 + 18)
        return
      }

      // Food — pulsing square
      const pulse = (Math.sin(Date.now() * 0.008) + 1) / 2
      ctx.fillStyle = `rgba(255,0,${Math.round(60 + pulse * 100)},${0.7 + pulse * 0.3})`
      ctx.fillRect(g.food.x * CELL + 3, g.food.y * CELL + 3, CELL - 6, CELL - 6)
      ctx.fillStyle = '#ff3366'
      ctx.fillRect(g.food.x * CELL + 5, g.food.y * CELL + 5, CELL - 10, CELL - 10)

      // Snake body
      g.snake.forEach((seg, i) => {
        const t = 1 - i / g.snake.length
        if (i === 0) {
          ctx.fillStyle = '#00fd00'
        } else {
          const g2 = Math.round(180 + t * 73)
          ctx.fillStyle = `rgb(0,${g2},0)`
        }
        const pad = i === 0 ? 1 : 2
        ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
      })

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
        ctx.fillStyle = 'rgba(0,0,0,0.75)'
        ctx.fillRect(0, 0, CW, CH)
        ctx.fillStyle = '#ff3366'
        ctx.font = `bold 15px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('// GAME OVER //', CW / 2, CH / 2 - 20)
        ctx.fillStyle = '#00fd00'
        ctx.font = `bold 12px monospace`
        ctx.fillText(`SCORE: ${g.score}`, CW / 2, CH / 2 + 4)
        ctx.fillStyle = 'rgba(0,253,0,0.45)'
        ctx.font = `9px monospace`
        ctx.fillText('PRESS ANY KEY TO RESTART', CW / 2, CH / 2 + 26)
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

      if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS ||
          g.snake.some((s) => s.x === next.x && s.y === next.y)) {
        g.dead = true
        setDead(true)
        return
      }

      g.snake.unshift(next)
      if (next.x === g.food.x && next.y === g.food.y) {
        g.score += 10
        setScore(g.score)
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
  }, [])

  return (
    <Window
      win={win}
      menu={['Game', 'Options', 'Help']}
      status={`SNAKE.EXE | SCORE: ${score}${dead ? ' | GAME OVER — PRESS ANY KEY' : ''}`}
      isMobile={isMobile}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0a0f0a', gap: 6 }}>
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          style={{ imageRendering: 'pixelated', display: 'block', border: '2px solid rgba(0,253,0,0.2)' }}
        />
        <div style={{ fontFamily: 'var(--font-h)', fontSize: '8px', color: 'rgba(0,253,0,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          ARROW KEYS / WASD — EAT RED — AVOID WALLS
        </div>
      </div>
    </Window>
  )
}
