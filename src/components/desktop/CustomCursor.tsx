'use client'
import { useEffect, useRef, useState } from 'react'
import { useSystemStore } from '@/store/systemStore'

// Classic Win95-style arrow cursor path — tip is at (0,0)
const ARROW_PATH = "M 1 1 L 1 17 L 5.5 13 L 9 21 L 12 19.5 L 8.5 12 L 15 12 Z"

function CyberwaveCursor({ clicking }: { clicking: boolean }) {
  return (
    <svg
      width="17"
      height="23"
      viewBox="0 0 17 23"
      style={{
        filter: `drop-shadow(0 0 ${clicking ? 2 : 4}px rgba(255,255,255,0.6))`,
        transition: 'filter 0.08s',
      }}
    >
      {/* Dark outline */}
      <path d={ARROW_PATH} fill="#111111" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
      {/* White fill */}
      <path d={ARROW_PATH} fill={clicking ? '#cccccc' : '#ffffff'} />
    </svg>
  )
}

function PixelCursor({ clicking }: { clicking: boolean }) {
  return (
    <svg width="14" height="19" viewBox="0 0 14 19">
      {/* White outline */}
      <path d={ARROW_PATH} fill="#ffffff" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Black fill */}
      <path d={ARROW_PATH} fill={clicking ? '#555555' : '#111111'} />
    </svg>
  )
}

function BoxCursor({ clicking }: { clicking: boolean }) {
  const size = clicking ? 12 : 18
  const offset = size / 2
  return (
    <svg
      width={size + 4}
      height={size + 4}
      viewBox={`0 0 ${size + 4} ${size + 4}`}
      style={{ marginLeft: -(offset + 2), marginTop: -(offset + 2) }}
    >
      <rect
        x="2" y="2" width={size} height={size}
        fill="none"
        stroke={clicking ? '#ffffff' : '#00ffff'}
        strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${clicking ? '#fff' : '#00ffff'})` }}
      />
      <rect x={offset + 2 - 1.5} y={offset + 2 - 1.5} width="3" height="3" fill={clicking ? '#ffffff' : '#00ffff'} />
    </svg>
  )
}

export function CustomCursor() {
  const posRef = useRef<HTMLDivElement>(null)
  const [clicking, setClicking] = useState(false)
  const cursorStyle = useSystemStore((s) => s.cursorStyle)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (posRef.current) {
        posRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }
    const down = () => setClicking(true)
    const up = () => setClicking(false)
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  return (
    <div
      ref={posRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        willChange: 'transform',
      }}
    >
      {cursorStyle === 'cyberwave' && <CyberwaveCursor clicking={clicking} />}
      {cursorStyle === 'pixel'     && <PixelCursor     clicking={clicking} />}
      {cursorStyle === 'box'       && <BoxCursor       clicking={clicking} />}
    </div>
  )
}
