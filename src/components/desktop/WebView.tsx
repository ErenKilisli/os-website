'use client'
import { motion } from 'framer-motion'
import { useSystemStore } from '@/store/systemStore'
import { useWindowStore } from '@/store/windowStore'

const PROJECTS = [
  { emoji: '💾', label: 'SOFTWARE', sub: 'Dev Projects', type: 'devfiles' as const },
  { emoji: '🎬', label: 'FILM', sub: 'Film Projects', type: 'film' as const },
  { emoji: '🎮', label: 'GAME', sub: 'Game Projects', type: 'game' as const },
]

export function WebView() {
  const { setViewMode } = useSystemStore()
  const { openWindow } = useWindowStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#020812',
        zIndex: 9000,
        overflowY: 'auto',
        fontFamily: 'var(--font-b)',
        top: 38,
        bottom: 0,
      }}
    >
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        position: 'relative',
        borderBottom: '1px solid #0a1a2a',
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{
          fontFamily: 'var(--font-h)', fontSize: 11, color: '#00ffff',
          letterSpacing: '0.3em', marginBottom: 24, opacity: 0.7,
        }}>PORTFOLIO</div>

        <h1 style={{
          fontFamily: 'var(--font-h)',
          fontSize: 'clamp(28px, 6vw, 64px)',
          color: '#fff',
          letterSpacing: '0.06em',
          lineHeight: 1.1,
          marginBottom: 16,
        }}>EREN KILISLİ</h1>

        <p style={{
          fontSize: 22,
          color: '#4a6a8a',
          marginBottom: 48,
          maxWidth: 480,
          lineHeight: 1.6,
        }}>Developer · Filmmaker · Game Designer</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => openWindow('about')}
            style={{
              background: '#000080',
              border: '2px solid #00ffff',
              color: '#00ffff',
              fontFamily: 'var(--font-h)',
              fontSize: 10,
              padding: '10px 24px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              boxShadow: '0 0 20px rgba(0,255,255,0.15)',
            }}
          >ABOUT ME</button>
          <button
            onClick={() => openWindow('mail')}
            style={{
              background: 'transparent',
              border: '2px solid #1a3a5a',
              color: '#4a7a9a',
              fontFamily: 'var(--font-h)',
              fontSize: 10,
              padding: '10px 24px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ffff'; e.currentTarget.style.color = '#00ffff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a3a5a'; e.currentTarget.style.color = '#4a7a9a' }}
          >CONTACT</button>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ color: '#1a3a5a', fontSize: 22 }}
          >▼</motion.div>
        </div>
      </section>

      {/* Projects */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: 10, color: '#00ffff',
          letterSpacing: '0.3em', marginBottom: 48, textAlign: 'center', opacity: 0.6,
        }}>PROJECTS</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 2,
        }}>
          {PROJECTS.map(p => (
            <motion.div
              key={p.type}
              whileHover={{ scale: 1.02 }}
              onClick={() => openWindow(p.type)}
              style={{
                background: '#05070e',
                border: '1px solid #0a1a2a',
                padding: '40px 28px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00ffff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0a1a2a' }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.emoji}</div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 11, color: '#fff', letterSpacing: '0.12em', marginBottom: 8 }}>{p.label}</div>
              <div style={{ fontSize: 14, color: '#304050' }}>{p.sub}</div>
              <div style={{ marginTop: 20, fontFamily: 'var(--font-h)', fontSize: 9, color: '#00ffff', opacity: 0.6, letterSpacing: '0.1em' }}>
                OPEN →
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section style={{
        padding: '80px 24px',
        maxWidth: 640,
        margin: '0 auto',
        textAlign: 'center',
        borderTop: '1px solid #0a1a2a',
      }}>
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: 10, color: '#00ffff',
          letterSpacing: '0.3em', marginBottom: 32, opacity: 0.6,
        }}>ABOUT</div>
        <p style={{ fontSize: 18, color: '#4a6a8a', lineHeight: 1.8, marginBottom: 32 }}>
          I build things for the web, the screen, and the imagination.
          Software, film, and game projects — explore them all from inside the OS.
        </p>
        <button
          onClick={() => openWindow('about')}
          style={{
            background: 'transparent', border: '1px solid #1a3a5a',
            color: '#4a7a9a', fontFamily: 'var(--font-h)', fontSize: 9,
            padding: '10px 20px', cursor: 'pointer', letterSpacing: '0.1em',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ffff'; e.currentTarget.style.color = '#00ffff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a3a5a'; e.currentTarget.style.color = '#4a7a9a' }}
        >READ MORE →</button>
      </section>

      {/* OS CTA */}
      <section style={{
        padding: '80px 24px',
        background: '#020510',
        textAlign: 'center',
        borderTop: '1px solid #0a1a2a',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🖥️</div>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 11, color: '#fff', letterSpacing: '0.12em', marginBottom: 12 }}>
          EXPERIENCE THE FULL OS
        </div>
        <p style={{ fontSize: 16, color: '#304050', marginBottom: 32 }}>
          Switch to OS Desktop view for the full interactive experience.
        </p>
        <button
          onClick={() => setViewMode('desktop')}
          style={{
            background: '#00ffff',
            border: '2px solid #00ffff',
            color: '#000',
            fontFamily: 'var(--font-h)',
            fontSize: 10,
            padding: '12px 28px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >🖥️ OPEN OS VIEW</button>
      </section>
    </motion.div>
  )
}
