'use client'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { useWindowStore, WindowState } from '@/store/windowStore'
import { ReactNode, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { TITLEBAR_ICONS } from '@/config/iconRegistry'

type ResizeDir = 'e' | 's' | 'se' | 'sw' | 'w' | 'n' | 'ne' | 'nw'
const MIN_W = 240
const MIN_H = 160

interface Props {
  win: WindowState
  children: ReactNode
  menu?: string[]
  status?: string
  isMobile?: boolean
  bodyClass?: string
}

const SNAP_THRESHOLD = 48

export function Window({ win, children, menu = ['File', 'Edit', 'Help'], status, isMobile = false, bodyClass }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPos, updateWindowSize, focusedId } = useWindowStore()
  const dragControls = useDragControls()
  const x = useMotionValue(win.x)
  const y = useMotionValue(win.y)

  const [snapped, setSnapped] = useState<'left' | 'right' | null>(null)
  const [snapZone, setSnapZone] = useState<'left' | 'right' | null>(null)
  const prevGeom = useRef<{ x: number; y: number } | null>(null)

  // ── Resize state ──────────────────────────────────────────────
  const resizing = useRef<{
    dir: ResizeDir
    startX: number; startY: number
    startW: number; startH: number
    startPX: number; startPY: number
  } | null>(null)
  const liveW = useMotionValue(win.width)
  const liveH = useMotionValue(win.height)
  const liveX = useMotionValue(win.x)
  const liveY = useMotionValue(win.y)

  // sync live values when store updates externally
  if (!resizing.current) {
    if (liveW.get() !== win.width) liveW.set(win.width)
    if (liveH.get() !== win.height) liveH.set(win.height)
  }

  const startResize = (e: React.PointerEvent, dir: ResizeDir) => {
    e.stopPropagation()
    e.preventDefault()

    const snap = {
      dir,
      startX: e.clientX, startY: e.clientY,
      startW: liveW.get(), startH: liveH.get(),
      startPX: x.get(), startPY: y.get(),
    }
    resizing.current = snap

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - snap.startX
      const dy = ev.clientY - snap.startY
      let newW = snap.startW, newH = snap.startH
      let newX = snap.startPX, newY = snap.startPY

      if (dir.includes('e')) newW = Math.max(MIN_W, snap.startW + dx)
      if (dir.includes('s')) newH = Math.max(MIN_H, snap.startH + dy)
      if (dir.includes('w')) {
        newW = Math.max(MIN_W, snap.startW - dx)
        newX = snap.startPX + (snap.startW - newW)
      }
      if (dir.includes('n')) {
        newH = Math.max(MIN_H, snap.startH - dy)
        newY = snap.startPY + (snap.startH - newH)
      }

      liveW.set(newW); liveH.set(newH)
      liveX.set(newX); liveY.set(newY)
      x.set(newX); y.set(newY)
    }

    const onUp = () => {
      updateWindowSize(win.id, liveW.get(), liveH.get())
      updateWindowPos(win.id, x.get(), y.get())
      resizing.current = null
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  const HANDLES: { dir: ResizeDir; style: React.CSSProperties }[] = [
    { dir: 'e',  style: { right: 0, top: 4, bottom: 4, width: 4, cursor: 'ew-resize' } },
    { dir: 'w',  style: { left: 0, top: 4, bottom: 4, width: 4, cursor: 'ew-resize' } },
    { dir: 's',  style: { bottom: 0, left: 4, right: 4, height: 4, cursor: 'ns-resize' } },
    { dir: 'n',  style: { top: 0, left: 4, right: 4, height: 4, cursor: 'ns-resize' } },
    { dir: 'se', style: { right: 0, bottom: 0, width: 8, height: 8, cursor: 'nwse-resize' } },
    { dir: 'sw', style: { left: 0, bottom: 0, width: 8, height: 8, cursor: 'nesw-resize' } },
    { dir: 'ne', style: { right: 0, top: 0, width: 8, height: 8, cursor: 'nesw-resize' } },
    { dir: 'nw', style: { left: 0, top: 0, width: 8, height: 8, cursor: 'nwse-resize' } },
  ]

  if (win.isMinimized) return null

  const isActive = win.id === focusedId
  const filename = win.title

  // ── Mobile layout ────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="window is-active window-modal"
        style={{ zIndex: win.zIndex }}
        onMouseDown={() => focusWindow(win.id)}
      >
        <div className="tb">
          {TITLEBAR_ICONS[win.type]
            ? <span className="tb-ico" style={{ display: 'inline-flex', alignItems: 'center' }}>{TITLEBAR_ICONS[win.type]}</span>
            : <span className="tb-ico material-symbols-outlined">{win.icon}</span>
          }
          <span className="tb-lbl">{filename}</span>
          <div className="tb-btns">
            <button className="wbtn" onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        {menu.length > 0 && (
          <div className="win-menu">
            {menu.map(m => <div key={m} className="wmenu-item">{m}</div>)}
          </div>
        )}
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
  const winH = isFixed ? 'calc(100vh - 68px)' : win.height
  const winTop = isFixed ? 28 : undefined
  const winLeft = win.isMaximized ? 0 : snapped === 'left' ? 0 : undefined
  const winRight = snapped === 'right' ? 0 : undefined

  const bodyHeight = isFixed
    ? 'calc(100vh - 68px - 32px - 24px - 22px)'
    : undefined  // flex:1 handles it when not fixed

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
          width: isFixed ? winW : liveW,
          height: isFixed ? winH : liveH,
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
          {TITLEBAR_ICONS[win.type]
            ? <span className="tb-ico" style={{ display: 'inline-flex', alignItems: 'center' }}>{TITLEBAR_ICONS[win.type]}</span>
            : <span className="tb-ico material-symbols-outlined">{win.icon}</span>
          }
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
        {menu.length > 0 && (
          <div className="win-menu">
            {menu.map(m => <div key={m} className="wmenu-item">{m}</div>)}
          </div>
        )}
        <div
          className={`wbody${bodyClass ? ` ${bodyClass}` : ''}`}
          style={{ height: bodyHeight, flex: isFixed ? undefined : 1, minHeight: 0 }}
        >
          {children}
        </div>
        <div className="wstatus">
          <span className="wstatus-panel">{status ?? `${filename} | SYSTEM_V01`}</span>
          <span className="wstatus-panel" style={{ flex: 'none', minWidth: 'auto' }}>V01</span>
        </div>

        {/* ── Resize handles ── */}
        {!isFixed && HANDLES.map(h => (
          <div
            key={h.dir}
            data-cursor={h.dir}
            onPointerDown={e => startResize(e, h.dir)}
            style={{
              position: 'absolute',
              zIndex: 10,
              ...h.style,
            }}
          />
        ))}
      </motion.div>
    </>
  )
}
