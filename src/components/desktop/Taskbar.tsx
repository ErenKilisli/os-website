'use client'
import { useWindowStore } from '@/store/windowStore'
import { useEffect, useRef, useState } from 'react'
import { SystemTray } from './SystemTray'
import { motion, AnimatePresence } from 'framer-motion'
import type { CSSProperties } from 'react'

const menuItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  background: 'none',
  border: 'none',
  color: '#c0c0c0',
  fontFamily: 'var(--font-h)',
  fontSize: 9,
  letterSpacing: '0.08em',
  padding: '8px 12px',
  cursor: 'pointer',
  textAlign: 'left',
}

interface Props {
  onSpotlight: () => void
  onShutdown: () => void
  onRestart: () => void
}

export function Taskbar({ onSpotlight, onShutdown, onRestart }: Props) {
  const { windows, focusWindow, minimizeWindow, focusedId, openWindow } = useWindowStore()
  const [time, setTime] = useState('')
  const [startOpen, setStartOpen] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [previewX, setPreviewX] = useState(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const h = n.getHours()
      const m = String(n.getMinutes()).padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      setTime(`${String(h12).padStart(2, '0')}:${m} ${ampm}`)
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div id="taskbar">
      {/* Start menu popup */}
      {startOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 8998 }}
            onClick={() => setStartOpen(false)}
          />
          <div style={{
            position: 'fixed',
            bottom: 36,
            left: 0,
            width: 200,
            background: '#0a0a1a',
            border: '2px solid #00ffff',
            boxShadow: '0 0 24px rgba(0,255,255,0.15)',
            zIndex: 8999,
          }}>
            {/* Header */}
            <div style={{
              background: '#000080',
              padding: '8px 10px',
              borderBottom: '1px solid #00ffff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontFamily: 'var(--font-h)', fontSize: 11, color: '#fff', letterSpacing: '0.08em' }}>
                EREN.OS
              </span>
            </div>
            {/* Menu items */}
            <div style={{ padding: '4px 0' }}>
              <button
                style={menuItemStyle}
                onClick={() => { setStartOpen(false); openWindow('settings') }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>settings</span>
                SETTINGS
              </button>
              <button
                style={menuItemStyle}
                onClick={() => { setStartOpen(false); onSpotlight() }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
                SEARCH
              </button>
              <div style={{ height: 1, background: '#1a2030', margin: '4px 0' }} />
              <button
                style={menuItemStyle}
                onClick={() => { setStartOpen(false); onRestart() }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>restart_alt</span>
                RESTART
              </button>
              <button
                style={{ ...menuItemStyle, color: '#ff4444' }}
                onClick={() => { setStartOpen(false); onShutdown() }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>power_settings_new</span>
                SHUT DOWN
              </button>
            </div>
          </div>
        </>
      )}

      <button id="start-btn" onClick={() => setStartOpen(s => !s)}>
        <span className="material-symbols-filled" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
        START
      </button>

      {/* Spotlight button */}
      <button className="tb-search-btn" onClick={onSpotlight} title="Search (Ctrl+K)">
        <span className="material-symbols-outlined">search</span>
        <span>SEARCH</span>
      </button>

      <div className="tb-sep" />

      <div id="tb-wins">
        {windows.map((win) => (
          <div
            key={win.id}
            className={`tbw${win.id === focusedId && !win.isMinimized ? ' on' : ''}`}
            onClick={() => {
              if (win.isMinimized) focusWindow(win.id)
              else if (win.id === focusedId) minimizeWindow(win.id)
              else focusWindow(win.id)
            }}
            onMouseEnter={(e) => {
              if (hideTimer.current) clearTimeout(hideTimer.current)
              const rect = e.currentTarget.getBoundingClientRect()
              setPreviewX(rect.left + rect.width / 2)
              setPreviewId(win.id)
            }}
            onMouseLeave={() => {
              hideTimer.current = setTimeout(() => setPreviewId(null), 120)
            }}
          >
            <span className="material-symbols-outlined">{win.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{win.title}</span>
          </div>
        ))}
      </div>

      {/* Window preview tooltip */}
      <AnimatePresence>
        {previewId && (() => {
          const pw = windows.find(w => w.id === previewId)
          if (!pw) return null
          const cardW = 172
          const safeX = Math.min(Math.max(previewX - cardW / 2, 8), window.innerWidth - cardW - 8)
          return (
            <motion.div
              key={previewId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'fixed',
                bottom: 44,
                left: safeX,
                width: cardW,
                background: '#05070e',
                border: '2px solid #00ffff',
                boxShadow: '0 0 20px rgba(0,255,255,0.15)',
                zIndex: 90002,
                pointerEvents: 'none',
              }}
            >
              {/* Titlebar */}
              <div style={{
                background: '#000080',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderBottom: '1px solid #00007a',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{pw.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-h)',
                  fontSize: 8,
                  color: '#fff',
                  letterSpacing: '0.06em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {pw.title}
                </span>
              </div>
              {/* Body */}
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: pw.isMinimized ? '#606080' : '#00ffff' }}>
                  {pw.isMinimized ? '■ MINIMIZED' : pw.id === focusedId ? '▶ ACTIVE' : '● OPEN'}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#202040' }}>
                  {pw.width} × {pw.height} px
                </div>
              </div>
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '8px solid #00ffff',
              }} />
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Right side: SystemTray + clock */}
      <div id="tb-right">
        <SystemTray />
        <div className="tb-right-divider" />
        <span className="material-symbols-outlined">schedule</span>
        <div id="clock">{time}</div>
      </div>
    </div>
  )
}
