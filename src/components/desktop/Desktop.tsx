'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { DesktopIcon } from './DesktopIcon'
import { Taskbar } from './Taskbar'
import { BootScreen } from './BootScreen'
import { FileBrowserWindow } from '../windows/FileBrowserWindow'
import { AboutWindow } from '../windows/AboutWindow'
import { MailWindow } from '../windows/MailWindow'
import { TerminalWindow } from '../windows/TerminalWindow'
import { SettingsWindow } from '../windows/SettingsWindow'
import { ProjectDetailWindow } from '../windows/ProjectDetailWindow'

const LOADER_COUNT = 12

export function Desktop() {
  const [booted, setBooted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { windows, icons, openWindow } = useWindowStore()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      {/* Top nav bar */}
      <nav id="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div className="nav-brand">SYSTEM_V01</div>
          <div className="nav-links">
            <span className="nav-link active" onClick={() => openWindow('terminal')}>TERMINAL</span>
            <span className="nav-link" onClick={() => openWindow('swr')}>FILES</span>
            <span className="nav-link" onClick={() => openWindow('mail')}>NETWORK</span>
          </div>
        </div>
        <div className="nav-actions">
          <span className="material-symbols-outlined" onClick={() => openWindow('settings')}>settings</span>
          <span className="material-symbols-outlined">close</span>
        </div>
      </nav>

      <div id="desktop">
        {/* Desktop icons */}
        {icons.map(icon => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}

        {/* Windows */}
        <AnimatePresence>
          {windows.map(win => {
            if (win.type === 'about')    return <AboutWindow    key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'mail')     return <MailWindow     key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'terminal') return <TerminalWindow key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'settings') return <SettingsWindow key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'projectdetail') return <ProjectDetailWindow key={win.id} win={win} isMobile={isMobile} />
            return <FileBrowserWindow key={win.id} win={win} category={win.type} isMobile={isMobile} />
          })}
        </AnimatePresence>

        {/* Cursor cluster decoration */}
        <div className="cursor-cluster" style={{ width: 80, height: 80 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 30, top: -8, left: -8, transform: 'rotate(12deg)' }}>near_me</span>
          <span className="material-symbols-outlined" style={{ fontSize: 22, top: 16, left: 24, transform: 'rotate(-12deg)' }}>near_me</span>
          <span className="material-symbols-outlined" style={{ fontSize: 18, top: 32, left: 0, transform: 'rotate(45deg)' }}>near_me</span>
        </div>

        {/* Decorative loading bar */}
        <div className="deco-loader">
          <div className="deco-loader-lbl">LOADING_ASSETS... 64%</div>
          <div className="deco-loader-bar">
            {Array.from({ length: LOADER_COUNT }).map((_, i) => (
              <div key={i} className="deco-loader-sq" />
            ))}
          </div>
        </div>

        {/* Trash bin decoration */}
        <div className="deco-trash">
          <div className="deco-trash-icon">
            <span className="material-symbols-outlined">delete</span>
          </div>
          <span className="deco-trash-lbl">Trash</span>
        </div>
      </div>

      <Taskbar />
    </>
  )
}
