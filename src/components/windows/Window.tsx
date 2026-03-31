'use client'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { useWindowStore, WindowState } from '@/store/windowStore'
import { ReactNode } from 'react'

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

export function Window({ win, children, menu = ['File', 'Edit', 'Help'], status, isMobile = false, bodyClass }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPos, focusedId } = useWindowStore()
  const dragControls = useDragControls()
  const x = useMotionValue(win.x)
  const y = useMotionValue(win.y)

  if (win.isMinimized) return null

  const isActive = win.id === focusedId
  const filename = WIN_FILENAMES[win.type] ?? win.title

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

  const bodyHeight = win.isMaximized
    ? 'calc(100vh - 40px - 32px - 24px - 22px)'
    : win.height - 90

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
        height: win.isMaximized ? 'calc(100vh - 40px)' : win.height,
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
      <div
        className="tb"
        onPointerDown={(e) => { if (!win.isMaximized) dragControls.start(e) }}
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
  )
}
