'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystemStore } from '@/store/systemStore'
import { useSounds } from '@/hooks/useSounds'

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [visible, setVisible] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const { userIcon, loginPassword } = useSystemStore()
  const { playClick } = useSounds()

  const handleLogin = () => {
    if (loginPassword && password !== loginPassword) {
      setError(true)
      setTimeout(() => setError(false), 1200)
      return
    }
    playClick()
    setVisible(false)
    setTimeout(onLogin, 500)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password])

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
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          }} />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
          }} />

          <motion.div
            animate={error ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              width: 340,
              background: '#06080f',
              border: '2px solid #00ffff',
              boxShadow: '0 0 48px rgba(0,255,255,0.2), 0 0 120px rgba(0,0,255,0.12)',
            }}
          >
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(90deg, #000080 0%, #0000b8 100%)',
              padding: '5px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #00ffff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11 }}>💻</span>
                <span style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#fff', letterSpacing: '0.1em' }}>
                  LIZARD.OS — BEGIN LOGON
                </span>
              </div>
              {/* Win95-style close button (decorative) */}
              <div style={{
                width: 16, height: 14,
                background: '#c0c0c0',
                border: '1px solid',
                borderTopColor: '#fff',
                borderLeftColor: '#fff',
                borderBottomColor: '#808080',
                borderRightColor: '#808080',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontSize: 10, color: '#000', lineHeight: 1,
                userSelect: 'none',
              }}>✕</div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Icon + labels row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                {/* Animal icon */}
                <div style={{
                  width: 64, height: 64, flexShrink: 0,
                  background: '#000',
                  border: '2px solid',
                  borderTopColor: '#808080',
                  borderLeftColor: '#808080',
                  borderBottomColor: '#00ffff',
                  borderRightColor: '#00ffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32,
                  boxShadow: '0 0 20px rgba(0,255,255,0.18)',
                }}>
                  {userIcon}
                </div>

                {/* Labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#808080', letterSpacing: '0.15em' }}>
                    USER NAME
                  </div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 11, color: '#00ffff', letterSpacing: '0.1em' }}>
                    USER
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-h)', fontSize: 6, color: '#303850', letterSpacing: '0.1em', marginTop: 2,
                  }}>
                    LIZARD.OS NETWORK
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, #00ffff33, transparent)',
              }} />

              {/* Password field — only if password is set */}
              {loginPassword && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#8aa8c4', letterSpacing: '0.12em' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    style={{
                      background: '#000',
                      border: '2px solid',
                      borderTopColor: '#404040',
                      borderLeftColor: '#404040',
                      borderBottomColor: '#00ffff',
                      borderRightColor: '#00ffff',
                      color: '#00ffff',
                      fontFamily: 'monospace',
                      fontSize: 14,
                      padding: '6px 8px',
                      outline: 'none',
                      letterSpacing: '0.2em',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                  {error && (
                    <div style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#ff4040', letterSpacing: '0.1em' }}>
                      ✕ INCORRECT PASSWORD
                    </div>
                  )}
                </div>
              )}

              {/* ENTER button — Win95-inspired with cyber accent */}
              <button
                onClick={handleLogin}
                style={{
                  width: '100%',
                  background: '#000080',
                  border: '2px solid',
                  borderTopColor: '#a0a0c8',
                  borderLeftColor: '#a0a0c8',
                  borderBottomColor: '#202060',
                  borderRightColor: '#202060',
                  color: '#fff',
                  fontFamily: 'var(--font-h)',
                  fontSize: 10,
                  padding: '11px 20px',
                  cursor: 'pointer',
                  letterSpacing: '0.22em',
                  boxShadow: '0 0 18px rgba(0,255,255,0.1)',
                }}
                onMouseDown={e => {
                  e.currentTarget.style.borderTopColor = '#202060'
                  e.currentTarget.style.borderLeftColor = '#202060'
                  e.currentTarget.style.borderBottomColor = '#a0a0c8'
                  e.currentTarget.style.borderRightColor = '#a0a0c8'
                }}
                onMouseUp={e => {
                  e.currentTarget.style.borderTopColor = '#a0a0c8'
                  e.currentTarget.style.borderLeftColor = '#a0a0c8'
                  e.currentTarget.style.borderBottomColor = '#202060'
                  e.currentTarget.style.borderRightColor = '#202060'
                }}
              >
                ENTER
              </button>

              <div style={{
                fontFamily: 'monospace', fontSize: 9,
                color: '#1e2840', letterSpacing: '0.06em',
                textAlign: 'center',
              }}>
                press enter or click to continue
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}