'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  useEffect(() => {
    if (mode === 'shutdown') {
      const t = setTimeout(() => setPhase('safe'), 2200)
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
            {mode === 'shutdown' ? 'Shutting down EREN.OS' : 'Restarting EREN.OS'}
            <Blink />
          </motion.div>
        )}

        {phase === 'safe' && (
          <motion.div
            key="safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              border: '2px solid #808080',
              padding: '32px 56px',
              textAlign: 'center',
              background: '#0a0a14',
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#808080', marginBottom: 10 }}>
              It is now safe to
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#c0c0c0' }}>
              turn off your computer.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
