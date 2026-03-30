'use client'
import { motion, useDragControls, useMotionValue, AnimatePresence } from 'framer-motion'
import { useWindowStore, WindowState } from '@/store/windowStore'
import { ReactNode } from 'react'

interface Props {
  win: WindowState
  children: ReactNode
  menu?: string[]
  status?: string
}

export function Window({ win, children, menu = ['File', 'Edit', 'Help'], status }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPos, focusedId } = useWindowStore()
  const dragControls = useDragControls()
  const x = useMotionValue(win.x)
  const y = useMotionValue(win.y)

  if (win.isMinimized) return null

  const isActive = win.id === focusedId

  const bodyHeight = win.isMaximized
    ? 'calc(100vh - 44px - 26px - 28px - 20px)'
    : win.height - 74

  return (
    <motion.div
      drag={!win.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{
        x: win.isMaximized ? 0 : x,
        y: win.isMaximized ? 0 : y,
        zIndex: win.zIndex,
        position: win.isMaximized ? 'fixed' : 'absolute',
        width: win.isMaximized ? '100vw' : win.width,
        height: win.isMaximized ? 'calc(100vh - 44px)' : win.height,
        top: win.isMaximized ? 0 : undefined,
        left: win.isMaximized ? 0 : undefined,
      }}
      onDragEnd={() => updateWindowPos(win.id, x.get(), y.get())}
      onMouseDown={() => focusWindow(win.id)}
      initial={{ scale: 0.05, opacity: 0, filter: 'brightness(4)' }}
      animate={{ scale: 1, opacity: 1, filter: 'brightness(1)' }}
      exit={{ scale: 0.05, opacity: 0 }}
      transition={{ duration: 0.16, ease: [0, 0, 0.2, 1] }}
      className={`window${isActive ? ' is-active' : ''}`}
    >
      {/* Title bar */}
      <div
        className="tb"
        onPointerDown={(e) => { if (!win.isMaximized) dragControls.start(e) }}
      >
        <span className="tb-ico">{win.icon}</span>
        <span className="tb-lbl">{win.title}</span>
        <div className="tb-btns">
          <button className="wbtn wbtn-min" onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id) }}>_</button>
          <button className="wbtn wbtn-max" onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id) }}>{win.isMaximized ? '❐' : '□'}</button>
          <button className="wbtn wbtn-cls" onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}>✕</button>
        </div>
      </div>
      {/* Menu */}
      <div className="win-menu">
        {menu.map(m => <div key={m} className="wmenu-item">{m}</div>)}
      </div>
      {/* Body */}
      <div className="wbody" style={{ height: bodyHeight }}>
        {children}
      </div>
      {/* Status */}
      <div className="wstatus">
        <span>{status ?? `${win.title} | EREN.OS`}</span>
        <span>EREN.OS</span>
      </div>
    </motion.div>
  )
}
