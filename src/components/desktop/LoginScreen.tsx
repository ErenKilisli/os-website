'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  const handleLogin = () => {
    setVisible(false)
    setTimeout(onLogin, 500)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
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
                EREN.OS — BEGIN LOGON
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Avatar + username */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  background: '#000',
                  border: '2px solid #00ffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                  boxShadow: '0 0 12px rgba(0,255,255,0.2)',
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#00ffff', letterSpacing: '0.12em', marginBottom: 4 }}>USER</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#fff' }}>EREN_KILISLI</div>
                </div>
              </div>

              <div style={{ height: 1, background: '#0d1a2e' }} />

              {/* Password */}
              <div>
                <label style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#606080', display: 'block', marginBottom: 6, letterSpacing: '0.1em' }}>
                  PASSWORD
                </label>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: '#000',
                    border: '2px solid',
                    borderTopColor: '#303030',
                    borderLeftColor: '#303030',
                    borderBottomColor: '#909090',
                    borderRightColor: '#909090',
                    color: '#00ffff',
                    fontFamily: 'monospace',
                    fontSize: 16,
                    padding: '6px 8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    letterSpacing: '0.2em',
                  }}
                />
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#303050', marginTop: 5 }}>
                  hint: any key will do
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button
                  onClick={handleLogin}
                  style={{
                    background: '#000080',
                    border: '2px solid',
                    borderTopColor: '#a0a0c0',
                    borderLeftColor: '#a0a0c0',
                    borderBottomColor: '#303050',
                    borderRightColor: '#303050',
                    color: '#fff',
                    fontFamily: 'var(--font-h)',
                    fontSize: 9,
                    padding: '7px 20px',
                    cursor: 'pointer',
                    letterSpacing: '0.08em',
                  }}
                  onMouseDown={e => (e.currentTarget.style.borderTopColor = '#303050')}
                  onMouseUp={e => (e.currentTarget.style.borderTopColor = '#a0a0c0')}
                >
                  LOG IN
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
