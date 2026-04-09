'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { useSystemStore } from '@/store/systemStore'
import { DesktopIcon } from './DesktopIcon'
import { Taskbar } from './Taskbar'
import { BootScreen } from './BootScreen'
import { LoginScreen } from './LoginScreen'
import { ShutdownScreen } from './ShutdownScreen'
import { Spotlight } from './Spotlight'
import { SoundManager } from './SoundManager'
import { DesktopWallpaper } from './DesktopWallpaper'
import { APP_REGISTRY } from '@/config/appRegistry'
import { DesktopContextMenu } from './DesktopContextMenu'
import { CustomCursor } from './CustomCursor'
import { PhoneView } from './PhoneView'
import { TerminalMode } from './TerminalMode'
import { useSounds } from '@/hooks/useSounds'

type Phase = 'boot' | 'login' | 'desktop' | 'shutdown' | 'restart'


export function Desktop() {
  const [phase, setPhase] = useState<Phase>('boot')
  const [bootKey, setBootKey] = useState(0)
  const [spotlight, setSpotlight] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [trashOpen, setTrashOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const { windows, icons, openWindow, selectIcon } = useWindowStore()
  const { brightness, theme, viewMode, uiMode, setViewMode } = useSystemStore()
  const { playStartup } = useSounds()

  // Mark mounted — prevents Zustand persist mismatch on brightness overlay
  useEffect(() => { setMounted(true) }, [])

  // Apply theme & uiMode data attributes to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-uimode', uiMode)
  }, [uiMode])

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setViewMode('phone')
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [setViewMode])

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
      <CustomCursor />
      <SoundManager />

      {phase === 'boot' && (
        <BootScreen key={bootKey} onComplete={() => setPhase('login')} />
      )}
      {phase === 'login' && (
        <LoginScreen onLogin={() => { playStartup(); setPhase('desktop') }} />
      )}
      {(phase === 'shutdown' || phase === 'restart') && (
        <ShutdownScreen
          mode={phase === 'restart' ? 'restart' : 'shutdown'}
          onComplete={() => {
            setBootKey(k => k + 1)
            setPhase('boot')
          }}
        />
      )}

      {/* Hover zone at top edge when nav is collapsed to reveal it */}
      {navCollapsed && (
        <div
          id="nav-reveal-zone"
          onMouseEnter={() => setNavCollapsed(false)}
        />
      )}

      {/* Top nav bar */}
      <nav id="top-nav" className={navCollapsed ? 'nav-collapsed' : ''}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div className="nav-brand">OS.WEBSITE</div>
          <div className="nav-links">
            <span className="nav-link" onClick={() => openWindow('about')}>ABOUT ME</span>
            <span className="nav-link" onClick={() => openWindow('devfiles')}>DEV PROJECTS</span>
            <span className="nav-link" onClick={() => openWindow('film')}>FILM PROJECTS</span>
            <span className="nav-link" onClick={() => openWindow('game')}>GAME PROJECTS</span>
            <span className="nav-link" onClick={() => openWindow('mail')}>CONTACT</span>
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
          <span
            className="material-symbols-outlined nav-toggle-btn"
            onClick={() => setNavCollapsed(c => !c)}
            title={navCollapsed ? 'Show nav bar' : 'Hide nav bar'}
          >
            {navCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
          </span>
        </div>
      </nav>

      {/* Brightness overlay — only after mount to avoid Zustand persist hydration mismatch */}
      {mounted && brightness < 100 && (
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

      <div
        id="desktop"
        onClick={() => selectIcon(null)}
        onContextMenu={e => {
          e.preventDefault()
          selectIcon(null)
          setCtxMenu({ x: e.clientX, y: e.clientY })
        }}
      >
        <DesktopWallpaper />

        {/* Desktop icons */}
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}

        {/* Windows — driven by APP_REGISTRY */}
        <AnimatePresence>
          {windows.map((win) => {
            const app = APP_REGISTRY.find(a => a.type === win.type)
            if (!app) return null
            const { Component } = app
            return <Component key={win.id} win={win} isMobile={isMobile} />
          })}
        </AnimatePresence>

        {/* Trash bin — draggable */}
        <motion.div
          className="deco-trash"
          drag
          dragMomentum={false}
          dragElastic={0}
          onClick={() => setTrashOpen(t => !t)}
          style={{ cursor: 'grab', position: 'absolute', bottom: 56, right: 32 }}
        >
          <div className="deco-trash-icon">
            <span className="material-symbols-outlined">delete</span>
          </div>
          <span className="deco-trash-lbl">Trash</span>
        </motion.div>

        {/* Trash dialog */}
        {trashOpen && (
          <div style={{
            position: 'absolute', bottom: 90, right: 16, width: 220, zIndex: 800,
            background: '#c0c0c0', border: '2px solid #fff',
            boxShadow: '2px 2px 0 #808080, inset -1px -1px 0 #808080',
          }}>
            <div style={{
              background: '#000080', padding: '3px 6px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#fff' }}>delete</span>
                <span style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#fff', letterSpacing: '0.06em' }}>
                  RECYCLE BIN
                </span>
              </div>
              <button onClick={() => setTrashOpen(false)} style={{
                background: '#c0c0c0', border: '1px solid #fff',
                boxShadow: '1px 1px 0 #808080', width: 16, height: 14,
                cursor: 'pointer', fontFamily: 'var(--font-h)', fontSize: 9,
                color: '#000', padding: 0, lineHeight: 1,
              }}>✕</button>
            </div>
            <div style={{ padding: '20px 12px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#808080', display: 'block' }}>delete</span>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#000', marginTop: 8, letterSpacing: '0.06em' }}>
                RECYCLE BIN IS EMPTY
              </div>
            </div>
            <div style={{
              borderTop: '1px solid #808080', padding: '6px', display: 'flex', justifyContent: 'center',
            }}>
              <button onClick={() => setTrashOpen(false)} style={{
                background: '#c0c0c0', border: '2px solid #fff',
                boxShadow: '2px 2px 0 #808080, inset -1px -1px 0 #808080',
                padding: '3px 16px', cursor: 'pointer',
                fontFamily: 'var(--font-h)', fontSize: 8, color: '#000', letterSpacing: '0.06em',
              }}>OK</button>
            </div>
          </div>
        )}
      </div>

      <Taskbar
        onSpotlight={() => setSpotlight(true)}
        onShutdown={() => setPhase('shutdown')}
        onRestart={() => setPhase('restart')}
      />

      <Spotlight open={spotlight} onClose={() => setSpotlight(false)} />

      <AnimatePresence>
        {ctxMenu && (
          <DesktopContextMenu
            key="ctx"
            x={ctxMenu.x}
            y={ctxMenu.y}
            onClose={() => setCtxMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Phone / Terminal overlays ── */}
      <AnimatePresence>
        {viewMode === 'phone'    && phase === 'desktop' && <PhoneView    key="phone" fullscreen={isMobile} />}
        {viewMode === 'terminal' && phase === 'desktop' && <TerminalMode key="terminal" />}
      </AnimatePresence>
    </>
  )
}
