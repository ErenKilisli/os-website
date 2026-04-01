'use client'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { useWindowStore, WindowState } from '@/store/windowStore'
import { ReactNode, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  win: WindowState
  children: ReactNode
  menu?: string[]
  status?: string
  isMobile?: boolean
  bodyClass?: string
}

const WIN_FILENAMES: Record<string, string> = {
  game:     'GAMES.EXE',
  film:     'FILMS.EXE',
  swr:      'SOFTWARE.EXE',
  about:    'ABOUTME.DOC',
  mail:     'CONTACT.MSG',
  terminal: 'TERMINAL.EXE',
  settings: 'SETTINGS.EXE',
  devfiles: 'DEV_PROJECTS.EXE',
  cinema:   'FILM_PROJECTS.EXE',
  arcade:   'GAME_PROJECTS.EXE',
}

const SNAP_THRESHOLD = 48

export function Window({ win, children, menu = ['File', 'Edit', 'Help'], status, isMobile = false, bodyClass }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPos, focusedId } = useWindowStore()
  const dragControls = useDragControls()
  const x = useMotionValue(win.x)
  const y = useMotionValue(win.y)

  const [snapped, setSnapped] = useState<'left' | 'right' | null>(null)
  const [snapZone, setSnapZone] = useState<'left' | 'right' | null>(null)
  const prevGeom = useRef<{ x: number; y: number } | null>(null)

  if (win.isMinimized) return null

  const isActive = win.id === focusedId
  const filename = WIN_FILENAMES[win.type] ?? win.title

  // ── Mobile layout ────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="window is-active window-modal"
        style={{ zIndex: win.zIndex }}
        onMouseDown={() => focusWindow(win.id)}
      >
        <div className="tb">
          <span className="tb-ico material-symbols-outlined">{win.icon}</span>
          <span className="tb-lbl">{filename}</span>
          <div className="tb-btns">
            <button className="wbtn" onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <div className="win-menu">
          {menu.map(m => <div key={m} className="wmenu-item">{m}</div>)}
        </div>
        <div className={`wbody${bodyClass ? ` ${bodyClass}` : ''}`} style={{ flex: 1, height: 'calc(100% - 80px)' }}>
          {children}
        </div>
        <div className="wstatus">
          <span className="wstatus-panel">{status ?? `${filename} | SYSTEM_V01`}</span>
          <span className="wstatus-panel" style={{ flex: 'none', minWidth: 'auto' }}>V01</span>
        </div>
      </div>
    )
  }

  // ── Snap geometry ─────────────────────────────────────────────
  const isFixed = win.isMaximized || !!snapped
  const winW = win.isMaximized ? '100vw' : snapped ? '50vw' : win.width
  const winH = win.isMaximized ? 'calc(100vh - 40px)' : snapped ? 'calc(100vh - 68px)' : win.height
  const winTop = win.isMaximized ? 0 : snapped ? 28 : undefined
  const winLeft = win.isMaximized ? 0 : snapped === 'left' ? 0 : undefined
  const winRight = snapped === 'right' ? 0 : undefined

  const bodyHeight = win.isMaximized
    ? 'calc(100vh - 40px - 32px - 24px - 22px)'
    : snapped
    ? 'calc(100vh - 68px - 32px - 24px - 22px)'
    : win.height - 90

  // ── Drag handlers ─────────────────────────────────────────────
  const handleDrag = () => {
    if (win.isMaximized) return
    const cx = x.get()
    const sw = typeof window !== 'undefined' ? window.innerWidth : 1280
    if (cx <= SNAP_THRESHOLD) setSnapZone('left')
    else if (cx + win.width >= sw - SNAP_THRESHOLD) setSnapZone('right')
    else setSnapZone(null)
  }

  const handleDragEnd = () => {
    if (snapZone) {
      prevGeom.current = { x: x.get(), y: y.get() }
      setSnapped(snapZone)
    } else {
      updateWindowPos(win.id, x.get(), y.get())
    }
    setSnapZone(null)
  }

  const handleTitlebarPointerDown = (e: React.PointerEvent) => {
    if (win.isMaximized) return
    if (snapped) {
      setSnapped(null)
      if (prevGeom.current) {
        x.set(prevGeom.current.x)
        y.set(prevGeom.current.y)
      }
    }
    dragControls.start(e)
  }

  return (
    <>
      {/* Snap zone overlay rendered in body to escape transform context */}
      {snapZone && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 28,
            left: snapZone === 'left' ? 0 : '50%',
            width: '50vw',
            height: 'calc(100vh - 68px)',
            background: 'rgba(0,255,255,0.07)',
            border: '2px solid rgba(0,255,255,0.4)',
            boxShadow: 'inset 0 0 40px rgba(0,255,255,0.06)',
            zIndex: 89998,
            pointerEvents: 'none',
            transition: 'left 0.12s',
          }}
        />,
        document.body
      )}

      <motion.div
        drag={!isFixed}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        style={{
          x: isFixed ? 0 : x,
          y: isFixed ? 0 : y,
          zIndex: win.zIndex,
          position: isFixed ? 'fixed' : 'absolute',
          width: winW,
          height: winH,
          top: winTop,
          left: winLeft,
          right: winRight,
        }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onMouseDown={() => focusWindow(win.id)}
        initial={{ scale: 0.05, opacity: 0, filter: 'brightness(4)' }}
        animate={{ scale: 1, opacity: 1, filter: 'brightness(1)' }}
        exit={{ scale: 0.05, opacity: 0 }}
        transition={{ duration: 0.16, ease: [0, 0, 0.2, 1] }}
        className={`window${isActive ? ' is-active' : ''}`}
      >
        <div
          className="tb"
          onPointerDown={handleTitlebarPointerDown}
        >
          <span className="tb-ico material-symbols-outlined">{win.icon}</span>
          <span className="tb-lbl">{filename}</span>
          <div className="tb-btns">
            <button className="wbtn" onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id) }}>
              <span className="material-symbols-outlined">remove</span>
            </button>
            <button className="wbtn" onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id) }}>
              <span className="material-symbols-outlined">{win.isMaximized ? 'close_fullscreen' : 'open_in_full'}</span>
            </button>
            <button className="wbtn" onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <div className="win-menu">
          {menu.map(m => <div key={m} className="wmenu-item">{m}</div>)}
        </div>
        <div className={`wbody${bodyClass ? ` ${bodyClass}` : ''}`} style={{ height: bodyHeight }}>
          {children}
        </div>
        <div className="wstatus">
          <span className="wstatus-panel">{status ?? `${filename} | SYSTEM_V01`}</span>
          <span className="wstatus-panel" style={{ flex: 'none', minWidth: 'auto' }}>V01</span>
        </div>
      </motion.div>
    </>
  )
}
