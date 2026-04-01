'use client'
import { useEffect, useRef, CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { useSystemStore, Wallpaper, WALLPAPER_LABELS } from '@/store/systemStore'
import { useWindowStore, WindowType } from '@/store/windowStore'

interface Props {
  x: number
  y: number
  onClose: () => void
}

const WALLPAPERS: Wallpaper[] = ['synthwave', 'grid', 'stars', 'scanlines']

const APPS: { label: string; type: WindowType; icon: string }[] = [
  { label: 'TERMINAL',   type: 'terminal', icon: 'terminal'       },
  { label: 'ABOUT ME',   type: 'about',    icon: 'account_circle' },
  { label: 'CONTACT',    type: 'mail',     icon: 'mail'           },
  { label: 'SETTINGS',   type: 'settings', icon: 'settings'       },
  { label: 'PAINT.EXE',  type: 'paint',    icon: 'brush'          },
  { label: 'SNAKE.EXE',  type: 'snake',    icon: 'sports_esports' },
]

const MENU_W = 196

const sectionLabel: CSSProperties = {
  fontFamily: 'var(--font-h)',
  fontSize: 8,
  color: '#354060',
  padding: '6px 10px 3px',
  letterSpacing: '0.12em',
  userSelect: 'none',
}

const divider: CSSProperties = {
  height: 1,
  background: '#0d1828',
  margin: '3px 0',
}

function Item({
  icon,
  children,
  active,
  danger,
  onClick,
}: {
  icon?: string
  children: React.ReactNode
  active?: boolean
  danger?: boolean
  onClick: () => void
}) {
  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    background: 'none',
    border: 'none',
    color: danger ? '#ff5555' : active ? '#00ffff' : '#b0b0c8',
    fontFamily: 'var(--font-h)',
    fontSize: 9,
    letterSpacing: '0.07em',
    padding: '7px 12px',
    cursor: 'pointer',
    textAlign: 'left',
  }

  return (
    <button style={itemStyle} onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,255,0.07)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {active && <span style={{ color: '#00ffff', fontSize: 8, flexShrink: 0 }}>▶</span>}
      {icon && !active && (
        <span className="material-symbols-outlined" style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      )}
      {children}
    </button>
  )
}

export function DesktopContextMenu({ x, y, onClose }: Props) {
  const { wallpaper, setWallpaper } = useSystemStore()
  const { openWindow, resetIconPositions } = useWindowStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', escHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', escHandler)
    }
  }, [onClose])

  // Keep menu on screen
  const adjX = x + MENU_W > window.innerWidth ? x - MENU_W : x
  const adjY = Math.min(y, window.innerHeight - 360)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.1 }}
      style={{
        position: 'fixed',
        top: adjY,
        left: adjX,
        width: MENU_W,
        background: '#05070e',
        border: '2px solid #00ffff',
        boxShadow: '0 0 32px rgba(0,255,255,0.18), 0 8px 32px rgba(0,0,0,0.6)',
        zIndex: 90000,
      }}
    >
      {/* Wallpaper section */}
      <div style={sectionLabel}>WALLPAPER</div>
      {WALLPAPERS.map(wp => (
        <Item
          key={wp}
          active={wallpaper === wp}
          onClick={() => { setWallpaper(wp); onClose() }}
        >
          {WALLPAPER_LABELS[wp]}
        </Item>
      ))}

      <div style={divider} />

      {/* Open app section */}
      <div style={sectionLabel}>OPEN APP</div>
      {APPS.map(app => (
        <Item
          key={app.type}
          icon={app.icon}
          onClick={() => { openWindow(app.type); onClose() }}
        >
          {app.label}
        </Item>
      ))}

      <div style={divider} />

      {/* Refresh */}
      <Item
        icon="refresh"
        onClick={() => { resetIconPositions(); onClose() }}
      >
        REFRESH DESKTOP
      </Item>
    </motion.div>
  )
}
