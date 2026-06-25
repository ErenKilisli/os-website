'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    icon: '🖥️',
    title: 'WELCOME TO EREN.OS',
    desc: 'This portfolio is presented as a fictional operating system. Explore projects, learn about me, and get in touch — all from a retro desktop.',
  },
  {
    icon: '🖱️',
    title: 'OPEN & MOVE WINDOWS',
    desc: 'Click any desktop icon or navbar link to open a window. Drag windows by their titlebar to reposition them anywhere on the desktop.',
  },
  {
    icon: '⌨️',
    title: 'KEYBOARD SHORTCUTS',
    desc: 'Press Ctrl+K (or ⌘K on Mac) to open Spotlight search and quickly jump to any section. The taskbar at the bottom manages open windows.',
  },
  {
    icon: '📱',
    title: 'SWITCH VIEWS',
    desc: 'Use the view switcher in the top navbar to switch between OS Desktop, Mobile, and Web views. Pick what feels best for your device.',
  },
]

export function TutorialOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(2,8,18,0.88)',
        backdropFilter: 'blur(6px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
      }}
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#05070e',
          border: '2px solid #00ffff',
          boxShadow: '0 0 60px rgba(0,255,255,0.15)',
        }}
      >
        {/* Titlebar */}
        <div style={{
          background: '#000080',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#fff', letterSpacing: '0.1em' }}>
            WELCOME.EXE — STEP {step + 1} OF {STEPS.length}
          </span>
          <button
            onClick={onDone}
            style={{
              background: '#c0c0c0', border: '1px solid #fff',
              boxShadow: '1px 1px 0 #808080', width: 16, height: 14,
              cursor: 'pointer', fontSize: 9, color: '#000', padding: 0, lineHeight: 1,
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '36px 28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 20, lineHeight: 1 }}>{current.icon}</div>
          <div style={{
            fontFamily: 'var(--font-h)', fontSize: 11, color: '#00ffff',
            letterSpacing: '0.12em', marginBottom: 18,
          }}>{current.title}</div>
          <div style={{
            fontFamily: 'var(--font-b)', fontSize: 17, color: '#8090a8',
            lineHeight: 1.6,
          }}>{current.desc}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 4 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: 8, height: 8, cursor: 'pointer',
                background: i === step ? '#00ffff' : '#0a1a2a',
                border: `1px solid ${i <= step ? '#00ffff' : '#1a2a3a'}`,
                transition: 'background 0.15s',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #0a1a2a',
          marginTop: 16,
        }}>
          <button
            onClick={onDone}
            style={{
              background: 'transparent',
              border: '1px solid #1a2a3a',
              color: '#304050',
              fontFamily: 'var(--font-h)',
              fontSize: 9,
              padding: '7px 14px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#405060'; e.currentTarget.style.color = '#607080' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2a3a'; e.currentTarget.style.color = '#304050' }}
          >SKIP</button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  background: 'transparent',
                  border: '1px solid #1a3a4a',
                  color: '#00aacc',
                  fontFamily: 'var(--font-h)',
                  fontSize: 9,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
              >← BACK</button>
            )}
            <button
              onClick={isLast ? onDone : () => setStep(s => s + 1)}
              style={{
                background: isLast ? '#00ffff' : '#000080',
                border: '2px solid #00ffff',
                color: isLast ? '#000' : '#00ffff',
                fontFamily: 'var(--font-h)',
                fontSize: 9,
                padding: '7px 20px',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                boxShadow: '0 0 12px rgba(0,255,255,0.2)',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,255,0.2)' }}
            >{isLast ? '🚀 GET STARTED' : 'NEXT →'}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
