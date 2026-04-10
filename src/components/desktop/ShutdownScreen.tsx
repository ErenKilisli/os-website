'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSounds } from '@/hooks/useSounds'

interface Props {
  mode: 'shutdown' | 'restart'
  onComplete?: () => void
}

function Blink() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 530)
    return () => clearInterval(id)
  }, [])
  return <span style={{ opacity: on ? 1 : 0 }}>_</span>
}

// Classic Win95 beveled button
function Win95Button({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#c0c0c0',
        border: '2px solid',
        borderTopColor:    pressed ? '#808080' : '#ffffff',
        borderLeftColor:   pressed ? '#808080' : '#ffffff',
        borderBottomColor: pressed ? '#ffffff' : '#808080',
        borderRightColor:  pressed ? '#ffffff' : '#808080',
        boxShadow: pressed ? 'none' : '1px 1px 0 #000',
        color: '#000000',
        fontFamily: 'var(--font-press-start, monospace)',
        fontSize: 8,
        letterSpacing: '0.12em',
        padding: pressed ? '9px 18px 7px 22px' : '8px 20px',
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

export function ShutdownScreen({ mode, onComplete }: Props) {
  const [phase, setPhase] = useState<'text' | 'safe'>('text')
  const { playShutdown } = useSounds()

  // Play shutdown sound immediately on mount
  useEffect(() => {
    playShutdown()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mode === 'shutdown') {
      const t = setTimeout(() => setPhase('safe'), 2400)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => onComplete?.(), 2400)
      return () => clearTimeout(t)
    }
  }, [mode, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'text' && (
          <motion.div
            key="shutting"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: 'monospace', fontSize: 18, color: '#c0c0c0', textAlign: 'center' }}
          >
            {mode === 'shutdown' ? 'Shutting down OS.WEBSITE' : 'Restarting OS.WEBSITE'}
            <Blink />
          </motion.div>
        )}

        {phase === 'safe' && (
          <motion.div
            key="safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              textAlign: 'center',
            }}
          >
            {/* Safe-to-turn-off box */}
            <div style={{
              border: '2px solid #404040',
              padding: '32px 56px',
              background: '#060610',
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#606060', marginBottom: 10 }}>
                It is now safe to
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#a0a0a0', letterSpacing: '0.04em' }}>
                turn off your computer.
              </div>
            </div>

            {/* Classic Win95 grey restart button */}
            <Win95Button onClick={onComplete}>
              <span style={{ fontSize: 13, lineHeight: 1 }}>⏻</span>
              PRESS TO RESTART
            </Win95Button>

            <div style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: '#242424',
              letterSpacing: '0.08em',
            }}>
              OS.WEBSITE v1.0 — EREN KILISLI
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}