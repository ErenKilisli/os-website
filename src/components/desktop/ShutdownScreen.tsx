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
              gap: 32,
              textAlign: 'center',
            }}
          >
            {/* Safe-to-turn-off box */}
            <div style={{
              border: '2px solid #404040',
              padding: '32px 56px',
              background: '#060610',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#606060', marginBottom: 10 }}>
                It is now safe to
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#a0a0a0', letterSpacing: '0.04em' }}>
                turn off your computer.
              </div>
            </div>

            {/* Restart button */}
            <motion.button
              onClick={onComplete}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ boxShadow: '0 0 24px rgba(0,255,255,0.5), 0 0 48px rgba(0,255,255,0.2)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#000',
                border: '2px solid #00ffff',
                color: '#00ffff',
                fontFamily: 'var(--font-press-start, monospace)',
                fontSize: 9,
                letterSpacing: '0.18em',
                padding: '14px 28px',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(0,255,255,0.25)',
                outline: 'none',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>⏻</span>
              PRESS TO RESTART
            </motion.button>

            <div style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: '#303040',
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