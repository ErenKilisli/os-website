'use client'
import { useEffect, useRef, useState } from 'react'
import { useSystemStore } from '@/store/systemStore'

const ARROW_PATH = "M 1 1 L 1 17 L 5.5 13 L 9 21 L 12 19.5 L 8.5 12 L 15 12 Z"

// Double-headed arrow (horizontal), centered in 20×20 — rotate for each direction
const DBL = "M 1 10 L 5 6.5 L 5 8.5 L 15 8.5 L 15 6.5 L 19 10 L 15 13.5 L 15 11.5 L 5 11.5 L 5 13.5 Z"

// data-cursor value → SVG rotation degrees
const DIR_ROT: Record<string, number> = {
  e: 0, w: 0,
  n: 90, s: 90,
  ne: 45, sw: 45,
  se: 135, nw: 135,
}

function ResizeCursor({ dir }: { dir: string }) {
  const rot = DIR_ROT[dir] ?? 0
  return (
    <svg width="20" height="20" viewBox="0 0 20 20"
      style={{ marginLeft: -10, marginTop: -10 }}>
      <g transform={`rotate(${rot},10,10)`}>
        <path d={DBL} fill="#111" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={DBL} fill="#fff" />
      </g>
    </svg>
  )
}

function CyberwaveCursor({ clicking }: { clicking: boolean }) {
  return (
    <svg width="17" height="23" viewBox="0 0 17 23"
      style={{ filter: `drop-shadow(0 0 ${clicking ? 2 : 4}px rgba(255,255,255,0.6))`, transition: 'filter 0.08s' }}>
      <path d={ARROW_PATH} fill="#111" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={ARROW_PATH} fill={clicking ? '#ccc' : '#fff'} />
    </svg>
  )
}

function PixelCursor({ clicking }: { clicking: boolean }) {
  return (
    <svg width="14" height="19" viewBox="0 0 14 19">
      <path d={ARROW_PATH} fill="#fff" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={ARROW_PATH} fill={clicking ? '#555' : '#111'} />
    </svg>
  )
}

function BoxCursor({ clicking }: { clicking: boolean }) {
  const s = clicking ? 12 : 18
  const o = s / 2
  return (
    <svg width={s + 4} height={s + 4} viewBox={`0 0 ${s + 4} ${s + 4}`}
      style={{ marginLeft: -(o + 2), marginTop: -(o + 2) }}>
      <rect x="2" y="2" width={s} height={s} fill="none"
        stroke={clicking ? '#fff' : '#00ffff'} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${clicking ? '#fff' : '#00ffff'})` }} />
      <rect x={o + 2 - 1.5} y={o + 2 - 1.5} width="3" height="3"
        fill={clicking ? '#fff' : '#00ffff'} />
    </svg>
  )
}

export function CustomCursor() {
  const posRef = useRef<HTMLDivElement>(null)
  const [clicking, setClicking]       = useState(false)
  const [resizeDir, setResizeDir]     = useState<string | null>(null)
  const cursorStyle = useSystemStore(s => s.cursorStyle)
  const viewMode = useSystemStore(s => s.viewMode)

  useEffect(() => {
    let lastDir: string | null = null

    const move = (e: MouseEvent) => {
      if (posRef.current) {
        posRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
      }
      // Walk up DOM to find data-cursor from resize handle
      let el = e.target as HTMLElement | null
      let found: string | null = null
      while (el) {
        const dc = el.getAttribute('data-cursor')
        if (dc) { found = dc; break }
        el = el.parentElement
      }
      if (found !== lastDir) {
        lastDir = found
        setResizeDir(found)
      }
    }

    const down = () => setClicking(true)
    const up   = () => setClicking(false)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup',   up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup',   up)
    }
  }, [])

  if (viewMode === 'phone') return null

  return (
    <div ref={posRef} style={{
      position: 'fixed', top: 0, left: 0,
      pointerEvents: 'none', zIndex: 999999, willChange: 'transform',
    }}>
      {resizeDir ? (
        <ResizeCursor dir={resizeDir} />
      ) : (
        <>
          {cursorStyle === 'cyberwave' && <CyberwaveCursor clicking={clicking} />}
          {cursorStyle === 'pixel'     && <PixelCursor     clicking={clicking} />}
          {cursorStyle === 'box'       && <BoxCursor       clicking={clicking} />}
        </>
      )}
    </div>
  )
}
