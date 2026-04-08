'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = () => {
    setVisible(false)
    setTimeout(onLogin, 500)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000814',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Scanlines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
            pointerEvents: 'none',
          }} />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3, type: 'spring', stiffness: 220, damping: 20 }}
            style={{
              width: 320,
              background: '#06080f',
              border: '2px solid #00ffff',
              boxShadow: '0 0 48px rgba(0,255,255,0.25), 0 0 120px rgba(0,0,255,0.15)',
            }}
          >
            {/* Title bar */}
            <div style={{
              background: '#000080',
              padding: '5px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '2px solid #00ffff',
            }}>
              <span style={{ fontFamily: 'var(--font-h)', fontSize: 10, color: '#fff', letterSpacing: '0.1em' }}>
                LIZARD.OS — BEGIN LOGON
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
              {/* Avatar + username */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  background: '#000',
                  border: '2px solid #00ffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                  boxShadow: '0 0 16px rgba(0,255,255,0.25)',
                }}>
                  🦎
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#00ffff', letterSpacing: '0.12em', marginBottom: 4 }}>USER</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#fff' }}>EREN_KILISLI</div>
                </div>
              </div>

              <div style={{ height: 1, background: '#0d1a2e', width: '100%' }} />

              {/* Enter button */}
              <button
                onClick={handleLogin}
                style={{
                  width: '100%',
                  background: '#000080',
                  border: '2px solid',
                  borderTopColor: '#a0a0c0',
                  borderLeftColor: '#a0a0c0',
                  borderBottomColor: '#303050',
                  borderRightColor: '#303050',
                  color: '#fff',
                  fontFamily: 'var(--font-h)',
                  fontSize: 10,
                  padding: '12px 20px',
                  cursor: 'pointer',
                  letterSpacing: '0.18em',
                  boxShadow: '0 0 18px rgba(0,255,255,0.12)',
                }}
                onMouseDown={e => (e.currentTarget.style.borderTopColor = '#303050')}
                onMouseUp={e => (e.currentTarget.style.borderTopColor = '#a0a0c0')}
              >
                ENTER
              </button>

              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#303050', letterSpacing: '0.06em' }}>
                press enter or click to continue
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
