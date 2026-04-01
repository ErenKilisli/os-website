'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { useSystemStore } from '@/store/systemStore'
import { DesktopIcon } from './DesktopIcon'
import { Taskbar } from './Taskbar'
import { BootScreen } from './BootScreen'
import { Spotlight } from './Spotlight'
import { SoundManager } from './SoundManager'
import { DesktopWallpaper } from './DesktopWallpaper'
import { FileBrowserWindow } from '../windows/FileBrowserWindow'
import { AboutWindow } from '../windows/AboutWindow'
import { MailWindow } from '../windows/MailWindow'
import { TerminalWindow } from '../windows/TerminalWindow'
import { SettingsWindow } from '../windows/SettingsWindow'
import { ProjectDetailWindow } from '../windows/ProjectDetailWindow'
import { SnakeWindow } from '../windows/SnakeWindow'
import { SnowboardWindow } from '../windows/SnowboardWindow'
import { PaintWindow } from '../windows/PaintWindow'

const LOADER_COUNT = 12

export function Desktop() {
  const [booted, setBooted] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { windows, icons, openWindow } = useWindowStore()
  const { brightness, theme } = useSystemStore()

  // Apply theme data attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Cmd+K or Ctrl+K opens spotlight
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSpotlight((s) => !s)
      }
      if (e.key === 'Escape') setSpotlight(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <SoundManager />

      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      {/* Top nav bar */}
      <nav id="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div className="nav-brand">EREN.OS</div>
          <div className="nav-links">
            <span className="nav-link active" onClick={() => openWindow('terminal')}>TERMINAL</span>
            <span className="nav-link" onClick={() => openWindow('devfiles')}>FILES</span>
            <span className="nav-link" onClick={() => openWindow('mail')}>NETWORK</span>
          </div>
        </div>
        <div className="nav-actions">
          <span
            className="material-symbols-outlined nav-spotlight-btn"
            onClick={() => setSpotlight(true)}
            title="Search (Ctrl+K)"
          >
            search
          </span>
          <span className="material-symbols-outlined" onClick={() => openWindow('settings')}>settings</span>
          <span className="material-symbols-outlined">close</span>
        </div>
      </nav>

      {/* Brightness overlay */}
      {brightness < 100 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            opacity: 1 - brightness / 100,
            pointerEvents: 'none',
            zIndex: 99998,
          }}
        />
      )}

      <div id="desktop">
        <DesktopWallpaper />

        {/* Desktop icons */}
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}

        {/* Windows */}
        <AnimatePresence>
          {windows.map((win) => {
            if (win.type === 'about')         return <AboutWindow         key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'mail')          return <MailWindow          key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'terminal')      return <TerminalWindow      key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'settings')      return <SettingsWindow      key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'projectdetail') return <ProjectDetailWindow key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'snake')         return <SnakeWindow         key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'snowboard')     return <SnowboardWindow     key={win.id} win={win} isMobile={isMobile} />
            if (win.type === 'paint')         return <PaintWindow         key={win.id} win={win} isMobile={isMobile} />
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

      <Taskbar onSpotlight={() => setSpotlight(true)} />

      <Spotlight open={spotlight} onClose={() => setSpotlight(false)} />
    </>
  )
}
